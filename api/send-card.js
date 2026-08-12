/*
 * TYJC — email the Experiment Card (RG-06 / US-06).
 *
 * Vercel serverless function, POST only. This is the ONLY server-side code the
 * MVP has, and it exists for one reason: the Resend API key cannot live in the
 * browser. Everything else in the product is a static file.
 *
 *   POST /api/send-card
 *   { email, cardText, consent?, track? }  ->  { ok: true }
 *
 * WHAT IT DOES NOT DO, DELIBERATELY
 *
 *   - It does not store anything. There is no database in the MVP (that is the
 *     stack decision, not an oversight). The consequence is written down for
 *     the PM rather than hidden: US-06 AC4 ("the email is stored in a list with
 *     its origin identified") is NOT met by this file. What it does instead is
 *     put the origin on the message as Resend tags, so the founder can read the
 *     list out of the Resend dashboard until a real list exists.
 *   - It does not log the email address or the card text. Not on success, not
 *     on failure. A serverless log is a copy of personal data in a place nobody
 *     is auditing, and Privacy Policy §1 promises a two-item list.
 *   - It never returns the provider's error text. A failure from Resend can
 *     quote the request back — including the recipient — and can name internals
 *     the caller has no business seeing. Callers get a stable English sentence;
 *     the detail stays on this side.
 *
 * PF-11: RESEND_API_KEY is set in the Vercel dashboard, never in the repo (see
 * .gitignore). Without it this endpoint answers 503 and says so plainly, which
 * is what the browser turns into "we couldn't email it — the card is still on
 * your screen". The card is never gated behind this call (US-06 AC7).
 */

/* The sending identity. The domain's Resend DNS records were published and
   verified under PF-10; `card@` is a send-only address, so replies are pointed
   at the address a human reads (PF-02 / RG-08). */
const FROM = 'TYJC <card@lessriskmoregrowth.com>';
const REPLY_TO = 'contact@lessriskmoregrowth.com';

/* The return link the email carries (US-06 AC2: the eight fields AND the way
   back). Overridable so a preview deployment can point at itself. */
const SITE_URL = (process.env.SITE_URL || 'https://lessriskmoregrowth.com').replace(/\/+$/, '');
const BUILDER_URL = SITE_URL + '/builder.html';

/* Limits. The card is one page of text; anything far beyond that is not a card,
   and this endpoint is public. */
const MAX_EMAIL = 254;      // RFC 5321 practical maximum
const MAX_CARD = 20000;     // ~4x the longest card the builder can produce
const MIN_CARD = 40;

/* Rate limit, per IP, in memory.
   Honest about what it is: a serverless instance is ephemeral and there can be
   many of them, so this is a speed bump against one browser hammering the
   endpoint, NOT a security control. It costs nothing and it stops the obvious
   accident (a stuck retry loop) from spending the Resend quota. Real abuse
   protection, if it is ever needed, belongs at the edge. */
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  /* Opportunistic sweep so the map cannot grow without bound on a warm
     instance. Cheap: it only runs on the request path, over recent keys. */
  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (!stamps.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '');
  const first = forwarded.split(',')[0].trim();
  return first || req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}

/* Server-side validation (US-06 AC6). The browser checks too, but a browser
   check is a courtesy — this one is the rule. Deliberately strict and boring:
   one @, something either side, a dot in the domain, no whitespace, no commas
   or semicolons (which is what a header-injection attempt looks like), and no
   control characters. */
const EMAIL_RE = /^[^\s@,;:<>"'\\]+@[^\s@,;:<>"'\\]+\.[^\s@,;:<>"'\\]{2,}$/;

function validEmail(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text || text.length > MAX_EMAIL) return '';
  if (/[\r\n\t\0]/.test(text)) return '';
  return EMAIL_RE.test(text) ? text : '';
}

/* Tag values reach Resend, which only accepts ASCII letters, digits, underscore
   and dash. Anything else is not a track name we produce. */
function tagValue(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[A-Za-z0-9_-]{1,32}$/.test(text) ? text : 'unknown';
}

function subjectFor(cardText) {
  /* The card's first line is "EXPERIMENT CARD — <test name>". Using the test
     name makes the message findable in an inbox six weeks later, which is the
     entire point of asking for it by email. Falls back to something plain if
     the shape ever changes. */
  const first = String(cardText).split('\n')[0] || '';
  const match = first.match(/^EXPERIMENT CARD\s*[—-]\s*(.+)$/);
  const name = match ? match[1].trim().slice(0, 80) : '';
  return name ? 'Your Experiment Card: ' + name : 'Your Experiment Card';
}

function bodyFor(cardText, consented) {
  const lines = [];
  lines.push('Here is your Experiment Card, in full, so you have it on Monday');
  lines.push('even if you lose the tab.');
  lines.push('');
  lines.push('Print it, or copy the eight fields into wherever you actually');
  lines.push('keep your week. The card is only worth anything if the cap, the');
  lines.push('dates and the stop number end up somewhere you will look.');
  lines.push('');
  lines.push('Come back to the builder any time: ' + BUILDER_URL);
  lines.push('(Your answers are saved in the browser you used, on that device.)');
  lines.push('');
  lines.push('----------------------------------------------------------------');
  lines.push('');
  lines.push(cardText);
  lines.push('');
  lines.push('----------------------------------------------------------------');
  lines.push('');
  lines.push('You run this test yourself. We do not run it for you, and nobody');
  lines.push('honest can promise you the result in advance.');
  lines.push('');
  if (consented) {
    lines.push('You ticked the box for occasional emails about the method and');
    lines.push('new experiments. To stop them, reply to this email with');
    lines.push('"unsubscribe" and you are off the list — no form, no login.');
  } else {
    lines.push('This is a one-off: you asked for the card, here it is. You did');
    lines.push('not tick the box for anything else, so there is nothing else');
    lines.push('coming.');
  }
  lines.push('');
  lines.push('Questions, or you want your data deleted: ' + REPLY_TO);
  lines.push('');
  lines.push('Test Your Jump Cheaply, from - Risk + Growth.');
  return lines.join('\n');
}

/* One shape for every refusal, so no branch can leak a detail by accident. */
function fail(res, status, message) {
  return res.status(status).json({ ok: false, error: message });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Send this as a POST request.');
  }

  /* Vercel parses JSON bodies; a raw string body is handled too so this works
     under a plain node server in local testing. */
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return fail(res, 400, "We couldn't read that request.");
    }
  }
  if (!body || typeof body !== 'object') {
    return fail(res, 400, "We couldn't read that request.");
  }

  const email = validEmail(body.email);
  if (!email) {
    /* US-06 AC6: an English message the browser can show as-is, and the card
       stays on screen — that part is the browser's job, but the wording here
       is written so it never reads as "you have lost the card". */
    return fail(res, 400, "That doesn't look like an email address. Check it and try again — your card is still on screen.");
  }

  const cardText = String(body.cardText == null ? '' : body.cardText);
  if (cardText.trim().length < MIN_CARD) {
    return fail(res, 400, 'There is no card to send yet. Finish the builder first.');
  }
  if (cardText.length > MAX_CARD) {
    return fail(res, 413, 'That card is too long to email. Copy it from the screen instead.');
  }

  if (rateLimited(clientIp(req))) {
    return fail(res, 429, "That's a lot of cards in a short time. Wait a few minutes and try again.");
  }

  /* PF-11. No key, no sending — and the caller is told the truth about which
     side the problem is on, without a word about what is missing or where. */
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return fail(
      res,
      503,
      "Email delivery isn't switched on yet. Your card is still on screen — copy or print it, and it stays saved in this browser."
    );
  }

  const consented = body.consent === true;
  const track = tagValue(body.track);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        reply_to: REPLY_TO,
        subject: subjectFor(cardText),
        text: bodyFor(cardText, consented),
        /* US-06 AC5 / Privacy §2.3: the marketing consent is a separate,
           unticked choice. It is carried as a tag so the founder can tell a
           card recipient from someone who joined the list, and List-Unsubscribe
           is set either way so an inbox that offers the button offers a
           working one. */
        headers: {
          'List-Unsubscribe': '<mailto:' + REPLY_TO + '?subject=unsubscribe>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        },
        tags: [
          { name: 'source', value: 'experiment_card' },
          { name: 'track', value: track },
          { name: 'marketing_consent', value: consented ? 'yes' : 'no' }
        ]
      })
    });

    if (!response.ok) {
      /* Read and discard. The body can quote the recipient back at us and can
         name provider internals; neither belongs in a response or a log. The
         status alone tells us whose fault it is. */
      try {
        await response.text();
      } catch (err) {
        /* nothing to read */
      }
      const ours = response.status >= 500 || response.status === 429;
      return fail(
        res,
        ours ? 503 : 502,
        "We couldn't send that email just now. Your card is still on screen — copy or print it, and try the email again in a minute."
      );
    }

    /* Nothing from the provider's response is echoed back: the message id is
       operational data and the browser has no use for it. */
    return res.status(200).json({ ok: true });
  } catch (err) {
    /* Network failure, DNS, timeout. Same sentence, same silence. */
    return fail(
      res,
      503,
      "We couldn't send that email just now. Your card is still on screen — copy or print it, and try the email again in a minute."
    );
  }
}

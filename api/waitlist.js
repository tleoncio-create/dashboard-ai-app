/*
 * TYJC — post-purchase feedback and the step-2 waiting list (RG-10 / US-10).
 *
 * Vercel serverless function, POST only. Second and last piece of server-side
 * code in the MVP, and it exists for the same single reason as api/send-card.js:
 * the Resend API key cannot live in the browser.
 *
 *   POST /api/waitlist
 *   { kind: 'feedback', answer: 'yes'|'no', comment?, track?, stage? } -> { ok: true }
 *   { kind: 'waitlist', email, consent: true, track? }                 -> { ok: true }
 *
 * WHY A SEPARATE FILE AND NOT AN EXTENSION OF send-card.js
 *
 * send-card.js sends the buyer their own card. Its rate limit, its 400 messages
 * and its whole contract are written around "there is a card on screen and this
 * is a copy of it". This endpoint sends something else, to someone else, under a
 * different consent, and its failures must never read as "your card is gone".
 * Folding two consents and two recipients into one handler would make both
 * harder to audit — and the consent branch is exactly the part a regulator, or
 * the QA, has to be able to read in one sitting.
 *
 * WHAT IT DOES NOT DO, DELIBERATELY (same stack rules as RG-06)
 *
 *   - No database. There is none in the MVP. The record of who joined the list
 *     is the message itself, in Resend, tagged with its origin and track, which
 *     is exactly the workaround written down for US-06 AC4. US-10 AC4 ("the
 *     waiting list join is recorded and segmented by track") is met the same
 *     way, plus the waitlist_joined analytics event the browser emits.
 *   - No logging of the address or of anything the buyer typed. Not on success,
 *     not on failure.
 *   - It never echoes the provider's error text. Same reasoning as send-card.js:
 *     a provider error can quote the recipient back.
 *
 * PRIVACY — read this before changing the feedback branch.
 *
 * The feedback answer is ANONYMOUS ON PURPOSE. This endpoint does not accept an
 * email address on a `feedback` payload and the browser never sends one, so the
 * one-word answer and the optional comment cannot be joined back to a person by
 * anything we hold. That is a deliberate choice, not an oversight: the answer is
 * a product signal, and it costs nothing to keep it unlinkable.
 *
 * The optional comment is free text a buyer typed. It travels to the founder's
 * own inbox and nowhere else. It never reaches analytics — see nextstep.js,
 * where the event carries the track and nothing else.
 *
 * PF-11: RESEND_API_KEY is set in the Vercel dashboard, never in the repo.
 * Without it this endpoint answers 503 and says so plainly. Nothing is recorded
 * and — this is the part that matters for the H2.2 number — the browser emits NO
 * waitlist_joined event on a failure, so the validation panel can never report a
 * capture that did not happen.
 */

/* Sending identity. Same verified domain as RG-06 (PF-10); `list@` is send-only,
   so replies go to the address a human reads (PF-02 / RG-08). */
const FROM = 'TYJC <list@lessriskmoregrowth.com>';
const REPLY_TO = 'contact@lessriskmoregrowth.com';

/* Where the internal feedback notification lands. The founder's inbox is the
   store, because there is no database — overridable so a preview deployment can
   point somewhere else. */
const FEEDBACK_TO = process.env.FEEDBACK_TO || REPLY_TO;

const MAX_EMAIL = 254;     // RFC 5321 practical maximum
const MAX_COMMENT = 2000;  // a sentence or two; anything longer is not feedback

/* Rate limit, per IP, in memory. Same honest caveat as send-card.js: a
   serverless instance is ephemeral and there can be many of them, so this is a
   speed bump against one browser hammering the endpoint, not a security
   control. The ceiling is higher than send-card's five because one buyer
   legitimately makes up to three calls here — the Yes/No answer, the optional
   comment, and the waiting-list join — and a retry after a flaky network must
   not lock them out of the one that carries the H2.2 signal. */
const RATE_MAX = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
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

/* Identical rule to send-card.js, on purpose: one @, something either side, a
   dot in the domain, no whitespace, no commas or semicolons (which is what a
   header-injection attempt looks like), no control characters. */
const EMAIL_RE = /^[^\s@,;:<>"'\\]+@[^\s@,;:<>"'\\]+\.[^\s@,;:<>"'\\]{2,}$/;

function validEmail(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text || text.length > MAX_EMAIL) return '';
  if (/[\r\n\t\0]/.test(text)) return '';
  return EMAIL_RE.test(text) ? text : '';
}

/* Resend tag values accept ASCII letters, digits, underscore and dash only.
   Anything else is not a value we produce. */
function tagValue(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[A-Za-z0-9_-]{1,32}$/.test(text) ? text : 'unknown';
}

/* The comment is free text and it is going into an email body, so control
   characters are stripped and the length is capped. It is never put in a
   subject line, never in a tag, and never in a header. */
function cleanComment(value) {
  const text = String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  return text.slice(0, MAX_COMMENT);
}

function feedbackBody(answer, track, comment, stage) {
  const lines = [];
  lines.push('Post-purchase feedback — US-10, one question.');
  lines.push('');
  lines.push('Is this experiment ready to run on Monday?   ' + answer.toUpperCase());
  lines.push('Track: ' + track);
  lines.push('Stage: ' + stage);
  lines.push('');
  if (comment) {
    lines.push('What they added, in their own words:');
    lines.push('');
    lines.push(comment);
  } else {
    lines.push('No comment left — the one-click answer is the whole message.');
  }
  lines.push('');
  lines.push('No email address is attached to this. The answer is anonymous by');
  lines.push('design (api/waitlist.js); it cannot be joined back to a buyer.');
  return lines.join('\n');
}

function waitlistBody() {
  const lines = [];
  lines.push("You're on the list for The Experiment Library.");
  lines.push('');
  lines.push("That's the whole of it: when it opens, you get one email. We");
  lines.push("are not giving you a date, because we don't have one, and we'd");
  lines.push("rather say so than invent one.");
  lines.push('');
  lines.push('Nothing else changes. The Experiment Card you already have is');
  lines.push('yours, and this list is not a subscription to anything.');
  lines.push('');
  lines.push('Want off the list? Reply with "unsubscribe" and you are off it —');
  lines.push('no form, no login, no follow-up asking why.');
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

/* Both branches end here. Everything provider-specific is in this one place so
   the two consents above stay readable. */
async function send(res, apiKey, message, failureMessage) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      /* Read and discard — the body can quote the recipient back at us and can
         name provider internals. The status alone tells us whose fault it is. */
      try {
        await response.text();
      } catch (err) {
        /* nothing to read */
      }
      const ours = response.status >= 500 || response.status === 429;
      return fail(res, ours ? 503 : 502, failureMessage);
    }

    /* Nothing from the provider's response is echoed back. */
    return res.status(200).json({ ok: true });
  } catch (err) {
    /* Network failure, DNS, timeout. Same sentence, same silence. */
    return fail(res, 503, failureMessage);
  }
}

const FEEDBACK_FAILED =
  "We couldn't record that just now. Nothing else to do — your card is unaffected, and you can try again in a minute.";
const WAITLIST_FAILED =
  "We couldn't add you to the list just now. Your card is unaffected. Try again in a minute, or email us and we'll add you by hand.";

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

  const kind = String(body.kind == null ? '' : body.kind).trim();
  if (kind !== 'feedback' && kind !== 'waitlist') {
    return fail(res, 400, "We couldn't read that request.");
  }

  /* Everything that can be judged without the key is judged first, so a
     malformed call gets the same answer with or without PF-11 delivered. */
  let answer = '';
  let comment = '';
  let stage = 'answer';
  let email = '';

  if (kind === 'feedback') {
    answer = String(body.answer == null ? '' : body.answer).trim().toLowerCase();
    if (answer !== 'yes' && answer !== 'no') {
      return fail(res, 400, 'Answer yes or no.');
    }
    comment = cleanComment(body.comment);
    stage = body.stage === 'comment' ? 'comment' : 'answer';
    /* An address on a feedback payload is refused rather than ignored: the
       browser never sends one, so its presence means something changed that a
       human should look at before it becomes a habit. The answer is anonymous
       by design — see the header. */
    if (body.email) {
      return fail(res, 400, "We couldn't read that request.");
    }
  } else {
    /* US-10 AC3/AC4 and Privacy §2.3: joining is an explicit, unticked opt-in.
       No box, no join — and the refusal says which box, in English. */
    if (body.consent !== true) {
      return fail(res, 400, 'Tick the box first, so we know you want the email.');
    }
    email = validEmail(body.email);
    if (!email) {
      return fail(res, 400, "That doesn't look like an email address. Check it and try again — your card is unaffected.");
    }
  }

  if (rateLimited(clientIp(req))) {
    return fail(res, 429, "That's a lot of requests in a short time. Wait a few minutes and try again.");
  }

  /* PF-11. No key, no sending — and the caller is told the truth about which
     side the problem is on, without a word about what is missing or where. */
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return fail(
      res,
      503,
      kind === 'waitlist'
        ? "The waiting list isn't switched on yet, so we haven't kept your address. Your card is unaffected — email us and we'll add you by hand."
        : "Feedback isn't switched on yet, so that answer wasn't recorded. Your card is unaffected."
    );
  }

  const track = tagValue(body.track);

  if (kind === 'feedback') {
    return send(
      res,
      apiKey,
      {
        from: FROM,
        to: [FEEDBACK_TO],
        reply_to: REPLY_TO,
        /* The buyer's own words never reach a subject line: a subject is
           quoted in notification previews, logs and phone lock screens. */
        subject: 'TYJC feedback — ready to run on Monday: ' + answer + ' (' + track + ')',
        text: feedbackBody(answer, track, comment, stage),
        tags: [
          { name: 'source', value: 'post_purchase_feedback' },
          { name: 'track', value: track },
          { name: 'answer', value: answer },
          { name: 'stage', value: stage }
        ]
      },
      FEEDBACK_FAILED
    );
  }

  return send(
    res,
    apiKey,
    {
      from: FROM,
      to: [email],
      reply_to: REPLY_TO,
      subject: "You're on the list — The Experiment Library",
      text: waitlistBody(),
      /* An inbox that offers an unsubscribe button gets a working one, on the
         first message, not on the one that announces the launch. */
      headers: {
        'List-Unsubscribe': '<mailto:' + REPLY_TO + '?subject=unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      },
      /* US-10 AC4, as far as a no-database stack can carry it: origin and
         track on the message, readable in the Resend dashboard. The analytics
         side of the same fact is the waitlist_joined event. */
      tags: [
        { name: 'source', value: 'waitlist_experiment_library' },
        { name: 'track', value: track },
        { name: 'marketing_consent', value: 'yes' }
      ]
    },
    WAITLIST_FAILED
  );
}

/*
 * TYJC — post-purchase: one question, and the step-2 waiting list
 * (RG-10 / US-10). Static page, client-side only, no framework.
 *
 * WHY THIS IS A SHARED MODULE AND NOT TWO COPIES
 *
 * The block has to exist in two places a buyer can be — the post-purchase
 * landing (thanks.html) and the end of the card flow (builder.html, appended by
 * card.js) — and the two must agree about what has already been answered. One
 * module, one pair of storage keys, one event guard. A buyer who answers on one
 * page is not asked again on the other.
 *
 * WHERE IT SITS IN THE JOURNEY, AND WHY (the RG-10 brief asked for the reason)
 *
 *   builder.html — LAST element of the card mount, BELOW the RG-06 email form.
 *     This is where the buyer actually finishes: the card is on screen, they
 *     have read it, and "is this ready to run on Monday?" is a question they can
 *     answer honestly. Asked any earlier it is a guess.
 *
 *     It does not compete with the email send, and that is a design constraint,
 *     not a hope. Three things keep it out of RG-06's way:
 *       1. it renders after the email form, so the first thing under the card is
 *          still "Email me the card";
 *       2. its opening move is a one-click answer, not a second form — there is
 *          no visible email field until the waiting-list box is ticked;
 *       3. when the buyer already emailed themselves the card in this page load,
 *          the field is pre-filled from that form IN MEMORY (never stored), so
 *          the same address is never typed twice.
 *
 *   thanks.html — after the "start now" section, before the legal footer. A
 *     buyer landing here has not built anything yet, so the question would be
 *     unanswerable; it appears only if this device already generated a card
 *     (a buyer coming back through the link in their email). The waiting-list
 *     invitation is shown either way — it is the only thing on that page that
 *     needs nothing to have happened first.
 *
 * US-10 AC5 — nothing here blocks the card, and nothing here has to be answered
 * to keep it. The card is already on screen and already saved when this renders.
 *
 * THE EVENT (US-07 / H2.2)
 *
 * `waitlist_joined` is the one event name outside the frozen seven, reserved for
 * this story in the FUNNEL_ORDER comment of analytics.js and read by report.html
 * for row H2.2. It is declared here rather than added to TYJC.EVENTS so that
 * RG-07's contract file is not touched by this story at all.
 *
 * It is emitted ONLY when the POST really succeeded, once per device, and it
 * carries the track and nothing else. A failed join records nothing, so the
 * panel can never report a capture that did not happen — H2.2 is the number that
 * decides an R$ 8k bet, and a number that flatters itself is worse than no
 * number.
 *
 * NO EMAIL ADDRESS EVER REACHES ANALYTICS (US-07 AC5). The address is read from
 * the field, put in the POST body, and dropped. sanitize() in analytics.js would
 * catch it, but that is a net, not a plan: the event below is built from the
 * track alone, in a scope where no address exists.
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});

  /* Vercel serves the function at /api/waitlist. Overridable so the site can be
     opened from a subdirectory, or from file:// against a local server. */
  var WAITLIST_URL = window.TYJC_WAITLIST_URL || '/api/waitlist';

  var FEEDBACK_KEY = 'tyjc.feedback.v1';
  var WAITLIST_KEY = 'tyjc.waitlist.v1';
  var BUILDER_KEY = 'tyjc.builder.v1'; // read-only, for the track on thanks.html
  var CARD_KEY = 'tyjc.card.v1';       // read-only, to know a card exists

  /* See "THE EVENT" above. Not in TYJC.EVENTS on purpose. */
  var WAITLIST_JOINED = 'waitlist_joined';

  var TRACKS = ['first_traction', 'scaling'];

  /* Same rule as the browser side of RG-06 and as api/waitlist.js. It saves a
     round trip; the server's copy is the one that decides. */
  var EMAIL_RE = /^[^\s@,;:<>"'\\]+@[^\s@,;:<>"'\\]+\.[^\s@,;:<>"'\\]{2,}$/;

  /* ------------------------------------------------------------------ *
   * Storage — best effort, exactly like everything else in this product.
   * A blocked localStorage degrades the guards to "this page load", which
   * can only lose an event, never invent one.
   * ------------------------------------------------------------------ */
  function readJson(key) {
    try {
      var raw = window.localStorage.getItem(key);
      var value = raw ? JSON.parse(raw) : null;
      return value && typeof value === 'object' ? value : null;
    } catch (err) {
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      /* see readJson */
    }
  }

  function feedbackState() {
    var value = readJson(FEEDBACK_KEY) || {};
    return {
      answer: value.answer === 'yes' || value.answer === 'no' ? value.answer : null,
      commented: value.commented === true
    };
  }

  function waitlistState() {
    var value = readJson(WAITLIST_KEY) || {};
    return { joined: value.joined === true };
  }

  /** The track this device chose, for pages that do not have the builder loaded. */
  function storedTrack() {
    var saved = readJson(BUILDER_KEY);
    var stage = saved && saved.answers ? saved.answers.stage : null;
    return TRACKS.indexOf(stage) === -1 ? null : stage;
  }

  /** Has this device ever generated a card? (thanks.html only — see the header.) */
  function hasCard() {
    var meta = readJson(CARD_KEY);
    if (!meta) return false;
    return Object.prototype.toString.call(meta.emitted) === '[object Array]' && meta.emitted.length > 0;
  }

  /* ------------------------------------------------------------------ *
   * The event
   * ------------------------------------------------------------------ */
  var emittedThisLoad = false;

  /**
   * Records the waiting-list join, once per device, ever.
   * @param {string|null} track
   * @returns {boolean} true when the event was emitted on this call
   */
  function emitWaitlistJoined(track) {
    if (emittedThisLoad) return false;          // double click, same page load
    if (waitlistState().joined) return false;   // this device, any earlier visit
    emittedThisLoad = true;
    writeJson(WAITLIST_KEY, { joined: true });
    try {
      TYJC.track(WAITLIST_JOINED, { track: track || null });
    } catch (err) {
      /* The buyer's page must not break because the recorder did. The guard is
         already written, so a reload does not retry it — an event lost here is
         lost in the same direction as everything else (analytics.js header). */
    }
    return true;
  }

  /* ------------------------------------------------------------------ *
   * DOM helpers (textContent only — nothing typed is ever treated as HTML)
   * ------------------------------------------------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function post(payload) {
    return window
      .fetch(WAITLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            if (response.ok && data && data.ok === true) return { ok: true };
            /* The server writes its own English; it is the side that knows what
               went wrong. The fallback is only for a server that said nothing. */
            return { ok: false, error: (data && data.error) || null };
          });
      })
      .catch(function () {
        /* Offline, blocked, or no function deployed at that path. */
        return { ok: false, error: null };
      });
  }

  /* ------------------------------------------------------------------ *
   * Part 1 — the single question (US-10 AC1)
   *
   * One question, two buttons, one click. The optional comment appears only
   * after the answer is safely recorded, so the one-click answer is never held
   * hostage to a text field nobody was going to fill in.
   * ------------------------------------------------------------------ */
  var FEEDBACK_FAILED =
    "We couldn't record that just now. Nothing else to do — your card is unaffected, and you can try again in a minute.";

  function renderQuestion(box, opts) {
    var wrap = el('div', 'nextstep__block');
    wrap.appendChild(el('h3', 'nextstep__title', 'Is this experiment ready to run on Monday?'));
    wrap.appendChild(
      el(
        'p',
        'nextstep__lead',
        'One question, one click. It tells us whether the card did its job — ' +
          'and skipping it changes nothing about what you already have.'
      )
    );

    var status = el('p', 'nextstep__status');
    status.setAttribute('role', 'status');
    status.hidden = true;

    var error = el('p', 'nextstep__error');
    error.setAttribute('role', 'alert');
    error.hidden = true;

    var answers = el('div', 'nextstep__answers');
    var buttons = {};
    var busy = false; // a second click on either button is not a second answer

    function show(node, message) {
      status.hidden = true;
      error.hidden = true;
      node.textContent = message;
      node.hidden = false;
    }

    /* The comment is a second, separate call — see api/waitlist.js. It carries
       the answer again so the founder's inbox never holds an orphan comment. */
    function renderComment(answer) {
      if (feedbackState().commented) return;
      var commentBox = el('div', 'nextstep__comment');

      var label = el('label', 'nextstep__label', 'Anything you would change? (optional)');
      label.setAttribute('for', 'tyjc-feedback-comment');
      commentBox.appendChild(label);

      var field = document.createElement('textarea');
      field.className = 'nextstep__field nextstep__field--text';
      field.id = 'tyjc-feedback-comment';
      field.rows = 3;
      field.setAttribute('placeholder', 'What was missing, or what you would cut.');
      commentBox.appendChild(field);

      var send = el('button', 'btn btn--ghost', 'Send this too');
      send.type = 'button';
      send.addEventListener('click', function () {
        var text = field.value.trim();
        if (!text) {
          field.focus();
          return;
        }
        if (send.disabled) return;
        send.disabled = true;
        send.textContent = 'Sending…';
        post({ kind: 'feedback', answer: answer, comment: text, track: opts.track, stage: 'comment' }).then(function (result) {
          if (result.ok) {
            writeJson(FEEDBACK_KEY, { answer: answer, commented: true });
            commentBox.parentNode.removeChild(commentBox);
            show(status, 'Both recorded. Thank you — that is genuinely useful.');
            return;
          }
          send.disabled = false;
          send.textContent = 'Send this too';
          show(error, result.error || FEEDBACK_FAILED);
        });
      });
      commentBox.appendChild(send);

      wrap.appendChild(commentBox);
    }

    function lock(answer) {
      Object.keys(buttons).forEach(function (key) {
        buttons[key].disabled = true;
        buttons[key].setAttribute('aria-pressed', String(key === answer));
      });
    }

    function answered(answer) {
      if (busy) return;
      busy = true;
      lock(answer);
      show(status, 'Recording…');
      post({ kind: 'feedback', answer: answer, track: opts.track, stage: 'answer' }).then(function (result) {
        if (result.ok) {
          writeJson(FEEDBACK_KEY, { answer: answer, commented: false });
          show(
            status,
            answer === 'yes'
              ? 'Recorded — thank you. Go and run it.'
              : "Recorded — thank you. That is the more useful of the two answers."
          );
          renderComment(answer);
          return;
        }
        /* Nothing was recorded, so nothing pretends to have been. The buttons
           come back and the buyer can try again. */
        busy = false;
        Object.keys(buttons).forEach(function (key) {
          buttons[key].disabled = false;
          buttons[key].setAttribute('aria-pressed', 'false');
        });
        show(error, result.error || FEEDBACK_FAILED);
      });
    }

    ['yes', 'no'].forEach(function (value) {
      var button = el('button', 'btn btn--answer', value === 'yes' ? 'Yes' : 'No');
      button.type = 'button';
      button.id = 'tyjc-feedback-' + value;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () {
        answered(value);
      });
      buttons[value] = button;
      answers.appendChild(button);
    });

    var already = feedbackState();
    if (already.answer) {
      /* Answered on an earlier visit, or on the other page. Show what was said
         and move on — asking twice would corrupt the reading and annoy them. */
      lock(already.answer);
      status.hidden = false;
      status.textContent =
        'You answered "' + (already.answer === 'yes' ? 'Yes' : 'No') + '" already. Thank you.';
    }

    wrap.appendChild(answers);
    wrap.appendChild(status);
    wrap.appendChild(error);
    box.appendChild(wrap);

    if (already.answer && !already.commented) renderComment(already.answer);
  }

  /* ------------------------------------------------------------------ *
   * Part 2 — the waiting list (US-10 AC3/AC4/AC6)
   *
   * One sentence of description. No price, no launch date, and no promise of
   * when — anti-escopo 1 and AC6 are both about the same lie, and it is not
   * worth an email address.
   *
   * The opt-in is an UNTICKED box, exactly like RG-06's marketing consent
   * (Privacy Policy §2.3), and it is what reveals the address field: no box, no
   * field, no join. The server refuses a join without consent: true as well, so
   * the rule survives anyone poking at the page.
   * ------------------------------------------------------------------ */
  var WAITLIST_FAILED =
    "We couldn't add you to the list just now. Your card is unaffected. Try again in a minute, or email us and we'll add you by hand.";

  function renderWaitlist(box, opts) {
    var wrap = el('div', 'nextstep__block');
    wrap.appendChild(el('h3', 'nextstep__title', "What we're building next"));

    /* AC3: one sentence, and it says what the thing is — nothing about price,
       nothing about dates. */
    wrap.appendChild(
      el(
        'p',
        'nextstep__lead',
        "The Experiment Library is the next thing we're building: a bigger set of " +
          'cheap tests to pick from, and a place to write down how each one turned out.'
      )
    );

    if (waitlistState().joined) {
      var done = el('p', 'nextstep__status', "You're on the list. We'll email you once, when it opens.");
      done.setAttribute('role', 'status');
      wrap.appendChild(done);
      box.appendChild(wrap);
      return;
    }

    /* UNTICKED, and nothing in this file ever ticks it. */
    var optWrap = el('label', 'nextstep__opt');
    var opt = document.createElement('input');
    opt.type = 'checkbox';
    opt.id = 'tyjc-waitlist-opt';
    opt.checked = false;
    optWrap.setAttribute('for', 'tyjc-waitlist-opt');
    optWrap.appendChild(opt);
    optWrap.appendChild(
      el('span', null, 'Tell me when The Experiment Library opens.')
    );
    wrap.appendChild(optWrap);

    var form = el('div', 'nextstep__form');
    form.hidden = true;

    var label = el('label', 'nextstep__label', 'Your email address');
    label.setAttribute('for', 'tyjc-waitlist-email');
    form.appendChild(label);

    var field = document.createElement('input');
    field.type = 'email';
    field.className = 'nextstep__field';
    field.id = 'tyjc-waitlist-email';
    field.name = 'waitlist-email';
    field.autocomplete = 'email';
    field.setAttribute('inputmode', 'email');
    field.setAttribute('placeholder', 'you@yourbusiness.com');
    form.appendChild(field);

    var status = el('p', 'nextstep__status');
    status.setAttribute('role', 'status');
    status.hidden = true;
    form.appendChild(status);

    var error = el('p', 'nextstep__error');
    error.setAttribute('role', 'alert');
    error.hidden = true;
    form.appendChild(error);

    var join = el('button', 'btn btn--primary', 'Add me to the list');
    join.type = 'button';
    form.appendChild(join);

    form.appendChild(
      el(
        'p',
        'nextstep__fine',
        'One email, when it opens, and nothing else follows. Reply "unsubscribe" ' +
          "any time and you're off the list. We never sell your address. There is " +
          "no date on this, and we're not going to invent one."
      )
    );

    function show(node, message) {
      status.hidden = true;
      error.hidden = true;
      node.textContent = message;
      node.hidden = false;
    }

    opt.addEventListener('change', function () {
      form.hidden = !opt.checked;
      if (!opt.checked) return;
      /* In-memory only: the address the buyer typed into the RG-06 form during
         THIS page load. Nothing about it is stored by this file. */
      if (!field.value && typeof opts.emailHint === 'function') {
        var hint = opts.emailHint();
        if (typeof hint === 'string' && EMAIL_RE.test(hint)) field.value = hint;
      }
      field.focus();
    });

    join.addEventListener('click', function () {
      if (join.disabled) return; // double click: the second one is not a second join

      var address = field.value.trim();
      if (!EMAIL_RE.test(address) || address.length > 254) {
        show(error, "That doesn't look like an email address. Check it and try again — your card is unaffected.");
        field.focus();
        return;
      }
      if (!opt.checked) {
        show(error, 'Tick the box first, so we know you want the email.');
        return;
      }

      join.disabled = true;
      join.textContent = 'Adding…';

      post({ kind: 'waitlist', email: address, consent: true, track: opts.track }).then(function (result) {
        if (result.ok) {
          field.disabled = true;
          opt.disabled = true;
          join.textContent = 'Added';
          show(status, "You're on the list. We'll email you once, when it opens — and only then.");
          /* Only on a real success. See "THE EVENT" in the header. */
          emitWaitlistJoined(opts.track);
          return;
        }
        join.disabled = false;
        join.textContent = 'Add me to the list';
        show(error, result.error || WAITLIST_FAILED);
      });
    });

    wrap.appendChild(form);
    box.appendChild(wrap);
  }

  /* ------------------------------------------------------------------ *
   * Mounting
   * ------------------------------------------------------------------ */
  /**
   * Renders the post-purchase block.
   * @param {Element} mount where to append
   * @param {{track?: string|null, withQuestion?: boolean, emailHint?: function}} [options]
   * @returns {Element|null} the rendered section
   */
  function render(mount, options) {
    if (!mount || mount.querySelector('.nextstep')) return null;
    var opts = options || {};
    var track = opts.track || storedTrack();
    var withQuestion = opts.withQuestion !== false;

    var box = el('section', 'nextstep');
    box.setAttribute('aria-label', 'Before you go');

    if (withQuestion) renderQuestion(box, { track: track });
    renderWaitlist(box, { track: track, emailHint: opts.emailHint });

    mount.appendChild(box);
    return box;
  }

  TYJC.nextStep = {
    EVENT: WAITLIST_JOINED,
    FEEDBACK_KEY: FEEDBACK_KEY,
    WAITLIST_KEY: WAITLIST_KEY,
    render: render,
    /* Small public surface, for QA. */
    state: function () {
      return { feedback: feedbackState(), waitlist: waitlistState(), track: storedTrack() };
    },
    reset: function () {
      try {
        window.localStorage.removeItem(FEEDBACK_KEY);
        window.localStorage.removeItem(WAITLIST_KEY);
      } catch (err) {
        /* nothing stored */
      }
      emittedThisLoad = false;
    }
  };

  /* Self-mount for thanks.html. The card flow does NOT use this path: card.js
     calls render() itself, after the email form, with the live builder track. */
  function selfMount() {
    var mount = document.getElementById('tyjc-nextstep');
    if (!mount) return;
    render(mount, { track: storedTrack(), withQuestion: hasCard() });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', selfMount);
  } else {
    selfMount();
  }
})();

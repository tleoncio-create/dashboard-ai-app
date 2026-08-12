/*
 * TYJC — analytics (RG-07 / US-07).
 *
 * Static site, no backend. This file is the ONLY place allowed to talk to a
 * third party, and only once a provider is installed (see "Installing a
 * provider" below). Until then it is a local recorder: events are kept on the
 * user's own device and read by the internal panel, report.html.
 *
 * FROZEN EVENT CONTRACT (US-07 AC1/AC2). Names never change per feature:
 *
 *   page_view            { page }                     — fired here, site-wide
 *   checkout_start       { }                          — owned by RG-02
 *   purchase             { order_id?, value?, currency? } — owned by RG-02
 *   builder_start        { track: null }              — builder.js
 *   builder_step_completed { step: 1..8, track }      — builder.js
 *   card_generated       { track, experiment_id }     — card.js
 *   email_captured       { track }                    — owned by RG-06
 *
 * Every event also carries the first-touch traffic attribution (source /
 * medium / campaign), which is what lets report.html separate paid from
 * organic (US-07 AC4).
 *
 * PRIVACY (US-07 AC5). The Privacy Policy in force is the one rewritten in
 * c4f8c54 (DF-12); the older wording this header used to cite ("anonymous
 * analytics", "no advertising trackers") was revoked there and must not be
 * quoted again. Two live promises, two owners:
 *
 *   §5 — "Your email address is never sent to our analytics or advertising
 *        tools. Neither are your builder answers. ... the code that records
 *        these events drops anything that looks like an email address and
 *        anything that isn't on a fixed list of allowed fields, whatever it's
 *        called." That code is sanitize() below: allow-list by name, e-mail
 *        test on every value, and the same test on the key names echoed back
 *        in _dropped (a key can be free text too — BLQ-3).
 *   §9 — "Analytics and advertising cookies only run if you accept them."
 *        Owned by consent.js. This file loads nothing and sets no cookie: it
 *        records to the visitor's own device and hands events to whatever
 *        sink consent.js installs, if any.
 *
 * INSTALLING A PROVIDER (the one open decision — see
 * docs/risk-growth/sprint-1/proposta-provedores.md):
 *
 *   TYJC.analytics.install(function (event) {
 *     // event = { name, props, ts, seq }  — already sanitized
 *     provider.track(event.name, event.props);   // e.g. plausible / umami
 *   });
 *
 * DELIVERY MARK (BLQ-2). Every recorded event gets a sequence number (`seq`),
 * and localStorage keeps, next to the store, the highest seq already handed to
 * a sink. install() replays only what is past that mark and then advances it;
 * track() advances it for each event it hands over live. So:
 *
 *   - a provider that loads late still gets the start of the funnel, because
 *     everything not yet delivered is replayed exactly once;
 *   - install() called on ten page loads delivers each event once, not ten
 *     times. Before the mark existed, install() replayed the whole store every
 *     page load and inflated the volume that decides degrau 2 by up to 5.5x;
 *   - clear() drops the mark with the store, so a wiped device starts over.
 *
 * "Delivered" means "handed to the sink" — NOT "arrived at the provider". This
 * file has no way to know the difference, and the gap has one large, everyday
 * cause: an ad blocker. With uBlock or similar installed, plausible.js and
 * gtag.js never load; the queue stub consent.js installs still accepts the
 * call, so the sink returns normally, the mark advances, and the event is gone.
 * It is not retried and it is not re-queued — see the paragraph below.
 *
 * The direction of that error is UNDERCOUNTING: the panel and the provider show
 * fewer events than really happened, never more. The PM accepted that trade for
 * the degrau-2 kill/scale call because it is the safe direction — a decision
 * made on undercounted numbers kills something that was actually working
 * slightly better than it looked, whereas overcounting would scale a bet that
 * never earned it. Read every absolute volume as a floor, and remember that
 * ad-blocker rates differ by traffic source, so paid and organic are not
 * discounted by the same amount (US-07 AC4 compares them — the comparison is
 * indicative, not exact).
 *
 * If the sink throws, the event is not re-queued: a provider that fails on an
 * event will fail on the replay too, and an analytics retry loop is not worth a
 * page load.
 *
 * A store written before the mark existed (no seq on its events) is adopted as
 * ALREADY delivered on first read. Under the old code those events had already
 * been sent — repeatedly — if any sink was installed, and if none was, there
 * was no provider to lose them; back-filling them into a provider that goes
 * live today would only stamp last week's visits with today's date, since a
 * provider timestamps on receipt and ignores event.ts.
 *
 * Nothing here retries or buffers across devices: a dropped event is lost, and
 * that is the correct trade for a page that must never block on analytics.
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});

  TYJC.EVENTS = {
    PAGE_VIEW: 'page_view',
    CHECKOUT_START: 'checkout_start',
    PURCHASE: 'purchase',
    BUILDER_START: 'builder_start',
    BUILDER_STEP_COMPLETED: 'builder_step_completed',
    CARD_GENERATED: 'card_generated',
    EMAIL_CAPTURED: 'email_captured'
  };

  /* The canonical funnel order, used by report.html to check a walkthrough
     (US-07 AC6). waitlist_joined is NOT part of the frozen seven: it belongs to
     RG-10 and the panel reads it only if that story ever emits it. */
  TYJC.FUNNEL_ORDER = [
    'page_view',
    'checkout_start',
    'purchase',
    'builder_start',
    'builder_step_completed',
    'card_generated',
    'email_captured'
  ];

  var STORE_KEY = 'tyjc.analytics.v1';
  var ATTRIB_KEY = 'tyjc.attrib.v1';
  var MARK_KEY = 'tyjc.analytics.mark.v1'; // the delivery mark — see the header
  var MAX_STORED = 500; // oldest fall off first; this is a funnel, not an archive

  /* Only these property names may travel. Anything else is dropped by name. */
  var ALLOWED_PROPS = [
    'step', 'track', 'experiment_id', 'page',
    'source', 'medium', 'campaign',
    'order_id', 'value', 'currency'
  ];

  var EMAIL_LIKE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  var MAX_VALUE_LEN = 64;

  var analytics = (TYJC.analytics = TYJC.analytics || {});
  analytics.events = analytics.events || []; // this page load only
  analytics.sink = analytics.sink || null;

  /* ------------------------------------------------------------------ *
   * Storage (best effort — analytics must never break the product)
   * ------------------------------------------------------------------ */
  function readJson(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var value = JSON.parse(raw);
      return value === null || value === undefined ? fallback : value;
    } catch (err) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  /* ------------------------------------------------------------------ *
   * The delivery mark (BLQ-2)
   *
   *   { next: the sequence number the next recorded event will get,
   *     delivered: the highest sequence number already handed to a sink }
   *
   * It lives beside the store, under its own key, so the store stays the plain
   * array report.html and the QA fixtures already read.
   * ------------------------------------------------------------------ */
  function readMark() {
    var mark = readJson(MARK_KEY, null);
    if (!mark || typeof mark.next !== 'number' || typeof mark.delivered !== 'number') return null;
    if (!isFinite(mark.next) || !isFinite(mark.delivered)) return null;
    return { next: mark.next, delivered: mark.delivered };
  }

  /**
   * Reads the store and the mark together, repairing both if needed, and
   * returns { events, mark }. Events written before the mark existed are
   * stamped with a sequence number here and counted as already delivered —
   * see "DELIVERY MARK" in the header for why that is the honest default.
   */
  function loadState() {
    var raw = readJson(STORE_KEY, []);
    var events = isArray(raw) ? raw : [];
    var stored = readMark();
    var mark = stored || { next: 1, delivered: 0 };
    var dirty = !stored;
    var highest = 0;

    events.forEach(function (event) {
      if (!event || typeof event !== 'object') return;
      if (typeof event.seq !== 'number' || !isFinite(event.seq)) {
        event.seq = mark.next;
        mark.next += 1;
        if (event.seq > mark.delivered) mark.delivered = event.seq;
        dirty = true;
      }
      if (event.seq > highest) highest = event.seq;
    });

    /* A mark that lost track of the store (mark key cleared on its own, or a
       hand-seeded store) must never hand out a number already in use. */
    if (mark.next <= highest) {
      mark.next = highest + 1;
      dirty = true;
    }

    if (dirty) {
      writeJson(STORE_KEY, events);
      writeJson(MARK_KEY, mark);
    }
    return { events: events, mark: mark };
  }

  /* Moves the mark forward — never backward — after an event has been handed
     to a sink. */
  function noteDelivered(seq) {
    if (typeof seq !== 'number' || !isFinite(seq)) return;
    var mark = readMark();
    if (!mark || seq <= mark.delivered) return;
    mark.delivered = seq;
    writeJson(MARK_KEY, mark);
  }

  /* ------------------------------------------------------------------ *
   * Traffic attribution — first touch, so a visitor who arrives from an ad
   * and buys three days later still counts as paid (US-07 AC4).
   * Click ids (gclid/fbclid/msclkid) are used to classify and then thrown
   * away: we keep the classification, never the identifier.
   * ------------------------------------------------------------------ */
  var PAID_MEDIA = ['cpc', 'ppc', 'paid', 'paidsocial', 'paid_social', 'paid-social', 'display', 'banner'];
  var CLICK_IDS = ['gclid', 'fbclid', 'msclkid', 'ttclid'];

  function queryParams() {
    var out = {};
    var location = window.location || {};
    var search = String(location.search || '').replace(/^\?/, '');
    if (!search) return out;
    search.split('&').forEach(function (pair) {
      if (!pair) return;
      var bits = pair.split('=');
      var key = decodeURIComponent(bits[0] || '').toLowerCase();
      var value = decodeURIComponent((bits[1] || '').replace(/\+/g, ' '));
      if (key) out[key] = value;
    });
    return out;
  }

  function classify(params) {
    var medium = String(params.utm_medium || '').toLowerCase();
    var hasClickId = CLICK_IDS.some(function (id) {
      return !!params[id];
    });
    if (hasClickId || PAID_MEDIA.indexOf(medium) !== -1) return 'paid';
    return 'organic';
  }

  function shortText(value) {
    var text = String(value === undefined || value === null ? '' : value).trim();
    if (!text) return '';
    if (EMAIL_LIKE.test(text)) return '';
    return text.slice(0, MAX_VALUE_LEN);
  }

  function attribution() {
    var stored = readJson(ATTRIB_KEY, null);
    if (stored && stored.source) return stored;

    var params = queryParams();
    var fresh = {
      source: shortText(params.utm_source) || (classify(params) === 'paid' ? 'ad' : 'direct'),
      medium: shortText(params.utm_medium) || (classify(params) === 'paid' ? 'cpc' : 'none'),
      campaign: shortText(params.utm_campaign) || 'none',
      traffic: classify(params),
      firstSeen: new Date().toISOString()
    };
    writeJson(ATTRIB_KEY, fresh);
    return fresh;
  }

  /* ------------------------------------------------------------------ *
   * Sanitizing — the hard guarantee behind US-07 AC5
   * ------------------------------------------------------------------ */
  function sanitize(props) {
    var clean = {};
    var dropped = [];
    Object.keys(props || {}).forEach(function (key) {
      if (ALLOWED_PROPS.indexOf(key) === -1) {
        dropped.push(key);
        return;
      }
      var value = props[key];
      if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
        clean[key] = value;
        return;
      }
      var text = shortText(value);
      if (text === '' && String(value || '').trim() !== '') {
        dropped.push(key); // looked like an e-mail, or was empty after trimming
        return;
      }
      if (text !== '') clean[key] = text;
    });
    /* BLQ-3: key names only, never values — but a key name IS free text (a
       caller can pass { 'sam@example.com': 1 }), so every name goes through
       the same ruler as a value: e-mail-shaped names are dropped, long ones
       are truncated at 64. A name that survives as nothing still counts, as
       "redacted", so the panel keeps the signal that something was refused. */
    if (dropped.length) {
      clean._dropped = dropped.map(function (name) {
        return shortText(name) || 'redacted';
      }).join(',').slice(0, MAX_VALUE_LEN);
      /* The ceiling applies to the joined report too, so "no string in props is
         longer than 64" is an invariant the panel can check without
         exceptions. Truncating here cannot bring an e-mail back: a name that
         looked like one was already replaced whole, before the join. */
    }
    return clean;
  }

  /* ------------------------------------------------------------------ *
   * Recording
   * ------------------------------------------------------------------ */
  /* Stamps the event with its sequence number and stores it. */
  function persist(event) {
    var state = loadState();
    event.seq = state.mark.next;
    state.mark.next += 1;

    var stored = state.events;
    stored.push(event);
    if (stored.length > MAX_STORED) stored = stored.slice(stored.length - MAX_STORED);
    writeJson(STORE_KEY, stored);
    writeJson(MARK_KEY, state.mark);
  }

  /**
   * Records one funnel event.
   * @param {string} name one of TYJC.EVENTS
   * @param {object} [props] no personal data, ever — see sanitize()
   */
  TYJC.track = function (name, props) {
    var attrib = attribution();
    var payload = sanitize(props);
    payload.source = attrib.source;
    payload.medium = attrib.medium;
    payload.campaign = attrib.campaign;
    payload.traffic = attrib.traffic;

    var event = { name: name, props: payload, ts: new Date().toISOString() };
    analytics.events.push(event);
    persist(event);

    if (typeof analytics.sink === 'function') {
      try {
        analytics.sink(event);
      } catch (err) {
        /* analytics must never break the product */
      }
      /* Handed over live, so the next page load's install() must not replay
         it. This is the other half of BLQ-2: without it the mark would only
         ever cover what install() itself replayed. */
      noteDelivered(event.seq);
    }
    return event;
  };

  /* ------------------------------------------------------------------ *
   * Public surface for the provider and for report.html
   * ------------------------------------------------------------------ */

  /** Everything recorded on this device, oldest first. */
  analytics.all = function () {
    return loadState().events;
  };

  /**
   * Wipes the local record AND the first-touch attribution, so the next
   * landing is attributed from scratch. Both have to go together: clearing
   * only the events would leave a device permanently stamped "paid" from an
   * ad click three tests ago.
   */
  analytics.clear = function () {
    try {
      window.localStorage.removeItem(STORE_KEY);
      window.localStorage.removeItem(ATTRIB_KEY);
      /* The delivery mark goes with them: a device whose record was wiped must
         start counting from one, not from a mark pointing past events that no
         longer exist. */
      window.localStorage.removeItem(MARK_KEY);
    } catch (err) {
      /* nothing stored */
    }
    analytics.events = [];
  };

  /**
   * Installs the provider and replays what this device recorded and has NOT
   * yet delivered, so a provider that loads late still gets the start of the
   * funnel — and gets it once, not once per page load (BLQ-2).
   * @param {function(Object)} sink
   */
  analytics.install = function (sink) {
    if (typeof sink !== 'function') return;
    analytics.sink = sink;

    var state = loadState();
    var mark = state.mark;
    var floor = mark.delivered;
    var highest = floor;

    state.events.forEach(function (event) {
      var seq = event && typeof event.seq === 'number' ? event.seq : 0;
      if (seq <= floor) return;
      try {
        sink(event);
      } catch (err) {
        /* one bad replay must not stop the rest — and does not earn a retry */
      }
      if (seq > highest) highest = seq;
    });

    if (highest > mark.delivered) {
      mark.delivered = highest;
      writeJson(MARK_KEY, mark);
    }
  };

  analytics.attribution = attribution;

  /* ------------------------------------------------------------------ *
   * page_view — owned here, site-wide (US-07 AC1). Pages that must not
   * appear in the funnel (the internal panel) set window.TYJC_NO_PAGE_VIEW
   * before loading this file.
   * ------------------------------------------------------------------ */
  function pageName() {
    var path = String((window.location || {}).pathname || '');
    var file = path.split('/').pop() || 'index.html';
    if (path.indexOf('/legal/') !== -1) return 'legal';
    if (file === 'builder.html') return 'builder';
    if (file === 'report.html') return 'report';
    if (file === '' || file === 'index.html') return 'sales';
    return 'other';
  }

  if (!window.TYJC_NO_PAGE_VIEW) {
    try {
      TYJC.track(TYJC.EVENTS.PAGE_VIEW, { page: pageName() });
    } catch (err) {
      /* A page must never fail to load because analytics could not start. */
    }
  }
})();

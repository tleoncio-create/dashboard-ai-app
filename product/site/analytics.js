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
 * PRIVACY (US-07 AC5, and Privacy Policy §5/§9 — "anonymous analytics", "no
 * advertising trackers"): the e-mail address and every free-text answer the
 * user types are NEVER part of an event. That is not left to good intentions:
 * sanitize() below drops any property that is not on the allow-list, and drops
 * any value that looks like an e-mail address, whatever the key is called.
 *
 * INSTALLING A PROVIDER (the one open decision — see
 * docs/risk-growth/sprint-1/proposta-provedores.md):
 *
 *   TYJC.analytics.install(function (event) {
 *     // event = { name, props, ts }  — already sanitized
 *     provider.track(event.name, event.props);   // e.g. plausible / umami
 *   });
 *
 * install() replays everything already recorded on this device, so it does not
 * matter whether the provider script loads before or after the funnel starts.
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
    if (dropped.length) clean._dropped = dropped.join(','); // key names only, never values
    return clean;
  }

  /* ------------------------------------------------------------------ *
   * Recording
   * ------------------------------------------------------------------ */
  function persist(event) {
    var stored = analytics.all();
    stored.push(event);
    if (stored.length > MAX_STORED) stored = stored.slice(stored.length - MAX_STORED);
    writeJson(STORE_KEY, stored);
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
    }
    return event;
  };

  /* ------------------------------------------------------------------ *
   * Public surface for the provider and for report.html
   * ------------------------------------------------------------------ */

  /** Everything recorded on this device, oldest first. */
  analytics.all = function () {
    var stored = readJson(STORE_KEY, []);
    return Object.prototype.toString.call(stored) === '[object Array]' ? stored : [];
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
    } catch (err) {
      /* nothing stored */
    }
    analytics.events = [];
  };

  /**
   * Installs the provider. Replays what is already on this device so the
   * provider never misses the start of a funnel it loaded late.
   * @param {function(Object)} sink
   */
  analytics.install = function (sink) {
    if (typeof sink !== 'function') return;
    analytics.sink = sink;
    analytics.all().forEach(function (event) {
      try {
        sink(event);
      } catch (err) {
        /* one bad replay must not stop the rest */
      }
    });
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

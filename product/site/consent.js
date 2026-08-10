/*
 * TYJC — cookie consent gate (DT-01 / DT-02).
 *
 * THE SPEC FOR THIS FILE IS legal/privacy.html §9, which is already public copy:
 *
 *   "Analytics and advertising cookies only run if you accept them. Until you
 *    choose, they don't fire at all — nothing is set in advance and asked about
 *    later. You can change your mind whenever you like from the cookie link in
 *    the footer, and withdrawing is exactly as easy as accepting was."
 *
 * and §5: "Plausible ... runs for everyone, because there is nothing here to
 * consent to"; "Google Analytics ... only runs if you accept analytics cookies."
 *
 * So there are TWO independent gates, and a provider only runs when both open:
 *
 *   1. analytics-config.js — `enabled` per provider. Values only, no side
 *      effects. This file never writes to it and never overrides it.
 *   2. this file — the visitor's choice, for the providers that need one.
 *
 *   plausible : gate 1 only. No cookie, no device identifier, nothing to
 *               consent to. Loads for everyone the moment it is enabled.
 *   ga4       : gates 1 AND 2. Consent Mode v2 is initialised with every
 *               storage type DENIED before anything loads; nothing from Google
 *               is requested until an explicit Accept. Decline loads nothing.
 *
 * Google's default "Google tag (gtag.js)" snippet is deliberately NOT used: it
 * requests gtag.js and calls gtag('js', new Date()) / gtag('config', …) on page
 * load, with no gate, which would set a cookie before the visitor answered the
 * banner and make §9 a false statement. Everything in the Google path below —
 * the script element included — happens inside grant(), never at boot.
 *
 * No dark pattern (§9 "withdrawing is exactly as easy as accepting"):
 *   - Accept and Decline are the same size, weight and colour.
 *   - Closing the banner without choosing is NOT consent. Nothing loads, and
 *     the question comes back on the next visit.
 *   - The footer's "Cookie settings" reopens the banner and can switch either
 *     way, including accepted -> declined.
 *
 * The choice is kept in localStorage under `tyjc.consent.v1` — §9's "record of
 * the choice you made in the cookie banner", the third kind of strictly
 * necessary storage. It carries a version so a future change to what we ask
 * about can re-ask instead of silently inheriting an answer to another
 * question.
 *
 * Load order in the pages:  analytics-config.js -> analytics.js -> consent.js
 * (analytics.js is optional: on the legal pages consent.js runs standalone.)
 */
(function () {
  'use strict';

  var STORE_KEY = 'tyjc.consent.v1';
  var STORE_VERSION = 1;
  var ACCEPTED = 'accepted';
  var DECLINED = 'declined';

  var TYJC = (window.TYJC = window.TYJC || {});
  var config = window.TYJC_ANALYTICS_CONFIG || {};
  var plausibleCfg = config.plausible || {};
  var ga4Cfg = config.ga4 || {};

  /* report.html is the internal validation panel: noindex, and it sets
     TYJC_NO_PAGE_VIEW so it stays out of the funnel. Loading a provider there
     would count the team's own visits inside the very instrument the degrau-2
     kill/scale decision reads, so the panel gets the banner and the "Cookie
     settings" control (the choice is the same origin-wide choice) but never a
     provider script. */
  var INTERNAL = !!window.TYJC_NO_PAGE_VIEW;

  /* Does this page carry the frozen event contract? If it does, page_view
     arrives through the sink and GA4's own automatic page_view is switched off
     so the funnel is counted once, from one source. */
  function hasContract() {
    return !!(TYJC.analytics && typeof TYJC.analytics.install === 'function');
  }

  /* ------------------------------------------------------------------ *
   * The stored choice (best effort — a browser that refuses storage just
   * gets asked again, which is the safe direction)
   * ------------------------------------------------------------------ */
  function readChoice() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var value = JSON.parse(raw);
      if (!value || value.version !== STORE_VERSION) return null;
      if (value.choice !== ACCEPTED && value.choice !== DECLINED) return null;
      return value;
    } catch (err) {
      return null;
    }
  }

  function writeChoice(choice) {
    var record = {
      version: STORE_VERSION,
      choice: choice,
      ts: new Date().toISOString()
    };
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(record));
    } catch (err) {
      /* Private mode or storage disabled: the choice holds for this page load
         and we ask again next time. Never a reason to assume consent. */
    }
    return record;
  }

  /* ------------------------------------------------------------------ *
   * Sinks — one fan-out installed once, providers registered as they go live
   *
   * TYJC.analytics.install() replays everything recorded ON THIS DEVICE, which
   * includes previous page loads and previous visits. Forwarding that replay
   * verbatim on every page load would re-send the whole history to the
   * provider on each navigation. So the fan-out forwards only events belonging
   * to THIS page load — TYJC.analytics.events is documented as "this page load
   * only" — which also means a provider that goes live mid-visit (GA4, right
   * after Accept) never back-fills events recorded before the visitor said yes.
   * ------------------------------------------------------------------ */
  var sinks = [];
  var installed = false;

  function eventKey(event) {
    var props;
    try {
      props = JSON.stringify(event.props || {});
    } catch (err) {
      props = '';
    }
    return String(event.name) + '|' + String(event.ts) + '|' + props;
  }

  function isThisPageLoad(event) {
    var live = (TYJC.analytics && TYJC.analytics.events) || [];
    var key = eventKey(event);
    for (var i = 0; i < live.length; i++) {
      if (eventKey(live[i]) === key) return true;
    }
    return false;
  }

  function fanout(event) {
    if (!event || !isThisPageLoad(event)) return;
    var key = eventKey(event);
    sinks.forEach(function (entry) {
      if (entry.seen[key]) return;
      entry.seen[key] = true;
      try {
        entry.send(event);
      } catch (err) {
        /* analytics must never break the product */
      }
    });
  }

  function addSink(send) {
    if (!hasContract()) return;
    var entry = { send: send, seen: {} };
    sinks.push(entry);
    if (!installed) {
      installed = true;
      /* install() replays this device's record into fanout(); the filter above
         keeps only what this page load produced (in practice: page_view, which
         analytics.js fires before this file runs). */
      TYJC.analytics.install(fanout);
    } else {
      TYJC.analytics.all().forEach(fanout);
    }
  }

  /* Provider payloads: primitives only, no nulls, nothing this file invents.
     analytics.js has already dropped anything outside its allow-list and
     anything that looks like an e-mail address (US-07 AC5 / §5). */
  function cleanProps(props) {
    var out = {};
    Object.keys(props || {}).forEach(function (key) {
      var value = props[key];
      if (value === null || value === undefined || value === '') return;
      out[key] = typeof value === 'number' || typeof value === 'boolean' ? value : String(value);
    });
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Plausible — no consent gate (§5: "runs for everyone")
   * ------------------------------------------------------------------ */
  var plausibleLoaded = false;

  function loadPlausible() {
    if (plausibleLoaded) return;
    if (INTERNAL) return;
    if (!plausibleCfg.enabled) return;
    if (!plausibleCfg.src || !plausibleCfg.domain) return;
    plausibleLoaded = true;

    /* Queue stub so events fired before the script arrives are not lost. */
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    var script = document.createElement('script');
    script.defer = true;
    script.src = plausibleCfg.src;
    script.setAttribute('data-domain', plausibleCfg.domain);
    (document.head || document.documentElement).appendChild(script);

    addSink(function (event) {
      window.plausible(event.name, { props: cleanProps(event.props) });
    });
  }

  /* ------------------------------------------------------------------ *
   * GA4 — consent gated, Consent Mode v2
   * ------------------------------------------------------------------ */
  var CONSENT_KEYS = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'];
  var ga4Ready = false;   // dataLayer + denied defaults in place (no network)
  var ga4Loaded = false;  // gtag.js actually requested — only after Accept

  function ga4Usable() {
    return !INTERNAL && !!ga4Cfg.enabled && !!ga4Cfg.measurementId;
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function consentState(value) {
    var state = {};
    CONSENT_KEYS.forEach(function (key) {
      state[key] = value;
    });
    return state;
  }

  /* Defaults, before any load. Pure dataLayer bookkeeping: no request, no
     cookie. The keys come from the config, the VALUE does not — everything
     starts denied whatever the config says, because §9 is public and a
     mis-edited config must not be able to grant consent nobody gave. */
  function ga4Init() {
    if (ga4Ready || !ga4Usable()) return;
    ga4Ready = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || gtag;
    var keys = Object.keys(ga4Cfg.consentDefaults || {});
    var defaults = consentState('denied');
    keys.forEach(function (key) {
      defaults[key] = 'denied';
    });
    window.gtag('consent', 'default', defaults);
    /* Belt and braces: until an Accept, the property is switched off at source
       as well, so a stray tag elsewhere on the page cannot send a hit. */
    window['ga-disable-' + ga4Cfg.measurementId] = true;
  }

  function ga4Grant() {
    if (!ga4Usable()) return;
    ga4Init();
    var id = ga4Cfg.measurementId;
    window['ga-disable-' + id] = false;
    window.gtag('consent', 'update', consentState('granted'));

    if (ga4Loaded) return;
    ga4Loaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    (document.head || document.documentElement).appendChild(script);

    /* Everything below runs ONLY here, i.e. only after an explicit Accept.
       gtag('js', <timestamp>) is GA4's own initialisation call and belongs to
       the granted path; it never executes at page load. */
    window.gtag('js', new Date());
    window.gtag('config', id, {
      /* If the page carries the frozen event contract, page_view comes through
         the sink and GA4 must not also count its own, or every visit is two. */
      send_page_view: !hasContract()
    });

    addSink(function (event) {
      window.gtag('event', event.name, cleanProps(event.props));
    });
  }

  /* Withdrawal (§7: "withdraw your cookie consent ... same result, faster").
     gtag.js cannot be unloaded from a live page, so we do the three things
     that can be done immediately and honestly: revoke in Consent Mode, switch
     the property off at source, and clear the identifiers already set. The
     next page load starts clean because nothing from Google is requested. */
  function ga4Revoke() {
    if (!ga4Cfg.measurementId) return;
    window['ga-disable-' + ga4Cfg.measurementId] = true;
    if (ga4Ready && window.gtag) window.gtag('consent', 'update', consentState('denied'));
    clearGoogleCookies();
  }

  function clearGoogleCookies() {
    var names;
    try {
      names = String(document.cookie || '').split(';').map(function (pair) {
        return pair.split('=')[0].trim();
      });
    } catch (err) {
      return;
    }
    var host = String(window.location.hostname || '');
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));

    names.forEach(function (name) {
      if (!name || name.indexOf('_ga') !== 0 && name.indexOf('_gid') !== 0 && name.indexOf('_gcl') !== 0) return;
      domains.forEach(function (domain) {
        var cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        if (domain) cookie += '; domain=' + domain;
        try {
          document.cookie = cookie;
        } catch (err) {
          /* nothing to clear */
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Applying a state
   * ------------------------------------------------------------------ */
  function applyBoot() {
    loadPlausible();  // gate 1 only
    ga4Init();        // defaults denied, no network
    var stored = readChoice();
    if (stored && stored.choice === ACCEPTED) ga4Grant();
  }

  function choose(choice) {
    writeChoice(choice);
    if (choice === ACCEPTED) ga4Grant();
    else ga4Revoke();
    close();
  }

  /* ------------------------------------------------------------------ *
   * The banner
   * ------------------------------------------------------------------ */
  var banner = null;
  var lastFocus = null;

  function privacyHref() {
    /* Relative, so it works from the site root, from /legal/ and from a local
       file:// check alike. */
    var path = String((window.location || {}).pathname || '');
    return path.indexOf('/legal/') !== -1 ? 'privacy.html' : 'legal/privacy.html';
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function build() {
    var wrap = el('section', 'cc');
    wrap.id = 'tyjc-cookie-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'false');
    wrap.setAttribute('aria-labelledby', 'tyjc-cc-title');
    wrap.setAttribute('tabindex', '-1');
    wrap.hidden = true;

    var inner = el('div', 'cc__inner');

    var body = el('div', 'cc__body');
    var title = el('h2', 'cc__title', 'Cookies');
    title.id = 'tyjc-cc-title';
    body.appendChild(title);

    var text = el('p', 'cc__text');
    text.appendChild(document.createTextNode(
      'We count visits with a tool that sets no cookie and stores nothing on your ' +
      'device — that part runs for everyone. Google Analytics and our advertising ' +
      'tools do store an ID on your device, and they only run if you accept. ' +
      'Decline and none of them load. '
    ));
    var link = el('a', 'cc__link', 'Read the Privacy Policy');
    link.href = privacyHref();
    text.appendChild(link);
    text.appendChild(document.createTextNode('.'));
    body.appendChild(text);

    var current = el('p', 'cc__current');
    current.id = 'tyjc-cc-current';
    current.hidden = true;
    body.appendChild(current);

    var actions = el('div', 'cc__actions');
    var accept = el('button', 'cc__btn', 'Accept');
    accept.type = 'button';
    accept.addEventListener('click', function () {
      choose(ACCEPTED);
    });
    var decline = el('button', 'cc__btn', 'Decline');
    decline.type = 'button';
    decline.addEventListener('click', function () {
      choose(DECLINED);
    });
    actions.appendChild(accept);
    actions.appendChild(decline);

    var dismiss = el('button', 'cc__dismiss', '×');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Close without choosing');
    dismiss.title = 'Close without choosing. Nothing runs until you decide, and we will ask again next time.';
    dismiss.addEventListener('click', function () {
      close();  // NOT consent: nothing is stored and nothing is loaded
    });

    inner.appendChild(body);
    inner.appendChild(actions);
    inner.appendChild(dismiss);
    wrap.appendChild(inner);

    wrap.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') close();
    });

    return wrap;
  }

  function ensure() {
    if (banner && banner.parentNode) return banner;
    banner = build();
    (document.body || document.documentElement).appendChild(banner);
    return banner;
  }

  function open(focus) {
    var node = ensure();
    var stored = readChoice();
    var current = node.querySelector('.cc__current');
    if (stored) {
      current.textContent = 'Right now: ' + (stored.choice === ACCEPTED
        ? 'accepted. Decline switches it back off.'
        : 'declined. Nothing beyond the cookie-free count is running.');
      current.hidden = false;
    } else {
      current.hidden = true;
    }
    node.hidden = false;
    document.documentElement.classList.add('cc-open');
    if (focus) {
      lastFocus = document.activeElement;
      try {
        node.focus();
      } catch (err) {
        /* focus is a nicety, never a failure */
      }
    }
  }

  function close() {
    if (!banner) return;
    banner.hidden = true;
    document.documentElement.classList.remove('cc-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try {
        lastFocus.focus();
      } catch (err) {
        /* the element may be gone */
      }
      lastFocus = null;
    }
  }

  /* DT-02 — "Cookie settings" in the footer of every page. The control is
     hidden by CSS until this file marks the document ready, so a page with
     JavaScript off never shows a button that cannot do anything (with no
     JavaScript nothing is loaded and nothing is set either way). */
  function wireOpeners() {
    document.documentElement.classList.add('cc-ready');
    document.addEventListener('click', function (event) {
      var target = event.target;
      var opener = null;
      while (target && target !== document) {
        if (target.getAttribute && target.getAttribute('data-tyjc-consent') === 'open') {
          opener = target;
          break;
        }
        target = target.parentNode;
      }
      if (!opener) return;
      event.preventDefault();
      open(true);
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function start() {
    applyBoot();
    wireOpeners();
    if (!readChoice()) open(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* Small public surface, for the pages and for QA. */
  TYJC.consent = {
    STORE_KEY: STORE_KEY,
    choice: function () {
      var stored = readChoice();
      return stored ? stored.choice : null;
    },
    open: function () {
      open(true);
    },
    close: close,
    accept: function () {
      choose(ACCEPTED);
    },
    decline: function () {
      choose(DECLINED);
    },
    /* Forgets the choice and asks again — used by QA, and the honest
       implementation of "withdraw consent" if we ever need it from a link. */
    reset: function () {
      try {
        window.localStorage.removeItem(STORE_KEY);
      } catch (err) {
        /* nothing stored */
      }
      ga4Revoke();
      open(false);
    }
  };
})();

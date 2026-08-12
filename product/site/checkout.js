/*
 * TYJC — checkout (RG-02 / US-02).
 *
 * Static site, no backend. Lemon Squeezy is the merchant of record (DF-03), so
 * this file's entire job on the sales page is: point the three buy buttons at
 * the checkout, and record that a checkout started. Tax display, currency, card
 * errors, retry and the receipt (US-02 AC4, AC6, AC7) all happen on Lemon
 * Squeezy's own hosted page — that is what buying a merchant of record buys.
 *
 * TWO STATES, AND NEITHER IS A DEAD BUTTON
 *
 *   enabled + a valid https URL -> the three data-cta="buy" buttons carry that
 *     URL, and a click records checkout_start before the browser leaves.
 *   anything else (PF-08 not delivered, a blank URL, a typo that is not https)
 *     -> the buttons scroll to #checkout and say, in one short line, that sales
 *     have not opened yet. A button that does nothing when clicked is the one
 *     outcome this file exists to prevent: it reads as a broken site, and the
 *     visitor blames the product, not the launch date.
 *
 * The URL itself is NOT in this file — see checkout-config.js. Going live is a
 * configuration edit, not a code change.
 *
 * FROZEN EVENT CONTRACT (US-07 AC1/AC2). This file emits exactly one name from
 * the seven, checkout_start, with no props of its own; analytics.js adds the
 * traffic attribution. It invents no event name, not even for the pre-launch
 * click — see "what the disabled path does NOT emit" below.
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});
  var config = window.TYJC_CHECKOUT_CONFIG || {};

  /* Copy of last resort, used when checkout-config.js leaves launchNote empty.
     Short, honest, and it does not promise a date we do not have. */
  var DEFAULT_NOTE =
    'Sales are not open yet — the checkout goes live in the next few days. ' +
    'Nothing has been charged and there is nothing to sign up for right now. ' +
    'Come back to this page and the button will work.';

  /* ------------------------------------------------------------------ *
   * Is there a real checkout to send people to?
   *
   * https only, and on purpose: an http URL would be a downgrade on a page
   * that is about to ask for card details, and a value that is not a URL at
   * all (a store slug, an empty string, "TODO") must fail CLOSED — to the
   * pre-launch message — rather than turn every buy button into a 404.
   * ------------------------------------------------------------------ */
  function checkoutUrl() {
    if (!config.enabled) return '';
    var url = String(config.checkoutUrl || '').trim();
    if (url.slice(0, 8).toLowerCase() !== 'https://') return '';
    if (url.length <= 8) return '';
    return url;
  }

  function buyButtons() {
    var nodes = document.querySelectorAll('[data-cta="buy"]');
    return Array.prototype.slice.call(nodes);
  }

  /* ------------------------------------------------------------------ *
   * checkout_start — once per page load
   *
   * The guard is per page load, not per device: a visitor who comes back
   * tomorrow and clicks again really did start checkout twice, and the funnel
   * should say so. What it must not count twice is one intent — a double click
   * on the same button, or the visitor trying the hero button and then the one
   * in the price block on the way down the page. Both are one checkout start.
   * QA tests the double click.
   * ------------------------------------------------------------------ */
  var started = false;

  function trackStart() {
    if (started) return;
    started = true;
    try {
      TYJC.track(TYJC.EVENTS.CHECKOUT_START, {});
    } catch (err) {
      /* Analytics must never stand between a buyer and the checkout. If the
         recorder is missing or throws, the click still navigates. */
    }
  }

  /* ------------------------------------------------------------------ *
   * Live: the buttons become the checkout link
   * ------------------------------------------------------------------ */
  function goLive(url) {
    buyButtons().forEach(function (button) {
      button.setAttribute('href', url);
      button.setAttribute('data-cta-state', 'live');
      button.addEventListener('click', function () {
        /* No preventDefault: the browser navigates as it would for any link,
           which is what makes this work with a middle click, a long press and
           JavaScript half-broken. track() writes to localStorage synchronously,
           so report.html has the event whatever the navigation does next; a
           provider request that the unload cancels is the same undercount
           documented in the analytics.js header. */
        trackStart();
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Pre-launch: the buttons explain themselves
   *
   * What the disabled path does NOT emit: checkout_start. Nothing started —
   * there is no checkout. Counting these clicks as checkout starts would put a
   * conversion rate of zero into the one number the degrau-2 kill/scale
   * decision reads (US-07), and it would do it with denominators from a week
   * when buying was impossible. The interest those clicks represent is real and
   * worth capturing, but it needs its own name, and the contract is frozen at
   * seven: that is RG-10's waitlist_joined, not something this file invents.
   * ------------------------------------------------------------------ */
  var note = null;

  function noteText() {
    var custom = String(config.launchNote || '').trim();
    return custom || DEFAULT_NOTE;
  }

  function ensureNote() {
    if (note && note.parentNode) return note;

    var section = document.getElementById('checkout');
    if (!section) return null;

    note = document.createElement('p');
    note.id = 'tyjc-checkout-note';
    note.className = 'checkout-note';
    note.setAttribute('role', 'status');
    note.setAttribute('tabindex', '-1');
    note.hidden = true;
    note.textContent = noteText();

    /* Above the price block if there is one, so the answer is the first thing
       in view after the scroll rather than something below the fold. */
    var price = section.querySelector('.price');
    if (price) section.insertBefore(note, price);
    else section.appendChild(note);
    return note;
  }

  function reveal() {
    var target = ensureNote();
    if (!target) return;
    target.hidden = false;
    /* scrollIntoView is a nicety on top of the href="#checkout" the button
       already carries: with JavaScript off, or if this throws, the native
       anchor still puts the visitor on the price block. */
    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      try {
        target.scrollIntoView();
      } catch (err2) {
        /* the native anchor jump already happened */
      }
    }
    try {
      target.focus();
    } catch (err) {
      /* focus is a nicety, never a failure */
    }
  }

  function goPreLaunch() {
    buyButtons().forEach(function (button) {
      button.setAttribute('data-cta-state', 'pre-launch');
      button.addEventListener('click', function (event) {
        /* The href is #checkout, so the default action is a jump to the price
           block. We take it over to get a smooth scroll and to put focus on the
           message; if anything below throws, reveal() has already fallen back
           to the plain jump. */
        if (event.preventDefault) event.preventDefault();
        reveal();
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function start() {
    var url = checkoutUrl();
    if (url) goLive(url);
    else goPreLaunch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* Small public surface, for QA and for the pages. */
  TYJC.checkout = {
    /* '' when there is nothing to send a buyer to — i.e. the pre-launch state. */
    url: checkoutUrl,
    live: function () {
      return !!checkoutUrl();
    },
    /* True once checkout_start has been recorded on this page load. */
    started: function () {
      return started;
    }
  };
})();

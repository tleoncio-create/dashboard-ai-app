/*
 * TYJC — analytics seam (hooks only).
 *
 * RG-07 (US-07) owns the real analytics provider. This file exists so that
 * every feature can emit its events NOW, against a stable contract, with no
 * network call and no personal data. RG-07 only has to:
 *
 *   1. read the already-queued events in TYJC.analytics.events, and
 *   2. set TYJC.analytics.sink = function (event) { ... send it ... }
 *      — from then on every new event is forwarded synchronously.
 *
 * Event contract (US-07 AC1/AC2). Names are frozen here so nobody re-invents
 * them per feature:
 *
 *   page_view            (owned by RG-07, site-wide)
 *   checkout_start       (owned by RG-02)
 *   purchase             (owned by RG-02)
 *   builder_start        { track: null }              — emitted by builder.js
 *   builder_step_completed { step: 1..8, track }      — emitted by builder.js
 *   card_generated       { track, experiment_id }     — TO BE EMITTED BY RG-04
 *                          when the Experiment Card is actually rendered.
 *                          The builder deliberately does not fire it: no card
 *                          exists yet at question 8.
 *   email_captured       (owned by RG-06)
 *
 * Privacy (US-07 AC5): never put the user's e-mail, or any free-text answer
 * they typed, into an event payload. Track, step number and experiment id only.
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

  var analytics = (TYJC.analytics = TYJC.analytics || {});
  analytics.events = analytics.events || [];
  analytics.sink = analytics.sink || null;

  /**
   * Records one funnel event.
   * @param {string} name  one of TYJC.EVENTS
   * @param {object} [props]  no personal data, ever
   */
  TYJC.track = function (name, props) {
    var event = { name: name, props: props || {}, ts: new Date().toISOString() };
    analytics.events.push(event);
    if (typeof analytics.sink === 'function') {
      try {
        analytics.sink(event);
      } catch (err) {
        /* analytics must never break the product */
      }
    }
    return event;
  };
})();

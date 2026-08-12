/*
 * TYJC — checkout configuration (RG-02 / US-02).
 *
 * Values only, on the model of analytics-config.js. This file has NO side
 * effects: it sets one object and returns. It does not read the DOM, does not
 * fire an event and does not decide anything. checkout.js is what reads it.
 *
 * WHY THIS FILE EXISTS: on the day this was written the Lemon Squeezy account
 * existed (PF-01, resolved D2) but the checkout URL did not (PF-08 — a store, a
 * product priced per DF-02, and live payments switched on). Everything else in
 * US-02 is built and testable. So the URL was made a configuration value rather
 * than something threaded through three HTML files: when the founder delivers
 * it, going live is editing the two lines below and republishing. No code
 * change, no integration, no QA pass on new logic — and un-publishing is the
 * same edit in reverse, which is the rollback path the briefing asks for.
 *
 * --------------------------------------------------------------------------
 * TO GO LIVE (the whole procedure):
 *
 *   1. checkoutUrl: paste the Lemon Squeezy checkout URL. It must be https and
 *      it must be the LIVE URL, not the test-mode one — a test-mode link takes
 *      real card details and settles nothing, which looks like a working
 *      checkout right up to the point where no money arrives (US-02 AC1).
 *   2. enabled: true.
 *   3. Reload index.html and click one buy button. It must leave the site for
 *      Lemon Squeezy. Then check report.html for one checkout_start.
 *
 * TO TAKE IT BACK DOWN: enabled: false. The buttons go back to the pre-launch
 * message on the page. Nothing else changes, and no visitor meets a dead
 * button in either direction.
 * --------------------------------------------------------------------------
 *
 * Safe to commit. A checkout URL is public by construction — it ships in the
 * href of every buy button. What must NEVER land in this file, or anywhere in
 * product/site/: the Lemon Squeezy API key, the webhook signing secret, or the
 * store's API credentials. Those are server-side only (Vercel environment
 * variables), and nothing in the MVP needs them: Lemon Squeezy is the merchant
 * of record (DF-03) and sends the receipt itself (US-02 AC7).
 */
(function () {
  'use strict';

  window.TYJC_CHECKOUT_CONFIG = {
    /* The master switch. false = sales have not opened; the buy buttons show
       the pre-launch message instead of going nowhere. */
    enabled: false,

    /* PENDING PF-08. https URL from the Lemon Squeezy store. checkout.js
       refuses anything that is not https, so a half-pasted value fails closed
       (pre-launch message) instead of sending buyers to a broken page. */
    checkoutUrl: '',

    /* What the page says while enabled is false. Leave empty to use the
       default in checkout.js. Copy belongs to squad-conteudo: change it here,
       not in the code, and run any change past the PM — this string is read by
       a visitor who just tried to give us money. */
    launchNote: ''
  };
})();

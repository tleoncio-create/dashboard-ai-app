/*
 * TYJC — provider configuration (RG-07 / DF-11).
 *
 * Values only. This file has NO side effects: it sets one object and returns.
 * It does not load a provider, does not set a cookie, and does not fire an
 * event. The sink that reads it is squad-produto's work (DT-01) and is gated
 * on consent — see "Consent" below, which is a promise the Privacy Policy has
 * already made in public.
 *
 * Why the IDs live here and not inline in the pages: analytics.js froze the
 * event contract so the funnel survives a change of provider (US-07 AC1/AC2).
 * Swapping or adding a provider must stay a one-file change.
 *
 * Safe to commit. A GA4 Measurement ID and a Plausible domain are public by
 * construction — both ship in the HTML of every site that uses them. What must
 * NEVER land in this file, or anywhere else in product/site/: the GA4
 * Measurement Protocol api_secret, the Plausible API key, or any provider
 * credential. Those belong in Vercel environment variables, server side only.
 *
 * --------------------------------------------------------------------------
 * Consent (Privacy Policy §9 — "Analytics and advertising cookies only run if
 * you accept them ... they don't fire at all" until the visitor chooses):
 *
 *   plausible  — no cookie, no device identifier. Runs for everyone. There is
 *                nothing here to consent to, which is exactly why the fase-1
 *                decision reads from this one and never from GA4.
 *   ga4        — sets a cookie. MUST NOT load before an explicit accept.
 *
 * The standard Google snippet ("Google tag (gtag.js)") fires on page load with
 * no gate. Pasting it into the pages as-is would set a cookie before the
 * visitor answered the banner and make Privacy Policy §9 a false statement on
 * day one. It is therefore NOT used verbatim: Consent Mode is initialised with
 * analytics_storage and ad_storage DENIED, and the accept updates them.
 * --------------------------------------------------------------------------
 */
(function () {
  'use strict';

  window.TYJC_ANALYTICS_CONFIG = {
    /* Plausible — DF-11: the instrument the degrau-2 kill/scale decision reads.
       Account created by the founder on D2. No consent gate applies (no cookie,
       no device identifier), so this one goes live with the loader in DT-01 and
       does not wait on the banner.

       `domain` must match the site string registered in the Plausible dashboard
       character for character. A mismatch does not error anywhere visible — the
       script loads, the events leave the browser, and the dashboard stays empty.
       Confirm before flipping `enabled`. */
    plausible: {
      enabled: false,
      domain: 'lessriskmoregrowth.com',
      /* The variant with custom properties AND tagged events, required by the
         frozen event contract: the plain script accepts the event name and
         drops every prop silently, which would cost us step, track, source,
         medium and campaign — i.e. the whole funnel breakdown US-07 AC4 exists
         for. Verify the account's plan actually includes custom properties
         before launch; if it does not, the contract still holds but the props
         are lost, and that is a launch blocker worth knowing about early. */
      src: 'https://plausible.io/js/script.pageview-props.tagged-events.js'
    },

    /* GA4 — DF-11: long-term history only, never a decision input. GA4 has no
       backfill, which is the whole reason it starts on D0 rather than later.
       Measurement ID delivered by the founder on D2 (PF-06). */
    ga4: {
      enabled: false,
      measurementId: 'G-BH0GMH7G4K',
      /* Consent Mode v2 defaults. Every storage type starts denied; the
         banner's accept is what grants. Do not "temporarily" flip these to
         granted for testing — §9 is public. */
      consentDefaults: {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      }
    }
  };
})();

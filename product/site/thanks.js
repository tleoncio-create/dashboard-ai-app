/*
 * TYJC — post-purchase landing (RG-02 / US-02).
 *
 * Lemon Squeezy redirects here after a completed payment (the "redirect after
 * purchase" setting on the LS product — part of PF-08, configured in the Lemon
 * Squeezy dashboard, not in this repo). This file's whole job is to record ONE
 * purchase event, honestly.
 *
 * IDEMPOTENCE, PER DEVICE (not per page load)
 *
 * A reload of a thank-you page is not a second purchase. Neither is the buyer
 * coming back to the tab tomorrow, nor the browser restoring the session. So the
 * guard is written to localStorage and survives the page load:
 *
 *   - with an order_id : recorded once per order id. A genuine second purchase
 *     arrives with a different id and is counted, which a plain "once per
 *     device" flag would swallow — and a repeat buyer is exactly the signal the
 *     degrau-2 decision would most want to see.
 *   - without an order_id : once per device, ever. Until PF-08 delivers the URL
 *     and the LS redirect is configured with query parameters, this is the path
 *     that runs, and "once, ever" is the conservative choice — undercounting in
 *     the same direction as everything else in the funnel (see analytics.js).
 *
 * WHAT COMES FROM THE QUERY STRING
 *
 * Lemon Squeezy can append order data to the redirect URL. The parser below is
 * ready for it and reads nothing else: order_id, value, currency. Everything is
 * validated here before it reaches analytics.js, which sanitizes again — a
 * query string is attacker-controlled input, and this page is public. The three
 * are optional: with none of them the purchase is still counted, just without
 * revenue attached.
 *
 * FROZEN EVENT CONTRACT (US-07 AC1/AC2): one name, `purchase`, with the three
 * props already in the contract. Nothing new is invented here.
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});
  var STORE_KEY = 'tyjc.purchase.v1';
  var MAX_ORDERS = 20; // a guard against unbounded growth, not a business rule

  /* ------------------------------------------------------------------ *
   * The query string
   * ------------------------------------------------------------------ */
  function params() {
    var out = {};
    var search = String((window.location || {}).search || '').replace(/^\?/, '');
    if (!search) return out;
    search.split('&').forEach(function (pair) {
      if (!pair) return;
      var bits = pair.split('=');
      var key, value;
      try {
        key = decodeURIComponent(bits[0] || '').toLowerCase();
        value = decodeURIComponent((bits[1] || '').replace(/\+/g, ' '));
      } catch (err) {
        return; // a malformed escape sequence is not data
      }
      if (key) out[key] = value;
    });
    return out;
  }

  /* An order id is an opaque identifier, so it is allowed to be nothing but
     identifier characters. Anything else — a space, a quote, an angle bracket,
     an e-mail address someone appended to the URL by hand — is not an order id
     and is dropped whole rather than cleaned up into something plausible. */
  function orderId(raw) {
    var text = String(raw === undefined || raw === null ? '' : raw).trim();
    if (!text || text.length > 64) return '';
    return /^[A-Za-z0-9_-]+$/.test(text) ? text : '';
  }

  /* Money, as a number. A negative value, a non-number, or something absurd is
     dropped: a wrong revenue figure in the panel is worse than no figure, and
     this value can be edited by anyone who can edit a URL. */
  function amount(raw) {
    var text = String(raw === undefined || raw === null ? '' : raw).trim();
    if (!text || !/^\d+(\.\d{1,2})?$/.test(text)) return null;
    var value = parseFloat(text);
    if (!isFinite(value) || value < 0 || value > 100000) return null;
    return value;
  }

  /* ISO 4217 is three letters. Uppercased so the panel does not end up with
     "usd" and "USD" as two currencies. */
  function currency(raw) {
    var text = String(raw === undefined || raw === null ? '' : raw).trim();
    return /^[A-Za-z]{3}$/.test(text) ? text.toUpperCase() : '';
  }

  /* ------------------------------------------------------------------ *
   * The guard
   * ------------------------------------------------------------------ */
  function read() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var value = raw ? JSON.parse(raw) : null;
      if (!value || typeof value !== 'object') return { any: false, orders: [] };
      return {
        any: !!value.any,
        orders: Object.prototype.toString.call(value.orders) === '[object Array]' ? value.orders : []
      };
    } catch (err) {
      /* Storage blocked (private mode, or the visitor cleared it). The event is
         emitted for this page load and a reload would count a second one. That
         is the honest failure: we cannot remember, so we do not pretend to. */
      return { any: false, orders: [] };
    }
  }

  function write(record) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(record));
    } catch (err) {
      /* see read() */
    }
  }

  /**
   * Records the purchase if this device has not already recorded it.
   * @returns {boolean} true when the event was emitted on this call
   */
  function emit() {
    var query = params();
    var id = orderId(query.order_id);
    var record = read();

    if (id) {
      if (record.orders.indexOf(id) !== -1) return false;
      record.orders.push(id);
      if (record.orders.length > MAX_ORDERS) {
        record.orders = record.orders.slice(record.orders.length - MAX_ORDERS);
      }
    } else {
      if (record.any) return false;
    }
    record.any = true;
    write(record);

    var props = {};
    if (id) props.order_id = id;
    var value = amount(query.value);
    if (value !== null) props.value = value;
    var code = currency(query.currency);
    if (code) props.currency = code;

    try {
      TYJC.track(TYJC.EVENTS.PURCHASE, props);
    } catch (err) {
      /* The buyer's page must not break because the recorder did. The guard has
         already been written, so this purchase is not retried on reload — an
         event lost here is lost in the same direction as everything else. */
    }
    return true;
  }

  emit();

  /* Small public surface, for QA. */
  TYJC.purchase = {
    STORE_KEY: STORE_KEY,
    emit: emit,
    recorded: function () {
      return read();
    },
    reset: function () {
      try {
        window.localStorage.removeItem(STORE_KEY);
      } catch (err) {
        /* nothing stored */
      }
    }
  };
})();

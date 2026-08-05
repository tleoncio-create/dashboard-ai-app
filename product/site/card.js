/*
 * TYJC — The Experiment Card (US-04 / RG-04).
 *
 * Plugs into the RG-03 seam: TYJC.registerCardRenderer(fn) calls
 * fn(TYJC.getBuilderState(), mountElement) inside #tyjc-card-mount as soon as
 * the user picks a test at question 8. Static page, client-side only.
 *
 * Two hard rules from the RG-03 QA verdict, kept literally here:
 *   - the Budget cap field prints builderState.budgetCapDisplay as it comes.
 *     This file never formats a currency value of its own (US-04 AC2).
 *   - the card emits card_generated with the track and the experiment id only.
 *     No free-text answer ever enters an analytics payload (US-07 AC5).
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});
  var CARD_KEY = 'tyjc.card.v1';

  /* ------------------------------------------------------------------ *
   * Reading rules, one per experiment.
   *
   * Every number below is quoted from the experiment's own step-by-step in
   * product/experiments-library.md — the source sentence is in the comment.
   * They are NOT part of the mirrored library metadata (that lives in
   * experiments.js): they are the card layer turning the library's written
   * example into the two fields the card must always carry with a number —
   * Success metric + threshold (AC5) and Kill criteria (AC4).
   * ------------------------------------------------------------------ */
  var RULES = {
    /* A1 step 5: "out of 100 people who reach this page, at least 3 click Buy."
       A1 step 7: "People who reached the page. People who clicked the button." */
    A1: {
      count: 'People who reach the page, and people who click the button after seeing the price. Two numbers a day, nothing else.',
      kind: 'threshold',
      number: 3,
      unit: 'clicks on the button after the price is visible',
      context: 'out of every 100 people who reach the page'
    },
    /* A2 step 4: "out of 20, at least 3 say yes. If fewer than 3 by day 7, I
       change the offer — not the message." */
    A2: {
      count: 'Every reply from the 20 people you messaged: yes, no or silent — plus the exact words of every no.',
      kind: 'threshold',
      number: 3,
      unit: 'yes replies',
      context: 'out of the 20 people you message, one at a time'
    },
    /* A3 step 7: "If neither version reached roughly 30 clicks, you don't have
       an answer". A3 step 6: spend, clicks, cost per click per version. */
    A3: {
      count: 'Per headline, per day: money spent, clicks to the page, cost per click. Ignore impressions, likes and shares.',
      kind: 'floor',
      number: 30,
      unit: 'clicks on the stronger headline',
      context: 'Below that there is no answer to read, only noise'
    },
    /* A4 step 4: "five posts in 12 days: at least 8 replies and 3 people asking
       for the invite." */
    A4: {
      count: 'Per post: replies, people who ask for the invite, and people who then ask what you sell.',
      kind: 'threshold',
      number: 8,
      unit: 'replies across the five posts',
      context: 'with at least 3 people asking for the invite'
    },
    /* B1 step 4: "200 visitors per page minimum. I'll only call it a difference
       if one side gets at least twice the checkout starts." */
    B1: {
      count: 'Per page: visitors, checkout starts, completed purchases. If you take payment by hand, count "said yes to the price".',
      kind: 'floor',
      number: 200,
      unit: 'visitors on each of the two pages',
      context: 'One side needs at least twice the checkout starts before a price difference is real'
    },
    /* B2 step 7, quoted contiguously: "Five good leads beat forty junk ones."
       What to count comes from the first half of the same step: "Track per day:
       spend, leads, cost per lead - and how many of those leads were genuinely
       your buyer. Check that by hand." */
    B2: {
      count: 'Per day: spend, leads, cost per lead — and how many of those leads were genuinely your buyer, checked by hand.',
      kind: 'threshold',
      number: 5,
      unit: 'good leads inside the cap',
      context: 'junk leads do not count towards this number'
    },
    /* B3 step 1: five yes and five no. Step 7: "anything said by three or more
       people. That repetition is the finding." */
    B3: {
      count: 'Completed 15-minute calls, and the exact phrases people use — copied word for word, not summarised.',
      kind: 'floor',
      number: 10,
      unit: 'completed calls',
      context: 'Five who said yes and five who said no, with any phrase repeated by 3 or more people as the finding'
    },
    /* B4 step 4: "fewer than 15 clicks and 5 emails in 10 days means this idea
       is parked, not delayed." */
    B4: {
      count: 'Three numbers only: people who saw the button, people who clicked it, people who left an email.',
      kind: 'threshold',
      number: 15,
      unit: 'clicks on the button',
      context: 'with at least 5 people leaving an email'
    }
  };

  /* ------------------------------------------------------------------ *
   * Dates — absolute, English, no locale surprises (US-04 AC3)
   * ------------------------------------------------------------------ */
  var MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  var WEEKDAYS = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  function isoDay(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return date.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
  }

  function fromIsoDay(text) {
    var parts = String(text).split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function longDate(date) {
    return (
      WEEKDAYS[date.getDay()] + ', ' + date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear()
    );
  }

  function addDays(date, days) {
    var next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
  }

  function dayWord(n) {
    return n === 1 ? '1 day' : n + ' days';
  }

  /* ------------------------------------------------------------------ *
   * Card metadata — the start date is fixed on first generation so the card
   * does not silently slide forward every time the page is reopened. It is
   * reset when the user picks a different test.
   * ------------------------------------------------------------------ */
  function readMeta() {
    try {
      var raw = window.localStorage.getItem(CARD_KEY);
      var meta = raw ? JSON.parse(raw) : null;
      if (meta && typeof meta === 'object') {
        meta.emitted = meta.emitted || [];
        return meta;
      }
    } catch (err) {
      /* storage blocked — fall through to a fresh, in-memory card */
    }
    return { generatedOn: null, experimentId: null, emitted: [] };
  }

  function writeMeta(meta) {
    try {
      window.localStorage.setItem(CARD_KEY, JSON.stringify(meta));
    } catch (err) {
      /* the card still renders; only the fixed start date is lost on reload */
    }
  }

  function startDateFor(experimentId) {
    var meta = readMeta();
    if (!meta.generatedOn || meta.experimentId !== experimentId) {
      meta.generatedOn = isoDay(new Date());
      meta.experimentId = experimentId;
      writeMeta(meta);
    }
    return fromIsoDay(meta.generatedOn);
  }

  function emitCardGenerated(state) {
    var meta = readMeta();
    if (meta.emitted.indexOf(state.selectedExperimentId) !== -1) return; // one per test, per device
    meta.emitted.push(state.selectedExperimentId);
    writeMeta(meta);
    TYJC.track(TYJC.EVENTS.CARD_GENERATED, {
      track: state.track,
      experiment_id: state.selectedExperimentId
    });
  }

  /* ------------------------------------------------------------------ *
   * The user's number (spec-card-campos-6-7.md).
   *
   * "A autoridade do número é do usuário, sempre." The library number is a
   * guard rail, never a judge: it may appear labelled "Only readable above"
   * on a floor test, and it is never what kills a test.
   *
   * The target comes from the answer to question 7 when that answer carries a
   * digit. When it does not, the card is not generated until the user writes
   * the number here — see renderTargetPrompt.
   * ------------------------------------------------------------------ */
  function parseTarget(text) {
    var source = String(text === undefined || text === null ? '' : text);
    var match = source.match(/(\d[\d.,]*)\s*(%)?/);
    if (!match) return null;
    var number = match[1].replace(/[.,]$/, '') + (match[2] || '');
    var unit = source
      .slice(match.index + match[0].length)
      .replace(/^[\s,;:.\-–—]+/, '')
      .replace(/[\s.;,!]+$/, '');
    return { number: number, unit: unit, text: unit ? number + ' ' + unit : number };
  }

  function hasDigit(text) {
    return /\d/.test(String(text === undefined || text === null ? '' : text));
  }

  /* The confirmed number is stored against the question 7 answer it belongs to,
     so editing question 7 in the builder asks for it again instead of silently
     keeping a stale target. */
  function storedTarget(state) {
    var meta = readMeta();
    if (!meta.target || meta.targetFor !== state.successSignal) return null;
    return parseTarget(meta.target);
  }

  function resolveTarget(state) {
    if (hasDigit(state.successSignal)) return parseTarget(state.successSignal);
    return storedTarget(state);
  }

  /* ------------------------------------------------------------------ *
   * The eight fields. One builder for both the screen card and the plain
   * text copy, so the two can never drift (US-04 AC6).
   * ------------------------------------------------------------------ */
  function buildCard(state, target) {
    var exp = state.selectedExperiment;
    var rule = RULES[state.selectedExperimentId];
    var start = startDateFor(state.selectedExperimentId);
    var read = addDays(start, state.daysAvailable);
    var startText = longDate(start);
    var readText = longDate(read);
    var cap = state.budgetCapDisplay; // exactly as the builder committed it — never reformatted here

    return {
      title: exp.name,
      subtitle:
        'Test Your Jump Cheaply · ' + state.trackLabel + ' · Card created ' + startText,
      business: state.sells,
      startText: startText,
      readText: readText,
      fields: [
        {
          n: 1,
          label: 'The bet',
          blocks: [
            { text: state.decision },
            { text: 'This is the decision the test is for. Nothing else gets decided this round.', muted: true }
          ]
        },
        {
          n: 2,
          label: 'The hypothesis',
          blocks: [
            { text: state.belief },
            { text: 'Written to be proven wrong. If the result comes back below the number in field 6, this sentence was wrong — and that is a result, not a failure.', muted: true }
          ]
        },
        {
          n: 3,
          label: 'The smallest test',
          blocks: [
            { lead: exp.name + ' — typically ' + TYJC.formatUsd(exp.typical_cost_usd) + ', ' + dayWord(exp.typical_days) },
            { text: exp.proves },
            { text: 'Before you start: ' + exp.needs, muted: true },
            { steps: exp.steps }
          ]
        },
        {
          n: 4,
          label: 'Budget cap',
          blocks: [
            { big: cap },
            { text: 'Put this cap into the account, the calendar and this card before the first dollar moves. When it is gone, the test is over — you do not top it up.' }
          ]
        },
        {
          n: 5,
          label: 'Timebox',
          blocks: [
            { pair: ['Start', startText] },
            { pair: ['Read the result', readText] },
            { text: 'That is the ' + dayWord(state.daysAvailable) + ' you asked for. You read the result on ' + readText + ' and you stop the test that day, whatever the number says.' }
          ]
        },
        {
          n: 6,
          label: 'Success metric + threshold',
          /* Spec §2-4: Count, then the answer to question 7 verbatim, then the
             user's own number as the only target. On a floor test the library
             number follows, labelled so it can never read as a target. */
          blocks: (function () {
            var blocks = [
              { pair: ['Count', rule.count] },
              { pair: ['Yes means', state.successSignal] },
              { pair: ['The number', target.text + ' by ' + readText + '.'] }
            ];
            if (rule.kind === 'floor') {
              blocks.push({
                pair: [
                  'Only readable above',
                  'At least ' + rule.number + ' ' + rule.unit + ' by ' + readText + '. ' +
                    rule.context + '. This is a sample floor, not a target.'
                ]
              });
            }
            return blocks;
          })()
        },
        {
          n: 7,
          label: 'Kill criteria',
          /* Spec §6-8: the user's number is what kills the test. On a floor
             test, missing the library floor means the test never ran — that is
             inconclusive, not dead, and it never kills the idea. */
          blocks: (function () {
            var blocks = [];
            if (rule.kind === 'floor') {
              blocks.push({
                text:
                  'Fewer than ' + rule.number + ' ' + rule.unit + ' by ' + readText +
                  ' → inconclusive, not dead. The test did not run; there is no result to read. Rerun it at the same ' +
                  cap + ' cap with enough volume, or drop the question. Do not crown a winner and do not kill the idea on this.'
              });
              blocks.push({
                text:
                  'At or above ' + rule.number + ' ' + rule.unit + ', and fewer than ' +
                  target.text + ' → stop, under the same rules above.'
              });
            } else {
              blocks.push({
                text:
                  'Fewer than ' + target.text + ' by ' + readText +
                  ' → stop. Do not extend the deadline, do not raise the ' + cap +
                  ' cap, and do not rebuild the test to chase a better number.'
              });
            }
            blocks.push({
              text: 'Write the result down on ' + readText + ' before you decide anything else.',
              muted: true
            });
            return blocks;
          })()
        },
        {
          n: 8,
          label: 'If it works / If it doesn’t',
          /* Spec §8 again: the library number is never the death trigger, so
             both branches read against the user's number. */
          blocks: [
            {
              pair: [
                'If it works',
                'At or above ' + target.text + ' by ' + readText + ': you have one readable answer to the bet in field 1 — one answer, not a guarantee about what comes next. Write down what changed your mind, then design the next test with the same four fences: a cap, a date, a number and a stop rule.'
              ]
            },
            {
              pair: [
                'If it doesn’t',
                'Below ' + target.text + ' on ' + readText + ': stop there. Spend ten minutes writing what the result says about the hypothesis in field 2, then change one thing — the offer, the audience or the price — and test that instead. Do not reopen this test with more money.'
              ]
            }
          ]
        }
      ]
    };
  }

  /* ------------------------------------------------------------------ *
   * Plain text (US-04 AC6 — copy as text keeps the 8 fields)
   * ------------------------------------------------------------------ */
  function toPlainText(card) {
    var lines = [];
    lines.push('EXPERIMENT CARD — ' + card.title);
    lines.push(card.subtitle);
    lines.push('Business: ' + card.business);
    card.fields.forEach(function (field) {
      lines.push('');
      lines.push(field.n + '. ' + field.label.toUpperCase());
      field.blocks.forEach(function (block) {
        if (block.lead) lines.push(block.lead);
        if (block.big) lines.push(block.big);
        if (block.text) lines.push(block.text);
        if (block.pair) lines.push(block.pair[0] + ': ' + block.pair[1]);
        if (block.steps) {
          block.steps.forEach(function (step, i) {
            lines.push('  ' + (i + 1) + ') ' + step);
          });
        }
      });
    });
    lines.push('');
    /* DF-07: the brand mark is "- Risk + Growth", leading minus included, and
       it replaces the old "less risk, more growth" tagline wherever the brand
       is named. Same wording as the rest of the site (legal footer, index). */
    lines.push('Test Your Jump Cheaply, from - Risk + Growth.');
    return lines.join('\n');
  }

  /* ------------------------------------------------------------------ *
   * Rendering (textContent only — user answers are never treated as HTML)
   * ------------------------------------------------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function renderBlock(block, into) {
    if (block.lead) into.appendChild(el('p', 'card__lead', block.lead));
    if (block.big) into.appendChild(el('p', 'card__big', block.big));
    if (block.text) into.appendChild(el('p', block.muted ? 'card__p card__p--muted' : 'card__p', block.text));
    if (block.pair) {
      var p = el('p', 'card__p');
      p.appendChild(el('strong', null, block.pair[0] + ': '));
      p.appendChild(document.createTextNode(block.pair[1]));
      into.appendChild(p);
    }
    if (block.steps) {
      var list = el('ol', 'card__steps');
      block.steps.forEach(function (step) {
        list.appendChild(el('li', null, step));
      });
      into.appendChild(list);
    }
  }

  function renderActions(card, into) {
    var actions = el('div', 'card-actions');

    var copy = el('button', 'btn btn--ghost', 'Copy as text');
    copy.type = 'button';
    var copyLabel = 'Copy as text';
    copy.addEventListener('click', function () {
      var text = toPlainText(card);
      var done = function (okMessage) {
        copy.textContent = okMessage;
        window.setTimeout(function () {
          copy.textContent = copyLabel;
        }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            done('Copied');
          },
          function () {
            done(fallbackCopy(text) ? 'Copied' : 'Press Ctrl+C to copy');
          }
        );
      } else {
        done(fallbackCopy(text) ? 'Copied' : 'Press Ctrl+C to copy');
      }
    });

    var print = el('button', 'btn btn--primary', 'Print or save as PDF');
    print.type = 'button';
    print.addEventListener('click', function () {
      window.print();
    });

    actions.appendChild(copy);
    actions.appendChild(print);
    into.appendChild(actions);
  }

  /* Clipboard API needs a secure context; this keeps copy working on plain
     http and inside file:// so nobody is left without the artefact. */
  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', 'readonly');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (err) {
      copied = false;
    }
    document.body.removeChild(area);
    return copied;
  }

  /* ------------------------------------------------------------------ *
   * Spec §5 — question 7 came back without a digit, so there is no target to
   * kill the test with. Ask for it here, in the card layer, and generate
   * nothing until it is confirmed. The builder is untouched (RG-03 frozen).
   * ------------------------------------------------------------------ */
  function renderTargetPrompt(state, rule, mount) {
    var box = el('section', 'target-ask');

    box.appendChild(el('h3', 'target-ask__title', 'One number is missing'));
    box.appendChild(
      el(
        'p',
        'target-ask__lead',
        'Your card needs a number to stop on, and "' + state.successSignal +
          '" does not have one in it. Write the number that counts as yes.'
      )
    );

    var label = el('label', 'target-ask__label', 'Write the number that counts as yes');
    label.setAttribute('for', 'tyjc-target');
    box.appendChild(label);

    var suggestion = rule.number + ' ' + rule.unit;
    var field = document.createElement('input');
    field.type = 'text';
    field.className = 'field';
    field.id = 'tyjc-target';
    field.value = suggestion;
    field.setAttribute('data-suggestion', suggestion);
    field.setAttribute('aria-describedby', 'tyjc-target-hint');
    box.appendChild(field);

    var hint = el(
      'p',
      'target-ask__hint',
      'Suggestion, taken from this test in the library — change it to your own number. It is yours, not ours: it is what the card stops on.'
    );
    hint.id = 'tyjc-target-hint';
    box.appendChild(hint);

    var error = el('p', 'target-ask__error');
    error.setAttribute('role', 'alert');
    error.hidden = true;
    box.appendChild(error);

    var confirm = el('button', 'btn btn--primary', 'Save my number and create the card');
    confirm.type = 'button';
    confirm.addEventListener('click', function () {
      var value = field.value.trim();
      if (!hasDigit(value)) {
        error.textContent = 'Write a number — for example "3 sign-ups". Without one, there is nothing to stop on.';
        error.hidden = false;
        field.focus();
        return;
      }
      var meta = readMeta();
      meta.target = value;
      meta.targetFor = state.successSignal;
      writeMeta(meta);
      while (mount.firstChild) mount.removeChild(mount.firstChild);
      renderCard(TYJC.getBuilderState(), mount);
    });
    box.appendChild(confirm);

    mount.appendChild(box);
  }

  function renderCard(state, mount) {
    if (!state || !state.selectedExperiment || !RULES[state.selectedExperimentId]) return;
    if (state.budgetCapDisplay === '' || state.daysAvailable === null) return;

    var rule = RULES[state.selectedExperimentId];
    var target = resolveTarget(state);
    if (!target) {
      /* No confirmed number, no card — and no card_generated event either. */
      renderTargetPrompt(state, rule, mount);
      return;
    }

    var card = buildCard(state, target);

    renderActions(card, mount);

    var article = el('article', 'card');
    article.id = 'tyjc-card';

    var head = el('header', 'card__head');
    head.appendChild(el('p', 'card__kicker', 'Experiment Card'));
    head.appendChild(el('h2', 'card__title', card.title));
    head.appendChild(el('p', 'card__sub', card.subtitle));
    head.appendChild(el('p', 'card__sub', 'Business: ' + card.business));
    article.appendChild(head);

    var list = el('div', 'card__fields');
    card.fields.forEach(function (field) {
      var section = el('section', 'card__field');
      section.appendChild(el('h3', 'card__label', field.n + '. ' + field.label));
      field.blocks.forEach(function (block) {
        renderBlock(block, section);
      });
      list.appendChild(section);
    });
    article.appendChild(list);

    article.appendChild(
      el(
        'p',
        'card__foot',
        /* DF-07 brand mark — see the note in toPlainText above. */
        'Test Your Jump Cheaply, from - Risk + Growth. You run this test yourself.'
      )
    );

    mount.appendChild(article);
    mount.appendChild(
      el(
        'p',
        'card-note',
        'This card is saved in this browser, on this device. Print it, copy it, or come back to it here.'
      )
    );

    markPrintPath(article);
    emitCardGenerated(state);
  }

  /* Marks every ancestor of the card so the print stylesheet can collapse
     everything that is not on the way to it — see card.css @media print. */
  function markPrintPath(node) {
    var current = node.parentNode;
    while (current && current.nodeType === 1 && current !== document.body) {
      current.classList.add('tyjc-print-path');
      current = current.parentNode;
    }
  }

  TYJC.registerCardRenderer(renderCard);

  /* "Start over" in the builder must clear the card's own memory too, or a new
     card could inherit the start date of the old one. */
  TYJC.onReset = TYJC.onReset || [];
  TYJC.onReset.push(function () {
    try {
      window.localStorage.removeItem(CARD_KEY);
    } catch (err) {
      /* nothing was stored to begin with */
    }
  });

  /* Exposed so QA can read the exact plain text of the current card, and so
     RG-06 can put the same eight fields in the e-mail body. */
  TYJC.getCardText = function () {
    var state = TYJC.getBuilderState();
    if (!state.selectedExperiment || !RULES[state.selectedExperimentId]) return '';
    var target = resolveTarget(state);
    if (!target) return ''; // no confirmed number, no card
    return toPlainText(buildCard(state, target));
  };
})();

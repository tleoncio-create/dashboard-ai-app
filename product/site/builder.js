/*
 * TYJC — Experiment Builder (US-03 / RG-03).
 *
 * Static page, client-side JS only: no backend, no database, no network call.
 * Answers live in localStorage on the user's own device (US-03 AC6).
 *
 * Scope of this story: questions 1 to 8. It stops right after the user picks a
 * test. The Experiment Card is RG-04 — see TYJC.registerCardRenderer at the
 * bottom of this file for the seam it plugs into.
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});
  var STORAGE_KEY = 'tyjc.builder.v1';
  var TOTAL_STEPS = 8;

  /* ------------------------------------------------------------------ *
   * Storage — localStorage with an in-memory fallback, so the builder
   * never dies on a browser that blocks storage (private mode, file://).
   * ------------------------------------------------------------------ */
  var storage = (function () {
    try {
      var probe = '__tyjc_probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return window.localStorage;
    } catch (err) {
      var memory = {};
      return {
        getItem: function (k) {
          return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null;
        },
        setItem: function (k, v) {
          memory[k] = String(v);
        },
        removeItem: function (k) {
          delete memory[k];
        }
      };
    }
  })();

  /* ------------------------------------------------------------------ *
   * The eight questions — produto-proposta.md, section 5.1, in order.
   * Question 1 sets the track; every question after it changes wording
   * with the track (US-03 AC2).
   * ------------------------------------------------------------------ */
  var TRACK_LABELS = {
    first_traction: 'Getting first traction',
    scaling: 'Scaling what works'
  };

  var QUESTIONS = [
    {
      n: 1,
      key: 'stage',
      type: 'choice',
      title: 'What stage are you at?',
      hint: 'This sets your track. It changes the wording of the questions ahead and the tests you get at the end.',
      options: [
        {
          value: 'first_traction',
          label: 'Getting first traction',
          detail: 'I’ve sold a bit, and I can’t tell what’s working.'
        },
        {
          value: 'scaling',
          label: 'Scaling what works',
          detail: 'I already sell, and I need to choose where to push next.'
        }
      ],
      error: 'Pick one of the two to continue.'
    },
    {
      n: 2,
      key: 'sells',
      type: 'text',
      title: 'What does your business sell, in one line?',
      hint: {
        first_traction:
          'Plain words, no pitch — who it’s for and what they get. Example: "One-page websites for independent dog groomers."',
        scaling:
          'The one offer you’d push harder if you knew it would hold. Example: "A $49/month scheduling app for independent hair stylists."'
      },
      placeholder: 'One line is enough.',
      error: 'Write one line about what you sell.'
    },
    {
      n: 3,
      key: 'decision',
      type: 'text',
      title: 'What’s the one decision you’re stuck on?',
      hint: {
        first_traction:
          'The one you keep going back and forth on. Example: "Should I run ads, or keep messaging people one by one?"',
        scaling:
          'The one that costs you most if you get it wrong. Example: "Should I raise the price, or add a cheaper tier?"'
      },
      placeholder: 'One decision, not three.',
      error: 'Write the decision you’re stuck on.'
    },
    {
      n: 4,
      key: 'belief',
      type: 'text',
      title: 'What do you believe is true, that you haven’t proven?',
      hint: {
        first_traction:
          'Write it so that someone could prove you wrong. Example: "People will pay $40 for this before I build it."',
        scaling:
          'Write it so that someone could prove you wrong. Example: "My buyers would pay 50% more without walking away."'
      },
      placeholder: 'I believe that…',
      error: 'Write the belief you haven’t proven yet.'
    },
    {
      n: 5,
      key: 'budget',
      type: 'money',
      title: 'How much can you lose without it hurting?',
      hint: {
        first_traction:
          'The cap for this one test, in US dollars. Pick an amount that would sting a little and change nothing else about your month.',
        scaling:
          'The cap for this one test, in US dollars — not your monthly marketing budget. What can this single test lose without it mattering?'
      },
      note: 'Tests in this library run from $0 to $500.',
      placeholder: '150',
      prefix: '$',
      error: 'Enter an amount in US dollars.'
    },
    {
      n: 6,
      key: 'days',
      type: 'days',
      title: 'How many days until you need an answer?',
      hint: {
        first_traction:
          'Days from today until you have to decide. Tests on your track run in 3 to 14 days.',
        scaling:
          'Days from today until you have to decide. Tests on your track run in 5 to 14 days.'
      },
      note: 'This becomes the deadline you stop on, not a target you extend.',
      placeholder: '14',
      suffix: 'days',
      error: 'Enter the number of days.'
    },
    {
      n: 7,
      key: 'signal',
      type: 'text',
      title: 'What would you see if you were right?',
      hint: {
        first_traction:
          'One thing you can count, and the number that counts as a yes. Example: "At least 3 of the 20 people I message say yes."',
        scaling:
          'One thing you can count, and the number that counts as a yes. Example: "At least 2 out of every 100 visitors start checkout at the higher price."'
      },
      note: 'A number, not a feeling — "more interest" can’t be read on a deadline.',
      placeholder: 'I would see…',
      error: 'Write what you’d see if you were right.'
    },
    {
      n: 8,
      key: 'experiment',
      type: 'pick',
      title: 'Pick your test',
      hint: {
        first_traction:
          'These fit what you told us. Pick one — you run it yourself, with the cap and the deadline you just set.',
        scaling:
          'These fit your cap and your deadline. Pick the one that answers the decision you’re stuck on — you run it yourself.'
      },
      error: 'Pick one test to continue.'
    }
  ];

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */
  var state = {
    answers: {},
    step: 1,
    maxStep: 1,
    completed: [],
    started: false,
    selectedExperimentId: null
  };

  function load() {
    var raw = storage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return false;
      state.answers = saved.answers || {};
      state.step = Math.min(Math.max(saved.step || 1, 1), TOTAL_STEPS);
      state.maxStep = Math.min(Math.max(saved.maxStep || state.step, 1), TOTAL_STEPS);
      state.completed = saved.completed || [];
      state.started = !!saved.started;
      state.selectedExperimentId = saved.selectedExperimentId || null;
      return Object.keys(state.answers).length > 0;
    } catch (err) {
      return false;
    }
  }

  function save() {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* out of quota or storage disabled — the flow keeps working in memory */
    }
  }

  function track() {
    return state.answers.stage || null;
  }

  function hintFor(q) {
    if (typeof q.hint === 'string') return q.hint;
    var t = track();
    return (t && q.hint[t]) || q.hint.first_traction;
  }

  function budgetCap() {
    return parseFloat(state.answers.budget);
  }

  function daysAvailable() {
    return parseInt(state.answers.days, 10);
  }

  function formatMoney(value) {
    var n = Number(value);
    if (!isFinite(n)) return '';
    return '$' + (n % 1 === 0 ? String(n) : n.toFixed(2));
  }

  function formatDays(value) {
    var n = Number(value);
    return n === 1 ? '1 day' : n + ' days';
  }

  /* ------------------------------------------------------------------ *
   * Analytics hooks (US-07 AC1/AC2). No provider yet — RG-07 plugs the
   * sink into TYJC.analytics.sink and every event below is forwarded.
   * ------------------------------------------------------------------ */
  function trackStart() {
    if (state.started) return; // one builder_start per person, not per visit
    state.started = true;
    save();
    TYJC.track(TYJC.EVENTS.BUILDER_START, { track: track() });
  }

  function trackStepCompleted(step, extra) {
    if (state.completed.indexOf(step) !== -1) return; // first completion only
    state.completed.push(step);
    save();
    var props = { step: step, track: track() };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) props[k] = extra[k];
      }
    }
    TYJC.track(TYJC.EVENTS.BUILDER_STEP_COMPLETED, props);
  }

  /* ------------------------------------------------------------------ *
   * Tiny DOM helpers (textContent everywhere — user text is never HTML)
   * ------------------------------------------------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  var dom = {};

  /* ------------------------------------------------------------------ *
   * Validation (US-03 AC4 and AC5)
   * ------------------------------------------------------------------ */
  function validate(q, value) {
    var raw = (value === undefined || value === null ? '' : String(value)).trim();

    if (q.type === 'choice' || q.type === 'pick') {
      return raw ? null : q.error;
    }

    if (q.type === 'text') {
      return raw ? null : q.error;
    }

    if (q.type === 'money') {
      if (!raw) return q.error;
      var cleanMoney = raw.replace(/[$,\s]/g, '');
      if (!/^-?\d*\.?\d+$/.test(cleanMoney)) {
        return 'Enter numbers only — for example 150.';
      }
      if (parseFloat(cleanMoney) <= 0) {
        return 'Enter an amount above 0. Some tests here run without spending anything, but your cap still has to be a number you set on purpose.';
      }
      return null;
    }

    if (q.type === 'days') {
      if (!raw) return q.error;
      var cleanDays = raw.replace(/[,\s]/g, '');
      if (!/^-?\d+$/.test(cleanDays)) {
        return 'Enter whole days as a number — for example 14.';
      }
      if (parseInt(cleanDays, 10) <= 0) {
        return 'Enter a number of days above 0.';
      }
      return null;
    }

    return null;
  }

  function normalize(q, value) {
    var raw = String(value === undefined || value === null ? '' : value).trim();
    if (q.type === 'money') return raw.replace(/[$,\s]/g, '');
    if (q.type === 'days') return raw.replace(/[,\s]/g, '');
    return raw;
  }

  function showError(message) {
    if (!message) {
      dom.error.hidden = true;
      dom.error.textContent = '';
      return;
    }
    dom.error.textContent = message;
    dom.error.hidden = false;
  }

  /* ------------------------------------------------------------------ *
   * Rendering
   * ------------------------------------------------------------------ */
  function renderSteps() {
    clear(dom.steps);
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var chip = el('button', 'chip', String(i));
      chip.type = 'button';
      chip.setAttribute('data-step', String(i));
      if (i === state.step) {
        chip.classList.add('chip--current');
        chip.setAttribute('aria-current', 'step');
      }
      if (i <= state.maxStep) {
        chip.classList.add('chip--visited');
        chip.setAttribute('aria-label', 'Go back to question ' + i);
      } else {
        chip.disabled = true;
        chip.setAttribute('aria-label', 'Question ' + i + ', not reached yet');
      }
      dom.steps.appendChild(chip);
    }
  }

  function renderMeta() {
    dom.progress.textContent = 'Question ' + state.step + ' of ' + TOTAL_STEPS;
    var t = track();
    if (t && state.step > 1) {
      dom.trackTag.textContent = 'Your track: ' + TRACK_LABELS[t];
      dom.trackTag.hidden = false;
    } else {
      dom.trackTag.hidden = true;
    }
    var pct = Math.round(((state.step - 1) / TOTAL_STEPS) * 100);
    dom.bar.style.width = pct + '%';
    dom.barOuter.setAttribute('aria-valuenow', String(state.step));
  }

  function renderChoice(q, body) {
    var group = el('div', 'options');
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', 'question-title');
    q.options.forEach(function (option) {
      var wrap = el('label', 'option');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = q.key;
      input.value = option.value;
      input.checked = state.answers[q.key] === option.value;
      if (input.checked) wrap.classList.add('option--selected');
      input.addEventListener('change', function () {
        state.answers[q.key] = option.value;
        save();
        showError(null);
        var all = group.querySelectorAll('.option');
        for (var i = 0; i < all.length; i++) all[i].classList.remove('option--selected');
        wrap.classList.add('option--selected');
      });
      var textWrap = el('span', 'option__text');
      textWrap.appendChild(el('span', 'option__label', option.label));
      textWrap.appendChild(el('span', 'option__detail', option.detail));
      wrap.appendChild(input);
      wrap.appendChild(textWrap);
      group.appendChild(wrap);
    });
    body.appendChild(group);
  }

  function renderText(q, body) {
    var field = document.createElement('textarea');
    field.className = 'field field--text';
    field.id = 'answer';
    field.rows = 3;
    field.value = state.answers[q.key] || '';
    field.placeholder = q.placeholder || '';
    field.setAttribute('aria-describedby', 'question-hint');
    field.addEventListener('input', function () {
      state.answers[q.key] = field.value;
      save();
    });
    body.appendChild(field);
  }

  function renderNumber(q, body) {
    var wrap = el('div', 'numeric');
    if (q.prefix) wrap.appendChild(el('span', 'numeric__prefix', q.prefix));
    var field = document.createElement('input');
    field.type = 'text';
    field.className = 'field field--number';
    field.id = 'answer';
    field.value = state.answers[q.key] || '';
    field.placeholder = q.placeholder || '';
    field.autocomplete = 'off';
    field.setAttribute('inputmode', q.type === 'money' ? 'decimal' : 'numeric');
    field.setAttribute('aria-describedby', 'question-hint');
    field.addEventListener('input', function () {
      state.answers[q.key] = field.value;
      save();
    });
    wrap.appendChild(field);
    if (q.suffix) wrap.appendChild(el('span', 'numeric__suffix', q.suffix));
    body.appendChild(wrap);
  }

  function renderExperimentDetails(exp) {
    var details = document.createElement('details');
    details.className = 'rec__details';
    var summary = document.createElement('summary');
    summary.textContent = 'How you’d run it';
    details.appendChild(summary);

    details.appendChild(el('h4', 'rec__h', 'What you need before you start'));
    details.appendChild(el('p', 'rec__p', exp.needs));

    details.appendChild(el('h4', 'rec__h', 'Step by step'));
    var list = el('ol', 'rec__steps');
    exp.steps.forEach(function (step) {
      list.appendChild(el('li', null, step));
    });
    details.appendChild(list);

    if (exp.timebox_note) {
      details.appendChild(el('p', 'rec__p rec__p--note', exp.timebox_note));
    }

    details.appendChild(el('h4', 'rec__h', 'The most common mistake'));
    details.appendChild(el('p', 'rec__p', exp.mistake));

    return details;
  }

  function renderPick(q, body) {
    var cap = budgetCap();
    var span = daysAvailable();
    var result = TYJC.recommend({ track: track(), budgetCap: cap, daysAvailable: span });

    /* A recommendation the user picked earlier can fall out of the list if
       they go back and change the cap or the deadline. Drop it silently. */
    var stillThere = result.items.some(function (item) {
      return item.experiment.id === state.selectedExperimentId;
    });
    if (!stillThere && state.selectedExperimentId) {
      state.selectedExperimentId = null;
      save();
    }

    if (result.headerNote) {
      body.appendChild(el('p', 'rec-header', result.headerNote));
    }

    var list = el('div', 'recs');
    result.items.forEach(function (item) {
      var exp = item.experiment;
      var card = el('div', 'rec' + (item.fits ? '' : ' rec--flagged'));

      var head = el('label', 'rec__head');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'experiment';
      input.value = exp.id;
      input.checked = state.selectedExperimentId === exp.id;
      input.addEventListener('change', function () {
        selectExperiment(exp.id);
      });
      var headText = el('span', 'rec__headtext');
      headText.appendChild(el('span', 'rec__name', exp.name));
      headText.appendChild(
        el(
          'span',
          'rec__facts',
          'Typically ' + formatMoney(exp.typical_cost_usd) + ' · ' + formatDays(exp.typical_days)
        )
      );
      head.appendChild(input);
      head.appendChild(headText);
      card.appendChild(head);

      card.appendChild(el('p', 'rec__proves', exp.proves));

      if (item.warning) {
        card.appendChild(el('p', 'rec__warning', item.warning));
      }
      if (item.budgetNote) {
        var note = el('p', 'rec__budget');
        note.appendChild(el('strong', null, 'Budget note: '));
        note.appendChild(document.createTextNode(item.budgetNote));
        card.appendChild(note);
      }

      card.appendChild(renderExperimentDetails(exp));
      list.appendChild(card);
    });
    body.appendChild(list);

    var done = el('div', 'done');
    done.id = 'done';
    done.hidden = true;
    body.appendChild(done);
  }

  function renderQuestion(focus) {
    var q = QUESTIONS[state.step - 1];
    clear(dom.question);
    showError(null);

    var title = el('h2', 'question__title', q.title);
    title.id = 'question-title';
    title.tabIndex = -1;
    dom.question.appendChild(title);

    var hint = el('p', 'question__hint', hintFor(q));
    hint.id = 'question-hint';
    dom.question.appendChild(hint);

    var body = el('div', 'question__body');
    if (q.type === 'choice') renderChoice(q, body);
    else if (q.type === 'text') renderText(q, body);
    else if (q.type === 'money' || q.type === 'days') renderNumber(q, body);
    else if (q.type === 'pick') renderPick(q, body);
    dom.question.appendChild(body);

    if (q.note) dom.question.appendChild(el('p', 'question__note', q.note));

    dom.back.hidden = state.step === 1;
    dom.next.hidden = q.type === 'pick';
    dom.next.textContent = state.step === TOTAL_STEPS - 1 ? 'See my tests' : 'Next';

    renderSteps();
    renderMeta();

    if (q.type === 'pick' && state.selectedExperimentId) {
      renderSelection();
    }

    if (focus) {
      var first = dom.question.querySelector('textarea, input[type="text"]');
      if (first) first.focus();
      else title.focus();
    }
  }

  /* ------------------------------------------------------------------ *
   * Question 8 — selection panel. This is where RG-04 plugs the card in.
   * ------------------------------------------------------------------ */
  function selectExperiment(id) {
    state.selectedExperimentId = id;
    save();
    showError(null);
    var cards = dom.question.querySelectorAll('.rec');
    for (var i = 0; i < cards.length; i++) {
      var input = cards[i].querySelector('input[type="radio"]');
      cards[i].classList.toggle('rec--selected', !!input && input.value === id);
    }
    trackStepCompleted(8, { experiment_id: id });
    renderSelection();
  }

  function summaryRows() {
    var exp = TYJC.getExperiment(state.selectedExperimentId);
    return [
      ['Stage', TRACK_LABELS[track()]],
      ['What you sell', state.answers.sells],
      ['The decision', state.answers.decision],
      ['What you believe', state.answers.belief],
      ['Budget cap', formatMoney(budgetCap())],
      ['Days to an answer', formatDays(daysAvailable())],
      ['What "yes" looks like', state.answers.signal],
      ['Your test', exp ? exp.name : '']
    ];
  }

  function renderSelection() {
    var done = document.getElementById('done');
    if (!done) return;
    clear(done);
    done.hidden = false;

    var exp = TYJC.getExperiment(state.selectedExperimentId);
    done.appendChild(el('h3', 'done__title', 'Your test: ' + (exp ? exp.name : '')));
    done.appendChild(
      el(
        'p',
        'done__lead',
        'Saved on this device. Here is everything you have set for it — go back to any question above to change it.'
      )
    );

    var dl = el('dl', 'summary');
    summaryRows().forEach(function (row) {
      dl.appendChild(el('dt', null, row[0]));
      dl.appendChild(el('dd', null, row[1] || ''));
    });
    done.appendChild(dl);

    /* RG-04 mount point. Empty on purpose while the card story is not built:
       the user sees a finished, honest step 8 rather than a dead button. */
    var mount = el('div', 'card-mount');
    mount.id = 'tyjc-card-mount';
    done.appendChild(mount);

    if (typeof TYJC.cardRenderer === 'function') {
      try {
        TYJC.cardRenderer(TYJC.getBuilderState(), mount);
      } catch (err) {
        clear(mount);
      }
    }
  }

  /* ------------------------------------------------------------------ *
   * Navigation
   * ------------------------------------------------------------------ */
  function goTo(step, focus) {
    state.step = Math.min(Math.max(step, 1), TOTAL_STEPS);
    if (state.step > state.maxStep) state.maxStep = state.step;
    save();
    renderQuestion(focus);
    window.scrollTo(0, 0);
  }

  function next() {
    var q = QUESTIONS[state.step - 1];
    var value = state.answers[q.key];
    var message = validate(q, value);
    if (message) {
      showError(message);
      var field = dom.question.querySelector('textarea, input[type="text"]');
      if (field) field.focus();
      return;
    }
    state.answers[q.key] = normalize(q, value);
    save();
    trackStepCompleted(q.n);
    goTo(state.step + 1, true);
  }

  function reset() {
    var ok = window.confirm(
      'Start over? This clears the answers saved on this device. It cannot be undone.'
    );
    if (!ok) return;
    storage.removeItem(STORAGE_KEY);
    state = {
      answers: {},
      step: 1,
      maxStep: 1,
      completed: [],
      started: false,
      selectedExperimentId: null
    };
    dom.restored.hidden = true;
    save();
    trackStart();
    goTo(1, true);
  }

  /* ------------------------------------------------------------------ *
   * Public seam for RG-04 (Experiment Card) and RG-07 (analytics)
   * ------------------------------------------------------------------ */
  TYJC.getBuilderState = function () {
    return {
      track: track(),
      trackLabel: TRACK_LABELS[track()] || null,
      sells: state.answers.sells || '',
      decision: state.answers.decision || '',
      belief: state.answers.belief || '',
      budgetCapUsd: isFinite(budgetCap()) ? budgetCap() : null,
      budgetCapRaw: state.answers.budget || '',
      daysAvailable: isFinite(daysAvailable()) ? daysAvailable() : null,
      successSignal: state.answers.signal || '',
      selectedExperimentId: state.selectedExperimentId,
      selectedExperiment: TYJC.getExperiment(state.selectedExperimentId)
    };
  };

  /**
   * RG-04 calls this once with a function (builderState, mountElement) => void.
   * It runs as soon as a test is selected, inside #tyjc-card-mount.
   * Remember to emit TYJC.track(TYJC.EVENTS.CARD_GENERATED, {...}) there.
   */
  TYJC.registerCardRenderer = function (fn) {
    TYJC.cardRenderer = fn;
    if (state.step === TOTAL_STEPS && state.selectedExperimentId) renderSelection();
  };

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function init() {
    dom.steps = document.getElementById('steps');
    dom.progress = document.getElementById('progress');
    dom.trackTag = document.getElementById('track-tag');
    dom.question = document.getElementById('question');
    dom.error = document.getElementById('error');
    dom.back = document.getElementById('back');
    dom.next = document.getElementById('next');
    dom.form = document.getElementById('builder');
    dom.restored = document.getElementById('restored');
    dom.bar = document.getElementById('bar');
    dom.barOuter = document.getElementById('bar-outer');

    var restored = load();
    dom.restored.hidden = !restored;

    dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      next();
    });
    dom.back.addEventListener('click', function () {
      goTo(state.step - 1, true);
    });
    dom.steps.addEventListener('click', function (event) {
      var chip = event.target.closest ? event.target.closest('.chip') : null;
      if (!chip || chip.disabled) return;
      goTo(parseInt(chip.getAttribute('data-step'), 10), true);
    });
    var resetButtons = document.querySelectorAll('.js-reset');
    for (var i = 0; i < resetButtons.length; i++) {
      resetButtons[i].addEventListener('click', reset);
    }

    trackStart();
    renderQuestion(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

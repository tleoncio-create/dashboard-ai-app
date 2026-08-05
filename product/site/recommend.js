/*
 * TYJC — Recommendation contract (builder question 8).
 *
 * Implements, literally, the "Suggested selection rule" and the "Warning copy"
 * of product/experiments-library.md, plus the budget_note rule imposed by the
 * PM on D1 (board.md, Notas do PM, item 1 — QA OBS-1):
 *
 *   budget_note is shown on an experiment whenever the user's cap is below what
 *   the experiment typically costs (typical_cost_usd > budget_cap).
 *
 * Pure function, no DOM. Call it from the console to verify a case:
 *   TYJC.recommend({ track: 'first_traction', budgetCap: 10, daysAvailable: 4 })
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});

  var MAX_ITEMS = 3;
  var MIN_ITEMS = 2;

  function money(value) {
    var n = Number(value);
    if (!isFinite(n)) return '$0';
    return '$' + (n % 1 === 0 ? String(n) : n.toFixed(2));
  }

  function days(value) {
    var n = Number(value);
    return n === 1 ? '1 day' : n + ' days';
  }

  /* Warning copy — verbatim from the library, with the values substituted. */
  function budgetWarning(exp, budgetCap) {
    return (
      'This one needs about ' +
      money(exp.min_budget_usd) +
      ' to give you a readable answer — more than the ' +
      money(budgetCap) +
      ' you set. Either raise your cap to ' +
      money(exp.min_budget_usd) +
      ', or run it smaller and treat what you see as a hint, not an answer.'
    );
  }

  function timeboxWarning(exp, daysAvailable) {
    return (
      'This one needs about ' +
      days(exp.min_days) +
      ' to give you a readable answer — longer than the ' +
      days(daysAvailable) +
      ' you set. Either give it ' +
      days(exp.min_days) +
      ', or accept that you’ll be reading a partial result.'
    );
  }

  function bothWarning(exp, budgetCap, daysAvailable) {
    return (
      'This one needs about ' +
      money(exp.min_budget_usd) +
      ' and ' +
      days(exp.min_days) +
      ' to give you a readable answer — more than the ' +
      money(budgetCap) +
      ' and the ' +
      days(daysAvailable) +
      ' you set. Stretch one of the two, or run it smaller and treat what you see as a hint, not an answer.'
    );
  }

  function headerNote(cleanCount, budgetCap, daysAvailable) {
    if (cleanCount === 0) {
      return (
        'No test in this library fits both your ' +
        money(budgetCap) +
        ' cap and your ' +
        days(daysAvailable) +
        '. These are the closest we have — each one says what it needs.'
      );
    }
    return (
      'Only ' +
      cleanCount +
      ' test in this library fits both your ' +
      money(budgetCap) +
      ' cap and your ' +
      days(daysAvailable) +
      '. The others below are the closest we have — each one says what it needs.'
    );
  }

  function byPriority(a, b) {
    return a.recommendation_priority - b.recommendation_priority;
  }

  /**
   * @param {{track:string, budgetCap:number, daysAvailable:number}} input
   * @returns {{cleanCount:number, headerNote:(string|null), items:Array}}
   *   items[i] = {
   *     experiment, fits:boolean, failedBudget:boolean, failedDays:boolean,
   *     warning:(string|null), budgetNote:(string|null)
   *   }
   */
  TYJC.recommend = function (input) {
    var track = input.track;
    var budgetCap = Number(input.budgetCap);
    var daysAvailable = Number(input.daysAvailable);

    /* 1. Only the experiments of the chosen track are ever eligible. */
    var eligible = TYJC.experiments.filter(function (exp) {
      return exp.track === track;
    });

    /* 2. Clean pass. */
    var clean = [];
    var misses = [];
    eligible.forEach(function (exp) {
      var failedBudget = exp.min_budget_usd > budgetCap;
      var failedDays = exp.min_days > daysAvailable;
      if (!failedBudget && !failedDays) {
        clean.push(exp);
      } else {
        misses.push({ exp: exp, failedBudget: failedBudget, failedDays: failedDays });
      }
    });

    /* 3. Clean pass sorted by recommendation_priority; 3+ or exactly 2 stops here. */
    clean.sort(byPriority);
    var chosen = [];
    if (clean.length >= MIN_ITEMS) {
      chosen = clean.slice(0, MAX_ITEMS).map(function (exp) {
        return { experiment: exp, fits: true, failedBudget: false, failedDays: false };
      });
    } else {
      /* 4/5/6. Fill-up: 0 or 1 survivors. Order the misses by the dimension
         that failed. Any timebox failure among the candidates makes min_days
         lead ("time is the harder constraint to stretch"); when only budget
         failed anywhere, min_budget_usd leads. Ties break by priority, so the
         same inputs always produce the same list. */
      var anyDaysFailure = misses.some(function (m) {
        return m.failedDays;
      });
      misses.sort(function (a, b) {
        if (anyDaysFailure) {
          if (a.exp.min_days !== b.exp.min_days) return a.exp.min_days - b.exp.min_days;
          if (a.exp.min_budget_usd !== b.exp.min_budget_usd) {
            return a.exp.min_budget_usd - b.exp.min_budget_usd;
          }
        } else if (a.exp.min_budget_usd !== b.exp.min_budget_usd) {
          return a.exp.min_budget_usd - b.exp.min_budget_usd;
        }
        return byPriority(a.exp, b.exp);
      });

      chosen = clean.map(function (exp) {
        return { experiment: exp, fits: true, failedBudget: false, failedDays: false };
      });
      for (var i = 0; i < misses.length && chosen.length < MAX_ITEMS; i++) {
        chosen.push({
          experiment: misses[i].exp,
          fits: false,
          failedBudget: misses[i].failedBudget,
          failedDays: misses[i].failedDays
        });
      }
    }

    /* Warning per item + budget_note rule (PM / QA OBS-1). */
    chosen.forEach(function (item) {
      var exp = item.experiment;
      item.warning = null;
      if (!item.fits) {
        if (item.failedBudget && item.failedDays) {
          item.warning = bothWarning(exp, budgetCap, daysAvailable);
        } else if (item.failedBudget) {
          item.warning = budgetWarning(exp, budgetCap);
        } else {
          item.warning = timeboxWarning(exp, daysAvailable);
        }
      }
      item.budgetNote = exp.typical_cost_usd > budgetCap ? exp.budget_note : null;
    });

    var flagged = chosen.some(function (item) {
      return !item.fits;
    });

    return {
      cleanCount: clean.length,
      headerNote: flagged ? headerNote(clean.length, budgetCap, daysAvailable) : null,
      items: chosen
    };
  };
})();

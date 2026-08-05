/*
 * TYJC — Experiment library data (US-05 / RG-05).
 *
 * Source of truth: product/experiments-library.md (QA-approved on D1).
 * Only user-facing experiment content + the metadata declared in the
 * "Recommendation contract" is copied here. The library's internal sections
 * (Status header, Recommendation contract, Scope check) are NEVER shipped
 * to the user and are deliberately absent from this file.
 *
 * If the .md changes, this file must be updated in the same commit.
 */
(function () {
  'use strict';

  var TYJC = (window.TYJC = window.TYJC || {});

  TYJC.experiments = [
    /* ---------------- Track A — Getting first traction ---------------- */
    {
      id: 'A1',
      name: 'The Pre-Sale Page',
      track: 'first_traction',
      proves:
        'Whether people will actually hand over money for your offer — before you build it, stock it, or spend a month on it. It separates "that sounds great" from "here’s my card."',
      needs:
        'One free page builder, one clear sentence about the offer, and a way to take payment or collect a reservation.',
      steps: [
        'Write the offer in one sentence: who it’s for, what they get, what it costs. If you can’t fit it in one sentence, the test isn’t ready yet — fix the sentence first.',
        'Build a single page with five blocks: that sentence, three bullets of what’s included, the price, the button, and one line saying when it will be ready. Use a free page builder. Give it one afternoon, not one week.',
        'Decide what the button does. Two honest options: (a) it takes real payment now, with delivery on a stated date, or (b) it reserves a spot and collects an email. Option (a) gives you a much stronger answer, because money is the only vote that costs the voter something.',
        'Write the screen people see after clicking, before you send anyone: what happens next, and when. If you take money and then decide not to build it, refund in full the same day. Say that on the page.',
        'Write your number down where you’ll see it: for example, "out of 100 people who reach this page, at least 3 click Buy."',
        'Send people to the page for the whole timebox, using one route only — message 30 people who fit, post it in one place where your buyers already are, or run a small ad. Not all three. If you use three, you won’t know which one worked.',
        'Count two numbers a day. People who reached the page. People who clicked the button. That’s it.',
        'On the read date, compare with step 5. Below the line, stop: don’t extend the deadline and don’t rebuild the page. Write one sentence about what you’d change, and pick your next test.'
      ],
      timebox_note: null,
      mistake:
        'Counting the wrong number. Page views, likes, and friends replying "yeah I’d buy that" are not the test. The only line that counts is people clicking the button after seeing the price. The close second: quietly taking the price off the page to get more clicks — that turns a demand test into a popularity survey.',
      min_budget_usd: 0,
      max_budget_usd: 250,
      typical_cost_usd: 75,
      min_days: 7,
      max_days: 14,
      typical_days: 10,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 1,
      budget_note:
        'Free route: message people directly or post in one community. Paid route: $50-150 in ads.'
    },
    {
      id: 'A2',
      name: 'The 20 Direct Offers',
      track: 'first_traction',
      proves:
        'Whether your offer is clear enough and wanted enough that a specific human says yes when you ask them one-to-one — and, when they say no, what actually stopped them.',
      needs: 'A list of 20 names and a plain spreadsheet. Nothing else.',
      steps: [
        'Write down 20 named people who look like the buyer you want: past customers, people who asked once and never bought, people active in one place your buyers gather. Real names — not a bought list, not a broadcast.',
        'Write one short message: one line about the thing they’re dealing with, one line about what you’re offering, one clear ask. Under six sentences. The ask is either a 15-minute call or a direct "want it? it’s $X".',
        'Personalize the first line of every message with one detail that could only apply to that person. If it could be sent to anyone, it will be read by no one.',
        'Write your number and your stop line before you send: "out of 20, at least 3 say yes. If fewer than 3 by day 7, I change the offer — not the message."',
        'Send five a day for four days, one at a time. Never a group blast.',
        'Log every reply in a sheet: name, yes / no / silent, and — when they say no — their exact words. Their words, not your summary of them.',
        'On day 7, count the yeses and read the no’s back. If the same objection appears three or more times, that’s your real finding: that objection is what you test next.',
        'Stop at 20. Don’t keep messaging until someone says yes — that turns a test into a grind, and you lose the reading.'
      ],
      timebox_note: null,
      mistake:
        'Pasting the same message to all 20 at once and treating silence as "no interest". You lose the reason, and the reason was the whole point. The close second: pitching before asking anything. People answer questions and dodge pitches.',
      min_budget_usd: 0,
      max_budget_usd: 50,
      typical_cost_usd: 0,
      min_days: 3,
      max_days: 7,
      typical_days: 5,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 2,
      budget_note:
        'Runs at $0. Any budget goes to a scheduling or spreadsheet tool you probably already have.'
    },
    {
      id: 'A3',
      name: 'The $50 Cold Click Test',
      track: 'first_traction',
      proves:
        'Whether people who have never heard of you react to your promise at all — and which of two ways of saying it gets more of them to click through, at what cost per click.',
      needs:
        'One page that states the offer and the price, and one ad account with a daily cap you can set.',
      steps: [
        'Pick the one page you’ll send clicks to. It must show the offer and the price. If you don’t have that page, run The Pre-Sale Page first — this test is worthless if the destination is vague.',
        'Write two versions of the same promise. Change only the headline. Same picture, same audience, same budget. Two versions, not six.',
        'Before anything goes live, set the hard daily cap in the account: $10 a day, split evenly between the two versions, for 5 days — $50 total. Set the end date in the account too. Write both numbers into your card. This is the fence around the test.',
        'Choose the narrowest audience the platform will let you target that still matches your buyer. At this budget, narrow beats broad.',
        'Turn both versions on the same day, at the same budget, and then don’t touch them for the full 5 days. Editing copy or bids mid-run resets what you were learning.',
        'Write down three numbers per version each day: money spent, clicks to the page, cost per click. Ignore impressions, likes and shares.',
        'On the read date, compare cost per click and total clicks. If neither version reached roughly 30 clicks, you don’t have an answer — say that out loud instead of crowning a winner on six clicks.',
        'Whatever the result, turn the ads off on the end date. The cap is the experiment.'
      ],
      timebox_note:
        'How the 7 days add up: one day to set up, five days of ads, one day to read. In a hurry, you can set up in the morning of day 1 and read on the evening of day 5 — that’s the 5-day floor. If you give it more days, keep the $10 daily cap: 10 days is $100, and that’s the most this test is worth.',
      mistake:
        'Splitting a small budget across many versions and audiences, so nothing gets enough clicks to read. The close second: judging by likes and comments. Attention is not the same as someone clicking through to a page with a price on it.',
      min_budget_usd: 50,
      max_budget_usd: 100,
      typical_cost_usd: 50,
      min_days: 5,
      max_days: 10,
      typical_days: 7,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 3,
      budget_note:
        '$10/day for 5 days = $50, the floor for a readable number of clicks. The $100 ceiling is the same $10/day cap held for the full 10 days. Needs a destination page that shows the price.'
    },
    {
      id: 'A4',
      name: 'The Five-Post Channel Test',
      track: 'first_traction',
      proves:
        'Whether one free channel can produce real conversations with buyers, for the hours you put in — before you give it three months of your life.',
      needs: 'One account on one platform, and two hours a week.',
      steps: [
        'Pick exactly one place where your buyers already gather and talk: one social platform, one forum, one community. One. Testing three at once tells you nothing about any of them.',
        'Spend one hour reading the room: what people ask, what words they use, what gets ignored. Write down five questions you saw real people ask.',
        'Turn each of those five questions into one post that answers it plainly, with no pitch. End each post with one small, specific invite: "if you want the checklist I use for this, reply and I’ll send it."',
        'Write your number and your stop line before you post: "five posts in 12 days: at least 8 replies and 3 people asking for the invite. Below that, this channel isn’t for me right now."',
        'Post one every two or three days, at roughly the same time of day. Reply to every comment within 24 hours — the replies are the test.',
        'Track three numbers per post: replies, people who asked for the invite, and people who then asked what you sell.',
        'On the read date, compare with step 4. If it hit, this channel earns four more weeks. If it missed, stop — and don’t blame the algorithm. Try a different room, or a paid test.',
        'Keep everything you wrote. Even a channel that fails leaves you five pieces you can reuse somewhere else.'
      ],
      timebox_note: null,
      mistake:
        'Posting about yourself instead of answering the questions people actually asked — and then quitting after two posts because the first one flopped. Five is the minimum; the first post almost always underperforms.',
      min_budget_usd: 0,
      max_budget_usd: 25,
      typical_cost_usd: 0,
      min_days: 10,
      max_days: 14,
      typical_days: 14,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 4,
      budget_note:
        'Runs at $0. Needs 10 days minimum because five posts spaced two days apart is the smallest readable sample.'
    },

    /* ---------------- Track B — Scaling what works ---------------- */
    {
      id: 'B1',
      name: 'The Two-Price Test',
      track: 'scaling',
      proves:
        'Whether your price is what’s holding demand back — by showing two prices to two comparable groups of people, at the same time, and counting who moves to checkout.',
      needs: 'Two copies of one page, and a way to split visitors between them.',
      steps: [
        'Pick one offer and two prices: the one you charge today, and the one you’re seriously considering (usually higher). Two, never three.',
        'Make two copies of the same page. The only difference is the number. Same headline, same words, same images, same buttons.',
        'Decide how people get split. Best option: your page tool’s built-in split test, which sends every other visitor to a different version. If you don’t have that, run two ads with identical budget and audience, one pointing at each page.',
        'Write down, before you start, how many visitors each page needs and what would count as a real difference: "200 visitors per page minimum. I’ll only call it a difference if one side gets at least twice the checkout starts."',
        'Run both for the whole timebox without touching them. Never swap the price mid-run.',
        'Track per page: visitors, checkout starts, completed purchases. If you take payment by hand, count "said yes to the price" instead.',
        'On the read date, if either page got fewer visitors than your minimum, the honest answer is "not enough people to tell". Write that down and stop. Guessing from a small number is worse than not testing at all.',
        'Honor whatever price the buyer saw. If you raise the price afterwards, it applies to new visitors only.'
      ],
      timebox_note: null,
      mistake:
        'Showing the two prices at different times — this week versus last week — or from different sources. Then you’re comparing weeks and audiences, not prices. The close second: declaring a winner from 12 visitors because you were impatient.',
      min_budget_usd: 0,
      max_budget_usd: 400,
      typical_cost_usd: 150,
      min_days: 7,
      max_days: 14,
      typical_days: 14,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 1,
      budget_note:
        '$0 only if people already land on your page. With no visitors of your own, budget $150-300 in ads to send comparable traffic to both versions.'
    },
    {
      id: 'B2',
      name: 'The One-Channel Smoke Test',
      track: 'scaling',
      proves:
        'Whether one new channel can bring in the kind of leads you want, at a cost you can live with — before you commit a quarter and a retainer to it.',
      needs:
        'One ad or outreach account with a daily cap, one destination page, and a link you can tag.',
      steps: [
        'Pick one channel you are not using today, and write the number that would make it worth continuing: "a booked call under $80" or "an email address under $6". One number, written before you spend anything.',
        'Pick one offer and one message to run there. Not your whole catalogue. The channel is what’s on trial, so everything else stays fixed.',
        'Set the total budget and the hard daily cap in the account first — for example $400 total, $30 a day, with an end date. That fence is the experiment.',
        'Send every click to one page that asks for exactly one thing: book a call, or leave an email. Two asks cut your reading in half.',
        'Tag the link so you can tell this channel’s traffic apart from everything else. If you can’t tell it apart afterwards, you can’t read it at all.',
        'Let it run untouched for at least seven days before changing anything. New channels look terrible for the first three days, every time.',
        'Track per day: spend, leads, cost per lead — and how many of those leads were genuinely your buyer. Check that by hand. Five good leads beat forty junk ones.',
        'On the read date, compare your cost per good lead against step 1. Above the line, stop. And don’t renegotiate your own number after seeing the result — that number was the entire point of writing it down first.'
      ],
      timebox_note: null,
      mistake:
        'Running three channels at $130 each "to compare them". At that budget none of them gets enough data, so all three look like failures and you learn nothing about any of them. The close second: moving your own goalposts on the read date because you’d already decided you liked the channel.',
      min_budget_usd: 250,
      max_budget_usd: 500,
      typical_cost_usd: 400,
      min_days: 10,
      max_days: 14,
      typical_days: 14,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 3,
      budget_note:
        'Below $250 a new channel doesn’t produce enough leads to judge it. Hard ceiling $500 - this is a test, not a launch.'
    },
    {
      id: 'B3',
      name: 'The Win/Loss Five',
      track: 'scaling',
      proves:
        'Whether the reason you believe people buy — or walk away — is the real reason, in their words instead of yours.',
      needs:
        'Ten names from the last 90 days, 15 minutes each, and a document to paste exact phrases into.',
      steps: [
        'Pick five people who recently said yes and five who said no or went quiet, in the last 90 days. If you don’t have ten like that, use anyone who asked about your offer and didn’t buy.',
        'Ask for 15 minutes, not "a chat". If you need to, offer a $25 thank-you gift card — that’s what the budget is for.',
        'Use the same five questions with everyone, and make all of them about the past: What were you trying to fix? What had you tried before? What almost stopped you? Who else did you look at? What decided it, in the end?',
        'Never ask "would you buy X?". People are bad at predicting themselves and polite to your face. What they already did is the only reliable evidence you’ll get.',
        'Record with permission, or take notes in their words. Copy exact phrases, not your summary of them — your summary is your assumption wearing their voice.',
        'After each call, write one line: the sentence that surprised you most.',
        'On the read date, put every phrase in one document and look for anything said by three or more people. That repetition is the finding. Single mentions are noise.',
        'Turn the top repeated phrase into your next test — usually a headline change or an offer change — instead of rewriting everything at once.'
      ],
      timebox_note: null,
      mistake:
        'Only talking to happy customers, so you learn why your fans stay and nothing about why everyone else left. The close second: talking someone out of their objection during the call. Your job here is to collect, not to sell — the moment you defend the offer, the data stops.',
      min_budget_usd: 0,
      max_budget_usd: 250,
      typical_cost_usd: 125,
      min_days: 5,
      max_days: 10,
      typical_days: 7,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 2,
      budget_note:
        '$0 if people take the call without an incentive. Budget covers up to 10 thank-you gift cards at $25.'
    },
    {
      id: 'B4',
      name: 'The Painted-Door Upgrade',
      track: 'scaling',
      proves:
        'Whether real demand exists for the next thing you’re thinking of building — a higher tier, a new package, a new feature — before you build any part of it.',
      needs: 'One sentence, one price, one button, and one honest screen behind it.',
      steps: [
        'Describe the new thing in one sentence with one price. If it takes a paragraph, it isn’t ready to test.',
        'Put one visible button where the relevant people already are: your page, your product screen, your checkout, or your reply signature. Label it plainly: "Coming: [the thing] — $X".',
        'Write the honest screen behind the button before you turn it on: "This isn’t built yet. If enough people want it, we’ll build it — leave your email to be first in line." Nobody should ever believe they bought something that doesn’t exist.',
        'Write your number and your stop line before it goes live: "fewer than 15 clicks and 5 emails in 10 days means this idea is parked, not delayed."',
        'If nothing currently lands where you put the button, use the paid or direct route: about $100 in ads, or messages to 30 named people, pointing at the same button.',
        'Let it run untouched for the whole timebox. Don’t add explanations or nudges halfway through because it started slow.',
        'Track exactly three numbers: people who saw the button, people who clicked it, people who left an email.',
        'On the read date, compare with step 4 and act on it. Below the line, park the idea — and tell the people who left their email, honestly, that it isn’t happening yet.'
      ],
      timebox_note: null,
      mistake:
        'Treating clicks as sales. A click means curiosity, an email means interest, and only money means demand. So if what’s behind the door is a big build, run one more round before you write any code: same one sentence and same price, but with a real Buy button and a stated delivery date, sent to the people who left their email. If you then decide not to build it, refund in full the same day. The close second: leaving a fake button live for weeks with nothing honest behind it. That costs trust, which is far more expensive than any test in this library.',
      min_budget_usd: 0,
      max_budget_usd: 300,
      typical_cost_usd: 100,
      min_days: 7,
      max_days: 14,
      typical_days: 10,
      needs_existing_audience: false,
      needs_team: false,
      recommendation_priority: 4,
      budget_note:
        '$100 is the typical case: the paid or direct route that sends people to the button. It costs $0 only if people already reach the place you put it.'
    }
  ];

  TYJC.getExperiment = function (id) {
    for (var i = 0; i < TYJC.experiments.length; i++) {
      if (TYJC.experiments[i].id === id) return TYJC.experiments[i];
    }
    return null;
  };
})();

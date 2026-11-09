/*
 * JS Engine Lab — 🏢 How teams work: the real-world process of a software project, from an idea to production and after.
 * Brief by default; "+ Show details" adds the real documents (ticket, spec, PR, bug report, postmortem…).
 * The "What would you do?" situations are also 🏋️ Practice tasks (topic "Working in a team").
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const L = (...lines) => lines.join('\n');

  const ROLES = [
    ['Product manager (PM)', 'decides what to build and why; writes the requirements; owns priorities.'],
    ['Designer (UX / UI)', 'designs the screens and flows in Figma; owns how it looks and feels.'],
    ['Frontend developer (you)', 'builds what users see and touch; works with all the others.'],
    ['Backend developer', 'builds the APIs, data and business rules your screens use.'],
    ['QA / test engineer', 'tests features, finds bugs, keeps automated test suites healthy.'],
    ['DevOps / platform', 'runs CI/CD, cloud, monitoring; makes deploying easy and safe.'],
    ['Tech lead', 'guides technical decisions, reviews designs and code.'],
    ['Engineering manager (EM)', 'runs the team: people, hiring, process, delivery.'],
  ];

  const PHASES = [
    { key: 'req', icon: '💡', name: 'Requirements', title: 'Idea and requirements', brief: 'The PM describes the problem, who it is for, and what "done" means.',
      you: ['Read the requirements early and ask questions before anything is built.', 'Look for missing cases: empty, error, loading, permissions, mobile, very long text.', 'Give a rough size (small / medium / large) so it can be planned.'],
      docs: [['A user story with acceptance criteria', L('As a returning customer', 'I want to save products to a wishlist', 'so that I can buy them later.', '', 'Acceptance criteria', '- Given I am logged in, when I click ♡ on a product, it is saved and the icon fills.', '- Given I am logged out, clicking ♡ asks me to log in, then saves it.', '- The wishlist page lists saved items, newest first, with "Remove" and "Add to cart".', '- Works on mobile; the ♡ button has an accessible name.', '', 'Out of scope: sharing wishlists.')]],
      tools: 'Jira, Linear, GitHub Issues; Notion / Confluence for product docs (PRD).' },
    { key: 'design', icon: '🎨', name: 'Design', title: 'Design', brief: 'The designer makes the screens in Figma; you check they can be built and cover every state.',
      you: ['Check every state is designed: loading, empty, error, success, disabled.', 'Check mobile and desktop sizes, and keyboard / screen-reader use.', 'Reuse design-system components; ask before inventing new ones.'],
      docs: [['A design review checklist', L('Figma file: Wishlist v2 (Dev Mode on)', '☐ States: empty wishlist, loading, error, item out of stock', '☐ Sizes: 375px phone, 768px tablet, 1280px desktop', '☐ Components: ProductCard, IconButton, Toast (existing)', '☐ Tokens: colours and spacing from the design system, no new hex values', '☐ Accessibility: contrast, focus visible, ♡ button label "Save to wishlist"')]],
      tools: 'Figma (Dev Mode), Storybook for the components, design tokens.' },
    { key: 'plan', icon: '🗂️', name: 'Planning', title: 'Planning and estimating', brief: 'The work is split into small tickets, estimated, and taken into a sprint.',
      you: ['Split big work into tickets of 1–3 days each.', 'Estimate with your team (story points or t-shirt sizes); say what is unknown.', 'Agree the "definition of done" (tested, reviewed, accessible, deployed).'],
      docs: [['Tickets from one feature', L('WISH-101  API: save / remove / list wishlist items         (backend, 3 pts)', 'WISH-102  ♡ button on ProductCard, optimistic update       (frontend, 2 pts)', 'WISH-103  Wishlist page: list, empty and error states     (frontend, 3 pts)', 'WISH-104  Log-in redirect that saves the item afterwards   (frontend, 2 pts)', 'WISH-105  E2E test: save → see on wishlist → add to cart  (QA, 2 pts)', 'WISH-106  Analytics events: wishlist_add, wishlist_remove (frontend, 1 pt)')],
        ['Definition of done', L('☐ Acceptance criteria met', '☐ Unit / component tests, CI green', '☐ Reviewed and approved', '☐ Accessible (keyboard, labels, contrast)', '☐ Works on mobile', '☐ Behind a feature flag or released', '☐ Docs / changelog updated')]],
      tools: 'Scrum (2-week sprints, story points) or Kanban (a continuous flow with WIP limits).' },
    { key: 'tech', icon: '📐', name: 'Tech design', title: 'Technical design', brief: 'For bigger work: write down the plan and agree the API with the backend before coding.',
      you: ['Write a short tech spec (RFC) for anything big or risky; get feedback.', 'Agree the API contract with the backend (endpoints, fields, errors).', 'Mock the API (MSW) so frontend and backend can work at the same time.'],
      docs: [['A tech spec (RFC) outline', L('# Wishlist: technical design', 'Context: why, links to the PRD and Figma', 'Goals / non-goals', 'Proposal: components, state (React Query cache), optimistic updates', 'API contract (agreed with backend):', '  GET    /api/wishlist            → 200 [{ productId, addedAt }]', '  POST   /api/wishlist { productId } → 201 | 409 already saved', '  DELETE /api/wishlist/:productId → 204', 'Alternatives considered: localStorage only (no sync across devices)', 'Risks: logged-out flow, rate limits', 'Rollout: feature flag "wishlist", 10% → 100%')],
        ['A decision record (ADR)', L('ADR 014: Use React Query for server state', 'Status: accepted', 'Decision: all API data goes through React Query; no copies in Redux.', 'Why: caching, refetching and optimistic updates built in.', 'Consequences: remove the old Redux "products" slice over the next sprints.')]],
      tools: 'Google Docs / Notion for RFCs, OpenAPI or a GraphQL schema for the contract, MSW for mocks.' },
    { key: 'build', icon: '🛠️', name: 'Build', title: 'Building it', brief: 'One branch per ticket, small commits, tests alongside the code, a daily update to the team.',
      you: ['Create a branch from main for the ticket; commit small, clear steps.', 'Write tests with the code; keep unfinished work behind a feature flag.', 'Stuck for 30–60 minutes? Ask, saying what you tried.'],
      docs: [['Branch and commits', L('git switch -c feat/WISH-102-heart-button', '', 'feat(wishlist): add ♡ button to ProductCard', 'feat(wishlist): optimistic save with rollback on error', 'test(wishlist): heart button saves and shows a toast', 'fix(wishlist): keep focus on the button after saving', '', '# "Conventional commits": type(scope): what changed')],
        ['A good stand-up update', L('Yesterday: finished the ♡ button and its tests (WISH-102), PR is open.', 'Today: the wishlist page (WISH-103).', 'Blocked: the 409 "already saved" error is not in the API yet; talking to Sam after stand-up.')]],
      tools: 'Git + GitHub / GitLab, your editor, Storybook, the team chat (Slack / Teams).' },
    { key: 'review', icon: '👀', name: 'Code review', title: 'Pull request and code review', brief: 'Open a small PR with a clear description; teammates review it; CI must be green before merging.',
      you: ['Keep PRs small (under ~400 lines) and about one thing.', 'Write what and why, how to test it, and add screenshots for UI.', 'Review others kindly and specifically; answer every comment on yours.'],
      docs: [['A pull request description', L('WISH-102: ♡ button on product cards', '', 'What: adds a "Save to wishlist" button with an optimistic update.', 'Why: first part of the wishlist feature (link to ticket).', '', 'How to test:', '1. Open any product list on the preview URL', '2. Click ♡: it fills at once and a toast appears', '3. With the network offline: it rolls back and shows an error', '', 'Screenshots: before / after, mobile + desktop', 'Notes: behind the "wishlist" flag; API errors mapped in useWishlist.ts')],
        ['Review comments that help', L('nit: this name could be clearer, e.g. isSaved → isInWishlist (optional)', 'question: what happens if the user double-clicks? Could it send two requests?', 'suggestion: this effect could be a derived value; no state needed (see the React docs)', 'praise: nice test for the rollback case 👍')]],
      tools: 'GitHub / GitLab PRs, CI checks, preview deploys, CODEOWNERS, squash-merge.' },
    { key: 'qa', icon: '🧪', name: 'Testing / QA', title: 'Testing and QA', brief: 'Automated tests run in CI; PM, designer and QA check the preview or staging; bugs become tickets.',
      you: ['Test your own work first, like a user, on mobile too.', 'Fix bugs found in QA quickly; add a test for each one.', 'Write bug reports anyone can reproduce.'],
      docs: [['A good bug report', L('Title: Wishlist ♡ stays filled after the save fails', 'Environment: staging, Chrome 131, iPhone 15 Safari', 'Steps: 1. Log in  2. Go offline in DevTools  3. Click ♡ on any product', 'Expected: the heart empties again and an error toast appears', 'Actual: the heart stays filled; nothing is saved (refresh shows it empty)', 'Evidence: screen recording, console error "Failed to fetch"', 'Severity: medium (data looks saved but is not)')]],
      tools: 'Vitest / Jest, Testing Library, Playwright / Cypress, BrowserStack for real devices, a staging environment.' },
    { key: 'release', icon: '🚀', name: 'Release', title: 'Release', brief: 'Merge to main deploys (or a scheduled release); turn the feature flag on step by step; tell people.',
      you: ['Know how your team releases: continuous deploy, or release trains on set days.', 'Roll out with the flag: team only → 10% → everyone, watching errors.', 'Write the release note / changelog and tell support what changed.'],
      docs: [['A release note', L('Release 2026.11.12', '✨ New: save products to your wishlist (♡ on every product card)', '🐛 Fixed: prices in euros showed two decimal separators', '⚡ Faster: product pages load 30% less JavaScript', 'Rollout: wishlist at 10% today, 100% on Thursday if error rates stay flat')]],
      tools: 'CI/CD (see 🚢 Deployment), feature flags (LaunchDarkly, Unleash, PostHog), a changelog.' },
    { key: 'after', icon: '📈', name: 'After release', title: 'After release: measure, fix, maintain', brief: 'Watch errors and usage, check the feature reached its goal, handle incidents, pay back tech debt.',
      you: ['Watch the error dashboard and analytics for your feature in the first days.', 'If production breaks: roll back first, investigate second, then write a blameless postmortem.', 'Keep a list of tech debt and fix some every sprint.'],
      docs: [['A blameless postmortem', L('Incident: checkout errors, 18:02–18:21 (19 min)', 'Impact: ~4% of checkouts failed', 'Timeline: 17:55 release · 18:02 alert fired · 18:09 rolled back · 18:21 recovered', 'Root cause: a renamed API field (total → totalCents) not handled in the summary', 'What went well: the alert fired fast; rollback took one click', 'Action items: contract test for the order API (owner: Ana) · type the API response with zod (owner: Raj)', 'No blame: we fix systems, not people.')]],
      tools: 'Sentry, analytics (GA4, Amplitude, PostHog), dashboards, on-call rotation, status page.' },
  ];

  const RHYTHM = [
    ['Daily stand-up', '15 minutes: yesterday, today, blockers. Not a status report to the boss.'],
    ['Refinement', 'The team reads upcoming tickets, asks questions, splits and estimates them.'],
    ['Sprint planning', 'The team picks what it can finish in the next sprint (usually 2 weeks).'],
    ['Sprint review / demo', 'Show what was built to the PM and stakeholders; get feedback.'],
    ['Retrospective', 'What went well, what did not, one or two things to change.'],
    ['1:1 with your manager', 'Growth, feedback, problems: your time, bring topics.'],
    ['Async updates', 'Written updates, docs and comments; many teams work across time zones.'],
  ];

  const STORY = [
    ['Monday', 'req', 'Refinement: you ask "what happens when logged out?"; the PM adds an acceptance criterion.'],
    ['Monday', 'design', 'You notice the empty wishlist state is missing in Figma; the designer adds it.'],
    ['Tuesday', 'plan', 'Sprint planning: the feature becomes 6 tickets; you take WISH-102 and WISH-103.'],
    ['Tuesday', 'tech', 'You and the backend agree the API contract in a short spec; you mock it with MSW.'],
    ['Wed–Thu', 'build', 'You build the ♡ button behind a feature flag, with tests; stand-up mentions one blocker (the 409 error).'],
    ['Thursday', 'review', 'PR #482: one reviewer asks about double-clicks; you add a guard and a test. Approved, merged.'],
    ['Friday', 'qa', 'QA finds the offline bug on staging; you fix it the same day, with a test for it.'],
    ['Next Tuesday', 'release', 'The flag goes to 10% of users; errors stay flat; Thursday 100%. Release note published.'],
    ['Two weeks later', 'after', '12% of shoppers use the wishlist; the retro notes "agree API errors earlier". You add a tech-debt ticket.'],
  ];

  const SITUATIONS = [
    { id: 'team-unclear', title: 'An unclear ticket', q: 'The ticket says "Add filters to the product list" but not which filters or how they behave.', a: 'ask',
      choices: [['ask', 'Ask the PM, write down the questions and the answers in the ticket, then build'], ['guess', 'Pick sensible filters yourself and build them'], ['wait', 'Wait until someone notices']],
      why: 'Guessing often means building the wrong thing twice. A few written questions (which filters, multi-select, kept in the URL?) save days, and the answers stay in the ticket for QA.' },
    { id: 'team-api', title: 'The API is not ready', q: 'The backend API for your feature will not be ready for a week.', a: 'mock',
      choices: [['mock', 'Agree the API contract now and build against a mock (MSW)'], ['wait', 'Work on something else until it is ready'], ['own', 'Write your own temporary backend']],
      why: 'With an agreed contract (endpoints, fields, errors) both sides work at the same time. A mock (MSW) lets you build and test every state, including errors.' },
    { id: 'team-bigpr', title: 'A 2,400-line pull request', q: 'Your PR for the new checkout has 2,400 changed lines.', a: 'split',
      choices: [['split', 'Split it into smaller PRs that can each be reviewed and merged (behind a flag)'], ['ask', 'Ask reviewers to take their time'], ['merge', 'Merge it, since the tests pass']],
      why: 'Big PRs get shallow reviews and hide bugs. Small PRs (one thing each) are reviewed properly and merged sooner; a feature flag keeps unfinished parts hidden.' },
    { id: 'team-disagree', title: 'You disagree with a review', q: 'A reviewer asks you to rewrite something you think is fine.', a: 'discuss',
      choices: [['discuss', 'Reply with your reasons, ask for theirs, and agree; involve a third person if stuck'], ['ignore', 'Resolve the comment without answering'], ['obey', 'Always change it, even if you think it is wrong']],
      why: 'Reviews are a conversation about the code, not about you. Explain the trade-off; if you still disagree, a quick call or the tech lead decides. Agree on rules once (lint, docs) to avoid repeating it.' },
    { id: 'team-stuck', title: 'Stuck for hours', q: 'You have been stuck on a bug for three hours.', a: 'help',
      choices: [['help', 'Ask for help, saying what you tried and what you found'], ['more', 'Keep trying alone: asking looks weak'], ['skip', 'Move the ticket back and pick another']],
      why: 'Teams want you to ask: a colleague may know the answer in five minutes. Time-box (30–60 minutes), then ask with context: what you expected, what happens, what you tried.' },
    { id: 'team-estimate', title: '"How long will it take?"', q: 'The PM asks how long a feature you have never built before will take.', a: 'range',
      choices: [['range', 'Break it into parts, give a range, and name the unknowns (or ask for a short spike)'], ['exact', 'Give one exact number to look confident'], ['refuse', 'Say it cannot be estimated']],
      why: 'Estimates are for planning, not promises. Splitting the work shows where the risk is; a range ("3–5 days, 2 days more if the payment API needs changes") is honest and useful.' },
    { id: 'team-bug', title: '"Checkout is broken!"', q: 'Support forwards a message: "Checkout is broken!!"', a: 'repro',
      choices: [['repro', 'Reproduce it: get the steps, browser, account and time; check errors and logs; write a ticket'], ['guess', 'Start changing the checkout code right away'], ['close', 'Reply that it works for you']],
      why: 'You cannot fix what you cannot reproduce. Collect facts (steps, device, time, error monitoring, network), confirm, then fix with a test.' },
    { id: 'team-incident', title: 'Errors right after your release', q: 'Ten minutes after your release, checkout errors jump.', a: 'rollback',
      choices: [['rollback', 'Roll back first, tell the team in the incident channel, then investigate'], ['fix', 'Find and fix the bug on the spot, then deploy again'], ['wait', 'Wait to see if it settles']],
      why: 'Restore service first: a rollback takes a minute; a hot fix under pressure often adds bugs. Communicate, then find the cause, and write a blameless postmortem.' },
    { id: 'team-design', title: 'Missing design states', q: 'The Figma design has no loading, empty or error states.', a: 'askdesign',
      choices: [['askdesign', 'Point it out to the designer and agree on them (or propose a simple version)'], ['invent', 'Invent them yourself without telling anyone'], ['skip', 'Skip them: they are rare']],
      why: 'Every screen has these states and users see them often (slow networks, new accounts). Raising it early keeps the product consistent and avoids rework.' },
    { id: 'team-debt', title: 'Messy code next to your change', q: 'You find confusing, messy code next to the change you are making.', a: 'small',
      choices: [['small', 'Make a small, safe cleanup (or a separate PR / ticket for bigger ones)'], ['rewrite', 'Rewrite the whole module in your feature PR'], ['ignore', 'Never touch it']],
      why: 'Leave code a bit better than you found it, but keep your PR focused. Big refactors go in their own PR or ticket, with tests, so reviews stay clear.' },
  ];

  // the situations as 🏋️ Practice tasks
  if (window.WebLab) window.WebLab.extend('team', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...SITUATIONS.map(x => ({
    id: x.id, cat: 'Working in a team', kind: 'rule', solver: 'team', icon: '🏢', kindLabel: 'what would you do?',
    title: x.title, ask: 'What would you do?', scene: 'A normal week in a product team.',
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'What would a calm, experienced teammate do first?', why: `${esc(x.why)} See the 🏢 How teams work tab.`, scenario: { q: x.q, a: x.a, why: x.why },
  })));

  const STAGES = [
    { key: 'overview', name: 'Overview', title: 'How a project moves through a team', say: 'Every company names things differently, but the flow is almost always this.' },
    ...PHASES.map(p => ({ key: p.key, name: p.name, title: p.title, say: p.brief, phase: p })),
    { key: 'rhythm', name: 'Team rhythm', title: 'The team rhythm', say: 'The regular meetings and habits that keep a team in sync.' },
    { key: 'story', name: 'One feature', title: 'One feature, start to finish', say: 'A "Wishlist" feature, followed through every phase over about three weeks.' },
    { key: 'quiz', name: 'What would you do?', title: 'What would you do?', say: 'Everyday situations. Pick an answer to see why.' },
  ];
  const UI = { stage: 0, detail: false, answers: {} };
  const phaseView = p => `<div class="pr-you"><b>What you do</b><ul>${p.you.map(y => `<li>${esc(y)}</li>`).join('')}</ul></div>
    <p class="pr-tools"><b>Tools:</b> ${esc(p.tools)}</p>
    ${UI.detail ? p.docs.map(([t, d]) => `<p><b>📄 ${esc(t)}</b></p><pre class="px-src">${esc(d)}</pre>`).join('') : `<p class="cl-note">"+ Show details" shows a real example: ${p.docs.map(d => esc(d[0].toLowerCase())).join(', ')}.</p>`}`;
  const VIEWS = {
    overview: () => `<div class="dp-chain">${PHASES.map((p, i) => `<span data-prgo="${i + 1}">${p.icon} ${esc(p.name)}</span>`).join('<i>→</i>')}</div>
      <p>It is a loop: what you learn after a release becomes the next requirements. Small teams blur the steps together; big companies add more checks. Click a step to open it.</p>
      <p><b>Who is who</b></p><table class="iv-diff db-words"><tbody>${ROLES.map(([r, d]) => `<tr><td><b>${esc(r)}</b></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table>`,
    rhythm: () => `<table class="iv-diff db-words"><tbody>${RHYTHM.map(([r, d]) => `<tr><td><b>${esc(r)}</b></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table>
      <p><b>Scrum or Kanban?</b> Scrum works in fixed sprints with planning and a review at the end; Kanban is a continuous flow of tickets with a limit on work in progress. Many teams mix them.</p>
      ${UI.detail ? '<p class="db-how">Healthy signs: small tickets that finish in days, few things in progress at once, blockers raised the same day, retros that lead to real changes, and documentation that new people can follow in their first week.</p>' : ''}`,
    story: () => `<ol class="pr-story">${STORY.map(([day, k, text]) => { const p = PHASES.find(x => x.key === k); return `<li><span class="pr-day">${esc(day)}</span><span class="pr-tag" data-prgo="${PHASES.indexOf(p) + 1}">${p.icon} ${esc(p.name)}</span><span>${esc(text)}</span></li>`; }).join('')}</ol>`,
    quiz: () => SITUATIONS.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a, label = k => x.choices.find(c => c[0] === k)[1];
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-prq="${i}" data-pra="${k}">${esc(l)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Good call' : `❌ Better: <b>${esc(label(x.a))}</b>`}. ${esc(x.why)}</p>` : ''}</div>`;
    }).join(''),
  };

  function ensure() {
    let m = $('prLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'prLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'How teams work');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-prclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🏢 How teams work</h2><span class="cl-note">the real process of a project, from an idea to production and after</span></div>
      <div class="px-rail" id="prRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="prTitle"></h3><p class="px-say" id="prSay"></p><button class="btn small dp-detail" id="prDetail" data-prdetail></button><div id="prBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="prPrev">◀ Back</button><button class="btn small primary" id="prNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('prRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-prstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('prTitle').textContent = `${UI.stage + 1} · ${s.phase ? s.phase.icon + ' ' : ''}${s.title}`;
    $('prSay').textContent = s.say;
    $('prBody').innerHTML = s.phase ? phaseView(s.phase) : VIEWS[s.key]();
    $('prDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('prDetail').classList.toggle('hidden', ['overview', 'story', 'quiz'].includes(s.key));
    $('prPrev').disabled = UI.stage === 0;
    $('prNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('prLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnProcess') || t.closest('[data-fmprocess]')) { open(); return; }
    if (!$('prLab') || $('prLab').classList.contains('hidden')) return;
    const st = t.closest('[data-prstage], [data-prgo]');
    if (st) { UI.stage = +(st.dataset.prstage || st.dataset.prgo); draw(); return; }
    const a = t.closest('[data-prq]');
    if (a) { UI.answers[+a.dataset.prq] = a.dataset.pra; const box = $('prBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    if (t.closest('[data-prdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#prPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#prNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-prclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('prLab') && !$('prLab').classList.contains('hidden')) close(); });

  window.ProcessLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, stages: STAGES, phases: PHASES, situations: SITUATIONS };
})();

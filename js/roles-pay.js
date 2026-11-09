/*
 * JS Engine Lab — 💰 Roles & pay: frontend job titles and what each one does, the people around you,
 * responsibilities at each level, how titles map between companies, pay ranges (India + abroad),
 * the extra pay on top of salary (bonus, joining bonus, ESOPs, RSUs…), raises and career paths.
 * Brief by default; "+ Show details" adds more columns and notes.
 * The "What would you do?" situations are also 🏋️ Practice tasks (topic "Roles & pay").
 * Pay numbers are rough 2025–26 ranges: always check Levels.fyi, AmbitionBox and Glassdoor for the exact role and city.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // [title, what you do, who hires it, (details) day to day / skills]
  const ROLES = [
    ['Frontend Developer / Engineer', 'Builds the screens users see, usually in React, with TypeScript, CSS and API calls.', 'Every kind of company', 'Day: tickets from the sprint, PRs and reviews, talking to design and backend. Skills: JS/TS, React, CSS, testing, performance.'],
    ['Software Engineer (SDE), frontend focus', 'The same work, with a general title; interviews include DSA.', 'Big tech, GCCs, top product companies', 'Often expected to touch some backend too. The title on your offer may just say "SDE 2".'],
    ['UI Developer', 'Turns designs into pixel-perfect, responsive HTML/CSS/JS; less app logic.', 'IT services, agencies, e-commerce', 'Strong CSS, accessibility, cross-browser work. A good start; grow towards a full frontend engineer role.'],
    ['Full-stack Developer', 'The UI plus the API and database behind it (Node / Next.js, SQL).', 'Startups, agencies, product companies', 'You own a feature end to end. Common stacks: React + Node/Express or Next.js + Postgres/Prisma.'],
    ['Mobile Developer (React Native / Flutter)', 'Builds Android and iOS apps; React Native reuses your React skills.', 'B2C apps, fintech, startups', 'Plus app-store releases, native modules, offline storage, push notifications.'],
    ['Design Engineer / UI Engineer', 'Sits between design and code: polished interactions, animation, prototypes.', 'Product companies, design-led startups', 'Figma fluency, motion (CSS / Framer Motion), very strong CSS; often builds the design system.'],
    ['Design Systems Engineer', 'Builds and maintains the shared component library and design tokens.', 'Large product companies, GCCs', 'Storybook, accessibility, versioning and documentation; many teams are your users.'],
    ['Frontend Platform / Infra Engineer', 'Makes other frontend developers faster: build tools, monorepo, CI, shared libraries.', 'Large companies with many frontend teams', 'Vite / webpack, Turborepo / Nx, lint rules, codemods, bundle and build-time budgets.'],
    ['Web Performance Engineer', 'Makes pages load and respond faster; owns Core Web Vitals.', 'E-commerce, media, large consumer sites', 'Lighthouse, field data (RUM), bundle analysis, image / font strategy, caching.'],
    ['Accessibility Engineer / Specialist', 'Makes products usable with screen readers and keyboards; audits and fixes.', 'Banks, government, large product companies', 'WCAG, ARIA, screen reader testing (NVDA, VoiceOver); trains other teams.'],
    ['SDET / QA Automation (frontend)', 'Writes automated UI tests and test frameworks.', 'IT services, GCCs, product companies', 'Playwright / Cypress, CI pipelines, flaky-test fixing. Many move into development later.'],
    ['CMS / e-commerce Developer', 'Builds sites on WordPress, Shopify, headless CMSs.', 'Agencies, D2C brands', 'Themes, plugins / apps, Liquid or PHP templates, performance and SEO.'],
    ['Creative Developer', 'Interactive, animated sites: WebGL, Three.js, GSAP.', 'Creative agencies, studios, brands', 'A strong portfolio matters more than DSA here.'],
    ['Developer Advocate (DevRel)', 'Writes docs, demos, talks and content for developers using a product.', 'Developer-tool and cloud companies', 'Coding + writing + speaking; usually after a few years as an engineer.'],
    ['Solutions / Sales Engineer', 'Shows the product to customers and helps them integrate it.', 'SaaS and developer-tool companies', 'Part technical, part customer-facing; often a bonus tied to sales.'],
    ['Frontend Architect', 'Decides the frontend architecture and standards across teams.', 'IT services, GCCs, large companies', 'Usually 10+ years; similar to a Staff / Principal engineer in product companies.'],
    ['Engineering Manager (EM)', 'Leads a team of engineers: hiring, growth, delivery.', 'Everywhere', 'Codes less or not at all. A different job, not a promotion of the same job.'],
  ];

  // [role, what they own, what you give them / get from them]
  const TEAM = [
    ['Product Manager (PM)', 'What to build and why; priorities; the requirements doc (PRD).', 'Ask them about the goal and edge cases; tell them early about effort and risks.'],
    ['Designer (UX / UI)', 'User flows and screens in Figma; the design system look.', 'Ask for empty, loading and error states and mobile layouts; tell them what is hard or slow to build.'],
    ['Backend Engineer', 'APIs, data and business logic on the server.', 'Agree on the API shape (fields, errors, pagination) before both start; share mocks.'],
    ['QA / Test Engineer', 'Test plans, finding bugs before users do.', 'Give them clear build notes and test data; reproduce their bugs quickly.'],
    ['DevOps / SRE / Platform', 'Pipelines, servers, monitoring, uptime.', 'Ask for env vars, domains and alerts; tell them about new services or traffic spikes.'],
    ['Tech Lead', 'Technical direction of the team; reviews designs and code.', 'Bring them design questions early; follow the agreed patterns.'],
    ['Engineering Manager', 'Your growth, the team\'s delivery and process; your appraisal.', 'Weekly 1:1s: share progress, blockers and what you want to learn.'],
    ['Scrum Master / TPM', 'Timelines, sprint process, coordination between teams.', 'Keep tickets and estimates up to date; raise blockers in stand-up.'],
    ['Data Analyst', 'Metrics, dashboards, A/B test results.', 'Add the analytics events they need; ask them whether your feature helped.'],
    ['Security team', 'Reviews, vulnerability fixes, compliance.', 'Follow their review for auth, payments and personal data; fix reported issues quickly.'],
    ['Support / Customer success', 'Talks to users and reports their problems.', 'Ask for exact steps, screenshots and the user\'s browser; tell them when a fix ships.'],
  ];

  // [level, years, scope, you own, (details) people, how you are judged]
  const LEVELS = [
    ['Intern', 'student', 'A small, well-defined task with a mentor.', 'Finishing it and learning fast.', 'You ask lots of questions (that is expected).', 'Learning speed, finishing, attitude → a pre-placement offer (PPO).'],
    ['SDE 1 / Junior', '0–2 years', 'Clear tickets in one part of the app.', 'Your code, its tests, fixing review comments.', 'Ask for help early; learn the codebase.', 'Delivering on time, code quality, how quickly you need less help.'],
    ['SDE 2 / Mid', '2–5 years', 'Whole features, end to end.', 'Breaking a feature into tasks, estimates, talking to design / backend / QA.', 'Review others\' PRs; help interns and juniors.', 'Shipping features on your own with few bugs; good reviews.'],
    ['Senior / SDE 3', '5–8 years', 'A product area or a multi-sprint project.', 'Technical design docs, choosing the approach, handling unclear requirements, incidents.', 'Mentor 1–3 people; unblock the team.', 'Impact on the area, quality of decisions, making the team better.'],
    ['Staff / Lead', '8+ years', 'Problems across several teams (performance, design system, migrations).', 'Direction: RFCs, standards, aligning teams and managers.', 'Mentor seniors; influence without authority.', 'Org-level impact; things that would not happen without you.'],
    ['Principal / Architect', '12+ years', 'Company-wide technical strategy.', 'Long-term technical bets and the biggest risks.', 'Advise directors and VPs.', 'Company-level outcomes.'],
    ['Engineering Manager', 'usually 7+ years', 'A team of 5–10 engineers.', 'Hiring, 1:1s, appraisals, delivery, process.', 'Your job is the people.', 'Team output, health and retention.'],
    ['Director / Head of Engineering', '12+ years', 'Several teams and managers.', 'Budgets, org design, hiring plans.', 'Managers report to you.', 'Department results.'],
  ];

  // approximate title mapping (check Levels.fyi for the exact company)
  const TITLES_HEAD = ['Level', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Indian product (e.g. Flipkart)', 'IT services (e.g. Infosys)'];
  const TITLES = [
    ['Entry', 'L3 (SWE II)', 'SDE I (L4)', 'SDE (59–60)', 'E3', 'SDE 1', 'Systems Engineer'],
    ['Mid', 'L4 (SWE III)', 'SDE II (L5)', 'SDE II (61–62)', 'E4', 'SDE 2', 'Senior Systems Engineer / Technology Analyst'],
    ['Senior', 'L5 (Senior)', 'SDE III (L6)', 'Senior (63–64)', 'E5', 'SDE 3 / Senior', 'Technology Lead'],
    ['Staff', 'L6 (Staff)', 'Principal (L7)', 'Principal (65–67)', 'E6', 'Staff / Architect', 'Technical Architect'],
    ['Above', 'L7 Senior Staff, L8 Principal', 'Senior Principal (L8)', 'Partner (68+)', 'E7+', 'Principal Architect', 'Senior Architect / delivery head'],
  ];

  // rough yearly total pay in India, LPA (lakhs per annum), 2025–26
  const PAY_HEAD = ['Level', 'IT services', 'GCCs / mid-size product', 'Top product / big tech (incl. stock)'];
  const PAY = [
    ['Fresher (0–1 yr)', '3.5–7', '8–18', '18–45'],
    ['SDE 2 (2–5 yrs)', '6–14', '15–35', '30–70'],
    ['Senior (5–8 yrs)', '12–22', '30–55', '50–100'],
    ['Staff / Lead (8–12 yrs)', '18–35', '45–80', '80–150'],
    ['Engineering Manager', '25–45', '50–90', '80–160'],
  ];
  const PAY_NOTES = [
    'Mass-hiring fresher packages at large IT services are about 3.5–4.5 LPA; their "digital / specialist" tracks pay about 6.5–11 LPA.',
    'Bengaluru usually pays the most, then Hyderabad, Pune, Gurugram / NCR, Chennai and Mumbai. Remote roles often pay by city band.',
    'Skill matters more than years: a strong SDE 2 at a top company can earn more than a weak "lead" elsewhere.',
    'The top range includes stock (RSUs). Stock moves with the share price, so the same offer can be worth more or less each year.',
  ];
  // rough yearly pay abroad for a mid-level frontend engineer (before tax)
  const ABROAD = [
    ['USA', '$120k–200k base; big tech total (with stock) often $200k–350k', 'The H-1B visa is a lottery, and since September 2025 most new H-1B petitions carry a $100,000 employer fee (under legal challenge), so fewer companies sponsor; an L-1 transfer after a year with the same company is another route'],
    ['UK (London)', '£50k–85k', 'Skilled Worker visa; higher cost of living'],
    ['Germany', '€55k–80k', 'EU Blue Card; Berlin and Munich have the most jobs'],
    ['Netherlands', '€50k–80k', 'Highly Skilled Migrant visa; a tax break for skilled newcomers (the "30% ruling", becoming 27% from 2027)'],
    ['Ireland (Dublin)', '€55k–85k', 'Many big-tech EU offices; Critical Skills permit'],
    ['UAE (Dubai)', 'AED 18k–35k a month, no income tax', 'Employer sponsors the visa; check housing and school costs'],
    ['Singapore', 'SGD 70k–130k', 'Employment Pass with a minimum salary; very competitive'],
    ['Canada', 'CAD 85k–130k', 'Express Entry (permanent residence) is a common route'],
    ['Australia', 'AUD 100k–150k', 'Skilled visas; Sydney and Melbourne'],
    ['Remote for a foreign company, from India', '$25k–70k (often as a contractor)', 'No PF, gratuity or insurance unless an Employer of Record (Deel, Remote) hires you; you handle tax'],
  ];

  // [name, what it is, typical, watch out]
  const EXTRA = [
    ['Variable / performance bonus', 'Part of CTC paid yearly or quarterly, depending on your rating and company results.', '5–20% of CTC; more at senior levels', 'Do not plan your budget on 100% of it.'],
    ['Joining (sign-on) bonus', 'A one-time amount for joining, often to cover a bonus you lose by leaving.', '₹50,000 to a few lakhs; larger at big tech', 'Usually paid back (clawback) if you leave within 12 months.'],
    ['Notice-period buyout', 'Your new company pays your old one so you can leave before the notice ends.', 'Up to your remaining notice pay', 'Get it in the offer letter; the old company must agree to release you early.'],
    ['Relocation', 'Money or help to move cities or countries: flights, hotel, movers.', 'A one-time amount or 1–4 weeks of hotel', 'Often also has a clawback period.'],
    ['ESOPs (stock options)', 'The right to buy company shares later at a fixed low price (startups).', 'Vest over 4 years, with a 1-year cliff', 'Worth money only on a buyback, IPO or acquisition; taxed when you exercise and when you sell.'],
    ['RSUs (stock units)', 'Free company shares that vest over time (listed companies).', 'Vest over 3–4 years; some are back-loaded', 'Taxed as salary when they vest; their value moves with the share price.'],
    ['Retention bonus', 'Paid to stay for a period (after an acquisition or a counter-offer).', 'Varies', 'Clawback if you leave early.'],
    ['Referral bonus', 'Paid when someone you refer joins and stays a few months.', 'Often ₹20,000–₹1,00,000+ in tech', 'Refer people you can honestly recommend.'],
    ['On-call / shift allowance', 'Extra pay for being on call or working night shifts.', 'A fixed amount per week or per shift', 'Software engineers in India usually get comp-off, not overtime pay.'],
    ['Tax-saving benefits', 'Meal cards, employer NPS, LTA, phone / internet reimbursement.', 'Part of CTC', 'They do not add money, but they reduce your tax.'],
    ['Insurance and wellness', 'Health cover (sometimes parents too), term life, gym, mental health apps.', 'Part of CTC or free', 'Compare the cover amount and whether parents are included.'],
    ['Learning budget', 'Money for courses, books and conferences.', '₹10,000–₹1,00,000 a year at some companies', 'Use it: few people do.'],
    ['Awards and prizes', 'Spot awards, hackathon prizes, patent bonuses.', 'Small, occasional', 'They show up in appraisals too.'],
  ];

  // [what, typical, (details) note]
  const RAISES = [
    ['Annual hike', 'about 5–12% (IT services lower, product companies higher; top ratings more)', 'Given after appraisal, usually in April–July. Ask what rating you need for a higher hike.'],
    ['Promotion hike', 'often 10–30%', 'Comes with the next level. Prepare a promotion document with your manager.'],
    ['Switching jobs', 'commonly 20–50%; more for strong candidates', 'The biggest jumps usually come from switching, especially in the first 5 years.'],
    ['Counter-offer', 'your company matches an outside offer', 'It rarely fixes why you wanted to leave. Never use a fake offer to get one.'],
    ['Market correction', 'some companies raise pay for people paid below the market', 'Ask your manager if new joiners are paid more than you for the same level.'],
  ];
  const COMPARE_OFFERS = ['Compare fixed pay first: it is the only guaranteed part.', 'Then add the bonus at a realistic level (not 100%).', 'Value ESOPs at zero until there is a buyback or an IPO; value RSUs at today\'s price, and remember they change.', 'Look at each year separately: joining bonuses and back-loaded RSUs make years 1 and 2 look different.', 'Then the non-money parts: level, learning, team, manager, location, notice period, stability.'];

  // [path, what it looks like]
  const PATHS = [
    ['Individual contributor (IC)', 'SDE 1 → SDE 2 → Senior → Staff → Principal. You stay hands-on, and your scope grows. Pay at Staff+ matches managers.'],
    ['Manager', 'Senior → Engineering Manager → Senior EM → Director → VP. Your work becomes people, hiring and delivery. You can switch back to IC.'],
    ['Specialist', 'Go deep: performance, accessibility, design systems, frontend platform, security. Fewer people, high demand.'],
    ['Wider engineer', 'Full-stack, mobile (React Native), or backend: more roles open to you.'],
    ['Beside engineering', 'Product management, DevRel, solutions engineering, technical writing, design engineering.'],
    ['On your own', 'Freelancing, contracting for foreign companies, building products, founding a startup.'],
  ];

  const SITUATIONS = [
    { id: 'rp-esop', title: 'Cash or ESOPs?', q: 'Offer A: 18 LPA fixed. Offer B: 15 LPA fixed + ESOPs "worth 10 lakhs". Which number do you compare first?', a: 'fixed', choices: [['fixed', 'Fixed pay: 18 vs 15; count ESOPs as a maybe'], ['total', '18 vs 25: B is clearly better'], ['esop', 'Always take the ESOPs']], why: 'ESOPs turn into money only on a buyback, IPO or acquisition, and many startups never get there. Compare the guaranteed pay first, then treat ESOPs as a possible upside.' },
    { id: 'rp-clawback', title: 'Leaving after a joining bonus', q: 'You got a ₹2 lakh joining bonus and, 8 months later, a better offer.', a: 'check', choices: [['check', 'Read the clawback clause: you may have to pay some or all of it back'], ['keep', 'It is yours, it was paid already'], ['ignore', 'Just leave; they will not ask']], why: 'Joining bonuses usually have a 12-month clawback, sometimes prorated. Ask the new company to cover it in its own joining bonus.' },
    { id: 'rp-variable', title: 'Planning with variable pay', q: 'Your CTC is 20 LPA, with 20% variable. What do you plan your monthly budget on?', a: 'fixed', choices: [['fixed', 'The fixed 16 LPA, minus PF and tax'], ['ctc', '20 LPA divided by 12'], ['max', '20 LPA, plus a hike']], why: 'Variable pay depends on your rating and company results and is often paid once a year. Your monthly in-hand comes from fixed pay after PF, professional tax and income tax.' },
    { id: 'rp-title', title: 'A bigger title or a bigger company?', q: '"Lead Frontend Engineer" at a 10-person startup, or "SDE 2" at a large product company, for similar pay.', a: 'scope', choices: [['scope', 'Compare the real scope, learning and pay; titles do not transfer'], ['title', 'Take the bigger title, always'], ['brand', 'Take the bigger brand, always']], why: 'Your next employer levels you by what you actually did, not the title. A small-startup "lead" may be an SDE 2 elsewhere; both can be good choices depending on what you will learn.' },
    { id: 'rp-role', title: 'Which role fits?', q: 'You love CSS, animation and polishing details in Figma designs. Which role suits you best?', a: 'design', choices: [['design', 'Design Engineer / UI Engineer'], ['platform', 'Frontend Platform Engineer'], ['sdet', 'SDET / QA Automation']], why: 'Design engineers sit between design and code: interactions, motion, prototypes and often the design system. Platform engineers focus on build tools and CI.' },
    { id: 'rp-sde2', title: 'What an SDE 2 does', q: 'As an SDE 2, your manager gives you "add a wishlist to the shop", with no tickets yet.', a: 'own', choices: [['own', 'Clarify with PM and design, agree the API with backend, split it into tasks, estimate, build'], ['wait', 'Wait until someone writes the tickets'], ['code', 'Start coding the UI straight away']], why: 'From SDE 2 you are expected to own a feature end to end, including breaking it down and coordinating with others. Doing that well is what gets you to Senior.' },
    { id: 'rp-counter', title: 'A counter-offer', q: 'You resigned for a better offer; your manager now offers to match the money.', a: 'why', choices: [['why', 'Decide on why you wanted to leave; money rarely fixes that'], ['accept', 'Accept: same company, more money'], ['bid', 'Go back to the new company for more, again and again']], why: 'If you left for growth, the manager or the work, a counter-offer does not change that. If it was only pay and they fix it fairly, staying can be fine; just do not use offers as a bidding war.' },
    { id: 'rp-rsu', title: 'Back-loaded RSUs', q: 'A big-tech offer has RSUs vesting 5%, 15%, 40%, 40% over 4 years, plus joining bonuses in years 1 and 2.', a: 'yearly', choices: [['yearly', 'Work out the total for each year separately'], ['avg', 'Divide the 4-year total by 4'], ['ignore', 'Ignore the stock']], why: 'With back-loaded vesting, years 1–2 get little stock, which the joining bonuses make up for. If you might leave after 2 years, the yearly view shows what you really get.' },
    { id: 'rp-notice', title: 'Long notice period', q: 'You have a 90-day notice period; the new company wants you in 30 days.', a: 'buyout', choices: [['buyout', 'Ask for early release and a notice buyout, in writing'], ['abscond', 'Stop going to work after 30 days'], ['decline', 'Decline the offer']], why: 'Ask your manager for early release (offer a handover plan) and ask the new company to buy out the rest. Leaving without a release can block your relieving letter and background checks.' },
    { id: 'rp-contract', title: 'A remote contract offer', q: 'A US company offers you $40,000 a year as a contractor from India. How do you compare it with a 30 LPA job?', a: 'costs', choices: [['costs', 'Subtract what the job gives that a contract does not: PF, gratuity, insurance, paid leave; then compare'], ['convert', 'Convert the dollars and take the bigger number'], ['never', 'Contracts are always worse']], why: 'As a contractor you pay for your own insurance, get no PF or gratuity, may get no paid leave, and handle tax and invoicing. It can still be a great deal; compare after those costs.' },
  ];

  if (window.WebLab) window.WebLab.extend('roles', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...SITUATIONS.map(x => ({
    id: x.id, cat: 'Roles & pay', kind: 'rule', solver: 'roles', icon: '💰', kindLabel: 'what would you do?',
    title: x.title, ask: 'What would you do?', scene: 'Offers, pay and roles in a real career.',
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'Which part of the pay is guaranteed, and what is the real scope?', why: `${esc(x.why)} See the 💰 Roles & pay tab.`, scenario: { q: x.q, a: x.a, why: x.why },
  })));

  const STAGES = [
    { key: 'roles', name: 'Job titles', title: 'Frontend job titles and what they do', say: 'The same skills appear under many titles. Search job sites for all of them.' },
    { key: 'team', name: 'People around you', title: 'The people you work with', say: 'Who owns what in a product team, and what to give and ask each of them.' },
    { key: 'levels', name: 'Responsibilities', title: 'Responsibilities at each level', say: 'What changes is your scope: from a ticket, to a feature, to an area, to the whole company.' },
    { key: 'titles', name: 'Titles across companies', title: 'How titles map between companies', say: 'The same level has different names at different companies. Approximate; check Levels.fyi for a specific company.' },
    { key: 'pay', name: 'Pay ranges', title: 'Pay ranges', say: 'Rough yearly totals for frontend roles in 2025–26. The spread is wide, so check Levels.fyi, AmbitionBox and Glassdoor for your role and city.' },
    { key: 'extra', name: 'Extra pay', title: 'Extra pay on top of salary', say: 'Bonuses, stock and benefits: what each one is worth, and the catch.' },
    { key: 'raises', name: 'Raises & offers', title: 'Raises, switching and comparing offers', say: 'How pay grows, and how to compare two offers fairly.' },
    { key: 'paths', name: 'Career paths', title: 'Career paths', say: 'Where a frontend career can go.' },
    { key: 'quiz', name: 'What would you do?', title: 'What would you do?', say: 'Real offer and role situations. Pick an answer to see why.' },
  ];
  const UI = { stage: 0, detail: false, answers: {} };
  const table = (head, rows) => `<table class="iv-diff db-words"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i ? esc(c) : `<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const more = what => UI.detail ? '' : `<p class="cl-note">"+ Show details" adds ${what}.</p>`;
  const VIEWS = {
    roles: () => table(UI.detail ? ['Title', 'What you do', 'Who hires', 'Day to day / skills'] : ['Title', 'What you do', 'Who hires'], ROLES.map(r => UI.detail ? r : r.slice(0, 3))) + more('the day-to-day work and skills for each title'),
    team: () => table(UI.detail ? ['Role', 'What they own', 'Working with them'] : ['Role', 'What they own'], TEAM.map(r => UI.detail ? r : r.slice(0, 2))) + more('what to give and ask each of them'),
    levels: () => table(UI.detail ? ['Level', 'Experience', 'Scope', 'You own', 'People', 'Judged on'] : ['Level', 'Experience', 'Scope', 'You own'], LEVELS.map(r => UI.detail ? r : r.slice(0, 4))) + more('the people side and how each level is judged') + '<p class="cl-note">Appraisals and promotions: see 💼 Corporate life.</p>',
    titles: () => table(TITLES_HEAD, TITLES) + '<p class="cl-note">Moving between companies, you are levelled by your interview and past scope, not your old title.</p>',
    pay: () => `<p><b>🇮🇳 India: yearly total, in LPA</b></p>${table(PAY_HEAD, PAY)}
      <ul>${(UI.detail ? PAY_NOTES : PAY_NOTES.slice(0, 1)).map(n => `<li>${esc(n)}</li>`).join('')}</ul>
      ${UI.detail ? `<p><b>✈️ Abroad: a mid-level frontend engineer, yearly, before tax</b></p>${table(['Where', 'Pay', 'Notes'], ABROAD)}<p class="cl-note">Higher pay abroad comes with higher tax, rent and living costs. Compare what you can save, not just the salary.</p>` : more('city notes and pay abroad (USA, UK, Germany, UAE, Singapore and more)')}
      <p class="cl-note">From CTC to monthly in-hand: see 💼 Corporate life → Salary & offers.</p>`,
    extra: () => table(UI.detail ? ['What', 'What it is', 'Typical', 'Watch out'] : ['What', 'What it is', 'Typical'], EXTRA.map(r => UI.detail ? r : r.slice(0, 3))) + more('the catch for each one (clawbacks, tax, vesting)'),
    raises: () => table(UI.detail ? ['What', 'Typical', 'Note'] : ['What', 'Typical'], RAISES.map(r => UI.detail ? r : r.slice(0, 2))) + `<p><b>Comparing two offers</b></p><ol>${COMPARE_OFFERS.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` + more('a note on each kind of raise'),
    paths: () => `<div class="db-grid">${PATHS.map(([p, d]) => `<div class="db-card"><div class="db-h"><b>${esc(p)}</b></div><p>${esc(d)}</p></div>`).join('')}</div>`,
    quiz: () => SITUATIONS.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a, label = k => x.choices.find(c => c[0] === k)[1];
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-rpq="${i}" data-rpa="${k}">${esc(l)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Right' : `❌ Better: <b>${esc(label(x.a))}</b>`}. ${esc(x.why)}</p>` : ''}</div>`;
    }).join(''),
  };
  const HAS_DETAIL = ['roles', 'team', 'levels', 'pay', 'extra', 'raises'];

  function ensure() {
    let m = $('rpLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'rpLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Roles and pay');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-rpclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">💰 Roles & pay</h2><span class="cl-note">job titles, responsibilities, salary and the extras</span></div>
      <div class="px-rail" id="rpRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="rpTitle"></h3><p class="px-say" id="rpSay"></p><button class="btn small dp-detail" id="rpDetail" data-rpdetail></button><div id="rpBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="rpPrev">◀ Back</button><button class="btn small primary" id="rpNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('rpRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-rpstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('rpTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('rpSay').textContent = s.say;
    $('rpBody').innerHTML = VIEWS[s.key]();
    $('rpDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('rpDetail').classList.toggle('hidden', !HAS_DETAIL.includes(s.key));
    $('rpPrev').disabled = UI.stage === 0;
    $('rpNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('rpLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnRoles') || t.closest('[data-fmroles]')) { open(); return; }
    if (!$('rpLab') || $('rpLab').classList.contains('hidden')) return;
    const st = t.closest('[data-rpstage]');
    if (st) { UI.stage = +st.dataset.rpstage; draw(); return; }
    const a = t.closest('[data-rpq]');
    if (a) { UI.answers[+a.dataset.rpq] = a.dataset.rpa; const box = $('rpBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    if (t.closest('[data-rpdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#rpPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#rpNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-rpclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('rpLab') && !$('rpLab').classList.contains('hidden')) close(); });

  window.RolesPayLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, situations: SITUATIONS, stages: STAGES, roles: ROLES, extra: EXTRA };
})();

/*
 * JS Engine Lab — 💸 Earn more (top-bar tab): ways a frontend developer can earn more — in the job,
 * by switching, freelancing, building products, content and teaching — plus small everyday tips,
 * traps and scams to avoid, and a 90-day plan for each stage of a career.
 * Money figures are rough examples, not promises. Built with makeTopicTab (topic-tab.js);
 * situations are also 🏋️ Practice tasks (topic "Earning more").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  // [way, what it is, first money, effort, (details) best for]
  const WAYS = [
    ['Grow in your job', 'Promotions, bigger scope, a better rating', 'months', 'medium', 'Everyone: it compounds and needs no extra hours.'],
    ['Switch jobs well', 'Move to a company or level that pays more', '1–3 months', 'medium (interviews)', 'Usually the biggest jump in your first 5–8 years.'],
    ['Work remotely for a foreign company', 'Get paid closer to global rates from India', '3–6 months', 'high (strong skills, English, overlap hours)', '3+ years of experience with a solid portfolio.'],
    ['Freelancing', 'Build sites and apps for clients', 'weeks', 'medium–high (finding clients)', 'Students, people between jobs, or evenings, if your contract allows it.'],
    ['Sell digital products', 'Templates, UI kits, extensions, plugins, small SaaS', 'months', 'high upfront, then low', 'People who like building and can market a little.'],
    ['Content and teaching', 'YouTube, blogs, newsletters, courses, mentoring', 'months to a year', 'high and steady', 'People who enjoy explaining; it also builds your reputation.'],
    ['Paid side work in tech', 'Interview panels, paid tutorials, bug bounties, hackathon prizes', 'weeks', 'low–medium', 'Experienced developers with spare hours.'],
  ];

  const IN_JOB = [
    ['Negotiate every offer', 'Politely, with a researched range. One email can add more than a whole year\'s raise.'],
    ['Time your switch', 'Leave after your bonus is paid and your RSUs vest, not a week before. Check joining-bonus clawbacks.'],
    ['Learn what pays a premium', 'TypeScript, Next.js, performance, accessibility, testing, design systems, and some backend / cloud. Full-stack and "frontend + AI features" roles pay more than "UI only".'],
    ['Move up the company ladder', 'IT services → GCC / product company → top product company is the usual path to higher pay (see 💰 Roles & pay).'],
    ['Keep a brag document', 'Write down every win with numbers ("cut load time 40%"). It makes appraisals, promotions and interviews much easier.'],
    ['Ask for a market correction', 'If new joiners at your level are paid more, show the data to your manager calmly.'],
    ['Use what your company pays for', 'Learning budget, certifications, conference tickets, referral bonuses, internet and phone reimbursements.'],
    ['Pay less tax, legally', 'Pick the right regime, ask for employer NPS, claim HRA if you use the old regime (see 🧾 Tax & money).'],
  ];

  const FREELANCE = [
    ['First, check your contract', 'Many employment contracts forbid other paid work ("moonlighting") or claim what you build. Get written permission, never use company time, laptop or code, and never work for a competitor.'],
    ['Pick a niche', 'Easier to sell than "I do websites": Shopify stores, WordPress speed fixes, landing pages for startups, React dashboards, Webflow sites, accessibility or performance audits.'],
    ['Where clients come from', 'People you know and their businesses, LinkedIn, local businesses, agencies that need extra hands (white-label work), Upwork, Contra, Toptal (after a strict test).'],
    ['Price it', 'Start with small fixed-price projects; move to weekly or value-based pricing as you get reviews. Charge foreign clients in USD / EUR. Raise prices every few clients.'],
    ['Protect yourself', 'A written scope, 30–50% upfront, payments per milestone, a set number of revisions, and new requests quoted separately. Hand over the code after the final payment.'],
    ['Turn one-off work into steady income', 'Offer a monthly maintenance plan: updates, backups, small changes, uptime checks.'],
  ];

  // [idea, who pays, how you build it]
  const PRODUCTS = [
    ['Website templates', 'Startups, freelancers, agencies', 'Next.js / Astro + Tailwind templates; sell on your own site, Gumroad or marketplaces.'],
    ['UI kits and component libraries', 'Developers and designers', 'React components with good docs and a Figma file; a free version and a paid "pro" version.'],
    ['Webflow / Framer templates', 'Non-developers who want nice sites', 'Sold on the Webflow and Framer marketplaces.'],
    ['Browser extensions', 'Users with a specific daily annoyance', 'Small, focused Chrome extensions; earn through a paid tier.'],
    ['Shopify apps and themes', 'Online store owners', 'Shopify\'s app store brings the buyers; store owners are used to paying monthly.'],
    ['WordPress plugins', 'Millions of WordPress sites', 'A free plugin in the directory with a paid pro version.'],
    ['Micro-SaaS', 'Small businesses with one clear problem', 'Invoice generators, booking pages, form builders, status pages: one feature, done well, with a monthly subscription.'],
    ['Figma plugins', 'Designers', 'Built with web technologies; some charge for pro features.'],
    ['Digital downloads', 'Learners and job seekers', 'Interview-prep notes, cheat sheets, Notion templates, starter kits.'],
  ];
  const SELL = 'Taking payments: Razorpay or Cashfree for Indian customers; Lemon Squeezy, Paddle or Gumroad for worldwide sales (they also handle foreign sales tax for you). Stripe in India is invite-only.';

  const CONTENT = [
    ['YouTube and short videos', 'Ad revenue, sponsorships, and it brings course buyers and clients. Slow to start; consistency matters most.'],
    ['Blog or newsletter', 'Sponsorships and affiliate links; a newsletter is an audience you own.'],
    ['Courses and cohorts', 'Udemy, your own site, or live cohort classes. Teaching what you just learned well is valuable.'],
    ['Mentoring and mock interviews', 'Paid 1:1 calls on platforms like Topmate, or through communities and bootcamps.'],
    ['Paid technical writing', 'Some developer-tool companies pay for tutorials about their products. A good blog is your sample.'],
    ['Interview panels', 'Some hiring platforms pay experienced engineers per interview they conduct.'],
    ['Bug bounties and hackathons', 'HackerOne, Bugcrowd, company bounty programmes; hackathon prizes. Also great for your resume.'],
    ['GitHub Sponsors', 'If you maintain a useful open-source project, people and companies can sponsor you.'],
  ];

  const TIPS = [
    'Refer good friends to your company: referral bonuses are often ₹20,000–₹1,00,000+.',
    'Claim every reimbursement (internet, phone, travel, books). Small amounts add up over a year.',
    'Use your learning budget: courses and certifications that raise your next salary.',
    'Ask HR about employer NPS and the right tax regime: it is free money in tax savings.',
    'Keep 2–3 months of salary saved so you can wait for a good offer instead of taking the first one.',
    'Update LinkedIn every quarter: recruiters bring better-paid roles to you.',
    'Never accept the first number: "Is there flexibility on the fixed pay?" costs nothing to ask.',
    'For freelance work, ask every happy client for a testimonial and a referral.',
    'Reuse your own code: a starter template and your own components make every new project faster and more profitable.',
    'Package a service with a fixed price ("Speed audit + fixes: ₹X") instead of selling hours.',
    'Raise your freelance rates every year, and for every new client.',
    'Send invoices on time, with automatic reminders; chasing payments is lost earning time.',
    'Learn to explain value in money: "this change could lift conversions" earns more than "I refactored it".',
    'Invest each raise automatically (raise your SIP) before your spending catches up.',
  ];

  const TRAPS = [
    ['"Pay to get a job"', 'Real companies never charge for hiring, training or "security deposits". It is always a scam.'],
    ['Task-based earning apps', '"Like videos / rate products and earn" schemes pay small amounts first, then ask you to "invest". You lose the money.'],
    ['Get-rich trading', 'F&O tips, crypto "signals" and trading courses: SEBI found 93% of individual F&O traders lost money (FY22–FY24).'],
    ['Unpaid "test projects"', 'A short test is normal; building a full feature or site for free is unpaid work. Offer a paid trial instead.'],
    ['Breaking your contract', 'Side work against your contract, or using company code or time, can cost you your job and your relieving letter.'],
    ['No advance, no contract', 'Clients who refuse any upfront payment or written scope are the ones who do not pay at the end.'],
    ['"Passive income" courses', 'People selling courses about making money from courses. Learn from people who actually ship products.'],
    ['Pirated assets', 'Nulled themes, pirated fonts and stock images in client work can lead to legal claims against you.'],
  ];

  // real, public stories: [who / what, what happened, the lesson, source]
  const STORIES = [
    ['Tailwind UI (Adam Wathan)', 'A paid set of components and templates built on the free Tailwind CSS framework. It reportedly passed $2 million in sales in 2020. In January 2026, Tailwind Labs laid off 3 of its 4 engineers: AI tools answered developers\' questions, so fewer visited the docs where the paid products were shown, and revenue fell about 80%.', 'A free tool with a paid product on top can earn a lot, but it depends on how buyers find you. Do not rely on one channel.', 'Adam Wathan on GitHub; devclass, eWeek (Jan 2026)'],
    ['ShipFast (Marc Lou)', 'A Next.js starter kit (login, payments, emails ready) sold to people building SaaS. About $40,000 in its first month (2023) and roughly $1 million or more in total by public estimates; monthly sales later fell as the trend cooled.', 'Developers pay to save time. Selling to developers works, but trends fade: keep building new things.', 'Marc Lou\'s public revenue posts; Indie Hackers; TrustMRR'],
    ['Photo AI (Pieter Levels)', 'A solo-built AI photo app. He reported about $105,000 a month in revenue in 2026, on a famously simple stack (PHP and jQuery), after many earlier projects that failed.', 'Ship many small things quickly; the tech stack matters far less than solving a problem people pay for.', 'levels.io posts; Indie Hackers'],
    ['Anand Prakash (Bengaluru)', 'In 2016 he found that Facebook\'s beta sites did not limit password-reset guesses, so a 6-digit code could be brute-forced. Facebook fixed it the next day and paid him a $15,000 bug bounty.', 'Security knowledge pays, and frontend developers see auth flows every day. Report responsibly through official programmes.', 'Threatpost, SecurityWeek, Deccan Chronicle (Mar 2016)'],
    ['Wipro and Swiggy (2022)', 'Wipro dismissed about 300 employees found working for competitors on the side. Around the same time, Swiggy announced a policy allowing side work with approval.', 'Side income is fine where your company allows it. Get approval in writing and never work for a competitor.', 'Business Today, HR Katha (Sep 2022)'],
    ['SEBI study (2024)', 'About 93% of individual F&O traders lost money between FY22 and FY24, on average about ₹2 lakh each; only about 1% made more than ₹1 lakh after costs.', 'Trading is not a side income for almost everyone. Your skills are the better investment.', 'SEBI press release, Sep 2024'],
    ['Indian developer-educators', 'Akshay Saini (Namaste JavaScript on YouTube, then paid courses at NamasteDev), Hitesh Choudhary (LearnCodeOnline, later acquired by iNeuron; now Chai aur Code), Tanay Pratap (left Microsoft to start the neoG Camp bootcamp), Harkirat Singh (100xDevs cohorts).', 'Free, consistent teaching builds an audience; paid courses and cohorts came after. Most started while working full-time.', 'their own channels and sites'],
    ['Josh W. Comeau', 'A frontend developer whose free blog posts on CSS and React grew an audience for his paid courses, CSS for JavaScript Developers and The Joy of React.', 'Deep, friendly explanations of one topic you know well can become a business.', 'joshwcomeau.com'],
    ['Excalidraw', 'A free, open-source whiteboard app, built with React, that many developers use. Its team earns from Excalidraw+, a paid version with team features.', 'Open source can be the free product that brings paying teams ("open core").', 'excalidraw.com'],
  ];

  // made-up but realistic scenarios, with the maths worked out
  const EXAMPLES = [
    ['The switch (2 years in)', 'Riya earns 6 LPA at an IT services company. Over 4 months she learns TypeScript and Next.js, builds 2 portfolio projects, and switches to a product startup at 14 LPA.', 'Staying with 8% yearly hikes, she would reach about 7.6 LPA in 3 years. The switch adds 8 LPA at once, and every later hike builds on 14, not 6.'],
    ['Weekend freelancing (with approval)', 'Arjun builds one 5-page website a month for local clinics at ₹30,000 each, and each clinic then pays ₹2,000 a month for maintenance.', 'Year 1: 12 sites = ₹3.6 lakh, plus maintenance that grows from 1 to 12 clients = 78 client-months × ₹2,000 = ₹1.56 lakh. About ₹5.2 lakh before tax, and year 2 starts with ₹24,000 a month of maintenance already coming in.'],
    ['A template product', 'Neha sells a Next.js SaaS starter for $49. If it sells 30 copies a month, that is $1,470 (about ₹1.3 lakh) before platform fees (around 5–10%) and tax.', 'Many templates sell only a few copies. Test interest first (a landing page, a waitlist, a free version) before spending months on it.'],
    ['Mock interviews', 'Kiran, a senior developer, runs 6 one-hour mock interviews a month at ₹1,500 each on a mentoring platform.', '₹9,000 a month, minus the platform fee, for 6 hours. Small money, but it sharpens his own interviewing and builds his name.'],
    ['Remote for a foreign company', 'Sameer, with 5 years of experience and 24 LPA in Pune, gets a remote contract at $45,000 a year.', 'At about ₹88 per dollar (check today\'s rate) that is roughly ₹40 lakh. Subtract health insurance, no PF or gratuity, unpaid leave, and tax (often under the presumptive scheme on 50%). Still usually well ahead, if the contract is stable.'],
    ['Referral bonuses', 'Priya refers two friends who join her company, each with a ₹50,000 referral bonus.', '₹1 lakh for a few messages, and two friends on her team. Ask HR for your company\'s referral policy.'],
  ];

  // freelance rate calculator: what to charge per hour to reach a yearly goal
  const RATE = { target: 1200000, hours: 20, weeks: 44, costs: 100000 };
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const hourly = r => (r.hours > 0 && r.weeks > 0 ? (r.target + r.costs) / (r.hours * r.weeks) : 0);
  function rateHTML() {
    const h = hourly(RATE);
    return `<table class="iv-diff db-words"><tbody>
      <tr><td><b>Your hourly rate</b></td><td id="emHourly" class="tx-better">${inr(h)}</td></tr>
      <tr><td><b>A day</b> (6 billable hours)</td><td>${inr(h * 6)}</td></tr>
      <tr><td><b>A 40-hour project</b></td><td>${inr(h * 40)}</td></tr>
      <tr><td><b>In US dollars</b> (at about ₹88)</td><td>$${Math.round(h / 88)} an hour</td></tr></tbody></table>`;
  }
  document.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.emin;
    if (!k) return;
    RATE[k] = Math.max(0, Number(e.target.value) || 0);
    const out = document.getElementById('emRateOut');
    if (out) out.innerHTML = rateHTML();
  });

  const PLAN = [
    ['Student / fresher', 'Week 1–4: build 2 strong portfolio projects. Week 5–8: one small paid project (a local business site) or an internship. Week 9–12: apply widely with referrals; learn to negotiate your first offer.'],
    ['1–3 years', 'Month 1: brag document + market research (Levels.fyi, AmbitionBox). Month 2: fill one skill gap (TypeScript, testing, Next.js). Month 3: interview outside, even just to learn your market value; ask for a raise or switch.'],
    ['3+ years', 'Month 1: decide your direction (Senior / Staff, management, or remote for a foreign company). Month 2: one public proof (an open-source PR, a talk, a write-up). Month 3: apply to remote and top-tier roles, or start one productised side service if your contract allows.'],
  ];

  window.makeTopicTab({
    id: 'em', title: '💸 Earn more', sub: 'ways to earn more as a developer, and small tips that add up',
    button: 'btnEarn', map: 'earn', api: 'EarnLab', cat: 'Earning more', icon: '💸', solver: 'earn',
    scene: 'Growing your income as a developer.', hint: 'Which option earns the most for the risk and time, and is it allowed?',
    stages: [
      { key: 'ways', name: 'All the ways', title: 'All the ways to earn more', say: 'Your job is usually the biggest lever. Side income comes on top, and only where your contract allows it.', detail: true,
        view: (d, H) => H.table(d ? ['Way', 'What it is', 'First money', 'Effort', 'Best for'] : ['Way', 'What it is', 'First money', 'Effort'], WAYS.map(r => d ? r : r.slice(0, 4))) + (d ? '' : H.more('who each way suits')) },
      { key: 'stories', name: 'Real stories', title: 'Real stories, and what they teach', say: 'Public stories of developers earning (and losing) money. The numbers are what was publicly reported; the lessons are what matters.', detail: true,
        view: (d, H) => `<div class="db-grid">${STORIES.map(([who, what, lesson, src]) => `<div class="db-card"><div class="db-h"><b>${H.esc(who)}</b></div><p>${H.esc(what)}</p><p><b>Lesson:</b> ${H.esc(lesson)}</p>${d ? `<p class="cl-note">Source: ${H.esc(src)}</p>` : ''}</div>`).join('')}</div>` + (d ? '' : H.more('the source of each story')) },
      { key: 'examples', name: 'Worked examples', title: 'Worked examples, with the maths', say: 'Made-up but realistic scenarios (not real people), so you can see how the numbers add up.',
        view: (d, H) => `<div class="db-grid">${EXAMPLES.map(([t, story, maths]) => `<div class="db-card"><div class="db-h"><b>${H.esc(t)}</b></div><p>${H.esc(story)}</p><p class="cl-note">🧮 ${H.esc(maths)}</p></div>`).join('')}</div>` },
      { key: 'rate', name: 'Rate calculator', title: 'What should you charge per hour?', say: 'Work backwards from the yearly amount you want. Most freelancers bill only 50–70% of their working hours: the rest goes to finding clients, emails and admin.',
        view: (d, H) => `<div class="tx-calc">
            <label>Yearly amount you want (₹) <input type="number" class="cl-search" data-emin="target" value="${RATE.target}" min="0" step="50000"></label>
            <label>Billable hours a week <input type="number" class="cl-search" data-emin="hours" value="${RATE.hours}" min="1" step="1"></label>
            <label>Working weeks a year (leave, holidays, sick days out) <input type="number" class="cl-search" data-emin="weeks" value="${RATE.weeks}" min="1" step="1"></label>
            <label>Yearly costs (₹: laptop, software, insurance, internet, accountant) <input type="number" class="cl-search" data-emin="costs" value="${RATE.costs}" min="0" step="10000"></label></div>
          <div id="emRateOut">${rateHTML()}</div>
          ${H.note('Hourly rate = (yearly amount + costs) ÷ (billable hours a week × working weeks). Quote clients a fixed price for the whole project, worked out from your hours, rather than an hourly rate where you can.')}` },
      { key: 'job', name: 'In your job', title: 'Earn more in your job', say: 'Strategies that need no side work at all.',
        view: (d, H) => H.cards(IN_JOB) },
      { key: 'freelance', name: 'Freelancing', title: 'Freelancing as a frontend developer', say: 'Paid client work, done safely. The essentials are below; the full guide has everything from your first client to a real freelance business.',
        view: (d, H) => `<p><button class="btn small primary" data-fmfreelance>🧑‍💻 Open the full Freelancing guide</button></p>` + H.cards(FREELANCE) },
      { key: 'products', name: 'Product ideas', title: 'Products you can build and sell', say: 'Build once, sell many times. Most products earn little at first; the ones that work solve one clear problem for people who already pay for tools.',
        view: (d, H) => H.table(['Idea', 'Who pays', 'How'], PRODUCTS) + H.note(SELL) },
      { key: 'content', name: 'Content & side work', title: 'Content, teaching and side work', say: 'Slower to pay, but it also builds your name, which brings jobs and clients.',
        view: (d, H) => H.cards(CONTENT) },
      { key: 'tips', name: 'Small tips', title: 'Small tips that add up', say: 'Quick wins you can use this month.',
        view: (d, H) => H.list(TIPS) },
      { key: 'traps', name: 'Traps & scams', title: 'Traps and scams to avoid', say: 'If an offer sounds too easy, it is usually a way to take your money.',
        view: (d, H) => H.cards(TRAPS) },
      { key: 'plan', name: '90-day plan', title: 'A 90-day plan for your stage', say: 'Pick the row that fits you and start this week.',
        view: (d, H) => H.cards(PLAN) + H.note('Money figures in this tab are rough examples, not promises. General information, not financial advice.') },
    ],
    situations: [
      { id: 'em-moonlight', title: 'A freelance offer while employed', q: 'You work full-time at a GCC, and a friend offers you a paid weekend project.', a: 'check', choices: [['check', 'Read your contract and get written permission first'], ['quiet', 'Do it quietly: weekends are your own time'], ['laptop', 'Do it on your work laptop: it is faster']], why: 'Many contracts forbid other paid work or claim what you build. Some companies have fired employees for moonlighting. With written permission, your own laptop and your own time, it can be fine.' },
      { id: 'em-first-offer', title: 'The first offer number', q: 'A company offers 14 LPA; your research says the range for the role is 14–18 LPA.', a: 'ask', choices: [['ask', 'Thank them and ask politely for 17 LPA, with your reasons'], ['accept', 'Accept at once so they do not change their mind'], ['demand', 'Say you will not join below 25 LPA']], why: 'Offers usually have room. A polite, researched counter rarely loses an offer, and every future raise builds on this number.' },
      { id: 'em-switch-timing', title: 'When to switch', q: 'You have a new offer. Your yearly bonus is paid in 5 weeks and an RSU batch vests in 6.', a: 'time', choices: [['time', 'Ask the new company for a later joining date, or a joining bonus to cover it'], ['now', 'Resign today'], ['ignore', 'The bonus does not matter']], why: 'Bonuses and vesting stop when you leave. A later joining date or a joining bonus that covers what you lose is a normal request.' },
      { id: 'em-pricing', title: 'Pricing your first client', q: 'A local business asks for a 5-page website. You have never freelanced before.', a: 'fixed', choices: [['fixed', 'A fixed price with a written scope, 50% upfront, 2 rounds of changes'], ['hourly', 'Bill by the hour with no estimate'], ['free', 'Do it free for the portfolio, with no agreement']], why: 'A fixed price with clear scope protects both sides, and the upfront payment shows the client is serious. Free work without an agreement often grows endlessly.' },
      { id: 'em-scope', title: 'The client wants more', q: 'Halfway through, the client asks for a blog and a login area that were not in the scope.', a: 'quote', choices: [['quote', 'Say yes, as a separate quote and timeline'], ['free', 'Add them for free to keep the client happy'], ['refuse', 'Refuse and stop the project']], why: 'New features are new work. A friendly "happy to, here is the quote" keeps the client and your earnings. Doing everything free trains clients to expect it.' },
      { id: 'em-job-fee', title: 'A fee to get hired', q: 'A "recruiter" offers you a remote job at a US company if you pay ₹15,000 for training and onboarding.', a: 'scam', choices: [['scam', 'It is a scam: real employers never charge you'], ['pay', 'Pay: the salary is worth it'], ['half', 'Offer to pay half']], why: 'Genuine companies and recruiters are paid by the employer, never by you. Report the profile and block it.' },
      { id: 'em-product', title: 'Your first product', q: 'You want to try selling a digital product. Which start is best?', a: 'small', choices: [['small', 'A small template or starter kit for a problem you know, launched in 2–4 weeks'], ['big', 'A full SaaS with 20 features before showing anyone'], ['copy', 'A copy of a popular app']], why: 'A small product shows quickly whether people will pay, and teaches you payments, marketing and support. Big projects built alone often never launch.' },
      { id: 'em-trading', title: 'A "sure" trading tip', q: 'A friend says an F&O trading group doubles his salary every month and asks you to join for ₹5,000.', a: 'avoid', choices: [['avoid', 'Skip it: most F&O traders lose money; invest steadily instead'], ['try', 'Try with one month\'s salary'], ['borrow', 'Take a loan to start bigger']], why: 'SEBI found that 93% of individual F&O traders lost money between FY22 and FY24, about ₹2 lakh each on average. Paid "tip" groups make money from fees. Steady investing and growing your skills earn far more over time.' },
    ],
  });
  window.EarnLab.hourly = hourly;
})();

/*
 * JS Engine Lab — 🧑‍💻 Freelancing, from scratch to pro: the levels, setting up, a portfolio that sells,
 * where clients come from, ready-to-use outreach scripts, discovery calls and proposals, pricing,
 * contracts and getting paid, delivering like a pro, keeping clients and growing, hard situations,
 * and admin / tax. India-first, with notes for foreign clients.
 * Prices are rough examples only. Built with makeTopicTab (topic-tab.js); situations are also
 * 🏋️ Practice tasks (topic "Freelancing").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  // [level, goal, what you do, (details) you are ready for the next level when…]
  const LEVELS = [
    ['0 · Prepare', 'Be sellable', 'Pick a service, build 2–3 sample projects, set up a simple portfolio site, check your employment contract.', 'You can build and deploy a complete small site on your own, start to finish.'],
    ['1 · First clients', 'Get paid 1–3 times', 'Tell everyone you know, approach local businesses, take small fixed-price projects.', 'You have 2 happy clients and a testimonial.'],
    ['2 · Repeat work', 'Steady monthly income', 'Maintenance plans, referrals from clients, agencies that need extra hands.', 'Most new work comes from referrals and repeat clients, not cold outreach.'],
    ['3 · Specialist', 'Higher prices', 'Pick a niche (e.g. Shopify for D2C brands, Next.js for startups, speed fixes), write about it, raise your rates.', 'Clients come to you for one specific thing, and you turn some work down.'],
    ['4 · Pro', 'A business, not a gig', 'Retainers, fixed-price "productised" services, foreign clients, other freelancers working with you.', 'Your income no longer depends only on your own hours.'],
  ];

  const SKILLS = [
    ['Must-have skills', 'Responsive HTML / CSS, JavaScript, one framework (React / Next.js), Git, deploying (Vercel, Netlify, a VPS), domains, DNS, SSL and business email.'],
    ['Skills clients pay for', 'A CMS (WordPress, Shopify or Webflow) so clients can edit content, forms, payments (Razorpay / Stripe), basic SEO, Google Analytics, page speed, WhatsApp / booking integrations.'],
    ['Skills that raise your price', 'UI / UX sense (or partner with a designer), copy that sells, accessibility, performance, and explaining things to non-technical people.'],
    ['Tools', 'Figma (read designs), a project board (Trello / Notion), an invoicing tool (Zoho Invoice, Refrens), a time tracker (Toggl Track, Clockify), Google Workspace or Zoho Mail for a professional email.'],
    ['Paperwork (India)', 'PAN, a separate bank account for freelance income, a simple contract template, GST registration once you need it, and written permission from your employer if you have a job.'],
  ];

  const PORTFOLIO = [
    ['3 case studies, not 20 screenshots', 'For each: the client\'s problem, what you did, the result with a number ("bookings up 30%", "loads in 1.8 s instead of 7 s"), screenshots and a live link.'],
    ['No clients yet?', 'Build 2–3 realistic sample projects for a kind of business you want to serve (a clinic, a café, a SaaS landing page), clearly labelled as concept work. Or do one discounted project for a non-profit or a friend\'s business in exchange for a testimonial.'],
    ['A site that speaks to one kind of client', '"Fast websites for clinics in Bengaluru" sells better than "Full-stack developer". Say who you help, what you deliver, and show a clear "Book a call" button.'],
    ['Show prices (or a starting price)', '"Projects from ₹25,000" filters out people with no budget and saves you hours of calls.'],
    ['Testimonials and logos', 'A short quote with the client\'s name, photo and business is worth more than any skill list. Ask for one at every launch.'],
  ];

  // [channel, how, good for, tip]
  const CHANNELS = [
    ['People you know', 'Tell friends, family, ex-colleagues and college groups exactly what you do and for whom.', 'Your first 1–3 clients, almost always', 'A one-line message works: "I now build websites for small businesses; if anyone you know needs one, I\'d love an intro."'],
    ['Local businesses', 'Clinics, gyms, cafés, coaching centres, CA firms, shops: find ones on Google Maps with no website or a slow, outdated one.', 'Steady small projects plus maintenance', 'Visit or call with one concrete improvement, not a generic pitch.'],
    ['Cold outreach (email / LinkedIn)', 'Find businesses or startups with a clear problem on their site; send a short, specific message, ideally with a 2-minute video audit.', 'Better-paying clients, startups, foreign clients', 'Personal and specific beats volume. 10 researched messages beat 200 copy-paste ones.'],
    ['Agencies (white-label)', 'Design, marketing and dev agencies need extra developers when busy; you build, they sell under their name.', 'Steady work without selling to end clients', 'Pitch "reliable Figma-to-code in X days" with 3 example builds.'],
    ['Marketplaces', 'Upwork, Fiverr, Freelancer, Truelancer; vetted networks like Toptal and Arc after a strict test.', 'Foreign clients, building early reviews', 'Competition is heavy on price. Niche profiles, fast and specific proposals, and great first reviews matter most.'],
    ['Communities', 'Indie Hackers, relevant Reddit and Discord communities, startup and founder groups, local meetups.', 'Startups and founders', 'Help first: answer questions and share what you know; work follows.'],
    ['Content', 'Write or post about your niche ("How we made a clinic site load in 1 second").', 'Inbound clients over time', 'Slow to start, but clients who find you this way already trust you.'],
    ['Partners', 'Designers, SEO and marketing freelancers who need a developer to build what they sell.', 'Referrals both ways', 'Agree on a referral fee or simply send work back to each other.'],
    ['Past clients', 'Check in after 2–3 months: "How is the site doing? Anything you need?"', 'Repeat work and referrals', 'The cheapest client to win is one who already trusts you.'],
  ];

  const SCRIPTS = [
    ['Cold email to a local business', `Subject: A quick idea for {Business}'s website

Hi {Name},

I was looking for a {clinic} in {area} and found {Business}.
On a phone your site takes about 9 seconds to load, and the
"Book appointment" button is hidden at the bottom of the page.
Most of your visitors are probably on their phones.

I'm a web developer in {city}. I recorded a 2-minute video
showing three quick fixes: {link}

If it's useful, I'd be happy to talk for 15 minutes this week.
If not, no worries: the tips are yours to keep.

{Your name}
{Portfolio link} · {Phone}`],
    ['Marketplace proposal (Upwork-style)', `Hi {Name},

You need {their goal in one line, in your own words}.

I recently built {a similar project} ({link}), where {a result}.

How I'd approach yours:
1. {first step}
2. {second step}
3. {third step}

One question: {a smart question that shows you read the post}

I can start on {date}; the timeline would be about {N} days.

{Your name}`],
    ['Follow-up (4–5 days later)', `Hi {Name}, just bringing this back to the top of your inbox.
Happy to answer any questions about {project}.
If now isn't the right time, no problem at all.`],
    ['LinkedIn message to an agency', `Hi {Name}, I'm a React / Next.js developer who helps agencies
with overflow work: accessible, pixel-accurate builds from Figma,
usually within {X} days. Three recent builds: {links}.
If you ever need an extra pair of hands, I'd be glad to help.`],
    ['Weekly update to a client', `Hi {Name}, here's this week's update for {project}:

Done: {what was finished}
Next week: {what's coming}
Need from you: {content, logins, feedback by a date}
Risks: {anything that could delay us, or "none"}
Preview: {staging link}`],
    ['Asking for a testimonial and referral', `Hi {Name}, I really enjoyed building {project} with you.
Would you write 2–3 lines about working together that I can
share on my site? And if you know anyone else who needs
{a website / app}, I'd be grateful for an introduction.`],
  ];

  const DISCOVERY = [
    'What is the goal? (more bookings, sales, leads, credibility, an internal tool)',
    'Who are the users, and what should they do on the site?',
    'Is there a deadline, and why that date?',
    'What budget range have you planned? (ask it plainly; it saves both of you time)',
    'Who decides, and who gives feedback?',
    'Are the content, photos and logo ready? Who writes the text?',
    'What exists already: domain, hosting, old site, logins, tools (CRM, payments, booking)?',
    'Who will update it after launch? (decides between a CMS and plain code)',
  ];
  const PROPOSAL = [
    'Their problem and goal, in their words',
    'What you will deliver, and what is NOT included',
    'Timeline with milestones (design → build → review → launch)',
    'Price with 2–3 options (basic / recommended / premium)',
    'Payment terms (e.g. 50% to start, 25% at review, 25% before launch)',
    'What you need from them, and by when',
    'How to say yes (sign, pay the advance, book the kickoff call)',
  ];
  const ESTIMATE = 'To estimate: split the project into small tasks, estimate hours for each, add 30% for meetings, changes and surprises, then price the total. Track your actual hours to estimate better next time.';

  // [model, how it works, best when]
  const PRICING = [
    ['Fixed price', 'One price for a clearly defined scope.', 'Websites, landing pages, clear projects. Most clients prefer it.'],
    ['Hourly / daily', 'Pay for time, tracked and reported.', 'Unclear or ongoing work, bug fixing, joining a team.'],
    ['Retainer', 'A fixed monthly fee for an agreed number of hours or tasks.', 'Maintenance and ongoing improvements; steady income.'],
    ['Productised service', 'A fixed package with a fixed price ("Speed audit + fixes: ₹20,000").', 'Repeatable work in your niche; easy to sell and deliver.'],
    ['Value-based', 'Price based on what the result is worth to the client.', 'When the result is clearly valuable (a store, a lead-generating site).'],
  ];
  // very rough Indian market ranges; vary a lot by city, client and quality
  const PRICES = [
    ['Landing page', '₹10,000–50,000'],
    ['5–8 page business website (WordPress / Webflow / Next.js)', '₹20,000–80,000'],
    ['Online store (Shopify / WooCommerce)', '₹40,000–2,00,000'],
    ['Custom React / Next.js web app', '₹1.5 lakh–10 lakh+'],
    ['Monthly maintenance plan', '₹2,000–15,000 a month'],
    ['Foreign clients on marketplaces', 'often $15–50 an hour early on; $60–120+ with experience and a niche'],
  ];

  const CONTRACT = [
    ['Scope and deliverables', 'Exactly what is included (pages, features, devices) and what is not.'],
    ['Timeline', 'Milestones, and that delays in the client\'s content or feedback move the dates.'],
    ['Revisions', 'How many rounds of changes are included (e.g. 2), and the rate for more.'],
    ['Change requests', 'New features are quoted separately before work starts.'],
    ['Payment schedule', 'Advance, milestones, final payment before launch or handover; a late-payment fee.'],
    ['Ownership (IP)', 'The client owns the code and design after full payment. You may show it in your portfolio (unless agreed otherwise).'],
    ['Third-party costs', 'Domain, hosting, themes, plugins, fonts and paid APIs are paid by the client, in the client\'s name.'],
    ['Support period', 'Free bug fixes for e.g. 30 days after launch; after that, a maintenance plan or hourly rate.'],
    ['Confidentiality', 'You keep their data and logins private.'],
    ['Ending early', 'Either side can stop with notice; work done so far is paid for.'],
  ];
  const PAYMENTS = [
    'Never start without an advance (30–50%). It confirms the client is serious.',
    'India: Razorpay payment links, UPI or bank transfer, with a proper invoice (with GST once registered).',
    'Foreign clients: Wise, Skydo, Payoneer or bank transfer (compare fees and exchange-rate markups); keep the FIRC / e-FIRA for every payment.',
    'Marketplaces hold payments in escrow per milestone: always use milestones.',
    'Hand over final files, admin logins and the domain transfer after the final payment.',
    'Save 25–30% of every payment for tax and slow months.',
  ];

  const DELIVERY = [
    ['Kickoff', 'A call to confirm goals, scope, timeline, contacts and the list of what you need from them.'],
    ['Shared plan', 'A simple board or document with milestones that the client can see.'],
    ['Weekly updates', 'Every Friday: done, next, needed from you, risks, preview link (script in "Scripts").'],
    ['Preview link', 'A staging URL (e.g. Vercel preview) so the client sees progress, not just promises.'],
    ['Feedback in one place', 'One document or tool for all comments, so nothing is lost in WhatsApp messages.'],
    ['Launch checklist', 'Domain and SSL, mobile check, forms and payments tested, analytics, SEO titles and descriptions, favicon, speed check, backups, basic accessibility, 404 page.'],
    ['Handover', 'Admin logins, a short guide or a 5-minute video on updating content, where everything is hosted, and invoices for third-party services.'],
    ['After launch', '30 days of bug fixes, then offer a maintenance plan. Ask for a testimonial and a referral.'],
  ];
  const GROW = [
    ['Maintenance plans', 'Three tiers, e.g. Basic (updates and backups), Standard (+ 2 hours of changes), Premium (+ priority support and monthly report). Steady income that grows with every launch.'],
    ['Niche down', 'The same kind of project for the same kind of client makes you faster, better and more expensive.'],
    ['Productise', 'Turn repeated work into a fixed package with a fixed price and a clear page that sells it.'],
    ['Raise your rates', 'For every new client, and yearly for existing ones (with notice). Busy for 2 months straight means you are too cheap.'],
    ['Upsell', 'Speed improvements, SEO, new features, a booking system, a blog: what helps the client\'s business next.'],
    ['Work with others', 'Partner with a designer; pass smaller work to other freelancers and review it; that is how small agencies start.'],
    ['Foreign clients', 'Once your process and portfolio are strong: higher rates in USD / EUR, and time-zone overlap as a selling point.'],
  ];

  // [problem, what to do]
  const PROBLEMS = [
    ['Scope creep', '"Happy to add that! Since it\'s outside our agreed scope, here\'s a quote and the new timeline." Never just quietly add work.'],
    ['Late payment', 'Day 1: a friendly reminder with the invoice. Day 7: a firm reminder. Day 15: pause work and apply the late fee from your contract. Day 30: a formal notice. Indian businesses: if you are registered under Udyam (free), the government\'s MSME Samadhaan portal handles delayed-payment complaints.'],
    ['The client goes silent', 'Follow up twice. Then: "I\'ll pause the project; when you\'re ready, we\'ll pick a new launch date." Your contract should say delays move the timeline.'],
    ['Endless revisions', 'Point to the included rounds, collect all feedback in one list per round, and quote extra rounds.'],
    ['Content never arrives', 'The most common cause of delays. Set content deadlines in the contract, or offer to write it (for a fee).'],
    ['An unhappy client', 'Listen first, find out exactly what is wrong, fix what is within scope quickly, and explain the rest calmly. Keep everything in writing.'],
    ['You made a mistake', 'Tell them early, fix it, and explain how you will prevent it. Honesty keeps clients.'],
    ['Too much work', 'Raise prices, set a waiting list, or bring in a trusted freelancer. Do not miss deadlines by over-promising.'],
  ];

  const ADMIN = [
    ['Taxes', 'Presumptive scheme (44ADA: 50% of receipts as profit), advance tax by 15 March, GST above ₹20 lakh a year (exports to foreign clients at 0% with a LUT). Details in 🧾 Tax & money.'],
    ['Records', 'An invoice for every payment, receipts for expenses, contracts and proposals, all in one folder per client.'],
    ['Accounts', 'A separate bank account and an invoicing tool. Review income and expenses every month.'],
    ['Safety net', 'Health insurance, an emergency fund of 6 months, and saving for tax from every payment.'],
    ['Security', 'A password manager, two-factor login everywhere, client logins never shared in plain chat, backups of every project.'],
    ['Your time', 'Fixed working hours, a weekly planning hour, and time blocked for finding new clients even when busy.'],
  ];

  const LEVEL_HEAD = d => d ? ['Level', 'Goal', 'What you do', 'Ready for the next level when'] : ['Level', 'Goal', 'What you do'];

  window.makeTopicTab({
    id: 'fl', title: '🧑‍💻 Freelancing', sub: 'from your first client to a real freelance business',
    button: 'btnFreelance', map: 'freelance', api: 'FreelanceLab', cat: 'Freelancing', icon: '🧑‍💻', solver: 'freelance',
    scene: 'Running freelance web projects for real clients.', hint: 'What protects both you and the client, and keeps the client coming back?',
    stages: [
      { key: 'levels', name: 'Scratch to pro', title: 'From scratch to pro: the five levels', say: 'Most freelancers move through these levels. Do not skip ahead: each one builds what the next needs.', detail: true,
        view: (d, H) => H.table(LEVEL_HEAD(d), LEVELS.map(r => d ? r : r.slice(0, 3))) + (d ? '' : H.more('when you are ready for the next level')) + H.note('Have a job? Read your contract first: many forbid paid side work. Get written permission, and never use company time, laptop or code.') },
      { key: 'setup', name: 'Set up', title: 'What you need before your first client', say: 'You do not need to know everything. You need to deliver one kind of project well, end to end.',
        view: (d, H) => H.cards(SKILLS) },
      { key: 'portfolio', name: 'Portfolio', title: 'A portfolio that wins clients', say: 'Clients do not buy skills; they buy results they can picture for their own business.',
        view: (d, H) => H.cards(PORTFOLIO) },
      { key: 'clients', name: 'Getting clients', title: 'Where clients come from', say: 'Use 2–3 channels consistently instead of trying everything once. Your first clients almost always come from people you know and local businesses.', detail: true,
        view: (d, H) => H.table(d ? ['Channel', 'How', 'Good for', 'Tip'] : ['Channel', 'How', 'Good for'], CHANNELS.map(r => d ? r : r.slice(0, 3))) + (d ? '' : H.more('a practical tip for each channel')) + H.note('Treat finding clients as a weekly habit: e.g. 5 personal messages every week, even when you are busy, so you are never without work.') },
      { key: 'scripts', name: 'Scripts', title: 'Ready-to-use messages', say: 'Copy, then make every message personal: their name, their business, one specific detail. Generic messages get ignored.',
        view: (d, H) => `<div class="db-grid">${SCRIPTS.map(([t, s]) => `<div class="db-card"><div class="db-h"><b>${H.esc(t)}</b></div>${H.code(s)}</div>`).join('')}</div>` },
      { key: 'proposal', name: 'Call & proposal', title: 'The discovery call and the proposal', say: 'Ask before you quote. A good call is mostly you asking questions and listening.',
        view: (d, H) => `<p><b>Questions to ask on the first call</b></p>${H.list(DISCOVERY)}<p><b>What a proposal contains</b></p>${H.list(PROPOSAL, true)}${H.note(ESTIMATE)}${H.note('Red flags: "it\'s a very simple project", no budget at all, wanting work before any agreement, rushing you, many decision-makers, bad-mouthing every previous developer.')}` },
      { key: 'pricing', name: 'Pricing', title: 'How to price your work', say: 'Do not compete on the lowest price; compete on reliability, speed, communication and results.', detail: true,
        view: (d, H) => H.table(['Model', 'How it works', 'Best when'], PRICING) + (d ? `<p><b>Rough Indian market ranges</b> (they vary a lot by city, client and quality)</p>${H.table(['Project', 'Typical range'], PRICES)}` : H.more('rough market price ranges')) + H.note('Offer 2–3 options (basic / recommended / premium): clients compare your options instead of comparing you with cheaper freelancers. Use the rate calculator in 💸 Earn more to find your hourly rate.') },
      { key: 'contract', name: 'Contract & payment', title: 'Contracts and getting paid', say: 'A simple written agreement prevents most freelance problems. A signed proposal with these terms is enough for small projects.',
        view: (d, H) => H.table(['Clause', 'What it says'], CONTRACT) + `<p><b>Getting paid</b></p>${H.list(PAYMENTS)}` },
      { key: 'deliver', name: 'Delivering', title: 'Delivering like a pro', say: 'Clients remember how working with you felt: clear, on time, no surprises.',
        view: (d, H) => H.cards(DELIVERY) },
      { key: 'grow', name: 'Keep & grow', title: 'Keeping clients and growing', say: 'Repeat clients and referrals are where freelancing becomes easy.',
        view: (d, H) => H.cards(GROW) },
      { key: 'problems', name: 'Hard situations', title: 'Hard situations and what to do', say: 'Every freelancer meets these. A contract and calm, written communication handle most of them.',
        view: (d, H) => H.cards(PROBLEMS) },
      { key: 'admin', name: 'Admin & tax', title: 'Admin, tax and protecting yourself', say: 'The boring part that keeps your business safe.',
        view: (d, H) => H.cards(ADMIN) + H.note('General information, not legal or tax advice. A chartered accountant is worth it from your first year.') },
    ],
    situations: [
      { id: 'fl-first', title: 'Your very first client', q: 'You have skills and a portfolio site, but no clients yet. Where is your first client most likely to come from?', a: 'warm', choices: [['warm', 'People you know and local businesses you approach personally'], ['upwork', 'Bidding the lowest price on 50 marketplace jobs'], ['ads', 'Paid ads for your services']], why: 'People who know you, or meet you, trust you before you have reviews. Marketplaces are crowded and price-driven for newcomers; ads cost money before you know what sells.' },
      { id: 'fl-noportfolio', title: 'No portfolio yet', q: 'You want clinic websites as your niche, but you have never built one.', a: 'samples', choices: [['samples', 'Build 2–3 realistic sample clinic sites, labelled as concept work'], ['fake', 'List made-up clients to look experienced'], ['wait', 'Wait until someone hires you without a portfolio']], why: 'Sample projects show exactly what a clinic would get, honestly. Invented clients are dishonest and easy to discover.' },
      { id: 'fl-price-first', title: '"How much will it cost?"', q: 'In the first minute of a call, a client asks how much a website costs.', a: 'discover', choices: [['discover', 'Ask about goals, pages, features, content and deadline first, then send options'], ['number', 'Give a low number right away to win them'], ['refuse', 'Refuse to discuss price']], why: 'Without knowing the scope, any number is a guess. A range ("projects like this are usually ₹X–Y") is fine, then a proper proposal after you understand the project.' },
      { id: 'fl-advance', title: 'No advance', q: 'A new client wants you to start now and promises to pay everything after launch.', a: 'advance', choices: [['advance', 'Politely require an advance (30–50%) or a first paid milestone'], ['trust', 'Start: they seem nice'], ['half', 'Build half, then ask']], why: 'An advance is normal and protects you from clients who disappear. Serious clients accept it; those who refuse are the risky ones.' },
      { id: 'fl-small-changes', title: '"Just one small change"', q: 'After launch, a client keeps sending "quick small changes" every week.', a: 'plan', choices: [['plan', 'Offer a monthly maintenance plan, or quote changes after the support period'], ['free', 'Keep doing them free forever'], ['ignore', 'Stop replying']], why: 'Small changes add up to real hours. A maintenance plan turns them into steady income, and the client gets priority help.' },
      { id: 'fl-offplatform', title: 'Pay outside the marketplace', q: 'A client you met on Upwork asks to pay you directly to avoid the fees.', a: 'stay', choices: [['stay', 'Keep the work and payment on the platform'], ['agree', 'Agree: you both save money'], ['share', 'Split the saved fee with them']], why: 'Taking payment outside the platform breaks its terms and can get your account banned, and you lose escrow and dispute protection.' },
      { id: 'fl-lowball', title: '"Someone quoted half"', q: 'A client says another freelancer quoted half your price.', a: 'scope', choices: [['scope', 'Explain what is included, and offer a smaller-scope option at a lower price'], ['halve', 'Cut your price in half'], ['insult', 'Say the other freelancer will do bad work']], why: 'Lowering the scope, not the price, protects your rate. Clients choosing only on price are often hard to work with; reliability and results are your selling points.' },
      { id: 'fl-steady', title: 'Steady work without selling', q: 'You want regular monthly work without constantly finding new clients.', a: 'agency', choices: [['agency', 'Partner with agencies for white-label work, and sell maintenance plans'], ['marketplace', 'Apply to more marketplace jobs'], ['discount', 'Offer big discounts to everyone']], why: 'Agencies have a steady flow of projects and need reliable developers. Maintenance plans add recurring income from each launch.' },
      { id: 'fl-ip', title: 'Code before payment', q: 'Before paying the final 25%, a client asks for the full source code and admin access.', a: 'onpay', choices: [['onpay', 'Share a preview; hand over code and logins once the final payment arrives, as the contract says'], ['give', 'Give everything: they will surely pay'], ['delete', 'Threaten to delete the site']], why: 'Ownership transfers on full payment, as agreed in writing. A preview shows the work is done; threats damage your reputation and can be illegal.' },
      { id: 'fl-content', title: 'Content never arrives', q: 'The site is built, but the client has not sent texts and photos for 4 weeks, and they ask why it is late.', a: 'deadline', choices: [['deadline', 'Point to the content deadline in the contract, offer to write it for a fee, and set a new date'], ['lorem', 'Launch with placeholder text'], ['blame', 'Stop the project without telling them']], why: 'Missing content is the most common delay. A contract that says client delays move the timeline, plus a helpful offer, keeps things moving and friendly.' },
    ],
  });
})();

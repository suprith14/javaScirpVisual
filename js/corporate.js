/*
 * JS Engine Lab — 💼 Corporate life: how working at a company works around the code.
 * Company types, levels, the first 90 days, communication, appraisals, salary and offers (Indian terms with
 * international notes), policies, growing and switching, and workplace situations (also 🏋️ Practice tasks).
 * Brief by default; "+ Show details" adds examples and templates.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const L = (...lines) => lines.join('\n');

  // company types: b = one line, ex = examples, fe = the frontend work, iv = interviews, pro / con, fit = who it suits
  const COMPANIES = [
    { t: '🛍️ Consumer product (B2C)', b: 'Apps that millions of people use directly.', ex: 'Flipkart, Swiggy, Zomato, CRED, Meesho, PhonePe, MakeMyTrip',
      fe: 'High-traffic pages where speed matters (Core Web Vitals), mobile web, A/B tests, analytics events, design systems.', iv: 'DSA, machine coding, frontend system design, deep JavaScript and React.',
      pro: 'Big impact and scale; strong engineering; good pay.', con: 'Pressure on metrics and deadlines; on-call for incidents.', fit: 'People who like performance, polish and seeing users react.' },
    { t: '🧰 B2B / SaaS product', b: 'Software that other businesses pay for, usually by subscription.', ex: 'Zoho, Freshworks, Postman, BrowserStack, Chargebee, Atlassian, Salesforce',
      fe: 'Complex dashboards, forms, data tables, permissions, accessibility for enterprise customers, long-lived design systems.', iv: 'Machine coding and practical rounds; system design for senior roles.',
      pro: 'Deep product engineering; steadier than consumer apps; skills that transfer well.', con: 'Less public brand; enterprise features can feel slow to ship.', fit: 'People who like hard UI problems and clean architecture.' },
    { t: '🏛️ Big tech', b: 'The largest global tech companies, with offices in India.', ex: 'Google, Microsoft, Amazon, Adobe, Uber, Apple, Meta (mostly abroad)',
      fe: 'Products at huge scale; often very specialised (one part of one product); strong internal tools.', iv: 'Hard DSA rounds, system design, behavioural ("leadership principles" at Amazon); often several rounds over weeks.',
      pro: 'Highest pay (with RSUs), clear levels, great engineers to learn from, brand on your CV.', con: 'Slow processes, narrow scope, layoffs do happen; very competitive to get in.', fit: 'People who prepare DSA seriously and want scale and structure.' },
    { t: '🌐 Global Capability Centres (GCCs)', b: 'The Indian technology centres of global companies (banks, retailers, product firms).', ex: 'Walmart Global Tech, Target, JPMorgan, Goldman Sachs, Lowe\'s, Intuit, Wells Fargo, many others (India has well over a thousand GCCs)',
      fe: 'Customer-facing apps and many internal tools for the parent company, often in React or Angular.', iv: 'DSA plus practical frontend rounds; process similar to product companies.',
      pro: 'Good pay and benefits, stability, global teams; a fast-growing part of Indian tech hiring.', con: 'Big decisions are often made at headquarters; meetings across time zones.', fit: 'People who want product-company pay with more stability.' },
    { t: '🏢 Large IT services', b: 'Build and maintain software for client companies, at huge scale.', ex: 'TCS, Infosys, Wipro, HCLTech, Tech Mahindra, Cognizant, Accenture, Capgemini, LTIMindtree',
      fe: 'Client projects in React, Angular or older stacks; often maintenance and migrations; work follows the client\'s choices.', iv: 'Aptitude test, basic coding, technical and HR interviews; mass campus hiring for freshers.',
      pro: 'Easiest way in for freshers; training programmes; job stability; chances of client trips abroad.', con: 'Slower pay growth; you may sit "on the bench" between projects; less ownership; bonds and timesheets.', fit: 'Freshers starting out; many switch to product companies after 1.5–3 years.' },
    { t: '🧪 Engineering consultancies and digital agencies', b: 'Smaller service firms known for modern engineering, or agencies that build websites and apps.', ex: 'Thoughtworks, Publicis Sapient, EPAM, Globant, Nagarro, and many design and web agencies',
      fe: 'Modern stacks for many clients; often good practices (testing, pairing, CI); agencies: marketing sites, animations, CMS work.', iv: 'Practical coding (often pairing), code review discussions, take-home tasks.',
      pro: 'Variety, good engineering habits, client skills.', con: 'Project-based; client pressure; agencies can have tight deadlines and lower pay.', fit: 'People who like variety and learning many stacks.' },
    { t: '🌱 Early-stage startups (seed to Series A)', b: 'Very small teams (often under 50 people) building a first product.', ex: 'Thousands of young companies; check funding on Tracxn or Crunchbase',
      fe: 'Everything: frontend, some backend, deployment, sometimes design. Ship fast, change direction often.', iv: 'Practical rounds, take-home projects, conversations with founders.',
      pro: 'Learn extremely fast; real ownership; ESOPs.', con: 'Risk of shutdown or late salaries; little mentoring; long hours; ESOPs may end up worth nothing.', fit: 'Self-driven people who can live with risk.' },
    { t: '🚀 Growth-stage startups and unicorns', b: 'Funded companies scaling up (Series B and later, sometimes valued over $1 billion).', ex: 'Razorpay, Zepto, Rapido, upGrad, and many more (some, like Swiggy, have since listed on the stock market)',
      fe: 'Scaling a product that already works: performance, design systems, new features, process being built.', iv: 'Close to product companies: DSA, machine coding, system design.',
      pro: 'Fast growth with more stability than early startups; good pay and ESOPs.', con: 'Reorganisations and layoffs when funding gets tight.', fit: 'People who want speed and ownership with some structure.' },
    { t: '🏦 Fintech and banks', b: 'Payments, trading, lending and banking, regulated by bodies like RBI and SEBI.', ex: 'Paytm, PhonePe, Zerodha, Razorpay, HDFC / ICICI technology teams, global banks\' GCCs',
      fe: 'Secure, reliable flows (payments, KYC, trading screens), strict accessibility and audit requirements.', iv: 'Product-style rounds; security awareness helps.',
      pro: 'Important, stable work; strong engineering at the best ones.', con: 'Compliance slows releases; less freedom to experiment.', fit: 'People who like correctness, security and real-time data.' },
    { t: '🌍 Remote-first and foreign companies', b: 'Companies abroad hiring Indian developers to work remotely, as employees or contractors.', ex: 'GitLab, Automattic, many startups via employer-of-record services (Deel, Remote) or platforms (Toptal, Turing)',
      fe: 'Same as their product or service; mostly asynchronous, written communication.', iv: 'Practical tasks, take-homes, English communication matters a lot.',
      pro: 'Global pay levels; remote work.', con: 'Time zones; contractor roles may lack PF, gratuity, insurance and job security; you handle taxes.', fit: 'Experienced, independent people with strong written English.' },
    { t: '🧑‍💻 Freelancing and your own products', b: 'Working for clients directly, or building something of your own.', ex: 'Upwork, Fiverr, direct clients, indie products',
      fe: 'Whatever the client needs: websites, landing pages, small apps.', iv: 'Your portfolio and reviews are the interview.',
      pro: 'Freedom, direct client relationships, can grow into an agency or product.', con: 'Unstable income, no benefits; you also do sales, contracts and invoicing.', fit: 'Experienced people with a portfolio, or as a side income (check your contract first).' },
  ];
  // company names by region and category, for looking up their careers pages (hiring changes all the time)
  const COMPANY_LIST = {
    india: [
      ['Big tech (India offices)', 'Google, Microsoft, Amazon, Apple, Adobe, Atlassian, Uber, Salesforce, Oracle, Intuit, Cisco, LinkedIn, ServiceNow, VMware (Broadcom), SAP Labs, Qualcomm, Nvidia'],
      ['B2C: e-commerce and quick commerce', 'Flipkart, Myntra, Meesho, Nykaa, Ajio (Reliance), Tata CLiQ, Snapdeal, FirstCry, Lenskart, Purplle, Zepto, Blinkit, Swiggy Instamart, BigBasket, JioMart, Pepperfry'],
      ['B2C: food, travel and local services', 'Swiggy, Zomato, District, MakeMyTrip, EaseMyTrip, ixigo, Cleartrip, Yatra, redBus, OYO, Ola, Rapido, Yulu, Urban Company, BookMyShow'],
      ['B2C: media, social and entertainment', 'JioHotstar, ShareChat, Pratilipi, Pocket FM, Kuku FM, InMobi, Glance, Times Internet, Dailyhunt (VerSe), Inshorts, ZEE5, SonyLIV, JioSaavn, Gaana'],
      ['B2C: gaming (real-money gaming was banned in 2025; several companies are changing direction)', 'Dream11, Games24x7, MPL, Nazara Technologies, Zupee, WinZO, Junglee Games, Krafton India, Rooter'],
      ['B2C: edtech', 'PhysicsWallah, upGrad, Unacademy, Vedantu, Scaler, Eruditus, Classplus, Testbook, Simplilearn, Great Learning, Leap'],
      ['B2C: health and fitness', 'Practo, PharmEasy, Tata 1mg, HealthifyMe, Cult.fit, Pristyn Care, Eka Care, Truemeds'],
      ['Fintech: payments and banking', 'Razorpay, PhonePe, Paytm, CRED, Cashfree, Juspay, PayU, Pine Labs, BharatPe, MobiKwik, Slice, Jupiter, Open, Niyo'],
      ['Fintech: investing, lending and insurance', 'Zerodha, Groww, Upstox, Dhan, INDmoney, smallcase, Navi, KreditBee, Lendingkart, Policybazaar, Acko, Digit Insurance'],
      ['B2B SaaS', 'Zoho, Freshworks, Chargebee, Sprinklr, Darwinbox, Druva, LeadSquared, MoEngage, CleverTap, WebEngage, Whatfix, Mindtickle, Kissflow, Exotel, Hevo Data, Rocketlane, Zluri, Leena AI, Yellow.ai, Haptik, Capillary, Icertis, HighRadius, Zenoti, Amagi, Netcore Cloud, Gupshup, Innovaccer'],
      ['Developer tools and open source', 'Postman, BrowserStack, LambdaTest, Hasura, Appsmith, ToolJet, Hoppscotch, Novu, Frappe, SigNoz, Plane'],
      ['AI and data', 'Sarvam AI, Krutrim, Fractal Analytics, Tiger Analytics, Mu Sigma, LatentView, Observe.AI, Uniphore, Quantiphi, Sigmoid, Qure.ai'],
      ['Cybersecurity', 'CloudSEK, Seclore, Sequretek, Quick Heal, Zscaler (India), Palo Alto Networks (India), CrowdStrike (India)'],
      ['Logistics and B2B commerce', 'Delhivery, Shiprocket, Porter, BlackBuck, Udaan, Moglix, OfBusiness, Zetwerk, Infra.Market, Jumbotail, ElasticRun'],
      ['Auto, mobility and real estate', 'Cars24, CarDekho, Spinny, Ather Energy, Ola Electric, NoBroker, Housing.com, MagicBricks, 99acres, Square Yards'],
      ['Conglomerates\' digital arms', 'Jio Platforms, Airtel Digital, Tata Digital (Tata Neu), Reliance Retail, Info Edge (Naukri), Adani Digital Labs'],
      ['B2C: D2C brands with tech teams', 'boAt, Honasa Consumer (Mamaearth), Sugar Cosmetics, Licious, Country Delight, The Souled Store, Bewakoof, Wakefit, Sleepy Owl'],
      ['HR tech and jobs', 'Keka, greytHR, apna, WorkIndia, Unstop, Instahyre, Cutshort, Hirist, foundit'],
      ['Insurtech and proptech services', 'InsuranceDekho, Turtlemint, PolicyX, Livspace, HomeLane, Zolo, Stanza Living'],
      ['Agritech and rural', 'DeHaat, Ninjacart, AgroStar, BharatAgri, Jai Kisan'],
      ['Data, analytics and AI-native SaaS', 'Atlan, Vue.ai (Mad Street Den), Composio, Ema, Murf AI, Gnani.ai'],
      ['Public digital infrastructure', 'NPCI, Protean (NSDL e-Gov), CRIS (Indian Railways IT), C-DAC'],
      ['GCCs: banking and finance', 'JPMorgan Chase, Goldman Sachs, Morgan Stanley, Wells Fargo, Citi, American Express, Barclays, HSBC, Standard Chartered, Deutsche Bank, Societe Generale, UBS, BNY, State Street, Fidelity, Visa, Mastercard, PayPal'],
      ['GCCs: retail, health and media', 'Walmart Global Tech, Target, Lowe\'s, The Home Depot, Tesco, Optum, Thomson Reuters, Expedia, McAfee'],
      ['GCCs: travel and airlines', 'Amadeus, Sabre, Airbus (India)'],
      ['GCCs: automotive and industrial', 'Mercedes-Benz R&D, Bosch, Siemens, Philips, Continental, Volvo, General Motors, Honeywell, GE, Shell, ABB'],
      ['Large IT services', 'TCS, Infosys, Wipro, HCLTech, Tech Mahindra, Cognizant, Accenture, Capgemini, LTIMindtree, IBM, DXC Technology'],
      ['Mid-size IT services', 'Mphasis, Persistent Systems, Coforge, Hexaware, Zensar, Birlasoft, Sonata Software, KPIT, Cyient, Happiest Minds, Mastek'],
      ['Digital engineering and product studios', 'Thoughtworks, Publicis Sapient, EPAM, Globant, Nagarro, GlobalLogic, Infogain, Xebia, Grid Dynamics, GeekyAnts, Simform, Robosoft, Kellton'],
      ['Consulting (Big 4 and strategy firms)', 'Deloitte, PwC, EY, KPMG, McKinsey Digital, BCG X'],
    ],
    abroad: [
      ['USA: big tech', 'Google, Microsoft, Amazon, Apple, Meta, Netflix, Adobe, Salesforce, Oracle, Nvidia, IBM'],
      ['USA: consumer apps and marketplaces', 'Uber, Airbnb, Lyft, DoorDash, Instacart, Pinterest, Reddit, Snap, Discord, Duolingo, Etsy, eBay'],
      ['USA: fintech', 'Stripe, Robinhood, Coinbase, Plaid, Chime, Brex, Ramp, Block (Square, Cash App), PayPal, Affirm'],
      ['USA: SaaS and developer tools', 'Figma, Notion, Linear, Vercel, Datadog, Cloudflare, Twilio, HubSpot, Snowflake, Databricks, GitHub, Retool, Airtable, Asana, Zoom'],
      ['USA: AI companies', 'OpenAI, Perplexity, Scale AI, Hugging Face, Runway, ElevenLabs (US / UK), Cursor (Anysphere)'],
      ['USA: gaming and media', 'Roblox, Epic Games, Riot Games, Electronic Arts, Twitch, Disney Streaming'],
      ['Israel', 'Wix, monday.com, Fiverr, Riskified, Lightricks, Similarweb'],
      ['Lithuania and the Baltics', 'Vinted, Nord Security, Revolut (Vilnius)'],
      ['United Kingdom and Ireland', 'Revolut, Monzo, Wise, Starling Bank, Deliveroo, Ocado Technology, Skyscanner, Trainline, Intercom, Stripe (Dublin), Workday (Dublin), Google (London / Dublin), Meta (London)'],
      ['Netherlands', 'Booking.com, Adyen, Miro, Mollie, Bunq, Picnic, Elastic, Just Eat Takeaway, Bol.com'],
      ['Germany', 'Zalando, Delivery Hero, N26, Trade Republic, SAP, Celonis, Personio, GetYourGuide, HelloFresh, Contentful, Scalable Capital'],
      ['France and Switzerland', 'Doctolib, BlaBlaCar, Criteo, Back Market, Qonto, Datadog (Paris), Google (Zurich)'],
      ['Spain, Portugal and Eastern Europe', 'Glovo, Cabify, Typeform, Farfetch, OutSystems, Feedzai, Allegro, Docplanner, Booksy, Bolt (Estonia), Pipedrive (Estonia)'],
      ['Nordics', 'Spotify, Klarna, King, Epidemic Sound (Sweden), Wolt, Supercell (Finland)'],
      ['Middle East (UAE, Saudi Arabia)', 'Careem, Noon, Talabat, Tabby, Tamara, Kitopi, Property Finder, Bayut / Dubizzle, Emirates Group IT, Anghami'],
      ['Singapore and Southeast Asia', 'Grab, Shopee (Sea), Lazada, GoTo, Agoda, Carousell, Ninja Van, Traveloka'],
      ['Japan', 'Rakuten, Mercari, LINE Yahoo, SmartNews, Money Forward, PayPay, Woven by Toyota'],
      ['Australia and New Zealand', 'Atlassian, Canva, Airwallex, SafetyCulture, Culture Amp, Seek, REA Group, Xero (NZ)'],
      ['Canada', 'Shopify, Wealthsimple, Clio, Hootsuite, 1Password, Cohere'],
    ],
    remote: [
      ['Fully remote: developer tools and infrastructure', 'GitLab, Supabase, PostHog, Grafana Labs, Sourcegraph, Netlify, Prisma, Elastic, Canonical'],
      ['Fully remote: SaaS and productivity', 'Automattic, Zapier, Doist, Buffer, Toggl, Help Scout, 37signals, Hotjar, Hubstaff, Close'],
      ['Fully remote: HR and global payroll', 'Remote.com, Deel, Oyster'],
      ['Fully remote: open-source platforms', 'Discourse, Ghost, Mattermost, Appwrite, Nextcloud'],
      ['Fully remote: security and networking', 'Bitwarden, Tailscale, 1Password'],
      ['Fully remote: cloud and hosting', 'Fly.io, Railway'],
      ['Crypto and web3 (mostly remote)', 'Kraken, Coinbase, Consensys'],
      ['Remote-first larger companies', 'Shopify, Dropbox, Atlassian (Team Anywhere), Vercel, Stripe (some roles)'],
      ['Non-profits and open source (remote)', 'Wikimedia Foundation, Mozilla, DuckDuckGo, Khan Academy'],
      ['Platforms for remote contracts', 'Toptal, Turing, Arc.dev, Andela, Upwork, Contra, Braintrust, Lemon.io'],
      ['Remote job boards (to find more)', 'We Work Remotely, Remote OK, Remotive, Wellfound (startups), Himalayas, LinkedIn (remote filter), Hacker News "Who is hiring?" (monthly thread)'],
    ],
  };
  // More names live in js/companies-data.js; add them here, skipping any name already listed in that region.
  COMPANY_LIST.bengaluru = [];
  for (const r of Object.keys(COMPANY_LIST)) {
    const seen = new Set(COMPANY_LIST[r].flatMap(([, s]) => s.split(', ')));
    for (const [cat, s] of (window.COMPANY_EXTRA || {})[r] || []) {
      const names = s.split(', ').map(n => n.trim()).filter(n => n && !seen.has(n) && seen.add(n));
      if (names.length) COMPANY_LIST[r].push([cat, names.join(', ')]);
    }
  }
  const LIST_NOTES = {
    bengaluru: 'Bengaluru has the most tech jobs in India. These are well-known companies headquartered here, then global companies with big offices here. Most companies in the India list also hire here.',
    india: 'Search "<company> careers" and filter by "frontend", "UI", "React" or "software engineer". Bengaluru, Hyderabad, Pune, Gurugram / NCR, Chennai and Mumbai have the most roles.',
    abroad: 'Check each job post for "visa sponsorship" or "relocation support". Popular routes for Indian developers: the Netherlands (Highly Skilled Migrant), Germany (EU Blue Card), the UAE, Singapore, Japan and Australia. Many hire after a few years of experience.',
    remote: 'Check that a remote role is open to India: many "remote" jobs are limited to certain countries or time zones. Contractor roles may not include PF, gratuity or insurance, and you handle your own taxes.',
  };

  const COMPARE = [
    ['Large IT services', 'lower', 'medium', 'high', 'steady', 'aptitude + basics'],
    ['Consultancies / agencies', 'medium', 'high', 'medium', 'project-driven', 'practical, pairing'],
    ['GCCs', 'medium–high', 'medium–high', 'high', 'steady', 'DSA + practical'],
    ['B2B / SaaS product', 'medium–high', 'high', 'medium–high', 'medium', 'machine coding'],
    ['Consumer product (B2C)', 'high', 'high', 'medium', 'fast', 'DSA + machine coding + design'],
    ['Growth startups / unicorns', 'high', 'very high', 'medium', 'fast', 'DSA + machine coding + design'],
    ['Early startups', 'varies (+ ESOPs)', 'very high', 'low', 'very fast', 'practical / take-home'],
    ['Big tech', 'highest', 'high', 'medium–high', 'medium', 'hard DSA + design + behavioural'],
  ];
  const CHOOSE = [
    'First job: the best learning you can get matters more than the brand or a small pay difference. A team that reviews your code well is worth a lot.',
    'A common Indian path: start at a service company or a small startup, build projects and skills, then switch to a product company or GCC after 1.5–3 years.',
    'Judge the team, not only the company: your manager, the stack (React? modern tooling?), code review and testing habits decide what you learn.',
    'Compare offers on fixed pay and in-hand first; treat ESOPs and variable pay as uncertain extras.',
  ];
  const RESEARCH = ['Reviews on Glassdoor and AmbitionBox (read the recent ones, not the average)', 'LinkedIn: how long engineers stay, where they come from and go to', 'The engineering blog and GitHub: how they build things', 'Funding and runway for startups (Tracxn, Crunchbase, news)', 'Ask in the interview: How do you review code? How do you release? What would I work on in my first month?'];
  const RED_FLAGS = ['Unpaid "trial" work or very large take-home projects', 'Bonds with huge penalties, or keeping your original certificates', 'No code review, no tests, deploying by hand to production', 'Delayed salaries, or vague answers about funding', '"We are like a family" combined with expected late nights every week', 'A role description that changes completely after you join'];

  const LEVELS = [
    ['Intern', '0', 'Learn the codebase and tools; finish small, well-defined tasks with help.', 'Shows up, learns fast, asks good questions, finishes what was given.'],
    ['Junior / SDE-1 / Associate', '0–2 years', 'Complete tickets that are already broken down; write tests; fix bugs.', 'Delivers reliably with less guidance; code needs fewer review comments.'],
    ['Mid / SDE-2', '2–5 years', 'Own whole features from design to release; review others\' code.', 'Owns bigger, vaguer work; makes good technical decisions; helps juniors.'],
    ['Senior', '5–8 years', 'Own a product area; lead technical design; mentor; improve how the team works.', 'Impact beyond your own tickets: other people deliver better because of you.'],
    ['Lead / Staff / Architect', '8+ years', 'Technical direction across teams; solve the hardest problems; set standards.', 'Organisation-wide impact.'],
    ['Engineering manager (other track)', 'usually after senior', 'People, hiring, delivery and team health instead of mostly coding.', 'A choice, not a promotion you must take: many great engineers stay on the technical track.'],
  ];

  const FIRST90 = [
    ['Week 1', 'Set up the laptop, accounts and access; finish mandatory trainings; run the app locally; read the README and the team docs; meet your manager and buddy.', 'Write down everything that was confusing in setup and fix the docs: an easy first contribution that helps the next person.'],
    ['Weeks 2–4', 'Take small "starter" tickets; learn the release process; read code around your tickets; ask questions in batches.', 'Keep a list of questions and ask them together; say what you already tried. Nobody expects you to know the codebase yet.'],
    ['Months 2–3', 'Own a small feature end to end; start reviewing PRs; understand the product and its users.', 'Agree with your manager what "doing well" means by the end of month 3, and check in on it in your 1:1s.'],
  ];
  const FIRST_MISTAKES = ['Staying stuck for days without asking', 'Changing big things in your first weeks before understanding why they are that way', 'Not writing anything down (you will be asked the same thing twice)', 'Saying "yes" to every deadline'];

  const COMM = [
    { t: 'Chat messages (Slack / Teams)', b: 'Write the whole question in one message, with context; do not send only "Hi".', ex: L('❌ Hi', '❌ Are you there?', '', '✅ Hi Priya, a quick question on WISH-102: the /wishlist API returns 409 when an item is', '   already saved. Should the UI treat that as success (heart stays filled) or show an', '   error? I am leaning to "success". No rush, today is fine.') },
    { t: 'Status updates', b: 'Done, next, blocked, and any risk to a date: short and early.', ex: L('Update on the wishlist feature:', '✅ Done: heart button and tests (merged)', '🔜 Next: wishlist page, expected Thursday', '⚠️ Risk: the API error format is not final; if it changes after Wednesday, Thursday moves to Friday.') },
    { t: 'Asking for help', b: 'Say what you are trying to do, what happens, and what you already tried.', ex: L('I am trying to run the e2e tests locally. `npm run e2e` fails with "browser not found".', 'I tried `npx playwright install` and restarting; same error. Node 20, Windows.', 'Has anyone seen this, or is there a setup step I missed?') },
    { t: 'Saying "no" or "not yet"', b: 'Do not just refuse or silently accept: show the trade-off and let your manager choose.', ex: L('I can pick up the export feature, but then the wishlist page moves from Thursday to next', 'Tuesday. Which one is more important this week?') },
    { t: 'Email', b: 'A clear subject, the point in the first line, then details; one topic per email.', ex: L('Subject: Release 2.4 moved to Friday: payment API not ready', '', 'Hi all,', 'Release 2.4 moves from Wednesday to Friday because the payment API needs two more days.', 'Everything else is on track. Details and the updated plan are below.') },
    { t: 'Meetings', b: 'Know why the meeting exists; prepare; speak up briefly; write down decisions and owners.', ex: L('Meeting notes: wishlist sync (12 Nov)', 'Decisions: 409 = success in the UI; release behind a flag on Tuesday.', 'Action items: API error format (Sam, Wed) · release note (Ana, Tue).') },
    { t: 'Clients and other time zones', b: 'Be polite and precise; confirm in writing; never promise dates your team has not agreed to.', ex: 'Thanks for the details. To confirm: you need CSV export with the filters applied, for up to 10,000 rows. I will check the effort with the team and get back to you by Thursday with a date.' },
  ];

  const PERF = [
    { t: 'The appraisal cycle', b: 'Usually once a year (often April in India), sometimes every six months, with a mid-year check.', d: 'You write a self-review, your manager writes theirs (sometimes with feedback from peers), the company calibrates ratings across teams, and you get a rating that drives your hike, bonus and promotion.' },
    { t: 'Goals: OKRs and KPIs', b: 'OKRs: an objective plus measurable key results. KPIs: numbers that show health (bugs, uptime, speed).', d: 'Example OKR: "Make the shop faster on phones" → key results "LCP under 2.5s at p75", "checkout INP under 200ms". Agree your goals at the start of the cycle, not at the end.' },
    { t: '1:1s with your manager', b: 'Your meeting, often weekly or every two weeks: bring topics.', d: 'Good topics: what you are working on and any blockers, feedback for you (ask for it), career goals, what you want to learn, and anything bothering you. Write down what you agree.' },
    { t: 'Keep a "brag document"', b: 'A running list of what you did and its impact; it writes your self-review for you.', d: 'Every week, two lines: what you shipped or fixed, and the result ("cut the bundle 40%, LCP 3.1s → 1.6s"), plus things like helping others, writing docs, or handling an incident.' },
    { t: 'Ratings, hikes and promotions', b: 'The rating decides the hike; a promotion needs you to already work at the next level.', d: 'Hikes in India often range from single digits to around 15–20% for strong ratings (more for promotions), varying by company and year. Promotions are rarely given for time served; show that you already do the next level\'s work, and tell your manager you want it early in the cycle.' },
    { t: 'Feedback', b: 'Ask for it often; when you get it, listen, ask for an example, agree what to change.', d: 'Do not argue on the spot. Thank them, think it over, and follow up. Giving feedback: be specific, talk about the work not the person, and do it privately.' },
  ];

  const MONEY = [
    ['CTC (cost to company)', 'Everything the company spends on you in a year, written as LPA (lakhs per annum): fixed pay, variable pay, employer PF, gratuity, insurance, sometimes bonuses. It is not what reaches your bank account.'],
    ['Fixed vs variable', 'Fixed is paid monthly. Variable (performance bonus) depends on your rating and company results, often paid yearly; you may get less than 100% of it.'],
    ['In-hand (take-home)', 'What you actually receive each month after PF, professional tax and income tax (TDS). Often around 65–80% of CTC ÷ 12, depending on the structure.'],
    ['Basic, HRA, allowances', 'The fixed pay is split into parts. Basic drives PF and gratuity; HRA can reduce tax under the old regime if you pay rent.'],
    ['PF (provident fund)', 'Retirement savings: usually 12% of basic from you and 12% from the employer (the employer part is often inside your CTC). Your UAN (Universal Account Number) stays the same for life: when you switch jobs, give it to the new employer and transfer the balance; withdrawing has conditions.'],
    ['Gratuity', 'A lump sum paid when you leave after 5 years of service (about 15 days of basic pay per year worked). Often shown in CTC even though you only get it after 5 years. Under the Labour Codes (in force since November 2025), fixed-term employees qualify after 1 year.'],
    ['The Labour Codes (2025)', 'India\'s four Labour Codes came into force in November 2025. Among other things, "wages" (basic and similar parts) must be at least 50% of total pay, which can raise PF and gratuity and lower in-hand pay for the same CTC. Companies are still adjusting their salary structures: ask how yours is affected.'],
    ['Joining bonus and relocation', 'One-time payments; often with a clawback: you must repay them if you leave within a year.'],
    ['ESOPs / RSUs', 'Company shares. ESOPs (startups): the right to buy shares at a fixed price later. RSUs (big tech): shares given to you. Both vest over time, usually 4 years, often with a 1-year cliff (nothing before 12 months).'],
    ['Notice period', 'How long you must keep working after resigning: commonly 30–90 days in India (2 weeks is common in the US). Some companies allow a buyout, paying salary instead of serving it.'],
    ['Offer letter, BGV, documents', 'The offer lists CTC, role, joining date and conditions. Background verification (BGV) checks past employment and education. Keep your relieving letter, experience letter and final payslips from every job.'],
    ['Service agreements (bonds)', 'Some companies ask freshers to sign a bond to stay for 1–2 years or pay a penalty. Read it before signing.'],
  ];
  const CTC_EXAMPLE = L(
    'A rough example: an offer of 12 LPA (₹12,00,000 a year)',
    '',
    '  Variable pay (10%, paid yearly, depends on rating)     ₹1,20,000',
    '  Fixed pay                                              ₹10,80,000',
    '    of which basic (50% of fixed)                         ₹5,40,000',
    '    employer PF (12% of basic, inside CTC)                  ₹64,800',
    '    gratuity (4.81% of basic, paid only after 5 years)      ₹25,974',
    '  Gross salary paid monthly: (10,80,000 − 64,800 − 25,974) ÷ 12 ≈ ₹82,400',
    '  − employee PF (12% of basic ÷ 12)                          ₹5,400',
    '  − professional tax (varies by state)                        ~₹200',
    '  − income tax (TDS): depends on the tax regime and your deductions',
    '',
    '  ≈ ₹76,000–77,000 a month in-hand, if no income tax applies',
    '    (under India\'s new regime for FY 2025-26, income up to ₹12 lakh had no tax thanks to the rebate;',
    '     rules change every budget, so check the current ones)',
    '  + the variable pay later in the year',
    '',
    'Compare offers by fixed pay and in-hand first; treat variable pay, ESOPs and joining bonuses as extras.');
  const NEGOTIATE = ['Find the range for the role and city first (Glassdoor, AmbitionBox, Levels.fyi, people you know).', 'Let them make the first number if you can; when asked, give a researched range.', 'Negotiate the whole package: fixed pay, joining bonus, joining date, level, remote days, learning budget.', 'Be polite and specific ("Based on my offer from X and the role\'s scope, could you do ₹14 LPA fixed?"); get the final offer in writing.', 'International: base salary + bonus + equity (RSUs) is the usual structure; at-will employment and shorter notice periods are common in the US.'];

  const POLICIES = [
    { t: 'NDA and confidentiality', b: 'Company code, designs, customer data and plans are confidential: they stay inside the company.', d: 'Do not put company code in personal GitHub, share screenshots of internal tools, or discuss unreleased features publicly. Your employment contract usually says the code you write at work belongs to the company.' },
    { t: 'AI tools and company code', b: 'Only use the AI tools your company has approved; never paste company code or customer data into public chatbots.', d: 'Many companies have an approved assistant with a data agreement. Read the policy; if there is none, ask before using any tool with company code.' },
    { t: 'Security', b: 'Use the company laptop for work, keep it updated and locked, use the password manager and 2FA, report phishing.', d: 'Never share credentials, never install pirated software, never copy production data to your laptop. Report a suspected incident at once: reporting early is never the mistake.' },
    { t: 'Side projects and moonlighting', b: 'Check your contract before freelancing or working a second job.', d: 'Many contracts forbid or limit outside work, or claim related inventions. Open-source contributions may need approval. Ask HR when unsure.' },
    { t: 'Leave, WFH and timesheets', b: 'Know your leave types (casual, sick, earned), how to apply, and the hybrid / WFH rules.', d: 'Plan leave early and hand over your work. Service companies often require daily timesheets against client projects: fill them on time, they are used for billing.' },
    { t: 'Code of conduct and workplace safety', b: 'Respectful behaviour is required; harassment has formal complaint routes.', d: 'In India the POSH Act requires companies to have an internal committee for sexual harassment complaints. There is usually an ethics or whistleblower channel too. These protect you: know where they are.' },
  ];

  const GROWTH = [
    { t: 'Be visible', b: 'Good work that nobody sees does not count for much: demo it, document it, share what you learned.', d: 'Short demos in team meetings, a write-up after solving a hard bug, answering questions in team channels, and helping new joiners all build your reputation.' },
    { t: 'Keep learning', b: 'Use the learning budget, find a mentor, take on slightly-too-hard tasks.', d: 'Ask your manager for work that stretches you; pair with seniors; review code from strong engineers; keep building outside work if you enjoy it.' },
    { t: 'A difficult manager or office politics', b: 'Focus on the work, write things down, talk openly in 1:1s, and use skip-levels or HR if needed.', d: 'Assume good intent first; most problems are unclear expectations. Agree goals in writing. If it is truly bad and nothing changes, moving teams or companies is a normal choice.' },
    { t: 'Burnout', b: 'Late nights now and then happen; every week is a problem. Raise it before it breaks you.', d: 'Signs: always tired, dreading work, small things feel huge. Talk to your manager, take real leave, protect your evenings. Sustainable pace produces better work.' },
    { t: 'When to switch jobs', b: 'Common reasons: you stopped learning, pay is well below market, or a bad environment does not improve.', d: 'Staying 1.5–3 years per job usually looks fine; very short stints repeatedly can raise questions. Switching is often the fastest way to a big pay jump, especially early in a career.' },
    { t: 'How to resign well', b: 'Tell your manager first, in person or on a call; then send the formal email; serve the notice professionally.', d: 'Keep it short and positive; no need to criticise anyone. Write a handover document, finish or pass on your work, and collect your relieving letter, experience letter and final settlement. Be careful with counter-offers: they rarely fix the reason you wanted to leave.' },
  ];
  const RESIGN_EMAIL = L('Subject: Resignation: Ravi Kumar', '', 'Hi Neha,', '', 'As discussed today, I am resigning from my position as Frontend Developer.', 'My last working day will be 15 February, after my 60-day notice period.', 'I will make sure the wishlist work is handed over with documentation.', '', 'Thank you for the support and everything I have learned here.', '', 'Best regards,', 'Ravi');

  const SITUATIONS = [
    { id: 'corp-deadline', title: 'You will miss a deadline', q: 'Two days before a deadline, you realise you will not finish in time.', a: 'tell', choices: [['tell', 'Tell your manager now, with what is done, a new estimate and options (cut scope, more time)'], ['quiet', 'Keep quiet and work nights, hoping to make it'], ['last', 'Tell them on the deadline day']],
      why: 'Bad news early is useful information; bad news late is a surprise. Managers can move scope, people or dates only if they know in time.' },
    { id: 'corp-vague', title: 'A vague task', q: 'Your manager says: "Make the dashboard faster."', a: 'clarify', choices: [['clarify', 'Ask which part is slow, for whom, and what "fast enough" means; then propose a plan'], ['rewrite', 'Start rewriting the dashboard'], ['guess', 'Add some memoisation and call it done']],
      why: 'Clarify the goal and how success will be measured, then measure before changing anything (see 📊 Performance). It also shows your manager how you think.' },
    { id: 'corp-meeting', title: 'You disagree in a meeting', q: 'A senior engineer proposes an approach you think will cause problems.', a: 'raise', choices: [['raise', 'Raise the concern briefly with your reasons, or follow up one-on-one after the meeting'], ['silent', 'Stay silent: they are senior'], ['argue', 'Argue until they agree']],
      why: 'Respectful disagreement with reasons is valued; staying silent lets problems through. If the meeting is not the place, a short message afterwards works. Once the decision is made, support it.' },
    { id: 'corp-weekend', title: 'Asked to work the weekend', q: 'Your manager asks you to work this weekend to finish a release.', a: 'discuss', choices: [['discuss', 'Understand why it is urgent; help if it is truly needed, ask about comp-off, and raise it if it keeps happening'], ['always', 'Always say yes, every time, without a word'], ['never', 'Refuse without discussing']],
      why: 'Occasional crunch happens; constant weekend work is a planning problem worth raising calmly. Comp-off (a day off in return) is common in Indian companies.' },
    { id: 'corp-mybug', title: 'You caused a production bug', q: 'You find out that a bug in production came from your change.', a: 'own', choices: [['own', 'Say so straight away, help fix it, and suggest how to prevent it next time'], ['hide', 'Fix it quietly and hope nobody notices'], ['blame', 'Point out that the reviewer approved it']],
      why: 'Everyone ships bugs. Owning it quickly builds trust; hiding it destroys trust when it comes out. Good teams run blameless postmortems focused on fixing the process.' },
    { id: 'corp-credit', title: 'Someone presents your work', q: 'A teammate presents your feature in a demo as if they built it.', a: 'private', choices: [['private', 'Talk to them privately first, and make your work more visible (demos, PR descriptions, updates)'], ['public', 'Correct them in front of everyone'], ['nothing', 'Do nothing and resent it']],
      why: 'It may be a misunderstanding; a private conversation usually solves it. Visibility habits prevent it, and if it keeps happening, mention it to your manager with facts.' },
    { id: 'corp-ai', title: 'Pasting code into an AI chatbot', q: 'You want help from a public AI chatbot with a tricky piece of company code.', a: 'policy', choices: [['policy', 'Check the company policy and use only approved tools (or rewrite the problem without company code)'], ['paste', 'Paste the code: everyone does it'], ['personal', 'Copy it to your personal laptop first']],
      why: 'Company code and data are confidential; some tools keep or train on what you paste. Approved tools have data agreements. Breaking this can end a job.' },
    { id: 'corp-counter', title: 'A counter-offer', q: 'You resign for a better offer, and your company offers you more money to stay.', a: 'reasons', choices: [['reasons', 'Decide based on why you wanted to leave: money alone rarely fixes the real reason'], ['accept', 'Accept at once: more money is more money'], ['auction', 'Keep going back and forth between them for more']],
      why: 'If you left for growth, a manager or the work itself, those do not change with a raise. If it really was only pay and they now match the market, staying can be fine.' },
    { id: 'corp-feedback', title: 'Critical feedback', q: 'In your 1:1 your manager says your PRs are often too big and hard to review.', a: 'listen', choices: [['listen', 'Listen, ask for an example, agree on what to change, and follow up later'], ['defend', 'Explain why they are wrong'], ['agree', 'Agree and change nothing']],
      why: 'Feedback is information. Asking for examples makes it concrete; agreeing an action (smaller PRs, one change each) and showing progress at the next 1:1 builds trust.' },
    { id: 'corp-overload', title: 'Too much work', q: 'You have been given more tasks than you can finish this sprint.', a: 'prioritise', choices: [['prioritise', 'Show the list with estimates and ask your manager to choose the order'], ['all', 'Try to do everything, staying late every day'], ['pick', 'Quietly pick the ones you like']],
      why: 'Priorities are your manager\'s call, but they need the facts. A visible list with estimates turns "I am overloaded" into a decision they can make.' },
  ];

  if (window.WebLab) window.WebLab.extend('corp', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...SITUATIONS.map(x => ({
    id: x.id, cat: 'Corporate life', kind: 'rule', solver: 'corp', icon: '💼', kindLabel: 'what would you do at work?',
    title: x.title, ask: 'What would you do?', scene: 'A normal week at a company.',
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'What keeps trust high and surprises low?', why: `${esc(x.why)} See the 💼 Corporate life tab.`, scenario: { q: x.q, a: x.a, why: x.why },
  })));

  const STAGES = [
    { key: 'types', name: 'Company types', title: 'Types of companies', say: 'Where you work shapes the work, the pace, the interviews and the pay.' },
    { key: 'levels', name: 'Levels', title: 'Levels and the career ladder', say: 'Titles differ between companies, but the levels are similar everywhere.' },
    { key: 'first', name: 'First 90 days', title: 'Your first 90 days', say: 'Nobody expects you to know the codebase. They expect you to learn, ask and deliver small things.' },
    { key: 'comm', name: 'Communication', title: 'Communication at work', say: 'At a company, how you communicate matters almost as much as your code.' },
    { key: 'perf', name: 'Appraisals', title: 'Performance, appraisals and promotions', say: 'How your work is judged, and how to make sure it is seen.' },
    { key: 'money', name: 'Salary & offers', title: 'Salary and offers', say: 'Indian terms (CTC, LPA, in-hand), with notes where international companies differ.' },
    { key: 'policy', name: 'Policies', title: 'Policies and professionalism', say: 'The rules that protect the company, its customers and you.' },
    { key: 'grow', name: 'Growing & switching', title: 'Growing, and switching jobs', say: 'Building a career, handling hard situations, and leaving well.' },
    { key: 'quiz', name: 'What would you do?', title: 'What would you do?', say: 'Workplace situations. Pick an answer to see why.' },
  ];
  const UI = { stage: 0, detail: false, answers: {} };
  const cards = list => `<div class="db-grid dp-must">${list.map(x => `<div class="db-card"><div class="db-h"><b>${esc(x.t)}</b></div><p>${esc(x.b)}</p>${UI.detail && x.d ? `<p class="db-how">${esc(x.d)}</p>` : ''}${UI.detail && x.ex ? `<pre>${esc(x.ex)}</pre>` : ''}</div>`).join('')}</div>`;
  const VIEWS = {
    types: () => `<div class="db-grid co-types">${COMPANIES.map(c => `<div class="db-card"><div class="db-h"><b>${esc(c.t)}</b></div><p>${esc(c.b)}</p><p class="db-ex">${esc(c.ex)}</p>
        ${UI.detail ? `<dl class="co-dl"><dt>Frontend work</dt><dd>${esc(c.fe)}</dd><dt>Interviews</dt><dd>${esc(c.iv)}</dd><dt>👍</dt><dd>${esc(c.pro)}</dd><dt>👎</dt><dd>${esc(c.con)}</dd><dt>Suits</dt><dd>${esc(c.fit)}</dd></dl>` : ''}</div>`).join('')}</div>
      ${UI.detail ? '' : '<p class="cl-note">"+ Show details" adds, for each type: the frontend work, the interviews, pros and cons, and who it suits.</p>'}
      <p><b>Side by side</b> <small>(typical, not true for every company)</small></p>
      <table class="iv-diff db-words"><thead><tr><th>type</th><th>pay</th><th>learning</th><th>stability</th><th>pace</th><th>interviews</th></tr></thead><tbody>${COMPARE.map(r => `<tr>${r.map((c, i) => `<td>${i ? esc(c) : `<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <p><b>How to choose</b></p><ul class="db-rel">${CHOOSE.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      ${UI.detail ? `<p><b>How to research a company</b></p><ul class="db-rel">${RESEARCH.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <p><b>Red flags</b></p><ul class="db-rel">${RED_FLAGS.map(x => `<li>🚩 ${esc(x)}</li>`).join('')}</ul>` : '<p class="cl-note">Details also show how to research a company and the red flags to watch for.</p>'}`,
    levels: () => `<table class="iv-diff db-words"><thead><tr><th>level</th><th>experience</th><th>what you do</th>${UI.detail ? '<th>what gets you to the next one</th>' : ''}</tr></thead><tbody>${LEVELS.map(([l, y, w, n]) => `<tr><td><b>${esc(l)}</b></td><td>${esc(y)}</td><td>${esc(w)}</td>${UI.detail ? `<td>${esc(n)}</td>` : ''}</tr>`).join('')}</tbody></table>
      <p class="cl-note">Service companies often use titles like Associate Software Engineer → Software Engineer → Senior Software Engineer → Technical Lead → Architect. Years are typical, not rules: impact decides.</p>`,
    first: () => `<ol class="dp-steps">${FIRST90.map(([t, b, tip]) => `<li><b>${esc(t)}</b><span>${esc(b)}</span>${UI.detail ? `<i class="ip-ex">Tip: ${esc(tip)}</i>` : ''}</li>`).join('')}</ol>
      <p><b>Common mistakes</b></p><ul class="db-rel">${FIRST_MISTAKES.map(m => `<li>${esc(m)}</li>`).join('')}</ul>`,
    comm: () => cards(COMM) + (UI.detail ? '' : '<p class="cl-note">"+ Show details" shows a real example for each: good vs bad chat messages, a status update, an email, meeting notes.</p>'),
    perf: () => cards(PERF),
    money: () => `<table class="iv-diff db-words"><tbody>${MONEY.map(([t, d]) => `<tr><td><b>${esc(t)}</b></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table>
      ${UI.detail ? `<p><b>From CTC to in-hand</b></p><pre class="px-src">${esc(CTC_EXAMPLE)}</pre>` : '<p class="cl-note">"+ Show details" shows a worked example from a 12 LPA CTC to the monthly in-hand amount.</p>'}
      <p><b>Negotiating</b></p><ul class="db-rel">${NEGOTIATE.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`,
    policy: () => cards(POLICIES),
    grow: () => cards(GROWTH) + (UI.detail ? `<p><b>A resignation email</b> (after telling your manager in person)</p><pre class="px-src">${esc(RESIGN_EMAIL)}</pre>` : ''),
    quiz: () => SITUATIONS.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a, label = k => x.choices.find(c => c[0] === k)[1];
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-coq="${i}" data-coa="${k}">${esc(l)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Good call' : `❌ Better: <b>${esc(label(x.a))}</b>`}. ${esc(x.why)}</p>` : ''}</div>`;
    }).join(''),
  };

  function ensure() {
    let m = $('coLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'coLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Corporate life');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-coclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">💼 Corporate life</h2><span class="cl-note">how working at a company works, around the code</span></div>
      <div class="px-rail" id="coRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="coTitle"></h3><p class="px-say" id="coSay"></p><button class="btn small dp-detail" id="coDetail" data-codetail></button><div id="coBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="coPrev">◀ Back</button><button class="btn small primary" id="coNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('coRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-costage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('coTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('coSay').textContent = s.say;
    $('coBody').innerHTML = VIEWS[s.key]();
    $('coDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('coDetail').classList.toggle('hidden', s.key === 'quiz');
    $('coPrev').disabled = UI.stage === 0;
    $('coNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('coLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnCorporate') || t.closest('[data-fmcorporate]')) { open(); return; }
    if (!$('coLab') || $('coLab').classList.contains('hidden')) return;
    const st = t.closest('[data-costage]');
    if (st) { UI.stage = +st.dataset.costage; draw(); return; }
    const a = t.closest('[data-coq]');
    if (a) { UI.answers[+a.dataset.coq] = a.dataset.coa; const box = $('coBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    if (t.closest('[data-codetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#coPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#coNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-coclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('coLab') && !$('coLab').classList.contains('hidden')) close(); });

  // ------------------------------------------------------------ 🏙️ Companies: its own window, opened from the top bar
  const CL = { region: 'india', q: '', type: 'all', pq: '', ptype: 'all', fresh: false, open: '' };
  const PROFILES = window.COMPANY_PROFILES || [];
  const PROFILE = new Map(PROFILES.map(p => [p[0], p]));
  const profileOf = n => PROFILE.get(n) || PROFILE.get(n.replace(/\s*\(.*\)$/, ''));
  const CITY_LIST = window.COMPANY_CITIES || [];
  // company type, guessed from the category name (for the type chips on the name lists)
  const TYPES = [['all', 'All'], ['big', 'Big tech'], ['product', 'Product & startups'], ['gcc', 'GCCs'], ['services', 'IT services & consulting'], ['studio', 'Agencies & studios']];
  const typeOf = cat => /big tech/i.test(cat) ? 'big'
    : /GCC|banks|chips|engineering, health|financial groups/i.test(cat) ? 'gcc'
    : /IT services|consult|engineering companies/i.test(cat) ? 'services'
    : /agenc|studio/i.test(cat) ? 'studio' : 'product';
  const listOf = r => r === 'cities' ? CITY_LIST : COMPANY_LIST[r];
  const TYPED = ['india', 'bengaluru', 'cities'];
  const link = (href, label) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  const tbl = (head, rows) => `<table class="iv-diff db-words"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i ? esc(c) : `<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const ul = items => `<ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  document.addEventListener('input', e => {
    if (e.target.id === 'clSearch') { CL.q = e.target.value; filterCompanies(); }
    if (e.target.id === 'clpSearch') { CL.pq = e.target.value; CL.open = ''; filterProfiles(); }
  });
  function drawCompanies() {
    const regions = [['india', '🇮🇳 India'], ['bengaluru', '📍 Bengaluru'], ['cities', '🏙️ Other cities'], ['abroad', '✈️ Abroad'], ['remote', '🏠 Remote-only'], ['profiles', '🔎 Profiles'], ['jobs', '🧭 Find jobs'], ['research', '🕵️ Research a company'], ['count', '📊 How many?']];
    const count = r => r === 'cities' ? ` <small>(${CITY_LIST.length} groups)</small>`
      : COMPANY_LIST[r] ? ` <small>(${COMPANY_LIST[r].reduce((n, [, s]) => n + s.split(', ').length, 0)})</small>`
      : r === 'profiles' ? ` <small>(${PROFILES.length})</small>` : '';
    const bar = `<div class="dp-walks">${regions.map(([k, l]) => `<button class="btn small cl-choice${CL.region === k ? ' on' : ''}" data-clregion="${k}">${l}${count(k)}</button>`).join('')}</div>`;
    const body = $('clBody');
    if (CL.region === 'count') {
      const N = window.COMPANY_COUNTS || { india: [], bengaluru: [], note: '' };
      const table = (title, rows) => `<h4 class="ip-group">${title}</h4><table class="iv-diff db-words"><tbody>${rows.map(([what, n, src]) => `<tr><td>${esc(what)}</td><td><b>${esc(n)}</b></td><td class="cl-note">${esc(src)}</td></tr>`).join('')}</tbody></table>`;
      body.innerHTML = `${bar}${table('🇮🇳 India', N.india)}${table('📍 Bengaluru', N.bengaluru)}<p class="cl-note">${esc(N.note)}</p>`;
      return;
    }
    if (CL.region === 'profiles') { body.innerHTML = bar + profilesHTML(); filterProfiles(); return; }
    if (CL.region === 'jobs') { body.innerHTML = bar + jobsHTML(); return; }
    if (CL.region === 'research') { body.innerHTML = bar + researchHTML(); return; }
    const typed = TYPED.includes(CL.region);
    const note = CL.region === 'cities' ? 'Bengaluru has its own list. These are well-known companies with large tech teams in other hubs; many companies in the India list also hire in these cities.' : LIST_NOTES[CL.region];
    body.innerHTML = `${bar}
      <p class="cl-note">${esc(note)} Underlined names have a profile: click one.</p>
      <input type="search" id="clSearch" class="cl-search" placeholder="🔍 Search a company or category…" aria-label="Search companies" value="${esc(CL.q)}">
      ${typed ? `<div class="cl-choices cl-types">${TYPES.map(([k, l]) => `<button class="btn small cl-choice${CL.type === k ? ' on' : ''}" data-cltype="${k}">${l}</button>`).join('')}</div>` : ''}
      <p class="cl-note" id="clHits"></p>
      ${listOf(CL.region).map(([cat, names]) => `<section class="cl-cat" data-type="${typed ? typeOf(cat) : 'all'}"><h4 class="ip-group">${esc(cat)}</h4><div class="co-names">${names.split(', ').map(n => {
        const p = profileOf(n);
        return p ? `<span class="cl-has" role="button" tabindex="0" data-clprof="${esc(p[0])}">${esc(n)}</span>` : `<span>${esc(n)}</span>`;
      }).join('')}</div></section>`).join('')}
      <p class="cl-note">Which kind of company suits you, how they interview, and red flags: see 💼 Corporate life → Company types.</p>`;
    filterCompanies();
  }
  // Filter in place (no redraw), so the search box keeps focus while typing.
  function filterCompanies() {
    const q = CL.q.trim().toLowerCase(), typed = TYPED.includes(CL.region);
    let hits = 0;
    $('clBody').querySelectorAll('.cl-cat').forEach(sec => {
      const typeOk = !typed || CL.type === 'all' || sec.dataset.type === CL.type;
      const catHit = !q || sec.querySelector('h4').textContent.toLowerCase().includes(q);
      let shown = 0;
      sec.querySelectorAll('.co-names span').forEach(s => {
        const ok = typeOk && (catHit || s.textContent.toLowerCase().includes(q));
        s.hidden = !ok;
        if (ok) shown++;
      });
      sec.hidden = !shown;
      hits += shown;
    });
    const filtering = q || (typed && CL.type !== 'all');
    $('clHits').textContent = filtering ? (hits ? `${hits} compan${hits === 1 ? 'y' : 'ies'}` : 'No match here: try another region or type.') : '';
  }

  // 🔎 Profiles
  function profilesHTML() {
    const types = ['all', ...new Set(PROFILES.map(p => p[1]))];
    return `<p class="cl-note">Short profiles of ${PROFILES.length} well-known employers. Stacks are what each company has shown in public; interview notes are the commonly reported pattern. Both change, so check recent job posts and interview experiences.</p>
      <input type="search" id="clpSearch" class="cl-search" placeholder="🔍 Search a company, city or stack (e.g. Next.js, Pune)…" aria-label="Search profiles" value="${esc(CL.pq)}">
      <div class="cl-choices cl-types">${types.map(k => `<button class="btn small cl-choice${CL.ptype === k ? ' on' : ''}" data-clptype="${esc(k)}">${k === 'all' ? 'All' : esc(k)}</button>`).join('')}
        <button class="btn small cl-choice${CL.fresh ? ' on' : ''}" data-clfresh>🎓 Hires freshers</button></div>
      <p class="cl-note" id="clpHits"></p>
      <div class="cl-profs">${PROFILES.map(profileHTML).join('')}</div>
      <details class="px-more"><summary>What the pay tiers mean</summary>${tbl(['Tier', 'Meaning'], window.COMPANY_PAY_TIERS || [])}<p class="cl-note">Rough labels, not numbers: see 💰 Roles & pay → Pay ranges for ranges by level.</p></details>`;
  }
  function profileHTML([name, type, where, builds, stack, interview, tier, fresh]) {
    const q = encodeURIComponent;
    return `<details class="cl-prof" data-name="${esc(name)}" data-type="${esc(type)}" data-fresh="${/^yes/i.test(fresh) ? 1 : 0}"${CL.open === name ? ' open' : ''}>
      <summary><b>${esc(name)}</b> <span class="cl-tag">${esc(type)}</span> <span class="cl-tag">💰 ${esc(tier)}</span> <span class="cl-tag">🎓 Freshers: ${esc(fresh)}</span></summary>
      <table class="iv-diff db-words"><tbody>
        <tr><td>Where</td><td>${esc(where)}</td></tr>
        <tr><td>Frontend builds</td><td>${esc(builds)}</td></tr>
        <tr><td>Stack</td><td>${esc(stack)}</td></tr>
        <tr><td>Interview</td><td>${esc(interview)}</td></tr>
      </tbody></table>
      <p class="cl-note">Look up: ${link(`https://www.google.com/search?q=${q(name + ' careers frontend')}`, 'careers page')} · ${link(`https://www.linkedin.com/jobs/search/?keywords=${q(name + ' frontend')}`, 'LinkedIn jobs')} · ${link(`https://www.google.com/search?q=${q(name + ' ambitionbox reviews')}`, 'reviews')} · ${link(`https://www.google.com/search?q=${q(name + ' frontend interview experience')}`, 'interview experiences')}</p>
    </details>`;
  }
  function filterProfiles() {
    const q = CL.pq.trim().toLowerCase();
    let hits = 0;
    $('clBody').querySelectorAll('.cl-prof').forEach(d => {
      const ok = (CL.ptype === 'all' || d.dataset.type === CL.ptype) && (!CL.fresh || d.dataset.fresh === '1') && (!q || d.textContent.toLowerCase().includes(q));
      d.hidden = !ok;
      if (ok) hits++;
    });
    $('clpHits').textContent = `${hits} of ${PROFILES.length} shown`;
  }
  function showProfile(name) {
    Object.assign(CL, { region: 'profiles', pq: name, ptype: 'all', fresh: false, open: name });
    drawCompanies();
    const d = $('clBody').querySelector(`.cl-prof[data-name="${CSS.escape(name)}"]`);
    if (d && d.scrollIntoView) d.scrollIntoView({ block: 'nearest' });
  }

  // 🧭 Find jobs
  function jobsHTML() {
    const G = window.COMPANY_GUIDE;
    return `<p class="cl-note">Where frontend jobs are posted, how to search them, and how to get referred. 🏆 Get hired → Getting interviews covers resumes and the overall strategy.</p>
      <h4 class="ip-group">Where jobs are posted</h4>${tbl(['Where', 'Best for', 'Tip'], G.boards)}
      <h4 class="ip-group">Search strings that find hidden posts</h4>
      <p class="cl-note">Many startups post only on Greenhouse, Lever or Ashby. Paste these into Google or LinkedIn and change the city or role.</p>
      ${tbl(['Where', 'Search'], G.searches)}
      <h4 class="ip-group">Getting a referral</h4><ol>${G.referral.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      <details class="px-more"><summary>Message templates</summary>${G.templates.map(([t, m]) => `<p><b>${esc(t)}</b></p><pre class="px-src">${esc(m)}</pre>`).join('')}</details>
      <h4 class="ip-group">A weekly routine</h4>${tbl(['When', 'What'], G.routine)}
      <h4 class="ip-group">⚠️ Fake jobs and scams</h4>${ul(G.scams)}`;
  }

  // 🕵️ Research a company
  function researchHTML() {
    const G = window.COMPANY_GUIDE;
    return `<p class="cl-note">Do this in about 15 minutes before you apply, and again before you accept an offer. It also gives you strong things to say in interviews.</p>
      <h4 class="ip-group">The checklist</h4>${tbl(['Step', 'Where', 'Look for'], G.research)}
      <div class="db-grid"><div class="db-card"><div class="db-h"><b>✅ Green flags</b></div>${ul(G.green)}</div><div class="db-card"><div class="db-h"><b>🚩 Red flags</b></div>${ul(G.red)}</div></div>
      <h4 class="ip-group">Questions to ask in your interviews</h4>${ul(G.ask)}
      <p class="cl-note">More: 💼 Corporate life → Company types (which kind suits you) and 🏦 How companies work (business models, funding, layoffs).</p>`;
  }
  function openCompanies(region) {
    let m = $('companiesLab');
    if (!m) {
      m = document.createElement('div');
      m.id = 'companiesLab';
      m.className = 'modal hidden';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-label', 'Companies');
      m.innerHTML = `<div class="modal-card wide cl-lab px-card">
        <button class="close" data-clclose aria-label="Close">✕</button>
        <div class="cl-head"><h2 class="modal-title">🏙️ Companies hiring frontend developers</h2></div>
        <p class="px-say">Names by region and type, profiles of well-known employers, where jobs are posted, and how to research a company. Hiring changes all the time, so a name here does not mean an opening today.</p>
        <div class="px-main db-main"><div class="px-view" id="clBody"></div></div>
      </div>`;
      document.body.appendChild(m);
    }
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap', 'coLab'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    if (region) CL.region = region;
    drawCompanies();
    m.classList.remove('hidden');
  }
  const closeCompanies = () => { const m = $('companiesLab'); if (m) m.classList.add('hidden'); };
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnCompanies') || t.closest('[data-fmcompanies]')) { openCompanies(); return; }
    if (!$('companiesLab') || $('companiesLab').classList.contains('hidden')) return;
    const r = t.closest('[data-clregion]');
    if (r) { CL.region = r.dataset.clregion; drawCompanies(); return; }
    const ty = t.closest('[data-cltype]');
    if (ty) { CL.type = ty.dataset.cltype; $('clBody').querySelectorAll('[data-cltype]').forEach(x => x.classList.toggle('on', x === ty)); filterCompanies(); return; }
    const pt = t.closest('[data-clptype]');
    if (pt) { CL.ptype = pt.dataset.clptype; $('clBody').querySelectorAll('[data-clptype]').forEach(x => x.classList.toggle('on', x === pt)); filterProfiles(); return; }
    const fr = t.closest('[data-clfresh]');
    if (fr) { CL.fresh = !CL.fresh; fr.classList.toggle('on', CL.fresh); filterProfiles(); return; }
    const pr = t.closest('[data-clprof]');
    if (pr) { showProfile(pr.dataset.clprof); return; }
    if (t.closest('[data-clclose]')) closeCompanies();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCompanies();
    const pr = (e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('[data-clprof]');
    if (pr) { e.preventDefault(); showProfile(pr.dataset.clprof); }
  });
  window.CompaniesLab = { open: openCompanies, close: closeCompanies, region: r => { CL.region = r; drawCompanies(); }, profile: showProfile, companies: COMPANY_LIST, cities: CITY_LIST, profiles: PROFILES };

  window.CorporateLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, situations: SITUATIONS, stages: STAGES };
})();

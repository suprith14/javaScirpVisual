/*
 * JS Engine Lab — data for the 🏙️ Companies tab:
 *   COMPANY_PROFILES  short profiles of well-known frontend employers
 *   COMPANY_CITIES    tech hubs other than Bengaluru
 *   COMPANY_GUIDE     where jobs are posted, referrals, scams, and researching a company
 * Stacks are only what companies have shown in public (engineering blogs, open-source repos, job posts).
 * Interview notes are the commonly reported pattern; processes change, so read recent experiences.
 * Pay tiers are rough labels, not numbers: see 💰 Roles & pay for ranges.
 */
(function () {
  'use strict';
  // [name, type, where in India, what the frontend team builds, frontend stack, interview, pay tier, freshers]
  window.COMPANY_PROFILES = [
    // Big tech
    ['Google', 'Big tech', 'Bengaluru, Hyderabad, Gurugram, Pune', 'Search, Maps, Google Pay, Workspace, Cloud console', 'Angular, Lit and internal frameworks; TypeScript', 'Online test, 3–4 DSA-heavy coding rounds, a "Googleyness" round', 'Top', 'Yes'],
    ['Microsoft', 'Big tech', 'Hyderabad (IDC), Bengaluru, Noida', 'Office for the web, Teams, Azure portal, Bing', 'React, TypeScript, Fluent UI', 'Online test, DSA rounds, some design, a final "as appropriate" round', 'Top', 'Yes'],
    ['Amazon', 'Big tech', 'Hyderabad, Bengaluru, Chennai', 'Shopping site, Prime Video, AWS console, Alexa', 'React and internal frameworks', 'Online test, DSA rounds, Leadership Principles questions in every round, a "bar raiser"', 'Top', 'Yes'],
    ['Atlassian', 'Big tech', 'Bengaluru', 'Jira, Confluence, Trello, Loom', 'React, TypeScript, Atlaskit design system', 'Coding, frontend coding / system design, a values round, a management round', 'Top', 'Some'],
    ['Adobe', 'Big tech', 'Noida, Bengaluru', 'Acrobat on the web, Adobe Express, Experience Cloud', 'React, React Spectrum, Web Components', 'Online test, DSA, JavaScript, design', 'Top', 'Yes'],
    ['Uber', 'Big tech', 'Bengaluru, Hyderabad', 'Rider and driver web, Uber Eats, internal tools', 'React, Base Web', 'DSA, frontend system design, a hiring-manager round', 'Top', 'Some'],
    ['Salesforce', 'Big tech', 'Hyderabad, Bengaluru', 'CRM apps, Tableau, Slack integrations', 'Lightning Web Components (their own), React in some products', 'DSA, JavaScript, design', 'Top', 'Yes'],
    ['Intuit', 'Big tech', 'Bengaluru', 'TurboTax, QuickBooks, Credit Karma, Mailchimp', 'React, TypeScript', 'A "craft demo" (build something and present it) plus rounds', 'Top', 'Some'],
    ['LinkedIn', 'Big tech', 'Bengaluru', 'Feed, Jobs, Learning, Sales Navigator', 'Ember.js for many years; check job posts for current stacks', 'DSA, frontend design, a hiring-manager round', 'Top', 'Some'],
    ['Oracle', 'Big tech', 'Bengaluru, Hyderabad', 'Cloud console, business apps', 'Oracle JET (their own), React in places', 'DSA and basics', 'Good', 'Yes'],
    ['SAP Labs', 'Big tech', 'Bengaluru', 'Business apps (ERP, HR, procurement)', 'SAPUI5 / UI5 Web Components, Fiori design', 'Coding, JavaScript, hiring-manager round', 'High', 'Yes'],
    ['Cisco', 'Big tech', 'Bengaluru', 'Webex, network dashboards', 'React, Angular (by team)', 'DSA, basics, hiring manager', 'High', 'Yes'],
    ['ServiceNow', 'Big tech', 'Hyderabad', 'The Now Platform UI', 'Their own web-component UI framework', 'DSA, JavaScript, design', 'High', 'Some'],
    ['Apple', 'Big tech', 'Hyderabad, Bengaluru', 'Internal tools and services', 'Varies by team', 'Team-specific; little is public', 'Top', 'Rare'],
    ['DE Shaw', 'Product', 'Hyderabad, Bengaluru, Gurugram', 'Internal finance and trading tools', 'Varies by team', 'Online test, DSA and problem solving, several rounds', 'Top', 'Yes (campus)'],
    ['Media.net', 'Product', 'Mumbai, Bengaluru', 'Ad-tech products and dashboards', 'Check job posts', 'DSA-heavy rounds', 'High', 'Yes (campus)'],
    ['Rippling', 'Product', 'Bengaluru', 'HR, IT and finance SaaS', 'React, TypeScript', 'Coding, frontend rounds, hiring manager', 'Top', 'Some'],

    // Indian product companies
    ['Flipkart', 'Product', 'Bengaluru', 'Shopping site, Flipkart Lite (PWA), seller and ads tools', 'React, Node.js', 'DSA, a machine-coding round (build a small app in ~90 minutes), design, hiring manager', 'High', 'Yes'],
    ['Myntra', 'Product', 'Bengaluru', 'Fashion shopping site and app', 'React', 'Machine coding, DSA, hiring manager', 'High', 'Some'],
    ['Swiggy', 'Product', 'Bengaluru', 'Food delivery, Instamart, Dineout', 'React', 'Machine coding, DSA / JavaScript, hiring manager', 'High', 'Some'],
    ['Zomato', 'Product', 'Gurugram', 'Zomato, Blinkit, District (parent company renamed Eternal in 2025)', 'React, Next.js', 'Coding, JavaScript, hiring manager', 'High', 'Some'],
    ['Razorpay', 'Product', 'Bengaluru', 'Payment gateway, merchant dashboard, Checkout', 'React, TypeScript, Blade (their open-source design system)', 'Frontend machine coding, JavaScript deep-dive, hiring manager', 'High', 'Some'],
    ['PhonePe', 'Product', 'Bengaluru', 'Payments, Share.Market, Indus Appstore', 'React, React Native', 'DSA, machine coding, hiring manager', 'High', 'Some'],
    ['CRED', 'Product', 'Bengaluru', 'A design-heavy consumer app and web', 'React', 'Craft-focused rounds: polish, animation, code quality', 'High', 'Rare'],
    ['Zerodha', 'Product', 'Bengaluru', 'Kite trading platform, Console, Coin', 'Vue.js (Kite), Go on the backend; a small team', 'Informal; they hire rarely and value open-source work', 'Good', 'Rare'],
    ['Groww', 'Product', 'Bengaluru', 'Investing app and web', 'React, Next.js', 'DSA, machine coding, hiring manager', 'High', 'Some'],
    ['Meesho', 'Product', 'Bengaluru', 'Social commerce app and seller tools', 'React', 'DSA, machine coding, hiring manager', 'High', 'Some'],
    ['Paytm', 'Product', 'Noida', 'Payments, wallet, travel and ticketing', 'React, React Native', 'DSA and JavaScript', 'Good', 'Yes'],
    ['MakeMyTrip', 'Product', 'Gurugram', 'Travel booking site and app', 'React, Node.js', 'DSA, JavaScript, hiring manager', 'Good', 'Yes'],
    ['Nykaa', 'Product', 'Mumbai', 'Beauty and fashion shopping', 'React', 'JavaScript, React, hiring manager', 'Good', 'Some'],
    ['Zepto', 'Product', 'Mumbai, Bengaluru', 'Quick-commerce app and web', 'Check job posts', 'DSA, machine coding', 'High', 'Some'],
    ['Dream11', 'Product', 'Mumbai', 'Sports apps (changing direction after the 2025 real-money gaming ban)', 'React Native, React', 'DSA, hiring manager', 'High', 'Some'],
    ['Freshworks', 'Product', 'Chennai, Bengaluru, Hyderabad', 'Freshdesk, Freshservice, Freshsales', 'Ember.js for many years, moving to React; Crayons web components', 'Coding, JavaScript, hiring manager', 'High', 'Yes'],
    ['Zoho', 'Product', 'Chennai, Tenkasi and other offices', '55+ SaaS apps (Mail, CRM, Books…)', 'Mostly in-house frameworks (Lyte)', 'Their own written test and programming rounds; no degree required', 'Good', 'Yes'],
    ['Postman', 'Product', 'Bengaluru', 'API platform (web and desktop app)', 'React, Electron', 'DSA, JavaScript, design', 'High', 'Some'],
    ['BrowserStack', 'Product', 'Mumbai', 'Testing cloud, Percy, test management', 'React', 'Coding, JavaScript, design', 'High', 'Some'],
    ['Hasura', 'Product', 'Bengaluru', 'GraphQL and data API console', 'React, TypeScript', 'Coding and take-home', 'High', 'Rare'],
    ['Innovaccer', 'Product', 'Noida', 'Healthcare data platform', 'React, Masala (their open-source design system)', 'DSA, JavaScript, React', 'Good', 'Some'],
    ['Sprinklr', 'Product', 'Gurugram, Bengaluru', 'Customer-experience SaaS', 'React', 'DSA, JavaScript, hiring manager', 'Good', 'Yes'],
    ['Info Edge', 'Product', 'Noida', 'Naukri, 99acres, Jeevansathi, Shiksha', 'React', 'JavaScript, React, hiring manager', 'Good', 'Yes'],
    ['Juspay', 'Product', 'Bengaluru', 'Payment SDKs and HyperCheckout', 'PureScript, ReScript, Haskell (functional languages)', 'A hiring challenge (hackathon style), then interviews', 'Good', 'Yes'],
    ['Urban Company', 'Product', 'Gurugram', 'Home-services app and web', 'React Native, React', 'DSA, machine coding', 'High', 'Some'],
    ['JioHotstar', 'Product', 'Mumbai, Bengaluru', 'Streaming on web, phones and TVs', 'React', 'DSA, JavaScript, design', 'High', 'Some'],
    ['ShareChat', 'Product', 'Bengaluru', 'ShareChat, Moj', 'Check job posts', 'DSA, machine coding', 'High', 'Some'],
    ['Delhivery', 'Product', 'Gurugram', 'Logistics dashboards and tracking', 'Check job posts', 'DSA and basics', 'Good', 'Yes'],
    ['Darwinbox', 'Product', 'Hyderabad', 'HR SaaS', 'Check job posts', 'JavaScript, framework round, hiring manager', 'Good', 'Some'],
    ['PhysicsWallah', 'Product', 'Noida', 'Learning app, live classes, web', 'Check job posts', 'JavaScript and React', 'Good', 'Yes'],
    ['Tekion', 'Product', 'Bengaluru', 'Cloud software for car dealers', 'React', 'DSA, JavaScript, design', 'High', 'Some'],

    // GCCs (global capability centres)
    ['Walmart Global Tech', 'GCC', 'Bengaluru, Chennai', 'walmart.com, Sam\'s Club, internal platforms', 'React, Next.js', 'DSA, JavaScript, hiring manager', 'High', 'Yes'],
    ['PayPal', 'GCC', 'Chennai, Bengaluru, Hyderabad', 'Checkout, consumer web, merchant tools', 'React, Node.js', 'DSA, JavaScript, design', 'High', 'Some'],
    ['Goldman Sachs', 'GCC', 'Bengaluru, Hyderabad', 'Trading and internal tools, Marcus', 'React, Angular, TypeScript', 'Online test, DSA, design', 'High', 'Yes'],
    ['JPMorgan Chase', 'GCC', 'Hyderabad, Bengaluru, Mumbai', 'Banking web and internal tools', 'React, Angular', 'Code for Good hackathon for students; online test and rounds', 'Good', 'Yes'],
    ['Morgan Stanley', 'GCC', 'Mumbai, Bengaluru', 'Trading and wealth tools', 'Angular, React', 'Online test, DSA, JavaScript', 'High', 'Yes'],
    ['American Express', 'GCC', 'Gurugram, Bengaluru', 'Card and account web', 'React', 'DSA and JavaScript', 'High', 'Yes'],
    ['Target', 'GCC', 'Bengaluru', 'target.com and store tools', 'React', 'DSA, JavaScript, hiring manager', 'High', 'Yes'],
    ['Lowe\'s', 'GCC', 'Bengaluru', 'lowes.com and store tools', 'React', 'DSA and JavaScript', 'High', 'Some'],
    ['Visa', 'GCC', 'Bengaluru', 'Payment products and dashboards', 'Check job posts', 'DSA and JavaScript', 'High', 'Some'],
    ['Mastercard', 'GCC', 'Pune, Gurugram', 'Payment products and dashboards', 'Angular, React', 'DSA and basics', 'Good', 'Yes'],
    ['Deutsche Bank', 'GCC', 'Pune, Bengaluru', 'Banking and internal tools', 'Angular, React', 'Online test and rounds', 'Good', 'Yes'],
    ['Barclays', 'GCC', 'Pune, Chennai', 'Banking and internal tools', 'Angular, React', 'Online test and rounds', 'Good', 'Yes'],
    ['Wells Fargo', 'GCC', 'Hyderabad, Bengaluru', 'Banking and internal tools', 'Angular, React', 'Online test and rounds', 'Good', 'Yes'],
    ['Tesco', 'GCC', 'Bengaluru', 'Online grocery and store tools for the UK', 'React', 'JavaScript, React, hiring manager', 'Good', 'Some'],
    ['Mercedes-Benz R&D India', 'GCC', 'Bengaluru', 'Car software, dashboards, internal tools', 'Angular, React', 'Technical rounds and hiring manager', 'Good', 'Yes'],
    ['Bosch', 'GCC', 'Bengaluru, Coimbatore', 'Internal and IoT dashboards', 'Angular, React', 'Online test and rounds', 'Good', 'Yes'],

    // IT services, consulting and studios
    ['TCS', 'IT services', 'All major cities', 'Client projects: websites, portals, internal apps', 'Angular, React, Java full-stack (by client)', 'National Qualifier Test (NQT); Ninja, Digital and Prime levels pay differently', 'Service', 'Yes'],
    ['Infosys', 'IT services', 'All major cities', 'Client projects', 'Angular, React (by client)', 'Online test; HackWithInfy and specialist roles (SP, DSE) pay more', 'Service', 'Yes'],
    ['Wipro', 'IT services', 'All major cities', 'Client projects', 'Angular, React (by client)', 'National Talent Hunt test and rounds', 'Service', 'Yes'],
    ['HCLTech', 'IT services', 'Noida, Chennai, Bengaluru', 'Client projects', 'Angular, React (by client)', 'Online test and rounds', 'Service', 'Yes'],
    ['Cognizant', 'IT services', 'Chennai and all major cities', 'Client projects', 'Angular, React (by client)', 'GenC, GenC Next and GenC Pro levels', 'Service', 'Yes'],
    ['Accenture', 'IT services', 'All major cities', 'Client projects, Accenture Song (digital agency)', 'Angular, React (by client)', 'Cognitive, technical and coding tests, then an interview', 'Service', 'Yes'],
    ['Capgemini', 'IT services', 'Mumbai, Bengaluru, Pune and more', 'Client projects', 'Angular, React (by client)', 'Online test and rounds', 'Service', 'Yes'],
    ['LTIMindtree', 'IT services', 'Mumbai, Bengaluru, Pune and more', 'Client projects', 'Angular, React (by client)', 'Online test and rounds', 'Service', 'Yes'],
    ['Tech Mahindra', 'IT services', 'Pune, Hyderabad and more', 'Client projects', 'Angular, React (by client)', 'Online test and rounds', 'Service', 'Yes'],
    ['Persistent Systems', 'IT services', 'Pune and more', 'Product engineering for clients', 'React, Angular (by client)', 'Online test and rounds', 'Good', 'Yes'],
    ['Thoughtworks', 'IT services', 'Bengaluru, Pune, Chennai, Gurugram', 'Consulting projects; known for good practices', 'React, TypeScript and more (by client)', 'Code submission, pair programming, code review; values TDD and clean code', 'Good', 'Yes'],
    ['Publicis Sapient', 'IT services', 'Gurugram, Bengaluru, Noida', 'Large websites and apps for global brands', 'React, Next.js, Angular', 'JavaScript, React, frontend design', 'Good', 'Yes'],
    ['EPAM', 'IT services', 'Hyderabad, Bengaluru, Pune', 'Product engineering for clients', 'React, Angular (by client)', 'Technical interviews, sometimes in English with global teams', 'Good', 'Some'],
    ['Nagarro', 'IT services', 'Gurugram and more', 'Digital engineering for clients', 'React, Angular (by client)', 'Online test and rounds', 'Good', 'Yes'],
    ['GeekyAnts', 'Agency / studio', 'Bengaluru', 'React and React Native apps for clients; makers of gluestack-ui (NativeBase)', 'React, React Native, Next.js', 'Practical coding and React rounds', 'Good', 'Yes'],
    ['Deloitte', 'IT services', 'Hyderabad, Bengaluru, Gurugram, Mumbai', 'Consulting and digital projects', 'Angular, React (by client)', 'Online test and rounds', 'Good', 'Yes'],

    // Abroad (often hire from India with visa support)
    ['Booking.com', 'Abroad', 'Amsterdam (relocation)', 'Hotel and travel booking', 'React, TypeScript', 'Coding, frontend, behavioural', 'Abroad', 'Rare'],
    ['Adyen', 'Abroad', 'Amsterdam, also Bengaluru', 'Payments platform and dashboards', 'React, TypeScript', 'Coding, frontend, culture', 'Abroad', 'Rare'],
    ['Zalando', 'Abroad', 'Berlin (relocation)', 'Fashion shopping', 'React', 'Coding, frontend, behavioural', 'Abroad', 'Rare'],
    ['Delivery Hero', 'Abroad', 'Berlin (relocation)', 'Food delivery brands', 'React', 'Coding, frontend', 'Abroad', 'Rare'],
    ['Spotify', 'Abroad', 'Stockholm, London', 'Web player, ads, Backstage (open source)', 'React, TypeScript', 'Coding, frontend, values', 'Abroad', 'Rare'],
    ['Klarna', 'Abroad', 'Stockholm', 'Payments and shopping app', 'React, TypeScript', 'Coding and frontend', 'Abroad', 'Rare'],
    ['Grab', 'Abroad', 'Singapore, also Bengaluru', 'Super-app (rides, food, payments)', 'React', 'DSA, frontend, behavioural', 'Abroad', 'Some'],
    ['Agoda', 'Abroad', 'Bangkok (relocation), also Gurugram', 'Hotel booking', 'React, TypeScript', 'Coding test and rounds', 'Abroad', 'Some'],
    ['Mercari', 'Abroad', 'Tokyo (relocation)', 'Second-hand marketplace', 'React, Next.js', 'Coding and frontend; English-speaking teams', 'Abroad', 'Some'],
    ['Rakuten', 'Abroad', 'Tokyo, also Bengaluru', 'E-commerce and services', 'Check job posts', 'Coding and rounds', 'Abroad', 'Some'],
    ['Canva', 'Abroad', 'Sydney', 'The Canva editor', 'React, TypeScript', 'Coding, frontend, values', 'Abroad', 'Rare'],
    ['Careem', 'Abroad', 'Dubai', 'Super-app (rides, food, payments)', 'Check job posts', 'Coding and rounds', 'Abroad', 'Rare'],
    ['Noon', 'Abroad', 'Dubai, Riyadh', 'E-commerce', 'Check job posts', 'Coding and rounds', 'Abroad', 'Rare'],
    ['Shopify', 'Abroad', 'Remote, Canada', 'Online stores, admin, checkout', 'React, Remix, Polaris design system', 'Life story, pair programming, technical deep-dive', 'Abroad', 'Rare'],

    // Remote-first
    ['GitLab', 'Remote', 'Remote (check country)', 'The GitLab web app', 'Vue.js', 'Technical interview, behavioural', 'Remote', 'Rare'],
    ['Automattic', 'Remote', 'Remote', 'WordPress.com, the Gutenberg editor, WooCommerce', 'React (Gutenberg), PHP', 'Text-chat interview and a paid trial project', 'Remote', 'Rare'],
    ['Vercel', 'Remote', 'Remote (check country)', 'Next.js, the Vercel dashboard', 'Next.js, React, TypeScript', 'Technical rounds and a project', 'Remote', 'Rare'],
    ['Supabase', 'Remote', 'Remote', 'Supabase Studio (database dashboard)', 'Next.js, React, TypeScript', 'Often from open-source contributors', 'Remote', 'Rare'],
    ['PostHog', 'Remote', 'Remote (check country)', 'Product analytics app', 'React, TypeScript, Kea', 'A paid "SuperDay" working on a real task', 'Remote', 'Rare'],
    ['Sentry', 'Remote', 'Remote and offices', 'Error-monitoring dashboard', 'React, TypeScript', 'Coding and frontend', 'Remote', 'Rare'],
    ['Cal.com', 'Remote', 'Remote', 'Open-source scheduling', 'Next.js, React, TypeScript', 'Often from open-source contributors', 'Remote', 'Rare'],
    ['Canonical', 'Remote', 'Remote', 'Ubuntu web tools and sites', 'React, Vanilla framework', 'Long process with written answers and several rounds', 'Remote', 'Some'],
    ['Deel', 'Remote', 'Remote', 'Global payroll and HR', 'React', 'Coding and rounds', 'Remote', 'Rare'],
    ['Zapier', 'Remote', 'Remote (check country)', 'Automation editor and dashboard', 'React, TypeScript', 'Coding and a project', 'Remote', 'Rare'],
  ];

  window.COMPANY_PAY_TIERS = [
    ['Top', 'Big tech and the best-paying product companies. Usually well above the market for the same level.'],
    ['High', 'Well-funded product companies, unicorns and top GCCs.'],
    ['Good', 'Mid-size product companies, most GCCs and engineering-focused services firms.'],
    ['Service', 'Large IT services. Freshers usually start around ₹3.5–4.5 LPA, and special tracks (TCS Digital / Prime, Infosys DSE / SP, Cognizant GenC Next / Pro…) pay roughly ₹6–12 LPA.'],
    ['Abroad / Remote', 'Paid in that country\'s market; compare after tax and cost of living (see 💰 Roles & pay → Pay ranges).'],
  ];

  // Tech hubs other than Bengaluru: companies with big tech teams in each city
  window.COMPANY_CITIES = [
    ['Hyderabad: big tech and product', 'Microsoft, Google, Amazon, Apple, Salesforce, ServiceNow, Qualcomm, Oracle, Uber, Darwinbox, Keka, Zenoti'],
    ['Hyderabad: GCCs and finance', 'JPMorgan Chase, Wells Fargo, Goldman Sachs, DE Shaw, Novartis, Eli Lilly, McDonald\'s, Lloyds, Vanguard, Bank of America, State Street, Providence'],
    ['Hyderabad: IT services', 'TCS, Infosys, Cognizant, Deloitte, EPAM, Tech Mahindra, Capgemini, Accenture, Virtusa'],
    ['Pune: product and GCCs', 'FirstCry, PubMatic, Druva, Icertis, BMC Software, Mastercard, Barclays, UBS, Deutsche Bank, Citi, Siemens, Volkswagen, Bajaj Finserv, Coditas'],
    ['Pune: IT services', 'Persistent Systems, KPIT, Zensar, Tech Mahindra, Infosys, Wipro, TCS, Cognizant, Capgemini, Synechron, LTIMindtree'],
    ['Gurugram / Noida / Delhi: product', 'Zomato, Blinkit, Paytm, MakeMyTrip, Policybazaar, Info Edge, Cars24, Spinny, OYO, Delhivery, Urban Company, Lenskart, PhysicsWallah, BharatPe, Innovaccer, Sprinklr, Times Internet, MobiKwik'],
    ['Gurugram / Noida / Delhi: big tech, GCCs and services', 'Google, Microsoft, Adobe, American Express, Agoda, Expedia, HCLTech, Nagarro, GlobalLogic, Publicis Sapient, EXL, Genpact, Samsung R&D (Noida)'],
    ['Chennai: product and SaaS', 'Zoho, Freshworks, Chargebee, Kissflow, Uniphore, Tiger Analytics, LatentView, Facilio, SuperOps, Agilisium'],
    ['Chennai: GCCs and services', 'PayPal, Walmart Global Tech, Ford, Comcast, Barclays, Temenos, Cognizant, TCS, Infosys, HCLTech, Accenture, Hexaware, Mphasis'],
    ['Mumbai: product and fintech', 'Jio Platforms, Nykaa, Dream11, Zepto, Upstox, Angel One, BrowserStack, Media.net, Haptik, Fynd, CleverTap, Games24x7, Kotak Mahindra Bank, HDFC Bank digital'],
    ['Mumbai: GCCs and services', 'Morgan Stanley, JPMorgan Chase, Barclays, Citi, Capgemini, LTIMindtree, TCS, Accenture, Deloitte'],
    ['Kochi, Thiruvananthapuram, Coimbatore and others', 'UST, IBS Software, Tata Elxsi, Experion Technologies, Zoho (Tenkasi), Bosch (Coimbatore)'],
  ];

  window.COMPANY_GUIDE = {
    boards: [
      ['Company careers pages', 'Every company; the newest and most accurate posts', 'Make a list of 30–50 target companies and check them weekly, or set job alerts on each.'],
      ['LinkedIn Jobs', 'All kinds of companies, India and abroad', 'Filter "Past week". "Easy Apply" posts get hundreds of applicants, so also message the recruiter or a team member.'],
      ['Naukri', 'IT services, GCCs, mid-size companies', 'Recruiters search profiles by how recently they were updated: refresh yours every few days, with keywords like React, TypeScript, Next.js.'],
      ['Instahyre', 'Product companies, 1+ years of experience', 'A curated profile; companies reach out to you.'],
      ['Cutshort', 'Startups and product companies', 'Shows salary ranges on many posts.'],
      ['Hirist (hirist.tech)', 'Tech-only roles, India', 'Good for mid-level frontend roles.'],
      ['Wellfound', 'Startups in India and abroad', 'Shows salary and equity; founders often reply directly.'],
      ['Work at a Startup (Y Combinator)', 'YC startups, including Indian ones', 'One profile, apply to many; small teams that need frontend people.'],
      ['Unstop and Internshala', 'Students and freshers', 'Hiring challenges, hackathons and internships.'],
      ['Hiring challenges', 'Freshers', 'TCS CodeVita, HackWithInfy, Flipkart GRiD, Juspay and others turn a contest result into an interview.'],
      ['Hacker News "Who is hiring?"', 'Remote and international startups', 'A monthly thread; search the page for "React", "remote" or "India".'],
      ['Posts on LinkedIn and X', 'Startups and teams hiring fast', 'Search "hiring frontend" or "hiring React" and sort by latest; reply or message the person who posted.'],
    ],
    searches: [
      ['LinkedIn job search', '("frontend" OR "front end" OR "react") AND ("engineer" OR "developer") NOT "senior"'],
      ['Google: jobs on Greenhouse', 'site:boards.greenhouse.io OR site:job-boards.greenhouse.io frontend (bengaluru OR india)'],
      ['Google: jobs on Lever', 'site:jobs.lever.co react (bangalore OR bengaluru OR india)'],
      ['Google: jobs on Ashby', 'site:jobs.ashbyhq.com frontend india'],
      ['LinkedIn posts', '"hiring" "frontend" bengaluru (then sort by Latest)'],
    ],
    referral: [
      'Make a list of target companies; for each, find 2–3 engineers on LinkedIn: alumni from your college, people from your city, or people in communities you are part of.',
      'Pick a specific job: copy its link and job ID. People can refer you much more easily to a specific opening.',
      'Send a short, specific message (templates below). Attach or link your resume; never just "Hi".',
      'Make it easy: one line on who you are, why this role, your best proof (a project or result), and the job link.',
      'Follow up once after 4–5 days. If they refer you, thank them and tell them the outcome later.',
      'Give back: share openings, help juniors, review resumes. Referrals work best inside a network you are part of.',
    ],
    templates: [
      ['To an alumnus or alumna', `Hi {Name}, I'm {You}, a {year} graduate of {college} like you. I'm a frontend developer working with React and TypeScript, and I saw this opening on your team: {job link} (ID {id}).
I recently built {project}, which {result, e.g. "loads in under 1 second on 4G"}: {link}.
Would you be open to referring me, or telling me if I'm a good fit? My resume: {link}. Thank you!`],
      ['To an engineer you do not know', `Hi {Name}, I enjoyed your post / talk on {topic}. I'm applying for {role} at {company} ({job link}).
I have {X} years of React experience; at {company or project} I {one concrete result}.
If you think I'd fit, would you be willing to refer me? Happy to share anything that makes it easier. Thanks for your time.`],
      ['Follow-up (after 4–5 days)', `Hi {Name}, just following up on my message about {role} ({job link}). Totally fine if you're busy: even a quick "not a fit" helps. Thanks!`],
      ['After a referral', `Thank you so much for referring me, {Name}! I'll keep you posted on how it goes.`],
    ],
    routine: [
      ['Monday', 'Check your target companies\' careers pages and saved searches; shortlist 10–15 openings.'],
      ['Tuesday', 'Tailor your resume for the best 5; send referral requests for them.'],
      ['Wednesday', 'Apply directly to the rest; update your Naukri / LinkedIn profile.'],
      ['Thursday', 'Follow up on last week\'s messages; reply to recruiters.'],
      ['Friday', 'Interview prep and one improvement to a portfolio project.'],
      ['Every week', 'Track everything in one sheet: company, role, link, date, referral, stage, next step.'],
    ],
    scams: [
      'Any "company" that asks you to pay: for registration, training, a laptop, a background check or a "security deposit". Real employers never charge you.',
      'An offer letter without a real interview, or interviews only on WhatsApp / Telegram chat.',
      'HR emails from Gmail / Yahoo addresses, or domains that look slightly wrong (company-careers.co instead of the real site).',
      '"Task" or "part-time" jobs where you like videos or rate products, then must "deposit" money to unlock earnings.',
      'Big salaries for little work, pressure to decide today, or requests for your Aadhaar, PAN or bank OTP early on.',
      'Check every opening on the company\'s official careers page; if in doubt, call the company\'s official number or report it at cybercrime.gov.in (helpline 1930).',
    ],
    research: [
      ['1. What it sells and who pays', 'The website, its pricing page, the app store', 'Can you say in one line how it makes money? (🏦 How companies work explains models.)'],
      ['2. Money and stability', 'Tracxn, Crunchbase, Inc42, Entrackr, Moneycontrol; Tofler or MCA filings; annual reports for listed companies', 'When it last raised money and how much; revenue and loss trend; is it profitable or close?'],
      ['3. Recent news and layoffs', 'Search "<company> layoffs" and "<company> news"; layoffs.fyi', 'Recent layoffs, leaders leaving, legal or regulatory trouble.'],
      ['4. Is the team growing?', 'The LinkedIn company page → People; the number of open engineering roles', 'A growing engineering team is a good sign; a shrinking one is a warning.'],
      ['5. What employees say', 'AmbitionBox, Glassdoor, Blind', 'Read the last 6 months; look for patterns about managers, hours, delayed salaries, appraisals.'],
      ['6. How they build', 'Their engineering blog, GitHub org, conference talks', 'Do they write about frontend, testing, performance? Do they have an open-source design system?'],
      ['7. Their actual frontend', 'Open the site with DevTools; Wappalyzer or BuiltWith; Lighthouse', 'Which framework? How fast and accessible is it? Note 2–3 things you could improve: great interview talking points.'],
      ['8. Pay for your level', 'AmbitionBox, Glassdoor, Levels.fyi, Blind, people you know', 'A range for the role, level and city before any salary talk.'],
      ['9. The people', 'Team members on LinkedIn', 'How long engineers stay, and where they go next.'],
    ],
    green: [
      'Growing engineering team and steady funding or profits',
      'An engineering blog or open-source work, especially on frontend',
      'A clear interview process that tests real work (machine coding, a code review)',
      'Interviewers who answer your questions openly, including about problems',
      'Code review, tests, CI and design systems mentioned in job posts or talks',
      'Recent reviews that mention learning, good managers and fair appraisals',
    ],
    red: [
      'Layoffs in the last few months without a clear plan, or delayed salaries in reviews',
      'Unpaid "trial work" or very large take-home projects',
      'Service bonds with large penalties, or keeping your original certificates',
      'Vague answers about funding, the role or who you would report to',
      'The same opening posted for many months, or very high attrition on LinkedIn',
      'Pressure to accept on the spot, or an offer very different from what was discussed',
    ],
    ask: [
      'What does the frontend team own, and how big is it?',
      'What is the stack, and how do changes reach production (code review, tests, CI)?',
      'What would I work on in my first 3 months?',
      'How are performance and promotions decided?',
      'How has the team changed in the last year?',
      'What do you like most about working here, and what would you change?',
    ],
  };
})();

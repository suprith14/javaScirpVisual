/*
 * JS Engine Lab — 🏦 How companies work: how companies make money and run in the real world —
 * money basics (revenue, profit, cash, burn, runway), business models with real examples,
 * unit economics (with a calculator), how IT services and GCCs make money, startup funding,
 * how a company is organised and planned, public companies and shares, real Indian stories,
 * checking a company before you join, and what it all means for your work as a developer.
 * Built with makeTopicTab (topic-tab.js); situations are also 🏋️ Practice tasks (topic "How companies work").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  // ------------------------------------------------------------ unit economics for a subscription product
  function unitEconomics({ price, margin, churn, cac }) {
    const gp = price * margin / 100; // gross profit per customer per month
    const ltv = churn > 0 ? gp / (churn / 100) : Infinity; // lifetime value
    return { gp, ltv, ratio: cac > 0 ? ltv / cac : Infinity, payback: gp > 0 ? cac / gp : Infinity, months: churn > 0 ? 100 / churn : Infinity };
  }
  const UE = { price: 1000, margin: 80, churn: 3, cac: 8000 };
  const inr = n => (isFinite(n) ? '₹' + Math.round(n).toLocaleString('en-IN') : '∞');
  function ueHTML() {
    const r = unitEconomics(UE);
    const good = r.ratio >= 3 && r.payback <= 12;
    return `<table class="iv-diff db-words"><tbody>
      <tr><td><b>Gross profit per customer per month</b></td><td>${inr(r.gp)}</td></tr>
      <tr><td><b>Average customer stays</b> (1 ÷ churn)</td><td>${isFinite(r.months) ? r.months.toFixed(1) + ' months' : 'forever'}</td></tr>
      <tr><td><b>Lifetime value (LTV)</b> = gross profit ÷ churn</td><td id="bzLtv">${inr(r.ltv)}</td></tr>
      <tr><td><b>LTV : CAC</b></td><td id="bzRatio" class="${r.ratio >= 3 ? 'tx-better' : 'ex-bad'}">${isFinite(r.ratio) ? r.ratio.toFixed(2) : '∞'} : 1</td></tr>
      <tr><td><b>Months to earn back the CAC</b></td><td id="bzPayback">${isFinite(r.payback) ? r.payback.toFixed(1) : '∞'}</td></tr></tbody></table>
      <p><b>${good ? '✅ Healthy: each customer earns well over what it cost to win them, and pays it back within a year.' : '⚠️ Weak: either customers cost too much to win, leave too fast, or earn too little. Try lowering churn or CAC.'}</b></p>`;
  }
  document.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.bzin;
    if (!k) return;
    UE[k] = Math.max(0, Number(e.target.value) || 0);
    const out = document.getElementById('bzUeOut');
    if (out) out.innerHTML = ueHTML();
  });

  const BASICS = [
    ['Revenue', 'All the money coming in from customers (sales, subscriptions, commissions, fees). Also called the "top line".'],
    ['Costs', 'Salaries (usually the biggest cost in tech), servers, office, marketing, payment fees, delivery, taxes.'],
    ['Gross profit', 'Revenue minus the direct cost of delivering the product (servers, delivery partners, payment fees). Software often keeps 70–80%+ of revenue as gross profit; retail and delivery keep much less.'],
    ['Operating profit (EBITDA, roughly)', 'Gross profit minus running costs: salaries, marketing, offices. Shows whether the core business makes money.'],
    ['Net profit', 'What is left after everything, including interest and taxes. The "bottom line". Negative = a loss.'],
    ['Margin', 'Profit as a % of revenue. ₹100 revenue with ₹20 profit = a 20% margin.'],
    ['Cash vs profit', 'A company can be profitable and still run out of cash (customers pay late), or lose money for years and survive (investors\' cash). Cash pays salaries.'],
    ['Burn and runway', 'Burn = cash lost per month. Runway = cash in the bank ÷ monthly burn: how many months the company can last without new money.'],
    ['Valuation', 'What investors think the whole company is worth. It is a bet on future profits, not money the company has.'],
  ];
  const BURN_EXAMPLE = `A startup has ₹60 crore in the bank.
Monthly revenue: ₹3 crore. Monthly costs: ₹8 crore.
Burn = ₹8 − ₹3 = ₹5 crore a month.
Runway = ₹60 ÷ ₹5 = 12 months.

To survive it must, within ~12 months:
  · raise new money, or
  · grow revenue, or
  · cut costs (often hiring freezes or layoffs).`;

  // [model, how they earn, examples, the number they watch]
  const MODELS = [
    ['Subscription (SaaS)', 'A monthly or yearly fee for software.', 'Zoho, Freshworks, Netflix, Spotify, Microsoft 365', 'MRR / ARR, churn'],
    ['Marketplace / commission', 'A cut of every transaction between buyers and sellers.', 'Swiggy, Zomato, Uber, Airbnb, Amazon\'s seller marketplace', 'GMV, take rate'],
    ['E-commerce / D2C', 'Buy or make products, sell them for more.', 'Lenskart, boAt, Nykaa, Mamaearth', 'Gross margin, repeat purchases'],
    ['Advertising', 'Free for users; advertisers pay for their attention.', 'Google, Meta, YouTube, ShareChat, news sites', 'Users, time spent, ad revenue per user'],
    ['Payments and fintech', 'Fees on payments, plus lending, insurance and other financial products.', 'Razorpay, PhonePe, Paytm, Pine Labs', 'Payment volume, fee per transaction, loan book'],
    ['Freemium', 'A free version for many; a paid version for some.', 'Canva, Notion, Slack, Zoom', 'Free-to-paid conversion'],
    ['Usage-based', 'Pay for what you use: compute, storage, API calls, messages.', 'AWS, Vercel, Twilio, OpenAI API', 'Usage growth, cost per unit'],
    ['IT services', 'Clients pay for engineers\' time or for a fixed project.', 'TCS, Infosys, Wipro, HCLTech, Accenture', 'Utilisation, billing rate, operating margin'],
    ['Enterprise licences', 'Large contracts sold by sales teams, renewed every year or few years.', 'Oracle, SAP, Salesforce', 'Contract value, renewals'],
    ['Open core', 'Free open-source product; paid cloud hosting, team and enterprise features.', 'GitLab, Supabase, Excalidraw+', 'Paying teams, cloud revenue'],
    ['Lending', 'Earn interest on loans, minus the money lost when people do not repay.', 'Banks, NBFCs, KreditBee, Navi', 'Interest margin, default rate'],
    ['In-app purchases', 'Free to play or use; pay for extras.', 'Mobile games, dating apps', 'Paying-user share, revenue per paying user'],
  ];
  const UPI_NOTE = 'Example of a hard model: UPI payments in India carry zero fees (MDR) for most transactions, so apps like PhonePe and Google Pay cannot make money from UPI itself. They earn from other products: lending, insurance, mutual funds, merchant devices and ads.';

  const UNIT = [
    ['CAC (customer acquisition cost)', 'Marketing and sales spend ÷ new customers won. Spend ₹10 lakh to win 200 customers → CAC ₹5,000.'],
    ['Churn', 'The share of customers who leave each month. 3% monthly churn means the average customer stays about 33 months.'],
    ['LTV (lifetime value)', 'The gross profit a customer brings over their whole time with you.'],
    ['LTV : CAC', 'A common rule of thumb: at least 3 : 1. Below 1 : 1, every new customer loses money.'],
    ['Payback period', 'Months until a customer has paid back what it cost to win them. Under 12 months is usually considered healthy.'],
    ['Contribution margin', 'What one order or customer leaves after its direct costs. If it is negative, growing faster only loses money faster.'],
  ];
  const ORDER_EXAMPLE = `A made-up food-delivery order of ₹400 (illustration only):

  Restaurant commission (20%)      + ₹80
  Customer delivery / platform fee + ₹30
  Delivery partner's pay           − ₹55
  Discount coupon                  − ₹20
  Payment gateway fee (2%)         − ₹8
  Customer support, refunds, etc.  − ₹10
  ─────────────────────────────────────
  Contribution per order           = ₹17

Then marketing, salaries and offices still have to be paid
from these ₹17s. Bigger orders, fewer discounts and more
orders per delivery partner per hour push it up.`;

  const SERVICES = [
    ['How IT services earn', 'A client pays for engineers: "time and material" (a rate per person per hour or month) or "fixed price" (one price for a project). Profit = what clients pay − salaries and overheads.'],
    ['Utilisation', 'The share of engineers billed to a client. Unbilled engineers ("on the bench") cost money and earn nothing, which is why the bench is managed closely.'],
    ['Margins', 'Large Indian IT services companies earn operating margins of roughly 20–25%. Rate pressure from clients and salary hikes squeeze them, which is why yearly hikes are often modest.'],
    ['Onsite and offshore', 'Work done from India costs clients much less than onsite work abroad; a mix of both is common. Onsite roles bill at higher rates.'],
    ['Why certifications and skills matter', 'Engineers with in-demand skills (cloud, AI, specific platforms) can be billed at higher rates, so companies push for them.'],
    ['GCCs are cost centres', 'A Global Capability Centre is part of a foreign company. It does not sell to customers; it gets a budget from the parent, so the question is "is this team worth its cost?", not "does it make a profit?".'],
    ['Product companies', 'Earn from their own product. Engineering is an investment in the product, so its value is judged by the product\'s growth and profit.'],
  ];

  // [stage, typical use of money]
  const FUNDING = [
    ['Bootstrapped', 'Funded by founders and customers only. Slower growth, full control, must be profitable early (Zoho).'],
    ['Pre-seed / seed', 'Friends, angel investors, early VCs. Build the first product and find the first customers.'],
    ['Series A', 'Proven that some customers want it; money to build a team and a repeatable way to sell.'],
    ['Series B, C, D…', 'Scale: new cities, new products, much bigger teams. Each round gives investors part of the company (dilution).'],
    ['Late stage / pre-IPO', 'Large companies preparing to list; focus shifts to profit and clean finances.'],
    ['IPO', 'Shares are sold to the public on a stock exchange (NSE / BSE in India). Early investors and employees can finally sell shares.'],
  ];
  const FUNDING_TERMS = [
    ['Unicorn', 'A private startup valued at $1 billion or more.'],
    ['Dilution', 'Each funding round issues new shares, so existing owners (including employees with ESOPs) own a smaller percentage.'],
    ['Down round', 'Raising money at a lower valuation than before; painful for employees\' ESOP value.'],
    ['Funding winter', 'Periods (like 2022–23) when investors give much less money. Startups cut burn: hiring freezes, layoffs, a push to profitability.'],
    ['Exit', 'How investors get their money back: an IPO or the company being acquired.'],
  ];

  const ORG = [
    ['Board of directors', 'Represents the owners (founders, investors). Approves big decisions and the budget; can replace the CEO.'],
    ['CEO and leaders', 'The CEO sets direction; the CTO (technology), CPO (product), CFO (money), COO (operations), CMO (marketing) and CHRO (people) run their areas.'],
    ['Profit centres', 'Teams that bring money in: sales, business units, the product itself.'],
    ['Cost centres', 'Teams that are necessary but do not directly earn: engineering platforms, HR, finance, legal, IT, support. They are judged on efficiency.'],
    ['Engineering\'s place', 'In software companies, engineering salaries are often the largest single cost, so headcount plans are watched carefully by finance.'],
  ];
  const PLANNING = [
    ['The yearly budget', 'Each year (April–March for most Indian companies) leaders agree revenue targets and how much each department may spend, including how many people to hire.'],
    ['Headcount plan', 'Hiring follows the budget. A "hiring freeze" means the plan was cut, usually because revenue or funding fell short.'],
    ['Quarters', 'Progress is reviewed every 3 months. Targets, priorities and sometimes teams change at quarter boundaries.'],
    ['OKRs and goals', 'Objectives and key results link company goals to team goals ("increase checkout conversion from 2.5% to 3%"). Your sprint work should trace back to one.'],
    ['P&L', 'The profit-and-loss statement: revenue, costs and profit for a period. Business-unit heads are judged on theirs.'],
    ['Why priorities change suddenly', 'A big customer\'s request, a competitor\'s launch, a quarter that missed its target, or a new funding situation. It is rarely personal.'],
  ];
  // ------------------------------------------------------------ how customers are won
  // [stage, who, what happens, where developers come in]
  const FUNNEL = [
    ['Awareness', 'Marketing', 'Ads, content, SEO, events, social media.', 'Landing pages, page speed, SEO tags, analytics and ad pixels.'],
    ['Sign-up / lead', 'Marketing, growth', 'Free trials, demo requests, lead forms, newsletters.', 'Sign-up and onboarding flows, A/B tests, form tracking.'],
    ['Qualify', 'Sales development (SDR / BDR)', 'Check that the lead fits: size, budget, need, timing.', 'CRM integrations (HubSpot, Salesforce, Zoho CRM).'],
    ['Demo and evaluation', 'Account executives, sales engineers', 'Demos, trials, a proof of concept (POC) for big customers.', 'Demo environments, small custom POCs, answering technical questions.'],
    ['Procurement', 'The customer\'s purchasing, legal and security teams', 'Price negotiation, contract review, security questionnaires.', 'Answering security questions accurately (SSO, encryption, data location).'],
    ['Onboarding', 'Customer success / implementation', 'Setup, training, importing data, connecting tools.', 'Import tools, SSO setup, integrations, fixing first-week bugs fast.'],
    ['Retention and expansion', 'Customer success, account managers', 'Renewals, more seats, upgrades to higher plans.', 'Usage analytics, fixing issues for key accounts, features that stop customers leaving.'],
  ];
  const GTM_NOTES = [
    ['B2C vs B2B', 'Consumer products are mostly won by marketing and the product itself (sign up and use). Business products often need sales: weeks for small deals, 6–12 months for big enterprise deals.'],
    ['Product-led growth (PLG)', 'Users try the product free and the product sells itself (Canva, Notion, Slack); sales steps in for large teams.'],
    ['Words you will hear', 'Lead, MQL / SQL (marketing- / sales-qualified lead), pipeline (deals in progress), quota (a salesperson\'s target), ACV (average contract value), churn, upsell.'],
  ];
  const SEC_QUESTIONS = `Typical security questionnaire questions (big customers send 50–300 of these):

  · Do you support single sign-on (SAML / OIDC) and enforce MFA?
  · Is data encrypted in transit (TLS) and at rest?
  · In which country / region is our data stored?
  · Do you have a SOC 2 Type II report or ISO 27001 certificate?
  · When was your last penetration test? Can we see a summary?
  · How fast do you fix critical vulnerabilities?
  · Can we export and delete all our data?
  · Do you keep audit logs of who did what?
  · Who in your company can access our data, and how is that controlled?

Never guess "yes": a wrong answer can become a contract breach.`;

  // ------------------------------------------------------------ how the roadmap is decided
  const IDEAS_FROM = [
    ['Customers and support', 'Support tickets, feedback, user research, churn reasons ("we left because…").'],
    ['Sales', '"We would win this ₹50 lakh deal if we had SSO / an export / an integration." Big deals carry a lot of weight.'],
    ['Data and experiments', 'Where users drop off, which features are used, A/B test results.'],
    ['Leadership and strategy', 'New markets, company goals for the year, investor or board priorities.'],
    ['Engineering', 'Tech debt, reliability, performance, security fixes, platform work.'],
    ['Competitors and the market', 'A competitor\'s launch, a new technology (like AI), industry changes.'],
    ['Regulation', 'New laws or rules with deadlines (data protection, payments, accessibility) jump the queue.'],
  ];
  const PRIORITISE = [
    ['RICE', '(Reach × Impact × Confidence) ÷ Effort. Scores ideas on how many people it helps, how much, how sure you are, and how long it takes.'],
    ['Impact vs effort', 'A 2×2 grid: do quick wins first (high impact, low effort), plan big bets, avoid low-impact high-effort work.'],
    ['MoSCoW', 'Must have, Should have, Could have, Won\'t have (this time). Common for fixed-deadline releases.'],
    ['Cost of delay', 'What waiting costs per week (lost revenue, a fine, a lost deal). Urgent and valuable work goes first.'],
    ['In real life', 'Frameworks inform the decision; leadership, big customers and deadlines still shape it. Data and clear reasoning are how you influence it.'],
  ];
  const RICE_EXAMPLE = `RICE, worked out (made-up numbers):

                     Reach / quarter  Impact  Confidence  Effort (person-weeks)  Score
  Saved carts        2,000 users      2       80%         4                      800
  Dark mode          5,000 users      0.5     90%         3                      750
  Bulk CSV export    300 users        3       50%         1                      450

Score = Reach × Impact × Confidence ÷ Effort
  Saved carts: 2,000 × 2 × 0.8 ÷ 4 = 800  → first`;
  const GET_ON_ROADMAP = [
    'Write a one-page proposal: the problem, the evidence (data, tickets, quotes), your idea, rough effort, expected impact.',
    'Talk to the product manager early; ask what goals this quarter is judged on, and tie your idea to one.',
    'Suggest a small experiment or a time-boxed spike instead of a big project.',
    'Accept "not now" gracefully, and bring it back with new evidence later.',
  ];

  // ------------------------------------------------------------ compliance and trust
  // [rule, what it is, what it means in your code]
  const COMPLIANCE = [
    ['DPDP Act 2023 (India)', 'India\'s personal-data law. Its rules were notified in November 2025 and phase in over about 18 months (most duties by around May 2027); a Data Protection Board can fine companies.', 'Clear consent notices saying why data is collected, easy withdrawal of consent, deleting data no longer needed, breach reporting, verifiable parental consent for users under 18.'],
    ['GDPR (EU)', 'The EU\'s data-protection law; applies to EU users\' data even if you are in India. Fines up to 4% of global turnover or €20 million.', 'Consent for non-essential cookies, the right to access, correct and delete data, data processing agreements with vendors.'],
    ['SOC 2 (Type I / II)', 'An independent audit report on security controls; most US business customers ask for it. Type II checks controls over months.', 'Code review on every change, access control, logging, onboarding / offboarding. Your PR approvals and deploy logs become audit evidence.'],
    ['ISO 27001', 'An international certificate for managing information security.', 'Similar controls: policies, risk registers, access reviews, incident processes.'],
    ['PCI DSS v4 (card payments)', 'Security rules for anyone handling card data.', 'Use hosted payment pages or fields (Razorpay, Stripe) so card numbers never touch your servers. Since March 2025, payment pages must list and authorise every script and detect changes: CSP and Subresource Integrity help.'],
    ['RBI rules (Indian payments)', 'Reserve Bank of India rules for payments.', 'Merchants may not store card numbers (card tokenisation since October 2022); payment data must be stored in India; extra authentication for recurring payments.'],
    ['Accessibility laws', 'The European Accessibility Act (from 28 June 2025), ADA lawsuits in the US, and accessibility guidelines for Indian government sites.', 'Aim for WCAG 2.1 / 2.2 AA: keyboard use, labels, contrast, captions, focus management.'],
  ];
  const PRIVACY_CODE = [
    'Collect only the data you need (data minimisation).',
    'Never put personal data (emails, phone numbers, tokens) in URLs, logs, analytics events or error reports; scrub it in tools like Sentry.',
    'Record consent (what, when, which version of the notice), and respect it before loading analytics or ad scripts.',
    'Build "export my data" and "delete my account" properly, including backups and third-party tools.',
    'Restrict and log access to personal data (audit logs).',
    'Check that every vendor you add (analytics, chat, error tracking) has a data processing agreement.',
  ];

  // ------------------------------------------------------------ customer contracts and SLAs
  const SLA = [
    ['SLA (service level agreement)', 'A promise in the contract: uptime (e.g. 99.9% a month), support response times, sometimes performance.'],
    ['Service credits', 'If the promise is missed, the customer gets money back (credits) and may be allowed to cancel.'],
    ['Severity levels', 'P1 / Sev-1: the product is down or data is at risk, everyone drops everything. P2: a major feature is broken. P3–P4: smaller bugs, scheduled normally.'],
    ['Support tiers', 'Enterprise plans buy faster responses (e.g. a P1 answered within 1 hour, 24×7) and a named account manager.'],
    ['Enterprise features', 'SSO, audit logs, role-based access, data residency, custom contracts. Often only on expensive plans.'],
    ['Commitments in deals', 'Sales sometimes promises a feature by a date to close a deal. Engineering should be asked before, not after.'],
    ['Status pages', 'Public pages (status.yourcompany.com) that report incidents honestly; part of keeping customers\' trust.'],
  ];
  const UPTIME = [['99%', 'about 7.2 hours'], ['99.5%', 'about 3.6 hours'], ['99.9% ("three nines")', 'about 43 minutes'], ['99.95%', 'about 22 minutes'], ['99.99% ("four nines")', 'about 4.3 minutes']];

  // ------------------------------------------------------------ build vs buy, and buying tools
  const BUILD_BUY = [
    ['Build when it is your core', 'What makes customers choose you (your product\'s unique features) is worth building and owning.'],
    ['Buy when it is a commodity', 'Login and auth, payments, email delivery, search, error tracking, analytics, feature flags: proven services do it better and cheaper.'],
    ['Count the full cost', 'Building costs engineers\' time plus maintenance, security fixes and on-call forever. Buying costs a subscription, integration work and dependence on a vendor.'],
    ['Examples', 'Payments: almost never build (Razorpay, Stripe). Auth: buy (Clerk, Auth0, Cognito, Firebase Auth) unless it is core. Search: start with Postgres full-text search, buy (Algolia, Typesense Cloud) when needed.'],
    ['Check the vendor', 'Pricing as you grow, uptime history, security certificates, data location, how hard it is to leave.'],
  ];
  const PROCUREMENT = [
    'Request: why you need the tool, the cost, alternatives considered.',
    'Approval: your manager and the budget owner.',
    'Security review: the vendor answers a security questionnaire; data access is checked.',
    'Legal: contract terms and a data processing agreement.',
    'Finance: a purchase order and invoicing.',
    'Setup: SSO, access for the right people, offboarding when people leave.',
    'Why it takes weeks: every step protects the company\'s data and money. Never put company data into a tool that has not been approved ("shadow IT").',
  ];

  // ------------------------------------------------------------ big changes
  const CHANGES = [
    ['Reorganisations', 'Teams are merged, split or given new goals; you may get a new manager. Meet them early, share what you work on and your goals, and ask what they expect.'],
    ['Acquisitions', 'The buyer merges teams and tech stacks; overlapping roles may be cut; key people may get retention bonuses; ESOPs may be bought out or converted into the buyer\'s shares.'],
    ['Layoffs: why', 'Running out of runway, missed targets, cutting a product line, or restructuring (including for AI-driven efficiency). Usually about cost, not about individual performance.'],
    ['Layoffs: how', 'Often sudden: a meeting, then access is cut the same day. Severance depends on your contract, company policy and labour law; ask HR for everything in writing.'],
    ['Leaving after a layoff (India)', 'Check your full and final settlement (salary, notice pay, leave encashment as per policy), relieving and experience letters, PF transfer, gratuity if eligible, and buy personal health insurance because company cover ends.'],
    ['Early warning signs', 'Hiring freezes, cost-cutting emails, leaders leaving, missed results, cancelled projects, delayed salaries or reimbursements.'],
    ['Protect yourself, always', 'Keep your brag document and LinkedIn current, your network warm, an emergency fund, and personal copies of your own payslips, offer letter and appraisals (never company code or data).'],
  ];

  const PUBLIC = [
    ['Market capitalisation', 'Share price × number of shares: what the stock market says the company is worth today.'],
    ['Quarterly results', 'Listed companies publish revenue and profit every quarter. Big announcements (and sometimes layoffs) often come around results.'],
    ['Expectations', 'A share price can fall even when profit grows, if growth is below what investors expected.'],
    ['Profit per share and P/E', 'Earnings per share (EPS) = net profit ÷ shares. The P/E ratio (price ÷ EPS) shows how much investors pay for each rupee of profit; high P/E = big expectations of growth.'],
    ['Lock-in periods', 'After an IPO, early investors and employees often cannot sell for months; prices can drop when lock-ins end.'],
    ['Why it matters to you', 'RSU and ESOP value moves with the share price; company performance drives bonuses, hikes and hiring.'],
  ];

  // real, public stories
  const STORIES = [
    ['Zoho', 'Built without any outside investment (bootstrapped). It reported operating revenue of about ₹12,300 crore and net profit of about ₹3,190 crore in FY25, from subscriptions to its 55+ business apps.', 'Profitable, patient growth is possible without venture capital; customers paying from the start fund everything.'],
    ['Zomato (now Eternal)', 'After years of losses (a ₹971 crore net loss in FY23), it reported its first full-year net profit, ₹351 crore, in FY24, helped by its quick-commerce arm Blinkit turning profitable on an adjusted basis.', 'Delivery businesses become profitable through better unit economics: higher order values, fewer discounts, and more efficient deliveries.'],
    ['Paytm\'s IPO (Nov 2021)', 'India\'s biggest IPO at the time, priced at ₹2,150. The share fell about 27% on its first day, wiping out roughly ₹38,000 crore of investor value.', 'Investors judge the path to profit, not only size and brand. Employees\' ESOP value fell with the share.'],
    ['Byju\'s', 'Valued at $22 billion in 2022, India\'s most valuable startup. Rapid expansion, heavy spending and debt disputes followed; in 2024 insolvency proceedings began and the founder said the company was "worth zero".', 'Valuation is not money. Growth funded by burning cash can collapse quickly when funding stops.'],
    ['Freshworks', 'Started in Chennai selling customer-support software by subscription; in 2021 it listed on the US Nasdaq exchange, a first for an Indian SaaS company.', 'Indian SaaS companies can sell to the whole world; many employees earned well from ESOPs at the listing.'],
    ['Netflix and password sharing (2023)', 'Netflix started charging for sharing accounts outside a household; subscriber numbers grew strongly afterwards.', 'A pricing and policy change, not a new feature, can be one of the biggest revenue levers.'],
    ['Tailwind Labs (2026)', 'Its paid products were sold through its free docs; when AI tools answered developers\' questions directly, docs traffic and revenue fell about 80%, leading to layoffs.', 'Know where your company\'s customers come from; a change in that channel can change the whole business.'],
  ];

  const CHECK = [
    'Funding: when it last raised money, and how much (Tracxn, Entrackr, Inc42, news).',
    'Revenue and losses: Indian companies file yearly accounts with the MCA; startup news sites report them. Listed companies publish results on their investor relations page and on NSE / BSE.',
    'Runway: if it raised long ago and is burning heavily, ask about it.',
    'Layoffs history: layoffs.fyi and news searches.',
    'Glassdoor and AmbitionBox reviews: look for patterns, not single angry reviews.',
    'Ask in your interview: "Are you profitable, or what is the plan to get there?", "How long is your runway?", "How does this team\'s work connect to revenue?" Good companies answer clearly.',
  ];

  const YOU = [
    ['Every feature should make or save money', 'Ask "what is this for?": more sign-ups, more purchases, fewer cancellations, fewer support tickets, lower server costs, or less risk.'],
    ['Talk about impact in business terms', '"Cut checkout steps from 5 to 3; conversion rose from 2.4% to 2.9%" is much stronger in an appraisal or interview than "refactored the checkout".'],
    ['Performance is money', 'Faster pages usually mean better conversion and SEO, and cheaper servers. Measure it before and after.'],
    ['Pitch tech debt as business risk', '"This old payment code causes about 3 incidents a month and slows every checkout change by a week" gets prioritised; "the code is ugly" does not.'],
    ['Cost awareness', 'Cloud bills, third-party API calls and AI tokens cost real money. Teams that know their costs make better design choices.'],
    ['Product sense', 'Understanding users, metrics and the business model is what separates senior engineers, and it helps you pick companies and teams that will do well.'],
  ];

  window.makeTopicTab({
    id: 'bz', title: '🏦 How companies work', sub: 'how companies make money, and how that shapes your job',
    button: 'btnBusiness', map: 'business', api: 'BusinessLab', cat: 'How companies work', icon: '🏦', solver: 'business',
    scene: 'Understanding the business behind the code you write.', hint: 'Follow the money: what earns, what costs, and what keeps the company alive?',
    stages: [
      { key: 'basics', name: 'Money basics', title: 'Revenue, profit, cash and runway', say: 'A few words explain most business news you will read, and most decisions your company makes.', detail: true,
        view: (d, H) => H.table(null, BASICS) + (d ? `<p><b>Burn and runway, worked out</b></p>${H.code(BURN_EXAMPLE)}` : H.more('a worked burn-and-runway example')) },
      { key: 'models', name: 'Business models', title: 'How companies make money: business models', say: 'Every company has a model: who pays, for what, and how often. Knowing it explains what your company cares about.', detail: true,
        view: (d, H) => H.table(d ? ['Model', 'How they earn', 'Examples', 'The number they watch'] : ['Model', 'How they earn', 'Examples'], MODELS.map(r => d ? r : r.slice(0, 3))) + H.note(UPI_NOTE) + (d ? '' : H.more('the key number each kind of company watches')) },
      { key: 'unit', name: 'Unit economics', title: 'Unit economics: does each customer make money?', say: 'Growth only helps if each customer (or order) earns more than it costs. Try the calculator for a subscription product.', detail: true,
        view: (d, H) => H.table(null, UNIT) + `<div class="tx-calc">
            <label>Price per customer per month (₹) <input type="number" class="cl-search" data-bzin="price" value="${UE.price}" min="0" step="100"></label>
            <label>Gross margin (%) <input type="number" class="cl-search" data-bzin="margin" value="${UE.margin}" min="0" max="100"></label>
            <label>Monthly churn (%) <input type="number" class="cl-search" data-bzin="churn" value="${UE.churn}" min="0" step="0.5"></label>
            <label>Cost to win a customer, CAC (₹) <input type="number" class="cl-search" data-bzin="cac" value="${UE.cac}" min="0" step="500"></label></div>
          <div id="bzUeOut">${ueHTML()}</div>` + (d ? `<p><b>One delivery order, worked out</b></p>${H.code(ORDER_EXAMPLE)}` : H.more('a worked food-delivery order')) },
      { key: 'services', name: 'IT services & GCCs', title: 'How IT services companies and GCCs work', say: 'Most Indian developers start in services or a GCC. Their business model explains bench time, billing, hikes and certifications.',
        view: (d, H) => H.cards(SERVICES) },
      { key: 'funding', name: 'Startup funding', title: 'How startups are funded', say: 'Most startups lose money for years on purpose, using investors\' money to grow. That works only while the money lasts.',
        view: (d, H) => H.table(['Stage', 'What it means'], FUNDING) + `<p><b>Words you will hear</b></p>${H.table(null, FUNDING_TERMS)}` },
      { key: 'org', name: 'Organisation & planning', title: 'How a company is organised and planned', say: 'Why hiring freezes, reorganisations and sudden priority changes happen.',
        view: (d, H) => H.cards(ORG) + `<p><b>Planning through the year</b></p>${H.cards(PLANNING)}` },
      { key: 'gtm', name: 'Winning customers', title: 'How customers are won: marketing, sales, customer success', say: 'Every customer passes through a funnel. Developers touch more of it than they think.', detail: true,
        view: (d, H) => H.table(d ? ['Stage', 'Who', 'What happens', 'Where developers come in'] : ['Stage', 'Who', 'What happens'], FUNNEL.map(r => d ? r : r.slice(0, 3))) + H.cards(GTM_NOTES) + (d ? H.code(SEC_QUESTIONS) : H.more('where developers come in at each stage, and typical security-questionnaire questions')) },
      { key: 'roadmap', name: 'The roadmap', title: 'How the roadmap is decided', say: 'Many more ideas arrive than a team can build. Prioritisation decides what gets built, and when.', detail: true,
        view: (d, H) => `<p><b>Where ideas come from</b></p>${H.cards(IDEAS_FROM)}<p><b>How they are prioritised</b></p>${H.table(null, PRIORITISE)}` + (d ? H.code(RICE_EXAMPLE) : H.more('a worked RICE example')) + `<p><b>Getting your own idea on the roadmap</b></p>${H.list(GET_ON_ROADMAP)}` },
      { key: 'compliance', name: 'Compliance & trust', title: 'Compliance and trust: the rules behind many features', say: 'Cookie banners, "delete my account", audit logs and SSO usually exist because of laws or customer requirements. General information, not legal advice.', detail: true,
        view: (d, H) => H.table(d ? ['Rule', 'What it is', 'What it means in your code'] : ['Rule', 'What it is'], COMPLIANCE.map(r => d ? r : r.slice(0, 2))) + `<p><b>Privacy in everyday code</b></p>${H.list(PRIVACY_CODE)}` + (d ? '' : H.more('what each rule means in your code')) },
      { key: 'contracts', name: 'Contracts & SLAs', title: 'Customer contracts and SLAs', say: 'Why one customer\'s bug can stop the whole team: it may be written into a contract.', detail: true,
        view: (d, H) => H.cards(SLA) + (d ? `<p><b>Allowed downtime per 30-day month</b></p>${H.table(['Uptime promise', 'Downtime allowed'], UPTIME)}` : H.more('how much downtime each uptime promise allows')) },
      { key: 'buy', name: 'Build vs buy', title: 'Build vs buy, and buying tools', say: 'Most software is assembled from bought services. Knowing when to build is a senior skill.',
        view: (d, H) => H.cards(BUILD_BUY) + `<p><b>How a company buys a tool</b></p>${H.list(PROCUREMENT, true)}` },
      { key: 'change', name: 'Big changes', title: 'Reorganisations, acquisitions and layoffs', say: 'Big changes happen at almost every company. Understanding them makes them less frightening.',
        view: (d, H) => H.cards(CHANGES) },
      { key: 'public', name: 'Shares & stock', title: 'Listed companies and their shares', say: 'If you get RSUs or ESOPs, this decides what they are worth.',
        view: (d, H) => H.cards(PUBLIC) },
      { key: 'stories', name: 'Real stories', title: 'Real stories from Indian and global tech', say: 'Publicly reported numbers, and what each story teaches.',
        view: (d, H) => `<div class="db-grid">${STORIES.map(([n, s, l]) => `<div class="db-card"><div class="db-h"><b>${H.esc(n)}</b></div><p>${H.esc(s)}</p><p><b>Lesson:</b> ${H.esc(l)}</p></div>`).join('')}</div>` + H.note('Sources: company filings and results as reported by Business Standard, YourStory, Inc42, TechCrunch and others; figures are rounded.') },
      { key: 'check', name: 'Check a company', title: 'Checking a company before you join', say: 'Ten minutes of research can save you from joining a company about to run out of money.',
        view: (d, H) => H.list(CHECK) },
      { key: 'you', name: 'What it means for you', title: 'What this means for your work', say: 'Developers who understand the business get better projects, better appraisals and better interviews.',
        view: (d, H) => H.cards(YOU) },
    ],
    situations: [
      { id: 'bz-runway', title: 'Reading a runway', q: 'A startup offering you a job has ₹40 crore in the bank and burns ₹4 crore a month. It last raised money 2 years ago.', a: 'ask', choices: [['ask', 'Runway is about 10 months: ask about revenue growth and funding plans before joining'], ['safe', '₹40 crore is a lot: it is safe'], ['ignore', 'Money is the founders\' problem']], why: 'Runway = ₹40 ÷ ₹4 = 10 months. With no recent funding, the company must raise money, grow revenue or cut costs soon. Asking openly is normal and wise.' },
      { id: 'bz-profit-cash', title: 'Profitable but short of cash', q: 'A profitable services company delays salaries because big clients pay 120 days late. How is that possible?', a: 'cash', choices: [['cash', 'Profit is not cash: money owed by clients cannot pay salaries until it arrives'], ['lying', 'It must be lying about profit'], ['impossible', 'A profitable company always has cash']], why: 'Profit counts revenue when it is earned; cash arrives when customers pay. Long payment delays can starve even a profitable business of cash.' },
      { id: 'bz-model', title: 'What does the company care about?', q: 'You join a SaaS company that charges a monthly subscription. Which metric is leadership most likely to watch closely?', a: 'churn', choices: [['churn', 'Recurring revenue (MRR / ARR) and churn'], ['downloads', 'App downloads'], ['lines', 'Lines of code written']], why: 'Subscription businesses live on recurring revenue and keeping customers. Features that reduce churn are often as valuable as ones that win new customers.' },
      { id: 'bz-ltv', title: 'Growth that loses money', q: 'Each new customer costs ₹6,000 to win and brings ₹4,000 of gross profit over their lifetime. Marketing wants to double spending to grow faster.', a: 'fix', choices: [['fix', 'Fix unit economics first (lower CAC or churn, raise price): growing now just loses more'], ['grow', 'Grow: scale fixes everything'], ['cut', 'Stop all marketing forever']], why: 'LTV : CAC is 0.67 : 1, so every new customer loses ₹2,000. Doubling spend doubles the losses unless the economics change.' },
      { id: 'bz-services-bench', title: 'On the bench', q: 'At an IT services company, you finish a project and are "on the bench". What is the smartest move?', a: 'skill', choices: [['skill', 'Learn an in-demand skill and actively ask about upcoming projects'], ['wait', 'Wait quietly until someone calls'], ['leave', 'Resign immediately']], why: 'Benched engineers cost money without earning, so companies try to deploy them fast. In-demand skills make you easier to bill and place on a good project.' },
      { id: 'bz-impact', title: 'Describing your work', q: 'In your appraisal, how should you describe the checkout redesign you built?', a: 'business', choices: [['business', '"Cut checkout from 5 steps to 3; conversion rose from 2.4% to 2.9%"'], ['tech', '"Migrated checkout to the new component library"'], ['hours', '"Worked many late nights on checkout"']], why: 'Leaders think in business outcomes. Linking your work to a metric shows its value; mention the technical work as how you achieved it.' },
      { id: 'bz-share-fall', title: 'Profit up, share down', q: 'Your company\'s profit grew 15%, but its share price (and your RSUs) fell 10% after results.', a: 'expect', choices: [['expect', 'Investors expected more growth; prices move on expectations, not just results'], ['error', 'The stock market made a mistake'], ['fraud', 'Something illegal happened']], why: 'Share prices already include expected growth. If results or the outlook are below what investors expected, the price can fall even when profit grows.' },
      { id: 'bz-security-q', title: 'A security questionnaire', q: 'Sales asks you to help answer a big customer\'s security questionnaire. One question: "Is all customer data encrypted at rest?" You are not sure.', a: 'verify', choices: [['verify', 'Check with the infrastructure / security team and answer accurately'], ['yes', 'Answer "yes": it probably is, and the deal matters'], ['skip', 'Leave it blank']], why: 'Questionnaire answers often become part of the contract. A wrong "yes" can be a breach later. Verify, and if the honest answer is "partly", say so with the plan.' },
      { id: 'bz-pii', title: 'Tracking a form', q: 'Marketing wants analytics events for the sign-up form, including the email and phone fields the user typed.', a: 'minimise', choices: [['minimise', 'Track the steps (started, field completed, submitted), not the personal data, and only with consent'], ['all', 'Send everything: it helps marketing'], ['hash', 'Send it all, but in a hidden field']], why: 'Personal data in analytics tools breaks data-protection rules (DPDP, GDPR) and your privacy policy. Funnel analysis needs events, not the values people typed.' },
      { id: 'bz-build-auth', title: 'Build or buy login?', q: 'A small team needs login with Google, email OTP and two-factor authentication within a month.', a: 'buy', choices: [['buy', 'Use a proven auth service, and spend the time on the product'], ['build', 'Build it all ourselves: it is just a form'], ['skip', 'Skip two-factor for now and add it later']], why: 'Auth is security-critical and a commodity. A proven service handles OAuth, OTP, MFA, sessions and attacks. Build it yourself only if auth is core to your business.' },
      { id: 'bz-sla', title: 'One customer, everyone stops', q: 'An enterprise customer reports a P1 outage. Their contract promises 99.9% monthly uptime, and the product has been down for them for 35 minutes. Why does the whole team drop everything?', a: 'sla', choices: [['sla', '99.9% allows only about 43 minutes a month: credits, the contract and trust are at risk'], ['vip', 'Because they complain loudly'], ['habit', 'It is just habit']], why: 'At 99.9%, about 43 minutes of downtime is allowed per month. Missing it means service credits, a possible right to cancel, and damaged trust with a big customer.' },
      { id: 'bz-roadmap', title: 'Your idea was not picked', q: 'Your idea for saved carts was not put on this quarter\'s roadmap.', a: 'evidence', choices: [['evidence', 'Write a one-page proposal with evidence (abandoned carts, tickets) and tie it to a quarterly goal'], ['build', 'Build it secretly in your spare sprint time'], ['give-up', 'Never suggest ideas again']], why: 'Roadmaps are decided on evidence and goals. A short, data-backed proposal linked to what the quarter is judged on is how engineers influence priorities.' },
      { id: 'bz-tech-debt', title: 'Getting tech debt prioritised', q: 'You want time to rewrite a fragile payment module. How do you pitch it?', a: 'risk', choices: [['risk', 'Show its cost: incidents per month, lost orders, and how much it slows new features'], ['ugly', 'Explain that the code is ugly'], ['secret', 'Rewrite it secretly during other tickets']], why: 'Managers prioritise by business impact. Numbers on incidents, lost revenue and slower delivery turn tech debt into a clear business case.' },
    ],
  });
  window.BusinessLab.unitEconomics = unitEconomics;
})();

/*
 * JS Engine Lab — 🧾 Tax & money (India): the words on your payslip and the tax portal, old vs new regime
 * with a calculator, how salary parts are taxed, filing your ITR, tax on RSUs / ESOPs / shares,
 * freelancing for foreign clients, and money basics.
 * Rules as of tax year 2026-27 (the Income-tax Act, 2025 applies from 1 April 2026; the slabs did not
 * change in Budget 2026). General information, not tax or financial advice: rules change every year.
 * Built with makeTopicTab (topic-tab.js); situations are also 🏋️ Practice tasks (topic "Tax & money").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  // ------------------------------------------------------------ the calculator (individuals below 60, no surcharge: income up to ₹50 lakh)
  const NEW_SLABS = [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]];
  const OLD_SLABS = [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]];
  const slabTax = (income, slabs) => { let tax = 0, low = 0; for (const [top, rate] of slabs) { if (income > low) tax += (Math.min(income, top) - low) * rate; low = top; } return tax; };
  function taxNew(salary) {
    const taxable = Math.max(0, salary - 75000); // standard deduction ₹75,000
    let tax = slabTax(taxable, NEW_SLABS);
    if (taxable <= 1200000) tax = 0; // rebate: no tax up to ₹12 lakh taxable
    else tax = Math.min(tax, taxable - 1200000); // marginal relief just above ₹12 lakh
    return { taxable, tax: Math.round(tax * 1.04) }; // + 4% health and education cess
  }
  function taxOld(salary, deductions) {
    const taxable = Math.max(0, salary - 50000 - (deductions || 0)); // standard deduction ₹50,000
    let tax = slabTax(taxable, OLD_SLABS);
    if (taxable <= 500000) tax = 0; // rebate up to ₹5 lakh taxable
    return { taxable, tax: Math.round(tax * 1.04) };
  }
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const CALC = { salary: 1500000, ded: 200000 };
  function calcHTML() {
    const n = taxNew(CALC.salary), o = taxOld(CALC.salary, CALC.ded), better = n.tax <= o.tax ? 'new' : 'old';
    return `<table class="iv-diff db-words"><thead><tr><th></th><th>New regime</th><th>Old regime</th></tr></thead><tbody>
      <tr><td><b>Taxable income</b></td><td>${inr(n.taxable)}</td><td>${inr(o.taxable)}</td></tr>
      <tr><td><b>Tax for the year</b> (with 4% cess)</td><td id="txNewTax"${better === 'new' ? ' class="tx-better"' : ''}>${inr(n.tax)}</td><td id="txOldTax"${better === 'old' ? ' class="tx-better"' : ''}>${inr(o.tax)}</td></tr>
      <tr><td><b>Tax per month</b> (roughly your monthly TDS)</td><td>${inr(n.tax / 12)}</td><td>${inr(o.tax / 12)}</td></tr></tbody></table>
      <p><b>${better === 'new' ? 'The new regime' : 'The old regime'} is lower by ${inr(Math.abs(n.tax - o.tax))}</b> for these numbers.</p>`;
  }
  document.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.txin;
    if (!k) return;
    CALC[k] = Math.max(0, Number(e.target.value) || 0);
    const out = document.getElementById('txCalcOut');
    if (out) out.innerHTML = calcHTML();
  });

  const TERMS = [
    ['Tax year', 'From 1 April 2026, the new Income-tax Act, 2025 uses one "tax year" (April–March), replacing "financial year / assessment year". Income up to 31 March 2026 still uses the old terms (FY 2025-26 = AY 2026-27).'],
    ['PAN', 'Your tax ID. Link it to Aadhaar; give it to your employer and bank.'],
    ['TDS', 'Tax deducted at source: your employer takes tax from each month\'s salary and pays it to the government for you.'],
    ['Form 16', 'Your employer\'s yearly certificate of salary paid and TDS deducted; usually given by June. You file your return with it.'],
    ['AIS / Form 26AS', 'On the income-tax portal: every income reported about you (salary, interest, dividends, share sales) and every tax paid. Check it before filing.'],
    ['ITR', 'Your income-tax return: the yearly form where you report all income and settle the tax. Filing it gets you any refund.'],
    ['Old / new regime', 'Two ways to calculate tax. The new regime (the default) has lower rates but almost no deductions; the old one has higher rates but deductions (80C, HRA, home loan…).'],
    ['Standard deduction', 'A flat amount taken off salary before tax: ₹75,000 in the new regime, ₹50,000 in the old.'],
    ['Cess', '4% extra on the tax itself (health and education cess).'],
    ['Advance tax', 'Tax paid during the year (not at the end) when TDS does not cover it, e.g. freelance income. Needed if the tax due is over ₹10,000.'],
  ];
  const SALARY_PARTS = [
    ['Basic, special allowance, bonus, variable pay', 'Fully taxed', 'Joining bonuses and performance bonuses too.'],
    ['HRA (house rent allowance)', 'Partly tax-free in the old regime if you pay rent', 'Needs rent receipts; the landlord\'s PAN if rent is over ₹1 lakh a year. No exemption in the new regime.'],
    ['Your PF contribution', 'Deduction (80C) in the old regime only', 'Up to ₹1.5 lakh together with PPF, ELSS, life insurance, home-loan principal, children\'s school fees.'],
    ['Employer PF', 'Not taxed (within limits)', 'Employer PF + NPS + superannuation above ₹7.5 lakh a year is taxed.'],
    ['Employer NPS contribution', 'Deduction in both regimes', 'Up to 14% of basic in the new regime (10% in the old). Ask HR if they offer it: it is one of the few new-regime savings.'],
    ['Meal cards, LTA, many allowances', 'Mostly old-regime benefits', 'In the new regime most of these exemptions do not apply.'],
    ['Phone / internet reimbursement', 'Not taxed when paid against bills', 'Both regimes.'],
    ['RSUs and ESOPs', 'Taxed as salary when they vest / you exercise', 'See "Shares, RSUs & ESOPs".'],
    ['Gratuity and leave encashment when you leave', 'Tax-free up to limits', 'Gratuity up to ₹20 lakh; leave encashment up to ₹25 lakh (private sector).'],
  ];
  const FILING = [
    'Get Form 16 from your employer (usually by June).',
    'Log in to incometax.gov.in and check AIS / Form 26AS: does salary and TDS match Form 16? Any interest, dividends or share sales you forgot?',
    'Pick the form: ITR-1 for salary + interest (income up to ₹50 lakh, one house); ITR-2 if you have capital gains beyond small exempt amounts, foreign assets (like US RSUs) or income over ₹50 lakh; ITR-3 / ITR-4 for freelance or business income.',
    'Choose your regime (salaried people can choose each year when filing) and claim deductions if you use the old regime.',
    'Pay any tax still due (it shows as "tax payable") before submitting.',
    'File before the due date: 31 July for most salaried people (it can change or be extended; check each year). Late filing means a fee (up to ₹5,000) and interest.',
    'E-verify within 30 days (Aadhaar OTP is easiest). An unverified return counts as not filed.',
    'The refund, if any, goes to a pre-validated bank account on the portal.',
  ];
  const SHARES = [
    ['RSUs', 'When they vest: their value is salary (your employer deducts TDS, often by selling some shares). When you sell: capital gains on the rise since vesting.', 'If you leave before vesting, unvested RSUs are usually lost.'],
    ['ESOPs', 'When you exercise: (market value − exercise price) is salary. When you sell: capital gains.', 'Employees of eligible DPIIT-recognised startups can defer the tax at exercise (until sale, leaving, or 5 years).'],
    ['Indian listed shares and equity mutual funds', 'Sold within 12 months: 20%. After 12 months: 12.5% on gains above ₹1.25 lakh a year.', 'Debt funds are taxed at your slab rate.'],
    ['Foreign shares (e.g. US RSUs)', 'Held up to 24 months: your slab rate. Over 24 months: 12.5%.', 'Foreign tax withheld on dividends can be claimed back with Form 67.'],
    ['Foreign assets disclosure', 'Report all foreign shares and accounts in Schedule FA of ITR-2, even if you sold nothing.', 'Missing it can bring heavy penalties under the Black Money Act. Many people with US RSUs forget this.'],
  ];
  const FREELANCE = [
    ['Presumptive scheme (44ADA)', 'Declare 50% of your receipts as profit, without keeping detailed books. For professionals, including software developers, with receipts up to ₹75 lakh if at most 5% is in cash (₹50 lakh otherwise). File ITR-4 if your total income is up to ₹50 lakh, ITR-3 above that.'],
    ['Advance tax', 'No employer deducts tax for you. Under the presumptive scheme, pay all of it by 15 March; otherwise in four parts (15 June 15%, 15 September 45%, 15 December 75%, 15 March 100%). Late payment means interest.'],
    ['GST', 'Registration is needed above ₹20 lakh turnover in a year (₹10 lakh in some states). Services to foreign clients count as exports: with a Letter of Undertaking (LUT) you charge 0% GST.'],
    ['Getting paid', 'Bank transfer (SWIFT), Wise, Skydo, Payoneer and similar: compare fees and the exchange-rate markup. Keep the FIRC / e-FIRA (proof of foreign payment) for every payment.'],
    ['Contractor or employee?', 'Through an Employer of Record (Deel, Remote…), you are an employee with TDS and payslips. As a direct contractor, you invoice and handle tax yourself.'],
    ['Habits', 'A separate bank account, an invoice for every payment, and a chartered accountant (CA) for the first year at least.'],
  ];
  const MONEY = [
    ['Emergency fund first', 'About 6 months of expenses in a savings account or liquid fund, for job loss or a medical emergency.'],
    ['Insurance', 'Health insurance beyond your company\'s cover (it ends when the job ends), and term life insurance if anyone depends on your income.'],
    ['Invest automatically', 'A monthly SIP (for example in index funds), EPF / VPF, PPF. Raise it with every hike, before your spending grows.'],
    ['Avoid expensive debt', 'Always pay the full credit card bill: interest on the unpaid amount is often over 40% a year. Avoid loans for gadgets and holidays.'],
    ['Be careful with trading tips', 'SEBI studies found about 9 in 10 individual F&O (futures and options) traders lose money.'],
    ['Keep records', 'Form 16, rent receipts, investment proofs, payslips and offer letters: you will need them for taxes, loans and visas.'],
  ];

  const tab = window.makeTopicTab({
    id: 'tx', title: '🧾 Tax & money', sub: 'India: your payslip, tax regimes, ITR, RSUs, freelancing and money basics',
    button: 'btnTax', map: 'tax', api: 'TaxLab', cat: 'Tax & money', icon: '🧾', solver: 'tax',
    scene: 'Your own salary, taxes and money as a developer in India.', hint: 'Which rule applies, and what does it cost you to get it wrong?',
    stages: [
      { key: 'terms', name: 'The words', title: 'The words you will meet', say: 'Rules for tax year 2026-27. General information, not tax advice: rules change every year, so check the income-tax portal or a CA.',
        view: (d, H) => H.table(null, TERMS) + H.note('Familiar names like 80C, 80D, 87A and 44ADA come from the old Income-tax Act, 1961. The 2025 Act renumbered the sections, but most people and tools still use the old names.') },
      { key: 'regime', name: 'Old vs new regime', title: 'Old or new regime: a calculator', say: 'Type your yearly salary and your old-regime deductions. The lower tax wins; you can choose again each year when you file.', detail: true,
        view: (d, H) => `<div class="tx-calc"><label>Yearly salary (₹, before tax) <input type="number" class="cl-search" data-txin="salary" value="${CALC.salary}" min="0" step="10000"></label>
          <label>Old-regime deductions (₹: 80C, 80D, HRA exemption, home-loan interest…) <input type="number" class="cl-search" data-txin="ded" value="${CALC.ded}" min="0" step="10000"></label></div>
          <div id="txCalcOut">${calcHTML()}</div>
          ${d ? `<p><b>New regime slabs</b> (after the ₹75,000 standard deduction)</p>${H.table(['Taxable income', 'Rate'], [['up to ₹4 lakh', '0%'], ['₹4–8 lakh', '5%'], ['₹8–12 lakh', '10%'], ['₹12–16 lakh', '15%'], ['₹16–20 lakh', '20%'], ['₹20–24 lakh', '25%'], ['above ₹24 lakh', '30%']])}
            ${H.note('No tax at all up to ₹12 lakh taxable (₹12.75 lakh of salary), thanks to the rebate; just above that, marginal relief keeps the tax from jumping.')}
            <p><b>Old regime slabs</b> (below 60, after the ₹50,000 standard deduction and your deductions)</p>${H.table(['Taxable income', 'Rate'], [['up to ₹2.5 lakh', '0%'], ['₹2.5–5 lakh', '5%'], ['₹5–10 lakh', '20%'], ['above ₹10 lakh', '30%']])}
            ${H.note('No tax up to ₹5 lakh taxable in the old regime. Above ₹50 lakh a surcharge is added (not in this calculator).')}` : H.more('both slab tables')}
          ${H.note('Roughly: with few deductions, the new regime usually wins. The old regime can win if you pay high rent (HRA) and have a home loan plus full 80C.')}` },
      { key: 'parts', name: 'Your salary parts', title: 'How each part of your salary is taxed', say: 'Your CTC breakup decides how much tax you pay.', detail: true,
        view: (d, H) => H.table(d ? ['Part', 'Taxed?', 'Note'] : ['Part', 'Taxed?'], SALARY_PARTS.map(r => d ? r : r.slice(0, 2))) + (d ? '' : H.more('a note on each part')) },
      { key: 'file', name: 'Filing your ITR', title: 'Filing your income-tax return', say: 'Even if your employer deducted all the tax, file your return: it is needed for refunds, loans and visas.',
        view: (d, H) => H.list(FILING, true) },
      { key: 'shares', name: 'Shares, RSUs & ESOPs', title: 'Tax on RSUs, ESOPs and shares', say: 'Stock is taxed twice: once as salary when you get it, again as capital gains when you sell.', detail: true,
        view: (d, H) => H.table(d ? ['What', 'How it is taxed', 'Watch out'] : ['What', 'How it is taxed'], SHARES.map(r => d ? r : r.slice(0, 2))) + (d ? '' : H.more('what to watch out for')) },
      { key: 'freelance', name: 'Freelancing', title: 'Freelancing and foreign clients', say: 'Working for clients abroad from India: income tax, GST and getting paid.',
        view: (d, H) => H.cards(FREELANCE) },
      { key: 'money', name: 'Money basics', title: 'Money basics for your first jobs', say: 'Habits that matter more than any single investment. General information, not financial advice.',
        view: (d, H) => H.cards(MONEY) },
    ],
    situations: [
      { id: 'tx-12l', title: 'Tax on ₹12.75 lakh', q: 'Your salary is ₹12,75,000 a year, new regime, no other income. How much income tax do you pay?', a: 'zero', choices: [['zero', '₹0'], ['63k', 'About ₹63,000'], ['1l', 'About ₹1 lakh']], why: 'After the ₹75,000 standard deduction, taxable income is ₹12 lakh, and the rebate makes tax zero up to ₹12 lakh taxable in the new regime.' },
      { id: 'tx-regime', title: 'Which regime?', q: 'You pay ₹25,000 a month rent, invest ₹1.5 lakh in 80C and pay ₹2 lakh home-loan interest. Which regime do you choose?', a: 'both', choices: [['both', 'Calculate both and pick the lower one'], ['new', 'Always the new regime: it is the default'], ['old', 'Always the old regime: deductions are good']], why: 'The answer depends on your numbers. With large HRA, 80C and home-loan deductions the old regime can win; otherwise the new one usually does. Salaried people can choose each year when filing.' },
      { id: 'tx-rsu-form', title: 'You hold US RSUs', q: 'You hold Amazon shares from RSUs (not sold). Which return do you file?', a: 'itr2', choices: [['itr2', 'ITR-2, with the shares listed in Schedule FA'], ['itr1', 'ITR-1: they were already taxed as salary'], ['none', 'Nothing extra until you sell']], why: 'Foreign assets must be reported every year in Schedule FA (in ITR-2), even if you sold nothing. ITR-1 cannot report foreign assets, and missing them can bring heavy penalties.' },
      { id: 'tx-ais', title: 'Forgotten interest', q: 'Your AIS shows ₹18,000 of fixed-deposit interest you forgot about.', a: 'include', choices: [['include', 'Include it in your return and pay any extra tax'], ['ignore', 'Ignore it: it is small'], ['wait', 'Wait for a notice first']], why: 'Banks report interest to the tax department, so a mismatch usually leads to a notice with interest. Interest is taxed at your slab rate (the bank\'s TDS may not cover all of it).' },
      { id: 'tx-freelance', title: 'Freelance income from abroad', q: 'You earned ₹30 lakh from US clients this year as a freelancer and kept no expense records.', a: 'presumptive', choices: [['presumptive', 'Use the presumptive scheme (50% as profit), file ITR-4, and pay advance tax by 15 March'], ['nothing', 'Foreign income is not taxed in India'], ['itr1', 'File ITR-1 like a salaried person']], why: 'Residents are taxed on income from anywhere. The presumptive scheme (44ADA) needs no detailed books: half of ₹30 lakh is taxable profit. With no employer deducting TDS, you pay advance tax yourself.' },
      { id: 'tx-gst', title: 'GST on export of services', q: 'Your freelance receipts from foreign clients will pass ₹25 lakh this year.', a: 'lut', choices: [['lut', 'Register for GST and file a LUT, then invoice foreign clients at 0% GST'], ['18', 'Charge foreign clients 18% GST'], ['skip', 'GST never applies to foreign clients']], why: 'Above the ₹20 lakh threshold you must register. Services to foreign clients are zero-rated exports: with a Letter of Undertaking you charge no GST, but you still file GST returns.' },
      { id: 'tx-two-jobs', title: 'Two employers in one year', q: 'You switched jobs in October. Both employers deducted TDS as if each paid your only salary.', a: 'declare', choices: [['declare', 'Give your new employer your earlier salary details (Form 12B), or pay the shortfall before filing'], ['fine', 'Nothing: each employer already deducted TDS'], ['refund', 'Expect a refund']], why: 'Each employer applied the lower slabs and the standard deduction separately, so too little tax was deducted overall. Declare your previous salary, or pay the balance before filing to avoid interest.' },
      { id: 'tx-card', title: 'The credit card bill', q: 'Your credit card bill is ₹60,000; the "minimum due" is ₹3,000.', a: 'full', choices: [['full', 'Pay the full amount by the due date'], ['min', 'Pay the minimum: it keeps the account fine'], ['skip', 'Pay next month together']], why: 'Paying only the minimum charges interest (often over 40% a year) on the rest, and on new purchases too. Paying in full every month makes the card free to use and helps your credit score.' },
    ],
  });
  window.TaxLab.taxNew = taxNew;
  window.TaxLab.taxOld = taxOld;
  void tab;
})();

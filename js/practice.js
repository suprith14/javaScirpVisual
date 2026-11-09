/*
 * JS Engine Lab — practice only: one straight list of every hands-on task, grouped by topic in learning order.
 *   predict: read the code, type what it prints, check it (then step through it)
 *   write:   the function bodies are removed; write them until the tests pass
 *   build:   a challenge: write the code from a task description
 * No theory items: each task has a small "need a hint?" link to the matching lesson instead.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const api = () => window.JSLabAPI;

  // topics in learning order; each has the lesson a hint opens
  const TOPICS = [
    ['Basics', 'callstack'], ['Scope & hoisting', 'hoisting'], ['Closures', 'closure'], ['this & functions', 'this'],
    ['Call stack limits', 'recursion'], ['Types & coercion', 'references'], ['Expressions & precedence', null], ['Numbers & strings inside', 'binary'],
    ['Strings & arrays', 'callbacks'], ['Objects', 'references'], ['Objects & classes', 'classes'], ['Prototypes', 'classes'],
    ['Modern syntax (ES6+)', 'iterators'], ['Errors', 'errors'], ['Dates, regex & JSON', 'regex'], ['Dates: Temporal', null],
    ['Event loop & promises', 'eventloop'], ['Rendering & frames', 'eventloop'], ['Async patterns', 'asyncawait'], ['Modules', 'modules'], ['Browser & DOM', 'dom'],
    ['HTML & accessibility', null], ['CSS: cascade & specificity', null], ['CSS: inheritance & units', null], ['CSS: box model', null],
    ['CSS: positioning & stacking', null], ['CSS: flexbox', null], ['CSS: grid', null], ['CSS: responsive', null], ['CSS: modern CSS', null],
    ['Network & HTTP', 'fetch'], ['Security', 'storage'], ['Auth & login', null], ['Web performance', 'lazyimport'], ['Rendering: CSR, SSR, SSG', null], ['Browser APIs', 'dom'], ['Offline & service workers', null], ['Live updates', null], ['Internationalisation', null], ['Frontend system design', 'patterns'], ['Databases', null], ['Deployment', null], ['Cloud (AWS)', null], ['Working in a team', null], ['Corporate life', null], ['Roles & pay', null], ['AI at work', null], ['Tax & money', null], ['Earning more', null], ['Freelancing', null], ['Open source', null], ['Design basics', null], ['Staying current', null], ['Health & career', null], ['How companies work', null], ['Interview strategy', null],
    ['TypeScript: types & inference', 'typescript'], ['TypeScript: objects & interfaces', 'typescript'], ['TypeScript: generics & utility types', 'typescript'], ['TypeScript: React', 'typescript'],
    ['Testing', null], ['Git & tools', null], ['Terminal & Git', null], ['Real projects', null],
    ['Node.js', 'nodeloop'], ['Node.js: streams & crypto', 'nodeloop'], ['Memory & garbage collection', 'references'], ['Memory & performance', 'internals'], ['Parsing & the JIT', 'internals'],
    ['Functional programming', 'callbacks'], ['Design patterns', 'patterns'],
    ['Implement it', 'closure'], ['How frameworks work', 'patterns'], ['Tricky output', 'eventloop'], ['Data structures', 'mapset'],
    ['Sorting & searching', 'loops'], ['Coding problems', 'recursion'], ['Advanced algorithms', 'recursion'],
  ];
  // the practice windows that open over the app: kind → [lab object, task list]
  const LABS = () => ({
    css: [window.CSSLab, window.CSS_TASKS], web: [window.WebLab, window.WEB_TASKS], ts: [window.TSLab, window.TS_TASKS],
    test: [window.TestLab, window.TEST_TASKS], project: [window.ProjectLab, window.PROJECTS],
  });
  // which topic each build challenge belongs to
  const CHALLENGE_TOPIC = {
    hello: 'Basics', sum: 'Basics', even: 'Basics', fizzbuzz: 'Basics', max: 'Basics', reverse: 'Strings & arrays', vowels: 'Strings & arrays',
    counter: 'Closures', evens: 'Strings & arrays', wordcount: 'Strings & arrays', rectangle: 'Objects & classes', fib: 'Coding problems',
    fixtdz: 'Scope & hoisting', order: 'Event loop & promises', delay: 'Async patterns', username: 'Async patterns', range: 'Modern syntax (ES6+)',
    clickcounter: 'Browser & DOM', delegation: 'Browser & DOM', debounce: 'Implement it', timeoutfetch: 'Async patterns', settled: 'Async patterns',
    readonly: 'Objects', deepcopy: 'Objects', bytes: 'Strings & arrays', workerdouble: 'Browser & DOM', nodeorder: 'Node.js', chat: 'Node.js',
    safecounter: 'Memory & performance', readjson: 'Node.js', httproute: 'Node.js', nodepath: 'Node.js', unique: 'Strings & arrays',
  };
  const KIND = { predict: ['🎯', 'predict the output'], write: ['✍️', 'write the code'], build: ['🧩', 'build it'], css: ['🎨', 'predict what the browser renders'], web: ['🌐', 'predict what the browser does'],
    ts: ['🔷', 'predict what TypeScript says'], test: ['🧪', 'write tests that catch the bugs'], project: ['🚀', 'build and ship a real project'] };
  const RANK = { Easy: 1, Medium: 2, Hard: 3 };

  let groups = null, order = null;
  function build() {
    if (order) return;
    const byTopic = new Map(TOPICS.map(([t]) => [t, []]));
    const topicOf = t => { if (!byTopic.has(t)) byTopic.set(t, []); return byTopic.get(t); };
    api().questions().filter(q => !api().isTheory(q)).forEach(q => {
      const write = api().canWrite(q);
      topicOf(q.cat).push({ key: (write ? 'w:' : 'q:') + q.id, kind: write ? 'write' : 'predict', id: q.id, title: q.title, ask: q.ask, rank: RANK[q.level] || 2, topic: q.cat });
    });
    api().challenges().forEach(c => {
      const t = CHALLENGE_TOPIC[c.id] || 'Coding problems';
      topicOf(t).push({ key: 'c:' + c.id, kind: 'build', id: c.id, title: c.title, ask: String(c.task || '').replace(/<[^>]+>/g, '').slice(0, 110), rank: typeof c.difficulty === 'number' ? c.difficulty : 2, topic: t, lesson: c.concept });
    });
    Object.entries(LABS()).forEach(([kind, [, tasks]]) => (tasks || []).forEach((t, k) => {
      topicOf(t.cat).push({ key: kind + ':' + t.id, kind, id: t.id, title: t.title, ask: String(t.ask || t.goal || '').replace(/<[^>]+>/g, ''), rank: 1 + k / 1000, topic: t.cat, icon: t.icon, klabel: t.kindLabel });
    }));
    const hint = new Map(TOPICS);
    groups = [];
    byTopic.forEach((items, topic) => {
      if (!items.length) return;
      items.sort((a, b) => a.rank - b.rank); // easier first (no labels shown)
      items.forEach(x => { if (!x.lesson) x.lesson = hint.get(topic) || null; });
      groups.push({ topic, items });
    });
    order = groups.flatMap(g => g.items);
  }
  const current = () => {
    let k = null;
    Object.entries(LABS()).forEach(([kind, [lab]]) => { const id = lab && lab.current(); if (id && !k) k = kind + ':' + id; });
    if (!k) k = api() && api().currentKey();
    return order ? order.findIndex(x => x.key === k) : -1;
  };
  // the CSS lab has its own ◀ ▶ (it is a window over the app)
  const cssNav = { position: () => ({ i: current(), n: order.length }), go: d => open(current() + d), list: () => showList() };

  function open(i) {
    build();
    const t = order[i];
    if (!t) return;
    const m = $('practiceList');
    if (m) m.classList.add('hidden');
    const labs = LABS();
    Object.entries(labs).forEach(([kind, [lab]]) => { if (kind !== t.kind && lab) lab.close(); });
    if (labs[t.kind]) labs[t.kind][0].open(t.id, cssNav);
    else if (t.kind === 'predict') api().openQuestion(t.id);
    else if (t.kind === 'write') api().openWriteIt(t.id);
    else api().openChallenge(t.id);
    try { localStorage.setItem('jsl.practice', String(i)); } catch (e) { /* private mode */ }
    setTimeout(pill, 0);
  }

  // ------------------------------------------------------------------ the list
  // quick access to the main tabs, from the top of the list
  const QUICK = [['projects', '🚀 Projects'], ['map', '🗺️ Map'], ['companies', '🏙️ Companies'], ['gethired', '🏆 Get hired'], ['earn', '💸 Earn more'], ['freelance', '🧑‍💻 Freelancing'], ['pixels', '🖥️ Code → Pixels'], ['perf', '📊 Performance'], ['db', '🗄️ Databases'], ['deploy', '🚢 Deployment'], ['process', '🏢 Teamwork'], ['devtools', '🧰 DevTools'], ['interview', '🎯 Interview prep'], ['corporate', '💼 Corporate life'], ['terminal', '⌨️ Terminal & Git'], ['roles', '💰 Roles & pay'], ['expr', '🌳 Expression tree'], ['ai', '🤖 AI at work'], ['tax', '🧾 Tax & money'], ['oss', '🌱 Open source'], ['design', '🎨 Design basics'], ['current', '📰 Staying current'], ['health', '🧘 Health & career'], ['business', '🏦 How companies work']];
  function quickOpen(k) {
    if (k === 'projects') { showList('Real projects'); return; }
    $('practiceList').classList.add('hidden');
    const open = { map: window.FrontendMap, companies: window.CompaniesLab, gethired: window.GetHiredLab, pixels: window.PixelsLab, perf: window.PerfLab, db: window.DatabaseLab, deploy: window.DeployLab, process: window.ProcessLab, devtools: window.DevtoolsLab, interview: window.InterviewPrep, corporate: window.CorporateLab, terminal: window.TerminalLab, roles: window.RolesPayLab, expr: window.ExpressionTree, ai: window.AiWorkLab, tax: window.TaxLab, oss: window.OssLab, earn: window.EarnLab, freelance: window.FreelanceLab, design: window.DesignLab, current: window.CurrentLab, health: window.HealthLab, business: window.BusinessLab }[k];
    if (open) open.open();
  }
  document.addEventListener('change', e => {
    if (!e.target.classList || !e.target.classList.contains('pl-jump') || !e.target.value) return;
    const h = [...document.querySelectorAll('#practiceList .pl-group')].find(x => x.textContent === e.target.value);
    if (h) h.scrollIntoView({ block: 'start' });
    e.target.value = '';
  });
  function showList(topic) {
    build();
    let m = $('practiceList');
    if (!m) {
      m = document.createElement('div');
      m.id = 'practiceList';
      m.className = 'modal hidden';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-label', 'Practice');
      m.innerHTML = '<div class="modal-card pl-card"><button class="close" data-plclose aria-label="Close">✕</button><div class="cbody"></div></div>';
      document.body.appendChild(m);
    }
    const now = current();
    let n = 0;
    const html = groups.map(g => `<h3 class="pl-group">${esc(g.topic)}</h3>` + g.items.map(t => {
      const i = n++;
      return `<button class="pl-item${i === now ? ' now' : ''}" data-pi="${i}"><span class="pl-n">${i + 1}</span><span class="pl-k" title="${esc(t.klabel || KIND[t.kind][1])}">${t.icon || KIND[t.kind][0]}</span><span class="pl-t"><b>${esc(t.title)}</b><small>${esc(t.klabel || KIND[t.kind][1])} · ${esc(t.ask)}</small></span></button>`;
    }).join('')).join('');
    const quick = `<div class="pl-quick">${QUICK.map(([k, label]) => `<button class="pl-q" data-plopen="${k}">${label}</button>`).join('')}
      <select class="pl-jump" aria-label="Jump to a topic"><option value="">Jump to topic…</option>${groups.map(g => `<option>${esc(g.topic)}</option>`).join('')}</select><button class="pl-q pl-x" data-plclose aria-label="Close the list" title="Close (Esc)">✕</button></div>`;
    m.querySelector('.cbody').innerHTML = `<h2 class="modal-title">🏋️ Practice</h2>${quick}
      <p class="pl-intro">${order.length} hands-on tasks, from the basics to hard problems. 🎯 predict what the code prints · ✍️ write the missing code · 🧩 build it from a description · 🎨🌐 predict what the browser does · 🔷 predict what TypeScript says · 🧪 write tests that catch bugs · 🚀 build real projects. Check your answer, then press ▶ to watch it run step by step.</p>${html}`;
    m.classList.remove('hidden');
    const head = typeof topic === 'string' ? [...m.querySelectorAll('.pl-group')].find(h => h.textContent === topic) : null;
    const cur = head || m.querySelector('.pl-item.now');
    if (cur) cur.scrollIntoView({ block: head ? 'start' : 'center' });
  }

  // ------------------------------------------------------------------ the pill: ◀ Task n / total ▶ · need a hint?
  function pill() {
    build();
    let p = $('practicePill');
    if (!p) {
      p = document.createElement('div');
      p.id = 'practicePill';
      p.className = 'pp hidden';
      p.setAttribute('role', 'group');
      p.setAttribute('aria-label', 'Practice');
      const anchor = document.querySelector('.phasebar .level-info');
      if (!anchor) return;
      anchor.parentNode.insertBefore(p, anchor.nextSibling);
    }
    const i = current();
    if (i < 0) { p.classList.add('hidden'); return; }
    const t = order[i];
    p.classList.remove('hidden');
    p.innerHTML = `<button class="btn small" id="ppPrev" title="Previous task"${i === 0 ? ' disabled' : ''}>◀</button>
      <button class="pp-now" id="ppList" title="All practice tasks">${t.icon || KIND[t.kind][0]} Task ${i + 1} / ${order.length}</button>
      <button class="btn small primary" id="ppNext" title="Next task"${i === order.length - 1 ? ' disabled' : ''}>▶</button>
      ${t.lesson ? `<button class="pp-hint" id="ppHint" title="Open the lesson about this">💡 need a hint?</button>` : ''}`;
  }

  function resume() {
    if (!$('btnPractice')) {
      const b = document.createElement('button');
      b.id = 'btnPractice';
      b.className = 'btn primary';
      b.textContent = '🏋️ Practice';
      b.title = 'Every hands-on task in one list';
      const ref = $('btnInterview');
      ref.parentNode.insertBefore(b, ref);
      const map = document.createElement('button');
      map.id = 'btnMap';
      map.className = 'btn';
      map.textContent = '🗺️ Map';
      map.title = 'Everything a frontend developer should know exists';
      ref.parentNode.insertBefore(map, ref);
      const co = document.createElement('button');
      co.id = 'btnCompanies';
      co.className = 'btn';
      co.textContent = '🏙️ Companies';
      co.title = 'Companies hiring frontend developers: India, abroad, remote';
      ref.parentNode.insertBefore(co, ref);
      const gh = document.createElement('button');
      gh.id = 'btnGetHired';
      gh.className = 'btn';
      gh.textContent = '🏆 Get hired';
      gh.title = 'Strategies to get interviews and pass them';
      ref.parentNode.insertBefore(gh, ref);
      const earn = document.createElement('button');
      earn.id = 'btnEarn';
      earn.className = 'btn';
      earn.textContent = '💸 Earn more';
      earn.title = 'Ways to earn more as a developer: your job, freelancing, products, content, small tips';
      ref.parentNode.insertBefore(earn, ref);
      // the topic tabs sit in one "Topics" menu, so the top bar stays on one line
      const wrap = document.createElement('div');
      wrap.className = 'tp-wrap';
      wrap.innerHTML = `<button class="btn" id="btnTopics" aria-haspopup="true" aria-expanded="false" title="Code → Pixels, Performance, Databases, Deployment, Teamwork">📚 Topics ▾</button>
        <div class="tp-menu hidden" id="topicsMenu" role="menu">${[
          ['btnPixels', '🖥️ Code → Pixels', 'how the browser turns code into the page'],
          ['btnPerf', '📊 Performance', 'how it is measured, and the score %'],
          ['btnDb', '🗄️ Databases', 'the kinds, SQL, and which to use'],
          ['btnDeploy', '🚢 Deployment', 'from your laptop to a public URL, AWS'],
          ['btnProcess', '🏢 Teamwork', 'how real projects run in a team'],
          ['btnDevtools', '🧰 DevTools & debugging', 'find any bug; every panel explained'],
          ['btnInterviewPrep', '🎯 Interview prep', 'the rounds, 40 questions, how to prepare'],
          ['btnCorporate', '💼 Corporate life', 'levels, appraisals, salary (CTC), workplace skills'],
          ['btnTerminal', '⌨️ Terminal & Git', 'the Linux and Git commands used every day'],
          ['btnRoles', '💰 Roles & pay', 'job titles, responsibilities, salary, bonus, ESOPs'],
          ['btnExpr', '🌳 Expression tree', 'how JavaScript groups and evaluates an expression'],
          ['btnAi', '🤖 AI at work', 'AI tools like a pro, and building AI features'],
          ['btnTax', '🧾 Tax & money', 'regime calculator, ITR, RSUs, freelancing (India)'],
          ['btnOss', '🌱 Open source', 'your first PR, programmes, licences, building in public'],
          ['btnFreelance', '🧑‍💻 Freelancing', 'scratch to pro: clients, scripts, pricing, contracts'],
          ['btnDesign', '🎨 Design basics', 'spacing, type, colour, contrast checker, Figma'],
          ['btnCurrent', '📰 Staying current', 'sources, release notes, judging new tools, routine'],
          ['btnHealth', '🧘 Health & career', 'desk setup, eyes, sleep, burnout, sustainable pace'],
          ['btnBusiness', '🏦 How companies work', 'how companies make money, funding, unit economics'],
        ].map(([id, text, sub]) => `<button class="tp-item" id="${id}" role="menuitem"><b>${text}</b><small>${sub}</small></button>`).join('')}</div>`;
      ref.parentNode.insertBefore(wrap, ref);
    }
    pill();
    const menu = $('topicsMenu'), toggle = $('btnTopics');
    const setMenu = on => { menu.classList.toggle('hidden', !on); toggle.setAttribute('aria-expanded', String(on)); };
    document.addEventListener('click', e => {
      if (e.target.closest('#btnTopics')) { setMenu(menu.classList.contains('hidden')); return; }
      if (!e.target.closest('#topicsMenu') || e.target.closest('.tp-item')) setMenu(false);
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    const title = $('levelTitle');
    if (title && window.MutationObserver) new MutationObserver(pill).observe(title, { childList: true, characterData: true, subtree: true });
  }

  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnPractice') || t.closest('#ppList')) { showList(); return; }
    if (t.closest('#ppPrev')) { open(current() - 1); return; }
    if (t.closest('#ppNext')) { open(current() + 1); return; }
    if (t.closest('#ppHint')) { const x = order[current()]; if (x && x.lesson) api().showLesson(x.lesson); return; }
    const q = t.closest('[data-plopen]');
    if (q) { quickOpen(q.dataset.plopen); return; }
    const item = t.closest('.pl-item');
    if (item) { open(+item.dataset.pi); return; }
    if (t.closest('[data-plclose]')) $('practiceList').classList.add('hidden');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { const m = $('practiceList'); if (m) m.classList.add('hidden'); } });

  window.JSPractice = { showList, open, resume, list: () => { build(); return order; }, groups: () => { build(); return groups; } };
})();

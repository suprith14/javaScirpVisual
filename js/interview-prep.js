/*
 * JS Engine Lab — 🎯 Interview prep: how frontend interviews work, round by round, and how to prepare for each.
 *   1 the rounds → 2 quick answers (40 questions) → 3 machine coding → 4 system design → 5 behavioural → 6 before and after
 * Brief by default; "+ Show details" adds the longer answers, code and examples. Links open the matching practice.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const L = (...lines) => lines.join('\n');

  // [round, what it tests, length, how to prepare, practice link ('topic:…' | 'tab:…')]
  const ROUNDS = [
    ['📞 Recruiter screen', 'Your background, motivation, availability, salary range.', '20–30 min', 'A 60-second introduction; why this company; your salary range researched.', null],
    ['🧠 JavaScript & web fundamentals', 'Closures, this, the event loop, promises, prototypes, CSS layout, the DOM, HTTP, the browser.', '45–60 min', 'The Practice list in order; explain each answer out loud.', 'topic:Event loop & promises'],
    ['🧩 Coding (data structures & algorithms)', 'Arrays, strings, hash maps, two pointers, recursion, trees, complexity (Big-O).', '45–60 min', 'Solve, then explain the time and space cost; talk while you code.', 'topic:Coding problems'],
    ['🛠️ Machine coding (build a UI)', 'Build a small working component or app: autocomplete, modal, tabs, star rating, todo, infinite scroll.', '60–90 min', 'Practise with a timer; follow the method in step 3.', 'topic:Implement it'],
    ['🏗️ Frontend system design', 'Design a feed, chat, autocomplete or dashboard: components, data, API, performance, accessibility.', '45–60 min', 'Use the RADIO framework in step 4.', 'topic:Frontend system design'],
    ['🤝 Behavioural / culture', 'How you work with people: conflict, mistakes, ownership, feedback.', '30–45 min', 'Five STAR stories from your projects (step 5).', 'tab:process'],
    ['📦 Take-home (some companies)', 'A small app built in a few days.', '4–8 hours', 'Scope it, test it, write a README with decisions and what you would do next.', null],
  ];

  // quick answers: [group, question, short answer, longer answer, practice topic]
  const QA = [
    ['JavaScript', 'What is a closure?', 'A function that remembers the variables from where it was created, even after that code has finished.', 'Used for private state, debounce, and every React hook. Classic bug: var in a loop shares one variable; let creates a new one per iteration.', 'Closures'],
    ['JavaScript', 'var vs let vs const?', 'var is function-scoped and hoisted as undefined; let and const are block-scoped and in the "temporal dead zone" until declared. const cannot be reassigned.', 'const does not make objects immutable: the binding is fixed, the object can still change (use Object.freeze for shallow immutability).', 'Scope & hoisting'],
    ['JavaScript', 'How is `this` decided?', 'By how a function is called: obj.method() → obj; plain call → undefined (strict); new → the new object; call/apply/bind set it; arrow functions take it from outside.', 'Common bug: passing obj.method as a callback loses `this`; fix with an arrow function or bind.', 'this & functions'],
    ['JavaScript', 'Explain the event loop.', 'JS runs one thing at a time on the call stack. When it is empty, all microtasks (promises) run, then one task (timer, event), then rendering if needed.', 'So Promise.then runs before setTimeout(0), and a long task blocks clicks and painting.', 'Event loop & promises'],
    ['JavaScript', 'Promise.all vs allSettled vs race vs any?', 'all: all succeed or the first error; allSettled: every result, never rejects; race: the first to settle; any: the first success.', 'Use allSettled for "load what you can"; race for timeouts.', 'Async patterns'],
    ['JavaScript', '== vs ===?', '=== compares without type conversion; == converts types first ("1" == 1 is true). Use ===.', 'The one common use of == is x == null, which checks null and undefined together.', 'Types & coercion'],
    ['JavaScript', 'How does prototypal inheritance work?', 'Objects link to a prototype; a missing property is looked up along the chain. Classes are syntax over this.', 'Methods live once on the prototype and are shared by all instances.', 'Prototypes'],
    ['JavaScript', 'Debounce vs throttle?', 'Debounce waits until calls stop (search input); throttle runs at most once per interval (scroll, resize).', 'Be ready to write both from scratch.', 'Implement it'],
    ['JavaScript', 'Shallow vs deep copy?', 'A shallow copy ({...obj}) copies the top level only; nested objects are shared. structuredClone makes a deep copy.', 'JSON.parse(JSON.stringify()) loses dates, undefined, Maps and functions.', 'Objects'],
    ['JavaScript', 'What is a memory leak in a web app?', 'Memory that stays reachable but is no longer needed: forgotten listeners, timers, growing caches, detached DOM nodes.', 'Find it with a heap snapshot comparison in DevTools → Memory.', 'Memory & garbage collection'],
    ['JavaScript', 'ES modules vs CommonJS?', 'ESM (import/export) is static, works in browsers, enables tree shaking; CommonJS (require) is Node\'s older dynamic system.', 'Dynamic import() loads code on demand (code splitting).', 'Modules'],
    ['JavaScript', 'What does async/await do?', 'Syntax over promises: await pauses the async function (not the thread) until the promise settles; errors become exceptions for try/catch.', 'Awaiting in a loop runs one by one; use Promise.all to run in parallel.', 'Async patterns'],
    ['React', 'What happens when state changes?', 'React re-renders the component (and its children), compares the new elements with the old (reconciliation), and applies only the differences to the DOM.', 'Updates are batched; the render must be pure; effects run after the browser paints.', null],
    ['React', 'Why do lists need keys?', 'Keys tell React which item is which between renders, so it can move, keep or remove the right elements and their state.', 'Index keys break when items are inserted or reordered (wrong input values, lost focus).', null],
    ['React', 'useEffect: when does it run?', 'After the render is painted; again when a dependency changes; the cleanup runs before the next effect and on unmount.', 'Not for derived data or event handling; mainly for syncing with something outside React.', null],
    ['React', 'useMemo, useCallback, React.memo?', 'Memoise a value, a function, or a component\'s render, so they are reused when inputs are the same.', 'Only worth it for expensive work or to keep props stable for memoised children; the React Compiler can do this automatically.', null],
    ['React', 'Controlled vs uncontrolled inputs?', 'Controlled: React state holds the value (value + onChange). Uncontrolled: the DOM holds it, read with a ref or FormData.', 'Form libraries (React Hook Form) use uncontrolled inputs for speed.', null],
    ['React', 'How do you avoid prop drilling?', 'Composition (pass components as children), context for app-wide values, or a store (Zustand, Redux) for shared state.', 'Server data belongs in React Query / SWR, not in global state.', null],
    ['React', 'What are Server Components?', 'Components that run only on the server; they can read data directly and send no JavaScript to the browser. Client Components ("use client") handle interaction.', 'Used in Next.js App Router; they reduce bundle size.', null],
    ['React', 'What is hydration?', 'React attaching event handlers to server-rendered HTML. The first client render must match the server output exactly.', 'Mismatches come from dates, random values, window or localStorage during render.', 'Rendering: CSR, SSR, SSG'],
    ['React', 'How do you find a slow component?', 'React DevTools Profiler: record, find components that render often or slowly, then fix the cause (state too high, unstable props, heavy work).', 'For long lists: virtualisation.', null],
    ['React', 'Error boundaries?', 'Class components (or a library) that catch render errors in their children and show a fallback instead of a blank page.', 'They do not catch errors in event handlers or async code.', null],
    ['CSS & HTML', 'How does specificity work?', 'Inline > id > class / attribute / pseudo-class > element. Equal specificity: the later rule wins. !important and @layer change the order.', 'Keep specificity low and flat (one class) to avoid fights.', 'CSS: cascade & specificity'],
    ['CSS & HTML', 'Flexbox vs Grid?', 'Flexbox lays out in one direction (a row of buttons); Grid in two (a page or card layout).', 'They combine well: grid for the page, flex inside the parts.', 'CSS: flexbox'],
    ['CSS & HTML', 'What creates a stacking context?', 'A positioned element with z-index, opacity < 1, transform, filter, isolation: isolate, and more. z-index only competes inside the same context.', 'Why a modal with z-index: 9999 can still be under a header.', 'CSS: positioning & stacking'],
    ['CSS & HTML', 'box-sizing: border-box?', 'Width includes padding and border, so a 200px box stays 200px.', 'Most resets set it on everything.', 'CSS: box model'],
    ['CSS & HTML', 'Why semantic HTML?', 'The right element (button, nav, label, h1) gives keyboard support, screen-reader meaning and SEO for free.', 'A div with onclick has none of these.', 'HTML & accessibility'],
    ['CSS & HTML', 'How do you make a site responsive?', 'Fluid layouts (flex, grid, %), media and container queries, clamp() for type, responsive images (srcset), mobile first.', 'Test on a real phone and with zoom at 200%.', 'CSS: responsive'],
    ['Browser & web', 'What happens when you type a URL?', 'DNS lookup → TCP / TLS connection → HTTP request → HTML arrives → parse to DOM, CSSOM → render tree → layout → paint → composite; scripts and resources load along the way.', 'See it step by step in 🖥️ Code → Pixels.', 'Rendering & frames'],
    ['Browser & web', 'What is CORS?', 'A browser rule: a page may only read responses from another origin if that server allows it with Access-Control-Allow-* headers.', 'It protects users\' data, not your server; requests with custom headers or JSON send a preflight first.', 'Network & HTTP'],
    ['Browser & web', 'How does HTTP caching work?', 'Cache-Control says how long a response is fresh; ETag / Last-Modified let the browser revalidate (304). Hashed files: cache a year; HTML: no-cache.', null, 'Network & HTTP'],
    ['Browser & web', 'XSS and CSRF?', 'XSS: attacker script runs on your page (escape output, avoid innerHTML, CSP). CSRF: another site makes the browser send a request with your cookies (SameSite cookies, CSRF tokens).', null, 'Security'],
    ['Browser & web', 'Where should a login token live?', 'Preferably in an HttpOnly, Secure, SameSite cookie, so scripts (and XSS) cannot read it.', 'localStorage is readable by any script on the page.', 'Auth & login'],
    ['Browser & web', 'What are Core Web Vitals?', 'LCP (loading, ≤ 2.5s), INP (responsiveness, ≤ 200ms), CLS (layout stability, ≤ 0.1), measured on real users at the 75th percentile.', 'See 📊 Performance.', 'Web performance'],
    ['Browser & web', 'How do you make a page load faster?', 'Ship less JavaScript (code splitting), optimise images, cache well, preload the LCP image, defer non-critical scripts, render on the server where it helps.', 'Measure first (Lighthouse, Performance panel), then fix the biggest cost.', 'Web performance'],
    ['Browser & web', 'localStorage vs sessionStorage vs cookies vs IndexedDB?', 'localStorage: small strings, kept; sessionStorage: per tab; cookies: sent to the server with requests; IndexedDB: large structured data, async.', null, 'Browser APIs'],
    ['Tools & practice', 'TypeScript: type vs interface?', 'Both describe object shapes; interfaces can be extended and merged; types can also be unions, tuples and mapped types.', 'Pick one style per codebase; use type for unions.', 'TypeScript: objects & interfaces'],
    ['Tools & practice', 'How do you test a React component?', 'Render it with Testing Library, find elements by role and text like a user, interact with user-event, assert on what is shown.', 'Test behaviour, not implementation details.', 'Testing'],
    ['Tools & practice', 'What does a bundler do?', 'Follows imports from an entry file, combines and minifies the code, splits it into chunks, hashes file names, and handles CSS and assets.', 'Vite uses native ESM in development and Rollup for production builds.', null],
    ['Tools & practice', 'git merge vs rebase?', 'Merge keeps history as it happened with a merge commit; rebase replays your commits on top for a straight line. Do not rebase shared branches.', null, 'Git & tools'],
  ];

  const MC_STEPS = [
    ['Clarify (5 min)', 'Repeat the task; ask about must-haves, data source, edge cases; agree what "done" means.'],
    ['Plan (5 min)', 'Sketch the components and the state: what is state, what is derived, where it lives.'],
    ['Build the core first', 'Get the main flow working end to end before any styling.'],
    ['Handle the states', 'Loading, empty, error, and the edge cases you listed.'],
    ['Accessibility and polish', 'Real buttons, labels, keyboard use, focus; then a little CSS.'],
    ['Talk the whole time', 'Say what you are doing and why; mention what you would add with more time (tests, caching).'],
  ];
  const MC_PROMPTS = [
    ['Autocomplete / typeahead', 'debounce, cancel stale requests, keyboard navigation (↑ ↓ Enter Esc), ARIA combobox'],
    ['Modal dialog', 'focus moves in and returns, Esc to close, background inert, a portal'],
    ['Tabs / accordion', 'roving focus with arrow keys, aria-selected / aria-expanded'],
    ['Star rating', 'hover preview, keyboard, a controlled value'],
    ['Todo list', 'add / edit / delete / filter, derived counts, localStorage'],
    ['Infinite scroll feed', 'IntersectionObserver, cursor pages, loading and end states'],
    ['Data table', 'sort, filter, paginate, sticky header; memoise the derived rows'],
    ['Kanban board', 'drag and drop (or buttons for accessibility), moving items between lists'],
    ['Form with validation', 'field and form errors, async validation, disabled submit, accessible messages'],
    ['Countdown / stopwatch', 'setInterval vs time difference, cleanup on unmount'],
    ['Image carousel', 'prev / next, auto-play that pauses on hover and focus, lazy images'],
    ['Nested comments', 'recursive components, collapse, reply'],
  ];
  const MC_CODE = L(
    'function Autocomplete({ search }) {',
    '  const [query, setQuery] = useState("");',
    '  const [results, setResults] = useState([]);',
    '  const [active, setActive] = useState(-1);',
    '',
    '  useEffect(() => {',
    '    if (!query) { setResults([]); return; }',
    '    const controller = new AbortController();',
    '    const t = setTimeout(() => {',
    '      search(query, controller.signal)          // debounced by 300ms',
    '        .then(setResults)',
    '        .catch(e => { if (e.name !== "AbortError") throw e; });',
    '    }, 300);',
    '    return () => { clearTimeout(t); controller.abort(); };   // stale requests cancelled',
    '  }, [query]);',
    '',
    '  function onKeyDown(e) {',
    '    if (e.key === "ArrowDown") setActive(i => Math.min(i + 1, results.length - 1));',
    '    if (e.key === "ArrowUp") setActive(i => Math.max(i - 1, 0));',
    '    if (e.key === "Escape") setResults([]);',
    '  }',
    '',
    '  return (',
    '    <div>',
    '      <input role="combobox" aria-expanded={results.length > 0} aria-controls="list"',
    '        value={query} onChange={e => setQuery(e.target.value)} onKeyDown={onKeyDown} />',
    '      <ul id="list" role="listbox">',
    '        {results.map((r, i) => <li key={r.id} role="option" aria-selected={i === active}>{r.name}</li>)}',
    '      </ul>',
    '    </div>',
    '  );',
    '}');

  const RADIO = [
    ['R · Requirements', 'Ask what it must do (features), for whom, on which devices, how much data, offline?, real-time?', 'Write the list down and agree on the core 3–4 features; park the rest.'],
    ['A · Architecture', 'Draw the main components and how data flows: server, API, client store, views.', 'For a feed: FeedPage → Composer, FeedList → Post (with Comments); a data layer with a cache.'],
    ['D · Data model', 'What entities exist in the client (Post, User, Comment), how they are stored (normalised by id), and what is server vs UI state.', 'Normalised data avoids duplicates when the same user appears in many posts.'],
    ['I · Interface (API)', 'The endpoints or GraphQL queries with their parameters and responses; pagination; real-time updates.', 'GET /feed?cursor=…&limit=20 → { items, nextCursor }; new posts via SSE or WebSocket.'],
    ['O · Optimisations', 'Performance (virtualised list, image sizes, prefetching, caching), accessibility, error and offline handling, security, i18n.', 'Pick the 3–4 that matter most for this product and explain the trade-offs.'],
  ];
  const SD_PROMPTS = ['A news feed (Facebook / Twitter)', 'An autocomplete search', 'A chat app', 'An analytics dashboard', 'An image gallery / Pinterest grid', 'An e-commerce product page and cart', 'A collaborative editor (Google Docs, basic)', 'A video player page', 'A notification system', 'A form builder'];

  const BEHAVIOURAL = [
    ['Tell me about a hard bug you fixed.', 'How you debug: steps, tools, persistence, what you learned.'],
    ['Tell me about a conflict with a teammate.', 'You stay calm, listen, use facts, and find a good outcome together.'],
    ['Tell me about a mistake you made.', 'Honesty, ownership, the fix, and what you changed to prevent it.'],
    ['Tell me about a project you are proud of.', 'Your part, the decisions, the result in numbers.'],
    ['Tell me about a time you disagreed with a decision.', 'You raise concerns with reasons, then commit once it is decided.'],
    ['How do you learn something new quickly?', 'A real example and your method (docs, small experiments, asking).'],
  ];
  const STAR_EXAMPLE = L('Situation: Our product page took 4.2 seconds to show the main image on phones (LCP), and conversion was dropping.', 'Task: I owned improving it within the sprint without changing the design.', 'Action: I measured with Lighthouse and the Performance panel, found a 1.6 MB hero image and a blocking script, converted the image to AVIF with srcset, preloaded it, and deferred the script. I added a Lighthouse CI budget so it could not regress.', 'Result: LCP dropped to 1.7 seconds at the 75th percentile, and mobile conversion went up 6% the next month. The budget has caught two regressions since.');

  const BEFORE_AFTER = [
    ['Your CV', 'One page; each line is an achievement with a number ("cut bundle size 40%"), not a duty. Put links to live projects and GitHub at the top.'],
    ['Portfolio', '2–3 finished projects with a live URL, a README (what, why, how to run, what you learned) and clean commits.'],
    ['GitHub and LinkedIn', 'Pinned projects, a short profile, the same story as your CV.'],
    ['Research the company', 'Use their product; read their engineering blog; know what they build and why you want to join.'],
    ['Questions to ask them', 'What does a normal week look like? How do you review code and release? What would success look like in my first 3 months? What is the hardest technical problem right now? How do you support learning?'],
    ['During the interview', 'Think out loud; it is fine to say "I do not know, but here is how I would find out". Ask clarifying questions before solving.'],
    ['After the interview', 'A short thank-you message; write down the questions you got and what you would answer better next time.'],
    ['Offers', 'Know your range from salary data; ask about the whole package (salary, bonus, equity, learning budget, remote); it is normal to negotiate politely.'],
    ['Rejections', 'Normal, even for strong people. Ask for feedback, fix one gap, apply again. Volume and steady practice win.'],
  ];

  const STAGES = [
    { key: 'rounds', name: 'The rounds', title: 'The rounds of a frontend interview', say: 'Most companies use some of these. Ask the recruiter which ones, then prepare for each.' },
    { key: 'qa', name: 'Quick answers', title: '40 questions you will be asked', say: 'Short answers to say out loud. Practise them until you can explain each one in your own words.' },
    { key: 'mc', name: 'Machine coding', title: 'The machine-coding round', say: 'Build a working UI in an hour or so. A clear method matters more than speed.' },
    { key: 'sd', name: 'System design', title: 'Frontend system design (RADIO)', say: 'There is no single right answer: they want to see how you think and explain trade-offs.' },
    { key: 'beh', name: 'Behavioural', title: 'Behavioural questions (STAR)', say: 'Stories from your real projects, told clearly: Situation, Task, Action, Result.' },
    { key: 'ba', name: 'Before & after', title: 'Before and after the interviews', say: 'CV, portfolio, questions to ask, offers and rejections.' },
  ];
  const UI = { stage: 0, detail: false, open: {} };
  const link = l => {
    if (!l) return '';
    const [k, ref] = l.split(':');
    return k === 'tab' ? `<button class="fm-go" data-ipproc>🏢 open</button>` : `<button class="fm-go" data-iptopic="${esc(ref)}">▶ practise</button>`;
  };
  const VIEWS = {
    rounds: () => `<div class="ip-rounds">${ROUNDS.map(([n, what, len, prep, l]) => `<div class="db-card"><div class="db-h"><b>${esc(n)}</b> <small class="ip-len">${esc(len)}</small></div><p>${esc(what)}</p><p class="db-how"><b>Prepare:</b> ${esc(prep)}</p>${link(l)}</div>`).join('')}</div>
      <p class="cl-note">Typical order: recruiter → one or two technical rounds → an onsite / final loop (coding, machine coding, system design, behavioural). For juniors, system design is often lighter.</p>`,
    qa: () => {
      const groups = [...new Set(QA.map(x => x[0]))];
      return groups.map(g => `<h4 class="ip-group">${esc(g)}</h4>${QA.map((x, i) => [x, i]).filter(([x]) => x[0] === g).map(([[, q, a, more, topic], i]) => `<div class="ip-qa${UI.open[i] ? ' open' : ''}"><button class="ip-q" data-ipq="${i}" aria-expanded="${!!UI.open[i]}">${esc(q)}</button>${UI.open[i] ? `<div class="ip-a"><p>${esc(a)}</p>${more && UI.detail ? `<p class="db-how">${esc(more)}</p>` : ''}${topic ? `<button class="fm-go" data-iptopic="${esc(topic)}">▶ practise: ${esc(topic)}</button>` : ''}</div>` : ''}</div>`).join('')}`).join('')
        + '<p class="cl-note">Say the answer out loud first, then click the question to compare. "+ Show details" adds a follow-up point for each.</p>';
    },
    mc: () => `<ol class="dp-steps">${MC_STEPS.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>
      <p><b>Common tasks, and what they check</b></p><table class="iv-diff db-words"><tbody>${MC_PROMPTS.map(([t, k]) => `<tr><td><b>${esc(t)}</b></td><td>${esc(k)}</td></tr>`).join('')}</tbody></table>
      ${UI.detail ? `<p><b>Example: an autocomplete with debounce, stale-request cancelling and keyboard support</b></p><pre class="px-src">${esc(MC_CODE)}</pre>` : '<p class="cl-note">"+ Show details" shows a full autocomplete solution, the most common task.</p>'}
      <p class="cl-note">Practise: ReactVisual's machine-coding challenges, and the "Implement it" topic in the Practice list.</p>`,
    sd: () => `<ol class="dp-steps">${RADIO.map(([t, d, ex]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span>${UI.detail ? `<i class="ip-ex">e.g. ${esc(ex)}</i>` : ''}</li>`).join('')}</ol>
      <p><b>Common prompts:</b> ${SD_PROMPTS.map(esc).join(' · ')}</p>
      <p class="cl-note">Spend about 5 min on requirements, 10 on architecture and data, 10 on the API, the rest on optimisations, and draw while you talk. The system-design tasks in Practice and the 📊 🗄️ 🚢 tabs give you the material.</p>`,
    beh: () => `<p><b>STAR:</b> <b>S</b>ituation (the context) · <b>T</b>ask (your job) · <b>A</b>ction (what <i>you</i> did, in detail) · <b>R</b>esult (with numbers, and what you learned). About two minutes per story.</p>
      <table class="iv-diff db-words"><thead><tr><th>question</th><th>what they are really checking</th></tr></thead><tbody>${BEHAVIOURAL.map(([q, c]) => `<tr><td><b>${esc(q)}</b></td><td>${esc(c)}</td></tr>`).join('')}</tbody></table>
      ${UI.detail ? `<p><b>An example answer</b></p><pre class="px-src">${esc(STAR_EXAMPLE)}</pre>` : '<p class="cl-note">"+ Show details" shows a full example answer.</p>'}
      <p class="cl-note">Prepare 5 stories from your 🚀 projects; most questions can be answered with one of them. Say "I", not "we", for your part.</p>`,
    ba: () => `<div class="db-grid dp-must">${BEFORE_AFTER.map(([t, d]) => `<div class="db-card"><div class="db-h"><b>${esc(t)}</b></div><p>${esc(d)}</p></div>`).join('')}</div>`,
  };

  function ensure() {
    let m = $('ipLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'ipLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Interview prep');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-ipclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🎯 Interview prep</h2><span class="cl-note">how frontend interviews work, and how to prepare for each round</span></div>
      <div class="px-rail" id="ipRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="ipTitle"></h3><p class="px-say" id="ipSay"></p><button class="btn small dp-detail" id="ipDetail" data-ipdetail></button><div id="ipBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="ipPrev">◀ Back</button><button class="btn small primary" id="ipNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('ipRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-ipstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('ipTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('ipSay').textContent = s.say;
    $('ipBody').innerHTML = VIEWS[s.key]();
    $('ipDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('ipDetail').classList.toggle('hidden', ['rounds', 'ba'].includes(s.key));
    $('ipPrev').disabled = UI.stage === 0;
    $('ipNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('ipLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnInterviewPrep') || t.closest('[data-fminterview]')) { open(); return; }
    if (!$('ipLab') || $('ipLab').classList.contains('hidden')) return;
    const st = t.closest('[data-ipstage]');
    if (st) { UI.stage = +st.dataset.ipstage; draw(); return; }
    const qq = t.closest('[data-ipq]');
    if (qq) { const i = +qq.dataset.ipq; UI.open[i] = !UI.open[i]; const box = $('ipBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    const tp = t.closest('[data-iptopic]');
    if (tp) { close(); if (window.JSPractice) window.JSPractice.showList(tp.dataset.iptopic); return; }
    if (t.closest('[data-ipproc]')) { close(); if (window.ProcessLab) window.ProcessLab.open(); return; }
    if (t.closest('[data-ipdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#ipPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#ipNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-ipclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('ipLab') && !$('ipLab').classList.contains('hidden')) close(); });

  window.InterviewPrep = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, qa: QA, rounds: ROUNDS, toggle: i => { UI.open[i] = !UI.open[i]; draw(); } };
})();

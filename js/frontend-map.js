/*
 * JS Engine Lab — 🗺️ the map: everything a frontend developer should at least know EXISTS.
 * One line per item: what it is / when you meet it. Items with practice link straight to it
 * (a topic of the practice list, a task, a project brief, or the React lab); the rest are "good to know".
 *   link: 'topic:<practice topic>' | 'task:<id>' | 'project:<id>' | 'react' | null
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  window.FRONTEND_MAP = [
    ['JavaScript, the language', [
      ['Types, coercion, == vs ===', 'the 7 primitives plus objects; how values convert; why [] + {} is a string', 'topic:Types & coercion'],
      ['Scope, hoisting, closures', 'where variables live and how functions remember them: the base of hooks, debounce and modules', 'topic:Closures'],
      ['this, call / apply / bind', 'what this is in methods, callbacks, arrow functions and classes', 'topic:this & functions'],
      ['Prototypes and classes', 'how property lookup walks the prototype chain; class is syntax on top of it', 'topic:Prototypes'],
      ['Promises, async / await, the event loop', 'the call stack, microtasks and tasks: why code runs in the order it does', 'topic:Event loop & promises'],
      ['Modules (ESM and CommonJS)', 'import / export, dynamic import(), and the older require() still used in Node', 'topic:Modules'],
      ['Modern syntax', 'destructuring, spread, optional chaining ?., nullish ??, iterators and generators', 'topic:Modern syntax (ES6+)'],
      ['Operators and precedence', 'how an expression is grouped (precedence, associativity), evaluated left to right, and short-circuited', 'expr'],
      ['Errors', 'throw / try / catch, custom errors, unhandled rejections, error boundaries in React', 'topic:Errors'],
      ['Map, Set, WeakMap, WeakRef', 'keyed collections; weak ones let garbage collection clean up caches', 'topic:Data structures'],
      ['Proxy and Reflect', 'intercept property access: how Vue and MobX track changes', 'topic:How frameworks work'],
      ['Dates, Intl and Temporal', 'Date is error-prone; Intl formats for each locale; Temporal (in Chrome 144+ and Firefox 139+) is the modern replacement', 'topic:Dates: Temporal'],
      ['Memory and garbage collection', 'reachability, leaks from listeners and timers, heap snapshots', 'topic:Memory & garbage collection'],
      ['How engines run JS', 'parsing, bytecode, the JIT, hidden classes and inline caches', 'topic:Parsing & the JIT'],
      ['Functional patterns', 'pure functions, immutability, map / filter / reduce, composition, currying', 'topic:Functional programming'],
      ['structuredClone, JSON', 'deep copies and serialization, and what they cannot copy', 'topic:Objects'],
    ]],
    ['The browser', [
      ['DOM and events', 'querying and changing the page; bubbling, capturing, delegation, preventDefault', 'topic:Browser & DOM'],
      ['How code becomes pixels', 'bytes → DOM → CSSOM → render tree → layout → paint → composite, and what a JS change re-runs', 'pixels'],
      ['The rendering pipeline in practice', 'requestAnimationFrame, frames, why layout thrashing hurts', 'topic:Rendering & frames'],
      ['fetch and AbortController', 'HTTP from JS, cancelling requests, timeouts', 'topic:Async patterns'],
      ['Storage', 'cookies, localStorage, sessionStorage, IndexedDB (big or structured data), Cache Storage', 'topic:Browser APIs'],
      ['Observers', 'IntersectionObserver (visibility), ResizeObserver (size), MutationObserver (DOM changes)', 'task:api-io-first'],
      ['History API and routing', 'pushState / popstate: how client-side routers change the URL without reloading', 'task:api-history'],
      ['Web Workers', 'run heavy JavaScript off the main thread so the page stays responsive', 'topic:Browser & DOM'],
      ['Service workers and PWAs', 'a script between the page and the network: offline, caching, push notifications, installable apps', 'topic:Offline & service workers'],
      ['WebSockets and Server-Sent Events', 'live updates pushed from the server', 'topic:Live updates'],
      ['Web Components', 'custom elements and the Shadow DOM: framework-free reusable components (used by some design systems)', null],
      ['Canvas, SVG, WebGL', 'drawing: SVG for icons and charts, Canvas for many moving pixels, WebGL / WebGPU for 3D', null],
      ['WebAssembly', 'run compiled C++, Rust or Go in the browser at near-native speed (Figma, video editing, games)', null],
      ['Files, Blobs, drag and drop, clipboard', 'upload previews, downloads made in JS, paste images, drag files in', null],
      ['Device APIs', 'geolocation, camera / microphone (getUserMedia), notifications; each needs the user\'s permission', null],
      ['Browser support', 'caniuse.com and Baseline tell you what works where; polyfills and transpiling fill the gaps', null],
    ]],
    ['HTML and CSS', [
      ['Semantic HTML', 'header, nav, main, button, form, label: the right element gives meaning, keyboard support and SEO for free', 'topic:HTML & accessibility'],
      ['Forms and validation', 'input types, required / pattern, the constraint validation API, :invalid / :user-invalid', 'task:css-has'],
      ['The cascade and specificity', 'which rule wins, inheritance, !important, cascade layers', 'topic:CSS: cascade & specificity'],
      ['The box model and units', 'content / padding / border / margin, box-sizing, px / em / rem / % / vw', 'topic:CSS: box model'],
      ['Positioning and stacking', 'relative / absolute / fixed / sticky, z-index and stacking contexts', 'topic:CSS: positioning & stacking'],
      ['Flexbox and Grid', 'one-dimensional and two-dimensional layout', 'topic:CSS: flexbox'],
      ['Responsive design', 'media queries, fluid sizes, container queries, mobile first', 'topic:CSS: responsive'],
      ['Modern CSS', ':has(), @layer, clamp(), custom properties (variables), nesting, logical properties', 'topic:CSS: modern CSS'],
      ['Animations and transitions', 'transition, @keyframes, animate transform and opacity only, prefers-reduced-motion', 'task:css-transform'],
      ['Images and fonts', 'srcset / sizes, <picture>, AVIF / WebP, width + height against layout shift, font-display', 'topic:Web performance'],
      ['Dark mode and theming', 'prefers-color-scheme, CSS variables for colours, no flash of the wrong theme', null],
      ['CSS architecture', 'BEM, CSS Modules, Tailwind (utility classes), CSS-in-JS (styled-components), Sass / PostCSS: know the trade-offs', null],
    ]],
    ['Accessibility (a11y)', [
      ['Keyboard and focus', 'everything works with Tab / Enter / Esc / arrows; visible focus; focus moves into dialogs and back', 'topic:HTML & accessibility'],
      ['Names, roles, states (ARIA)', 'every control has an accessible name; ARIA only when no native element fits (the first rule of ARIA)', 'task:a11y-aria-hidden'],
      ['Dialogs and inert', '<dialog>.showModal(), inert backgrounds, returning focus', 'task:a11y-dialog'],
      ['Live regions', 'aria-live / role="status" announce changes (toasts, form errors) to screen readers', null],
      ['Colour contrast and motion', 'WCAG contrast 4.5:1 for text; respect prefers-reduced-motion', null],
      ['WCAG and testing', 'WCAG 2.2 AA is the usual target (and often a legal one); test with axe, Lighthouse, a keyboard and a screen reader (NVDA, VoiceOver)', 'project:p-design-system'],
    ]],
    ['React and frameworks', [
      ['Components, props, state, hooks', 'the React model: render, commit, re-render rules', 'react'],
      ['Effects and their pitfalls', 'useEffect timing, cleanup, dependencies, "you might not need an effect"', 'react'],
      ['Reconciliation, keys, memo', 'how React decides what to update; React.memo, useMemo, useCallback; the React Compiler', 'react'],
      ['Context, Suspense, transitions', 'sharing state, loading boundaries, useTransition / useDeferredValue', 'react'],
      ['Server Components and Server Actions', 'components that run only on the server; the RSC payload', 'react'],
      ['Routing', 'React Router, TanStack Router, or a framework\'s file-based routes', 'project:p-dashboard'],
      ['Server state', 'TanStack Query or SWR: caching, refetching, mutations, optimistic updates', 'topic:Frontend system design'],
      ['Client state', 'useState / useReducer first; then Zustand, Redux Toolkit, Jotai for shared app state', null],
      ['Forms', 'React Hook Form + zod: validation, errors, performance', 'project:p-checkout'],
      ['Next.js and Remix / React Router framework', 'routing, SSR / SSG / ISR, data loading, deployment in one framework', 'project:p-shop'],
      ['Other frameworks', 'Vue, Angular, Svelte, Solid; Astro for content sites; React Native for mobile apps: know what they are and why teams pick them', null],
    ]],
    ['TypeScript', [
      ['Types and inference', 'annotations, literal types, unions, narrowing, any vs unknown', 'topic:TypeScript: types & inference'],
      ['Objects and interfaces', 'interface vs type, optional / readonly, discriminated unions', 'topic:TypeScript: objects & interfaces'],
      ['Generics and utility types', 'generic functions and constraints, Partial / Pick / Omit / Record / ReturnType', 'topic:TypeScript: generics & utility types'],
      ['Typing React', 'props, events, useState with unions, children', 'topic:TypeScript: React'],
      ['tsconfig and .d.ts files', 'strict mode, paths, @types packages, declaration files for JS libraries', null],
      ['Runtime validation', 'types disappear at runtime: validate API data with zod / valibot and infer the types from the schema', null],
    ]],
    ['Network and APIs', [
      ['HTTP basics', 'methods, status codes (200, 201, 204, 301, 304, 400, 401, 403, 404, 409, 429, 500), headers', 'topic:Network & HTTP'],
      ['Caching', 'Cache-Control, ETag / 304, hashed file names, CDNs', 'task:net-cache-hashed'],
      ['CORS', 'why the browser blocks cross-origin reads and how the server allows them; preflights', 'task:net-cors-json'],
      ['REST, GraphQL, tRPC', 'three ways to shape an API; GraphQL lets the client choose fields; tRPC shares TypeScript types end to end', null],
      ['Pagination, retries, rate limits', 'cursor vs offset pages, retry with backoff, 429 Too Many Requests', 'task:sd-pagination'],
      ['HTTP/2, HTTP/3, compression', 'many requests on one connection, QUIC, gzip / brotli: why bundling rules changed', null],
      ['Mocking APIs', 'MSW (Mock Service Worker) fakes the network in tests and during development', null],
    ]],
    ['Security', [
      ['XSS and escaping', 'never put user text into innerHTML; React escapes by default; sanitize with DOMPurify', 'task:sec-xss-img'],
      ['CSRF and SameSite cookies', 'why another site cannot make your browser act for you', 'task:sec-csrf-lax'],
      ['Content-Security-Policy', 'a header that limits which scripts may run', 'task:sec-csp'],
      ['Login and tokens', 'sessions vs JWT, HttpOnly cookies, refresh tokens', 'topic:Auth & login'],
      ['OAuth / OpenID Connect', '"Sign in with Google": the authorization-code flow with PKCE', 'task:auth-oauth'],
      ['HTTPS, HSTS, clickjacking', 'always HTTPS; HSTS forces it; frame-ancestors stops your site being framed', null],
      ['Supply chain', 'npm audit, lockfiles, Dependabot / Renovate, Subresource Integrity for CDN scripts', 'task:npm-caret'],
      ['No secrets in the client', 'anything shipped to the browser is public, including env vars prefixed VITE_ / NEXT_PUBLIC_', null],
    ]],
    ['Performance', [
      ['Core Web Vitals', 'LCP (loading), CLS (layout shift), INP (responsiveness): what Google measures', 'project:p-perf'],
      ['Loading', 'async / defer, preload / preconnect, code splitting, lazy loading', 'topic:Web performance'],
      ['Rendering strategies', 'CSR, SSR, SSG, ISR, streaming, islands, edge rendering', 'topic:Rendering: CSR, SSR, SSG'],
      ['Runtime performance', 'long tasks, layout thrashing, debounce / throttle, virtualized lists, Web Workers', 'topic:Memory & performance'],
      ['Measuring and the score %', 'Lighthouse score (0–100 from weighted metric curves), field data at the 75th percentile, web-vitals, Lighthouse CI', 'perf'],
    ]],
    ['Architecture and system design', [
      ['Frontend system design', 'type-ahead, infinite feed, normalized state, optimistic updates, caching', 'topic:Frontend system design'],
      ['Design patterns', 'observer, module, factory, strategy; in React: composition, custom hooks, render props', 'topic:Design patterns'],
      ['Design systems', 'tokens, components, documentation (Storybook), versioning', 'project:p-design-system'],
      ['Monorepos', 'many packages in one repo: pnpm workspaces, Turborepo, Nx', null],
      ['Micro-frontends', 'several teams ship parts of one page independently (Module Federation); powerful but costly', null],
      ['Feature flags and A/B tests', 'turn features on per user without deploying; measure which version works better', null],
      ['Internationalisation', 'translations (i18next, FormatJS), Intl formatting, right-to-left layouts', 'topic:Internationalisation'],
    ]],
    ['Tools and workflow', [
      ['Git', 'branches, merge vs rebase, reset vs revert, pull requests, resolving conflicts', 'topic:Git & tools'],
      ['The terminal (Linux shell)', 'files, grep, pipes, processes and ports, curl, ssh, permissions, env vars; and the Git commands used every day', 'terminal'],
      ['Package managers', 'npm, pnpm, yarn; semver ranges and lockfiles; npm scripts', 'task:npm-caret'],
      ['Build tools', 'Vite (dev server + Rollup), esbuild / SWC (fast compilers), webpack (older, still everywhere), Babel', 'project:p-setup'],
      ['Linting and formatting', 'ESLint finds bugs, Prettier formats, both run in CI and pre-commit hooks', 'project:p-setup'],
      ['CI / CD and deploying', 'static hosting, full-stack platforms, functions, containers; preview deploys, env vars, cache headers, rollback', 'deploy'],
      ['Environment variables', 'different API URLs and keys for development, preview and production', 'project:p-setup'],
      ['Browser DevTools', 'Elements, Console, Sources (breakpoints), Network, Performance, Memory, Application, Lighthouse, React DevTools; a debugging method', 'devtools'],
      ['Source maps', 'map minified production code back to your source for debugging and error reports', null],
      ['Docker (basics)', 'run the backend and database locally the same way as in production', null],
      ['AI coding tools', 'autocomplete, chat, agents and AI review: a safe workflow, good prompts, reviewing AI code, company rules, building AI features', 'ai'],
    ]],
    ['Testing', [
      ['Unit tests', 'Vitest / Jest: test functions and edge cases', 'topic:Testing'],
      ['Component tests', 'Testing Library: find by role and text, test what users see', 'task:t-counter'],
      ['End-to-end tests', 'Playwright / Cypress drive a real browser through whole flows', 'project:p-checkout'],
      ['Mocks, fakes and timers', 'fake APIs (MSW), fake clocks, dependency injection', 'task:t-debounce'],
      ['Visual and accessibility tests', 'screenshot comparison (Chromatic, Playwright), axe checks', 'project:p-design-system'],
      ['What to test', 'the testing trophy: mostly integration tests, a few E2E, unit tests for logic', null],
    ]],
    ['In production', [
      ['Error monitoring', 'Sentry and similar: crashes with stack traces (via source maps) from real users', 'project:p-setup'],
      ['Analytics and logging', 'page views, funnels, events; privacy rules apply', null],
      ['SEO', 'titles, meta descriptions, Open Graph previews, sitemaps, structured data, server-rendered HTML', 'task:render-csr-seo'],
      ['Privacy and law', 'cookie consent (GDPR), data minimisation, accessibility laws (European Accessibility Act, ADA)', null],
    ]],
    ['Node.js and the backend side', [
      ['Node.js basics', 'its event loop, modules, the file system, streams', 'topic:Node.js'],
      ['Streams and crypto', 'reading big files in chunks, backpressure, pipeline(); hashes, random tokens, password hashing', 'topic:Node.js: streams & crypto'],
      ['A small API server', 'Express / Fastify / Hono: routes, JSON, middleware', 'topic:Node.js'],
      ['Databases', 'relational (PostgreSQL), document, key-value (Redis), search, wide-column, graph, time-series, vector, warehouse, in-browser: what each is for', 'db'],
      ['Serverless and edge functions', 'small backend functions without managing servers (Vercel, Netlify, Cloudflare Workers)', null],
    ]],
    ['Problem solving and interviews', [
      ['Implement it yourself', 'debounce, throttle, Promise.all, deep clone, event emitter, curry: classic interview tasks', 'topic:Implement it'],
      ['Data structures and algorithms', 'arrays, hash maps, stacks, queues, trees, graphs; Big-O', 'topic:Data structures'],
      ['Coding problems', 'two pointers, sliding window, recursion, sorting', 'topic:Coding problems'],
      ['Machine-coding rounds', 'build a small working UI in 60–90 minutes', 'react'],
      ['Interviews: rounds and preparation', 'recruiter screen, fundamentals, coding, machine coding, system design (RADIO), behavioural (STAR), 40 common questions', 'interview'],
      ['Getting hired: strategy', 'referrals, a resume that passes ATS, a prep plan, online tests, round tactics, HR and salary questions, offers', 'gethired'],
      ['Working in a team', 'the project process: requirements, design, planning, tech specs, code review, QA, release, incidents, team rhythm', 'process'],
      ['Corporate life', 'company types, levels, first 90 days, communication, appraisals, salary (CTC, in-hand), policies, switching jobs', 'corporate'],
      ['Roles and pay', 'frontend job titles, who you work with, responsibilities per level, title mapping, pay ranges, bonus, ESOPs and RSUs, raises', 'roles'],
      ['Tax and money (India)', 'old vs new regime, salary parts, filing your ITR, tax on RSUs and ESOPs, freelancing for foreign clients, money basics', 'tax'],
      ['Open source and building in public', 'your first pull request, finding issues, etiquette, GSoC and other programmes, licences, your GitHub profile', 'oss'],
      ['Earning more', 'growing pay in your job, switching well, freelancing safely, products to sell, content and teaching, small tips, scams to avoid', 'earn'],
      ['Freelancing', 'from scratch to pro: setting up, a portfolio, getting clients, outreach scripts, proposals, pricing, contracts, delivering, growing, hard situations, tax', 'freelance'],
      ['Design basics', 'spacing, typography, colour and contrast, layout and hierarchy, component states, reading Figma, a polish checklist', 'design'],
      ['Staying current', 'good sources, release notes and Baseline, judging new libraries, a weekly learning routine, what to ignore', 'current'],
      ['Health and a long career', 'desk setup, eyes, movement, sleep, stress and burnout, sustainable work habits', 'health'],
      ['How companies work', 'revenue, profit, cash and runway, business models, unit economics, IT services and GCCs, startup funding, planning, shares, checking a company', 'business'],
    ]],
  ];

  function linkHTML(link) {
    if (!link) return '<span class="fm-know" title="Know what it is; there is no practice for it here">good to know</span>';
    const P = window.JSPractice, list = P ? P.list() : [];
    const [kind, ref] = link.split(/:(.*)/s);
    if (kind === 'pixels') return '<button class="fm-go" data-fmpixels>🖥️ watch it</button>';
    if (kind === 'perf') return '<button class="fm-go" data-fmperf>📊 open</button>';
    if (kind === 'gethired') return '<button class="fm-go" data-fmgethired>🏆 open</button>';
    if (kind === 'terminal') return '<button class="fm-go" data-fmterminal>⌨️ open</button>';
    if (kind === 'roles') return '<button class="fm-go" data-fmroles>💰 open</button>';
    if (kind === 'expr') return '<button class="fm-go" data-fmexpr>🌳 open</button>';
    if (kind === 'ai') return '<button class="fm-go" data-fmai>🤖 open</button>';
    if (kind === 'tax') return '<button class="fm-go" data-fmtax>🧾 open</button>';
    if (kind === 'oss') return '<button class="fm-go" data-fmoss>🌱 open</button>';
    if (kind === 'earn') return '<button class="fm-go" data-fmearn>💸 open</button>';
    if (kind === 'freelance') return '<button class="fm-go" data-fmfreelance>🧑‍💻 open</button>';
    if (kind === 'design') return '<button class="fm-go" data-fmdesign>🎨 open</button>';
    if (kind === 'current') return '<button class="fm-go" data-fmcurrent>📰 open</button>';
    if (kind === 'health') return '<button class="fm-go" data-fmhealth>🧘 open</button>';
    if (kind === 'business') return '<button class="fm-go" data-fmbusiness>🏦 open</button>';
    if (kind === 'corporate') return '<button class="fm-go" data-fmcorporate>💼 open</button>';
    if (kind === 'devtools') return '<button class="fm-go" data-fmdevtools>🧰 open</button>';
    if (kind === 'interview') return '<button class="fm-go" data-fminterview>🎯 open</button>';
    if (kind === 'process') return '<button class="fm-go" data-fmprocess>🏢 open</button>';
    if (kind === 'deploy') return '<button class="fm-go" data-fmdeploy>🚢 open</button>';
    if (kind === 'db') return '<button class="fm-go" data-fmdb>🗄️ open</button>';
    if (kind === 'react') return '<span class="fm-react" title="Practised in the React lab (ReactVisual)">⚛️ in the React lab</span>';
    if (kind === 'topic') { const g = P && P.groups().find(x => x.topic === ref); return g ? `<button class="fm-go" data-fmtopic="${esc(ref)}">▶ practise (${g.items.length})</button>` : '<span class="fm-know">good to know</span>'; }
    const x = list.find(t => (kind === 'project' ? t.kind === 'project' : t.kind !== 'project') && t.id === ref);
    return x ? `<button class="fm-go" data-fmtask="${list.indexOf(x)}">${kind === 'project' ? '🚀 in a project' : '▶ practise'}</button>` : '<span class="fm-know">good to know</span>';
  }
  function open() {
    let m = $('frontendMap');
    if (!m) {
      m = document.createElement('div');
      m.id = 'frontendMap';
      m.className = 'modal hidden';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-label', 'Frontend map');
      m.innerHTML = '<div class="modal-card pl-card"><button class="close" data-fmclose aria-label="Close">✕</button><div class="cbody"></div></div>';
      document.body.appendChild(m);
    }
    m.querySelector('.cbody').innerHTML = `<h2 class="modal-title">🗺️ Everything a frontend developer should know exists</h2>
      <p class="pl-intro">You do not need to master all of it. Know what each thing is and when you would reach for it. <b>▶ practise</b> opens the tasks for it; <b>good to know</b> means: read about it once, so you recognise it at work.</p>
      ${window.FRONTEND_MAP.map(([area, items]) => `<h3 class="pl-group">${esc(area)}</h3><div class="fm-list">${items.map(([name, what, link]) => `<div class="fm-item"><div><b>${esc(name)}</b><small>${esc(what)}</small></div>${linkHTML(link)}</div>`).join('')}</div>`).join('')}`;
    m.classList.remove('hidden');
    m.querySelector('.modal-card').scrollTop = 0;
  }
  const close = () => { const m = $('frontendMap'); if (m) m.classList.add('hidden'); };
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnMap')) { open(); return; }
    const go = t.closest('[data-fmtopic], [data-fmtask]');
    if (go) { close(); if (go.dataset.fmtopic) window.JSPractice.showList(go.dataset.fmtopic); else window.JSPractice.open(+go.dataset.fmtask); return; }
    if (t.closest('[data-fmclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.FrontendMap = { open, close };
})();

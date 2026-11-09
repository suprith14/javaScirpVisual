/*
 * JS Engine Lab — real projects: the skills only building and shipping an app teaches.
 * Each brief: the goal, what to build, milestones with real commands, how to check it is done,
 * DevTools exercises, and stretch goals. Build them on your own machine, outside the lab.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const UI = { p: null, nav: null };

  window.PROJECTS = [
    {
      id: 'p-setup', cat: 'Real projects', title: 'Ship-ready setup: from an empty folder to a deployed app',
      goal: 'Set up a project the way teams do: Vite + React + TypeScript, linting and formatting, tests, Git, CI, and a public URL. Every later project starts from this.',
      skills: ['Git', 'npm & lockfiles', 'Vite', 'TypeScript config', 'ESLint + Prettier', 'Vitest', 'GitHub Actions (CI)', 'Deploying'],
      build: ['A React + TypeScript app created with Vite', 'Lint and format scripts that pass', 'One component test that runs in CI', 'Automatic deploy on every push to main'],
      steps: [
        ['Create the app', 'npm create vite@latest my-app -- --template react-ts\ncd my-app && npm install && npm run dev'],
        ['Git from the first minute', 'git init && git add . && git commit -m "Initial commit"\n# create an empty repo on GitHub, then:\ngit remote add origin <url> && git push -u origin main'],
        ['Format and lint', 'npm install -D prettier eslint-config-prettier\n# add "format": "prettier --write ." to package.json scripts\nnpm run lint && npm run format'],
        ['Tests', 'npm install -D vitest @testing-library/react @testing-library/user-event jsdom\n# vite.config.ts → test: { environment: "jsdom" }\n# write src/App.test.tsx, then: npx vitest run'],
        ['CI: run checks on every push', '# .github/workflows/ci.yml\non: [push, pull_request]\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20, cache: npm }\n      - run: npm ci\n      - run: npm run lint\n      - run: npx tsc --noEmit\n      - run: npx vitest run\n      - run: npm run build'],
        ['Deploy', 'Connect the GitHub repo to Netlify, Vercel or Cloudflare Pages\n(build command: npm run build, output folder: dist).\nEvery push to main deploys; every pull request gets a preview URL.'],
      ],
      done: ['npm ci && npm run build works on a clean clone', 'The CI badge is green; a failing test turns it red', 'The app is online at a public URL', 'Work happens on branches, merged through pull requests'],
      devtools: ['Network panel: reload the deployed site; find the hashed JS file and check its Cache-Control header (compare with the caching tasks)', 'Lighthouse (Chrome DevTools): run it on the deployed URL and read the Performance and Accessibility scores'],
      practice: ['git-wrong-branch', 'git-switch-wip', 'git-push-rejected', 'term-port', 'term-perm', 'team-bigpr', 'team-stuck', 'aws-static', 'aws-keys', 'aws-cert', 'dep-portfolio', 'dep-404', 'dep-env', 'dep-preview', 'dep-rollback', 'db-mvp', 'git-merge', 'git-rebase', 'git-revert', 'npm-caret', 'npm-major', 't-sumeven', 'ts-react-props', 'net-cache-hashed'],
      stretch: ['Add a pre-commit hook (husky + lint-staged)', 'Add environment variables (VITE_API_URL) for dev and production', 'Add error monitoring (Sentry) and trigger a test error'],
    },
    {
      id: 'p-dashboard', cat: 'Real projects', title: 'Data dashboard: search, filters, pagination, charts',
      goal: 'Build the kind of screen most product teams own: a list of data from an API with search, filters, sorting, pagination, a details page, and charts.',
      skills: ['Data fetching & caching (React Query)', 'Routing & URL state', 'Debounced search', 'Loading / error / empty states', 'Charts', 'Performance (memo, virtualization)'],
      build: ['A list from a public API (e.g. dummyjson.com/products) with search, category filter and sort', 'Pagination (or infinite scroll) driven by the URL: ?q=phone&page=2', 'A details page at /items/:id', 'A chart of the data (e.g. Recharts)', 'Loading skeletons, an error state with "Retry", an empty state'],
      steps: [
        ['Routing', 'npm install react-router-dom\n# routes: / (list) and /items/:id (details)'],
        ['Server state', 'npm install @tanstack/react-query\n# useQuery({ queryKey: ["items", q, page], queryFn })\n# the key includes the filters: changing them refetches, going back is instant (cache)'],
        ['Search and filters in the URL', 'useSearchParams(): read q, category, page from the URL and write them back\n→ refresh, back button and shared links keep the state'],
        ['Debounce the search', 'only change the query 300ms after the user stops typing (see the type-ahead task)'],
        ['States', 'isPending → skeleton rows · isError → message + refetch() · no results → "Nothing found for …"'],
        ['Chart and details', 'a details route that reuses cached data; a chart of prices or categories'],
      ],
      done: ['Typing does not send one request per key', 'The URL fully describes the screen (copy it to a new tab: same view)', 'Slow 3G in DevTools: skeletons, no layout jumps', 'Offline in DevTools: a friendly error with a working Retry', 'Tests for the filter logic and for one full user flow'],
      devtools: ['Network: throttle to Slow 3G and watch the requests while typing', 'React DevTools Profiler: record typing in the search box and find components that re-render needlessly', 'Performance panel: record a scroll through a long list; try virtualization and compare'],
      practice: ['team-unclear', 'team-api', 'aws-api', 'aws-logs', 'db-metrics', 'db-report', 'auth-jwt-read', 'auth-token-xss', 'auth-refresh', 'auth-refresh-race', 'intl-date', 'sd-typeahead', 'sd-pagination', 'api-io-first', 'api-io-visible', 'api-history', 'css-container', 'render-pick-dashboard', 'render-csr-first', 'ts-generic', 'ts-keyof'],
      stretch: ['Virtualize the list (TanStack Virtual)', 'Prefetch the next page on hover', 'Export the filtered data to CSV'],
    },
    {
      id: 'p-chat', cat: 'Real projects', title: 'Real-time chat: optimistic UI and live updates',
      goal: 'A chat or comments app where messages appear instantly, sync live between tabs, and survive a flaky network.',
      skills: ['Optimistic updates & rollback', 'WebSockets / live updates', 'Scroll management', 'Offline handling', 'Auth basics'],
      build: ['Rooms with a message list and a composer', 'Messages appear immediately (optimistic), marked "sending…" until confirmed, with retry on failure', 'Live updates from other users (a WebSocket, or a hosted backend such as Supabase / Firebase)', 'Auto-scroll to new messages only when the user is already at the bottom'],
      steps: [
        ['Backend', 'use a hosted backend (Supabase, Firebase) or a small Node server with the ws package'],
        ['Optimistic send', 'add the message locally with status "sending", then confirm or mark "failed" (see the optimistic-update task)'],
        ['Live updates', 'subscribe to new messages; de-duplicate your own optimistic message when the server echoes it (match by a client-generated id)'],
        ['Offline', 'listen to the online / offline events; queue messages while offline and send them when back'],
        ['Accessibility', 'the message list is a log (role="log"); new messages are announced; the composer works with the keyboard only'],
      ],
      done: ['Two browser windows see each other\'s messages without reloading', 'DevTools offline: messages show "failed" with a Retry button, nothing is lost', 'No duplicate messages after reconnecting', 'Scrolling up to read old messages is not interrupted by new ones'],
      devtools: ['Network → WS: inspect the WebSocket frames', 'Memory panel: open and close a room 10 times; take heap snapshots and check that listeners are cleaned up'],
      practice: ['dep-websocket', 'db-chat', 'db-offline', 'live-poll', 'live-ws', 'live-reconnect', 'live-pick', 'auth-oauth', 'sd-optimistic', 'sd-normalize', 'api-storage-event', 't-async', 'ts-discriminated'],
      stretch: ['Typing indicators (debounced)', 'Load older messages on scroll up (cursor pagination)', 'Unread counts per room'],
    },
    {
      id: 'p-design-system', cat: 'Real projects', title: 'Component library: accessible, tested, documented',
      goal: 'Build the reusable components a design system provides, with accessibility and tests as part of the definition of done.',
      skills: ['Component API design', 'Accessibility (ARIA, focus, keyboard)', 'Storybook', 'Testing Library', 'CSS architecture (tokens, variants)'],
      build: ['Button (variants, sizes, loading, disabled)', 'Modal dialog (focus trap, Esc to close, returns focus)', 'Tabs (arrow-key navigation)', 'Combobox / autocomplete (ARIA combobox pattern)', 'Toast notifications (role="status")'],
      steps: [
        ['Tokens', 'CSS custom properties for colours, spacing, radii, typography; light and dark themes'],
        ['Storybook', 'npx storybook@latest init  # one story per state of each component'],
        ['Accessibility first', 'follow the WAI-ARIA Authoring Practices pattern for each widget (keyboard support table)'],
        ['Tests', 'Testing Library: find by role, test keyboard use; add axe (jest-axe / @axe-core) checks'],
        ['Publish', 'build the library with Vite library mode; publish to npm (or a private registry) with semver'],
      ],
      done: ['Every component works with the keyboard only', 'A screen reader (NVDA / VoiceOver) announces names, roles and states correctly', 'axe reports no violations', 'Each component has stories for all states and tests for its behaviour'],
      devtools: ['Accessibility pane in the Elements panel: check each widget\'s computed role and name', 'Rendering → "Emulate vision deficiencies" and "prefers-reduced-motion"; Lighthouse accessibility audit'],
      practice: ['team-design', 'team-disagree', 'a11y-dialog', 'a11y-inert', 'a11y-aria-hidden', 'html-tab', 'css-layer', 'css-has', 'css-transform', 't-counter', 'ts-react-props', 'npm-major'],
      stretch: ['Visual regression tests (Chromatic or Playwright screenshots)', 'A theme switcher with a no-flash first paint', 'Right-to-left support'],
    },
    {
      id: 'p-checkout', cat: 'Real projects', title: 'Checkout flow: complex forms and state',
      goal: 'A multi-step checkout: the hardest form work most front-end developers meet.',
      skills: ['Forms & validation (React Hook Form + zod)', 'Multi-step state (state machine)', 'Error handling', 'Security (no secrets in the client)', 'End-to-end tests (Playwright)'],
      build: ['Cart → shipping address → payment → review → confirmation', 'Field and form-level validation with clear, accessible messages', 'Progress kept on refresh (sessionStorage) and with the Back button', 'A mock payment API that sometimes fails or is slow'],
      steps: [
        ['Schema first', 'npm install react-hook-form zod @hookform/resolvers\n# one zod schema per step, shared types with z.infer'],
        ['Steps as a state machine', 'states: cart → shipping → payment → review → done; only legal transitions (or use XState)'],
        ['Server errors', 'map API errors to fields; disable the button while submitting; prevent double submits (idempotency key)'],
        ['E2E tests', 'npm init playwright@latest\n# test the happy path and a payment failure, in Chromium and WebKit'],
      ],
      done: ['Keyboard and screen-reader users can complete checkout', 'Refreshing on any step keeps the entered data (except card details)', 'A failed payment shows a clear error and keeps the form', 'Double-clicking "Pay" sends one request', 'Playwright tests pass in CI'],
      devtools: ['Network: "Offline" and "Slow 3G" during payment', 'Application panel: inspect what is stored (never card numbers or tokens in localStorage)'],
      practice: ['team-bug', 'team-incident', 'aws-postgres', 'dep-secret', 'db-orders', 'css-has', 'html-label', 't-form', 'intl-price', 'intl-timezone', 'api-storage-string', 'ts-discriminated', 'ts-partial', 'sec-csrf-lax', 'sec-xss-text', 'sec-cookie-httponly'],
      stretch: ['Address autocomplete with debounce and keyboard support', 'Analytics events for each step (funnel)', 'Internationalized prices and dates (Intl.NumberFormat / DateTimeFormat)'],
    },
    {
      id: 'p-perf', cat: 'Real projects', title: 'Performance audit: make a slow site fast',
      goal: 'Take a real, slow page (an old project, or a deliberately heavy demo), measure it, fix it, and prove the improvement with numbers.',
      skills: ['Lighthouse & Core Web Vitals (LCP, CLS, INP)', 'DevTools Performance panel', 'Bundle analysis & code splitting', 'Image optimization', 'Caching headers'],
      build: ['A before / after report with Lighthouse scores and Web Vitals', 'At least one fix for each vital: LCP, CLS and INP'],
      steps: [
        ['Measure first', 'Lighthouse (mobile) and the Performance panel; write down LCP, CLS, INP and the total JS size'],
        ['Bundle', 'npx vite-bundle-visualizer (or rollup-plugin-visualizer); lazy-load routes with React.lazy and import()'],
        ['Images', 'modern formats (AVIF/WebP), srcset/sizes, width + height (no CLS), loading="lazy" below the fold, fetchpriority="high" for the LCP image'],
        ['Fonts & CSS', 'preload the main font, font-display: swap, remove unused CSS, inline critical CSS'],
        ['Interaction (INP)', 'find long tasks in the Performance panel; debounce, move work off the main thread (startTransition, a Web Worker), avoid layout thrashing'],
        ['Caching', 'hashed assets with a long max-age, HTML with no-cache (see the caching tasks)'],
      ],
      done: ['Lighthouse Performance ≥ 90 on mobile', 'LCP < 2.5s, CLS < 0.1, INP < 200ms', 'The JS shipped for the first page is smaller, with the numbers to show it', 'A short write-up: what you measured, what you changed, the result'],
      devtools: ['Performance panel: record a page load, find the LCP element and what delayed it', 'Coverage tab: find unused JS and CSS', 'Network: compare the transfer size before and after compression'],
      practice: ['term-headers', 'team-estimate', 'team-debt', 'perf-cls', 'perf-cls-fixed', 'perf-script-order', 'perf-css-blocks', 'css-transform', 'api-io-first', 'net-cache-hashed', 'net-cache-nocache'],
      stretch: ['Real-user monitoring with the web-vitals library', 'A performance budget that fails CI when the bundle grows', 'Service worker caching for repeat visits'],
    },
    {
      id: 'p-shop', cat: 'Real projects', title: 'Online shop with Next.js: rendering strategies, SEO and offline',
      goal: 'A small shop where each page uses the right rendering strategy: static pages for content, server rendering for personal pages, regeneration for prices, and an offline-capable shell.',
      skills: ['Next.js App Router', 'SSG / SSR / ISR / CSR', 'Hydration', 'SEO & social previews', 'Service worker & offline (PWA)', 'Fluid, modern CSS'],
      build: ['Home and About pages built at build time (static)', 'Product pages regenerated every minute so prices stay fresh (ISR)', 'A cart and account page rendered per user (SSR or client-side behind login)', 'Open Graph tags so a shared product link shows its name, price and image', 'Works offline for pages already visited'],
      steps: [
        ['Create the app', 'npx create-next-app@latest shop --ts --eslint --app\ncd shop && npm run dev'],
        ['Static and regenerated pages', '// app/products/[id]/page.tsx\nexport const revalidate = 60; // ISR: rebuild at most once a minute\nexport async function generateStaticParams() { /* the popular products */ }'],
        ['Per-user pages', '// app/account/page.tsx reads cookies() → rendered on every request (dynamic)\n// the cart button is a Client Component ("use client")'],
        ['SEO', 'export async function generateMetadata({ params }) {\n  return { title: product.name, openGraph: { images: [product.image] } };\n}\n# check: curl the page and look for the product name in the HTML'],
        ['No hydration errors', 'anything that differs between server and browser (dates, Math.random, window, localStorage) goes into useEffect or a Client Component'],
        ['Offline', 'add a service worker (e.g. Serwist): cache-first for static files, network-first for pages, an offline fallback page'],
      ],
      done: ['curl on a product URL returns HTML that contains the product name', 'Changing a price shows up within a minute without a redeploy', 'No hydration warnings in the console', 'DevTools offline: visited pages still open, others show the offline page', 'Lighthouse SEO and Performance ≥ 90'],
      devtools: ['View Page Source (not Elements): what the server really sent', 'Network: compare the HTML of a static page and a dynamic one (response headers, timing)', 'Application → Service workers and Cache storage: see what is cached'],
      practice: ['dep-next', 'dep-webhook', 'dep-stale', 'db-search', 'db-cache', 'db-ai', 'db-cms', 'render-csr-seo', 'render-ssr-seo', 'render-csr-first', 'render-ssr-click', 'render-ssg-price', 'render-isr-price', 'render-pick-docs', 'render-pick-shop', 'render-hydration', 'sw-cache-first', 'sw-network-first', 'sw-swr', 'sw-offline-nocache', 'css-clamp', 'css-logical', 'intl-price', 'net-cache-stale'],
      stretch: ['Streaming with Suspense: show the page shell while slow parts load', 'Image optimization with next/image', 'Edge middleware for a country-specific currency'],
    },
  ];

  // the same routine for every project: small checks after each feature, bigger ones each week
  const WHILE_BUILDING = [
    'After each feature: the Console has no errors or warnings (React warnings too).',
    'After each feature: the Network panel shows no duplicate or failed requests, and typing does not send one request per key.',
    'After each feature: it works with the keyboard only (Tab, Enter, Esc) and focus is visible.',
    'Each week: Lighthouse (mobile): note the Performance and Accessibility scores and fix the biggest cost.',
    'Each week: throttle to Slow 4G and 4× CPU; check skeletons, layout shifts and slow clicks.',
    'Each week: go Offline in DevTools; the app should fail gracefully, with a retry.',
    'Write each improvement in the README with numbers ("LCP 3.1s → 1.6s"): that is what interviews ask about.',
  ];

  function ensure() {
    let m = $('projLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'projLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Project');
    m.innerHTML = `<div class="modal-card wide cl-lab">
      <button class="close" data-pjclose aria-label="Close">✕</button>
      <div class="cl-head"><span class="cl-nav"><button class="btn small" id="pjPrev" title="Previous">◀</button><button class="cl-count" id="pjList" title="All practice tasks"></button><button class="btn small primary" id="pjNext" title="Next">▶</button></span><h2 class="modal-title" id="pjTitle"></h2></div>
      <div id="pjBody" class="pj-body"></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function open(id, nav) {
    const p = window.PROJECTS.find(x => x.id === id);
    if (!p) return false;
    const m = ensure();
    Object.assign(UI, { p, nav: nav || null });
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    $('pjTitle').textContent = '🚀 ' + p.title;
    const pos = nav ? nav.position() : null;
    $('pjList').textContent = pos ? `🚀 ${pos.i + 1} / ${pos.n}` : 'All tasks';
    $('pjPrev').disabled = !pos || pos.i === 0;
    $('pjNext').disabled = !pos || pos.i === pos.n - 1;
    $('pjBody').innerHTML = `<p class="pj-goal">${esc(p.goal)}</p>
      <div class="pj-skills">${p.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div>
      <h3>What to build</h3><ul>${p.build.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      <h3>Milestones</h3><ol class="pj-steps">${p.steps.map(([t, c]) => `<li><b>${esc(t)}</b><pre>${esc(c)}</pre></li>`).join('')}</ol>
      <h3>It is done when</h3><ul class="pj-done">${p.done.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <h3>🔍 While building</h3><ul class="pj-done">${WHILE_BUILDING.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <h3>DevTools exercises for this project <button class="fm-go" data-fmdevtools>🧰 DevTools guide</button></h3><ul>${p.devtools.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <h3>Stretch goals</h3><ul>${p.stretch.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      ${practiceHTML(p)}
      <p class="cl-note">Build this on your own computer, in its own Git repository. Put the finished projects on GitHub with a short README (what it does, how to run it, what you learned): they are what interviewers ask about.</p>`;
    m.classList.remove('hidden');
    return true;
  }
  function close() { const m = $('projLab'); if (m) m.classList.add('hidden'); UI.p = null; }

  // ------------------------------------------------------------ tasks ↔ projects
  const list = () => (window.JSPractice ? window.JSPractice.list() : []);
  const indexOf = id => list().findIndex(x => x.id === id && x.kind !== 'project');
  function practiceHTML(p) {
    const items = (p.practice || []).map(id => list()[indexOf(id)]).filter(Boolean);
    if (!items.length) return '';
    return `<h3>Practise these first <small>(each one is a moment in this project)</small></h3><div class="pj-tasks">${items.map(x => `<button class="pj-task" data-pjtask="${esc(x.id)}"><span>${list().indexOf(x) + 1}</span>${esc(x.title)}</button>`).join('')}</div>`;
  }
  // the "📍 In a real project" box a lab shows above a task
  function sceneHTML(t) {
    const uses = window.PROJECTS.filter(p => (p.practice || []).includes(t.id));
    if (!t.scene && !uses.length) return '';
    return `<div class="pj-scene">${t.scene ? `<div>📍 <b>In a real project:</b> ${t.scene}</div>` : ''}${uses.length ? `<div class="pj-uses">🚀 You will use this in: ${uses.map(p => `<button class="pj-chip" data-pjopen="${p.id}">${esc(p.title.split(':')[0])}</button>`).join('')}</div>` : ''}</div>`;
  }
  // these buttons can sit in any lab window, so this listener is not limited to the project window
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pjtask], [data-pjopen]');
    if (!a || !window.JSPractice) return;
    const i = a.dataset.pjtask ? indexOf(a.dataset.pjtask) : list().findIndex(x => x.kind === 'project' && x.id === a.dataset.pjopen);
    if (i >= 0) window.JSPractice.open(i);
  });

  document.addEventListener('click', e => {
    const t = e.target;
    if (!$('projLab') || $('projLab').classList.contains('hidden')) return;
    if (t.closest('#pjPrev') && UI.nav) { UI.nav.go(-1); return; }
    if (t.closest('#pjNext') && UI.nav) { UI.nav.go(1); return; }
    if (t.closest('#pjList') && UI.nav) { close(); UI.nav.list(); return; }
    if (t.closest('[data-pjclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('projLab') && !$('projLab').classList.contains('hidden')) close(); });
  window.ProjectLab = { open, close, current: () => (UI.p ? UI.p.id : null), sceneHTML };
})();

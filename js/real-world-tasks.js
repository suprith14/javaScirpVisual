/*
 * JS Engine Lab — practice tasks taken from real projects: modern CSS, accessibility, rendering strategies
 * (CSR / SSR / SSG / ISR, hydration), service-worker caching and browser APIs.
 * Each task has a `scene`: the moment in a real project where you meet it (shown as "📍 In a real project").
 * CSS and accessibility answers are measured in the real browser (css-lab.js); browser-API tasks really run in a
 * sandboxed frame (web-lab.js); rendering and service-worker tasks are worked out step by step by the solvers below.
 */
(function () {
  'use strict';
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // Observers report on rendering frames (every 16ms in a visible page). Wait until the feed changes
  // (up to 2s), then a little longer so any follow-up callback has run too.
  const settle = async d => {
    const count = () => d.getElementById('feed').children.length, start = count();
    for (let i = 0; i < 40 && count() === start; i++) await wait(50);
    await wait(300);
  };
  const style = (el, p) => el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue(p);
  const YESNO = { yes: 'Yes', no: 'No' };

  // ============================================================ modern CSS and accessibility (the CSS lab measures them)
  (window.CSS_TASKS = window.CSS_TASKS || []).push(
    {
      id: 'css-container', cat: 'CSS: modern CSS', title: 'Container queries', ask: 'Which card shows its picture beside the text (a row)?',
      scene: 'Dashboard: the same product card is used in the wide main column and in the narrow sidebar. A media query only knows the <b>screen</b> width, so it cannot tell the two apart.',
      answer: 'choice', choices: ['only the main-column card', 'both cards', 'neither card'], target: '#side-card',
      hint: 'A container query asks how wide the card\'s container is, not how wide the screen is.',
      why: '<code>container-type: inline-size</code> makes an element a <b>container</b>; <code>@container (min-width: 300px)</code> then applies to elements inside containers that are at least 300px wide. The main slot is 360px, so its card becomes a row; the sidebar slot is 200px, so its card stays a column. Both are on the same 400px screen. That is why components in design systems use container queries: the component adapts to where it is placed.',
      html: `<style>
  .slot { container-type: inline-size; border: 1px dashed #999; margin-bottom: 8px; }
  .card { display: flex; flex-direction: column; gap: 8px; padding: 6px; }
  .card i { display: block; width: 60px; height: 36px; background: #8cb6c0; }
  @container (min-width: 300px) {
    .card { flex-direction: row; }
  }
</style>
<div class="slot" style="width: 360px">
  <div class="card" id="main-card"><i></i><span>Main column card</span></div>
</div>
<div class="slot" style="width: 200px">
  <div class="card" id="side-card"><i></i><span>Sidebar card</span></div>
</div>`,
      measure: (d, w, $) => {
        const a = style($('#main-card'), 'flex-direction') === 'row', b = style($('#side-card'), 'flex-direction') === 'row';
        return a && b ? 'both cards' : a ? 'only the main-column card' : b ? 'only the sidebar card' : 'neither card';
      },
    },
    {
      id: 'css-has', cat: 'CSS: modern CSS', title: ':has(): style a parent by its child', ask: 'The email field is empty. What colour is the label "Email"?',
      scene: 'Checkout form: when a field is invalid, its whole row (label and border) should turn red, without any JavaScript.',
      answer: 'color', target: 'label',
      hint: 'A required input that is empty is :invalid. Does the field contain one?',
      why: '<code>:has()</code> selects an element by what it <b>contains</b>: <code>.field:has(input:invalid)</code> matches the field row whose input is invalid, so you can style the label and border of that row. A <code>required</code> input that is empty is <code>:invalid</code> immediately, so the label is red. (In a real form you would also use <code>:user-invalid</code>, which waits until the user has interacted, so the form does not start out red.)',
      html: `<style>
  .field { display: flex; gap: 8px; padding: 6px; border: 2px solid #ccc; }
  .field:has(input:invalid) { border-color: red; }
  .field:has(input:invalid) label { color: red; }
</style>
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" required>
</div>`,
      measure: (d, w, $) => style($('label'), 'color'),
    },
    {
      id: 'css-layer', cat: 'CSS: modern CSS', title: 'Cascade layers beat specificity', ask: 'What colour is the Save button?',
      scene: 'Design system: the component styles live in a layer. A plain <code>button { … }</code> rule from an old global stylesheet overrides your carefully specific component rule, and you need to know why.',
      answer: 'color', target: 'button',
      hint: 'Layers are compared before specificity. Where does an unlayered rule go?',
      why: 'With <code>@layer</code>, the cascade compares <b>layers first</b> and specificity only inside the same layer. Styles that are <b>not in any layer</b> count as the last, strongest layer. So the unlayered <code>button { color: red }</code> beats <code>#save.btn</code> (specificity 1,1,0) inside <code>@layer components</code>. Teams put resets, third-party CSS and components into ordered layers (<code>@layer reset, vendor, components, utilities;</code>) to stop specificity wars.',
      html: `<style>
  @layer reset, components;
  @layer components {
    #save.btn { color: blue; }
  }
  button { color: red; }
</style>
<button id="save" class="btn">Save</button>`,
      measure: (d, w, $) => style($('button'), 'color'),
    },
    {
      id: 'css-clamp', cat: 'CSS: modern CSS', title: 'Fluid type with clamp()', ask: 'The preview is 400px wide. What font size does the heading get?',
      scene: 'Shop landing page: the hero heading should grow with the screen, but never be tiny on phones or huge on wide monitors, and without a stack of media queries.',
      answer: 'px', target: 'h1', prop: 'font-size', width: 400,
      hint: '5vw is 5% of the viewport width. Then clamp keeps it between the minimum and the maximum.',
      why: '<code>clamp(MIN, PREFERRED, MAX)</code> uses the preferred value but keeps it within the limits. <code>5vw</code> of a 400px viewport is 20px, which is between 16px and 40px, so the heading is 20px. On a 200px screen it would stop at 16px; on a 1000px screen at 40px. One line replaces several media queries.',
      html: `<style>
  h1 { font-size: clamp(16px, 5vw, 40px); margin: 0; }
</style>
<h1>Summer sale</h1>`,
      measure: (d, w, $) => parseFloat(style($('h1'), 'font-size')),
    },
    {
      id: 'css-transform', cat: 'CSS: modern CSS', title: 'transform does not move the layout', ask: 'The toast is moved 40px down with transform. How many px does the paragraph below it move?',
      scene: 'Any app with toasts, drawers or hover cards: you animate them in. Animating <code>top</code> or <code>margin</code> makes everything around them jump and re-layout on every frame; <code>transform</code> does not.',
      answer: 'px', target: '#next',
      hint: 'transform changes where an element is painted, not the space it takes in the layout.',
      why: '<code>transform</code> is applied <b>after layout</b>: the element is painted somewhere else, but its box still takes its original space, so nothing around it moves (0px). That is why animations should use <code>transform</code> and <code>opacity</code>: the browser can animate them on the compositor without re-running layout every frame, and they cause no layout shift (CLS). Animating <code>top</code>, <code>margin</code> or <code>height</code> forces layout on every frame.',
      html: `<style>
  .toast { background: #222; color: #fff; padding: 8px; transform: translateY(40px); }
</style>
<div class="toast">Saved ✓</div>
<p id="next">The paragraph below the toast</p>`,
      measure: (d, w, $) => {
        const p = $('#next'), t = $('.toast'), moved = p.getBoundingClientRect().top;
        const old = t.style.transform; t.style.transform = 'none';
        const without = p.getBoundingClientRect().top; t.style.transform = old;
        return Math.round(moved - without);
      },
    },
    {
      id: 'a11y-dialog', cat: 'HTML & accessibility', title: 'Where focus goes when a dialog opens', ask: 'The script calls dialog.showModal(). Which element has the keyboard focus?',
      scene: 'Design system / settings page: "Delete account" opens a confirmation dialog. Keyboard and screen-reader users must land inside it, ideally on the safe choice.',
      answer: 'choice', choices: ['the Cancel button', 'the Delete button', 'the "Delete account" button behind it'], target: 'dialog',
      hint: 'A modal <dialog> moves focus inside itself. Which focusable element comes first?',
      why: '<code>dialog.showModal()</code> does the hard parts of a modal for you: it moves focus <b>into</b> the dialog (to the first focusable element, here Cancel, or to an element with <code>autofocus</code>), makes the rest of the page <b>inert</b> (no clicks, no Tab), closes on <b>Esc</b>, and returns focus to the opener when it closes. Put <code>autofocus</code> on the safe action. Building this with a <code>&lt;div&gt;</code> means coding all of it yourself.',
      html: `<button id="open">Delete account</button>
<dialog>
  <p>Delete your account? This cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</dialog>`,
      measure: d => {
        const dlg = d.querySelector('dialog');
        if (!dlg.open) dlg.showModal();
        const a = d.activeElement, txt = a ? a.textContent.trim() : '';
        return txt === 'Cancel' ? 'the Cancel button' : txt === 'Delete' ? 'the Delete button' : 'the "Delete account" button behind it';
      },
    },
    {
      id: 'a11y-aria-hidden', cat: 'HTML & accessibility', title: 'aria-hidden does not stop the keyboard', ask: 'A custom modal is open and the page behind has aria-hidden="true". Can the Buy button behind it still get keyboard focus?',
      scene: 'Shop: a home-made modal hides the page behind it from screen readers with <code>aria-hidden</code>. Keyboard users press Tab and end up on invisible buttons behind the modal.',
      answer: 'choice', choices: ['yes', 'no'], target: '#buy',
      hint: 'aria-hidden is only for assistive technology. Does it change what Tab can reach?',
      why: '<code>aria-hidden="true"</code> removes content from the <b>accessibility tree</b> only: screen readers skip it, but it is still focusable and clickable. So a keyboard user can Tab onto a button that a screen reader then cannot describe, which is worse than nothing. Never put <code>aria-hidden</code> on something focusable; use <code>inert</code> (next task) or a native <code>&lt;dialog&gt;</code>.',
      html: `<main aria-hidden="true">
  <h3>Running shoes</h3>
  <button id="buy">Buy now</button>
</main>
<div role="dialog" aria-modal="true" aria-label="Newsletter">
  <p>Join our newsletter!</p>
  <button>Close</button>
</div>`,
      measure: (d, w, $) => { const b = $('#buy'); b.focus(); const r = d.activeElement === b ? 'yes' : 'no'; b.blur(); return r; },
    },
    {
      id: 'a11y-inert', cat: 'HTML & accessibility', title: 'inert: really switch the background off', ask: 'Now the page behind the modal has the inert attribute. Can the Buy button get keyboard focus?',
      scene: 'The same shop modal, fixed: while it is open, nothing behind it should be reachable by Tab, mouse or screen reader.',
      answer: 'choice', choices: ['yes', 'no'], target: '#buy',
      hint: 'inert switches off focus, clicks and the accessibility tree together.',
      why: 'The <code>inert</code> attribute makes a whole subtree <b>non-interactive</b>: it cannot be focused or clicked, and it is hidden from assistive technology. Set <code>inert</code> on the page while your custom modal or drawer is open, and remove it when it closes. A native <code>&lt;dialog&gt;</code> opened with <code>showModal()</code> does this automatically.',
      html: `<main inert>
  <h3>Running shoes</h3>
  <button id="buy">Buy now</button>
</main>
<div role="dialog" aria-modal="true" aria-label="Newsletter">
  <p>Join our newsletter!</p>
  <button>Close</button>
</div>`,
      measure: (d, w, $) => { const b = $('#buy'); b.focus(); const r = d.activeElement === b ? 'yes' : 'no'; b.blur(); return r; },
    },
  );

  // ============================================================ rendering strategies (CSR, SSR, SSG, ISR) and hydration
  const NAMES = { csr: 'Client-side rendering (CSR)', ssr: 'Server-side rendering (SSR)', ssg: 'Static generation (SSG)', isr: 'Incremental static regeneration (ISR)' };
  function timing(s) {
    const T = Object.assign({ cdn: 50, serverData: 300, serverRender: 50, js: 400, api: 300, hydrate: 100 }, s.t || {});
    const x = { rows: [], strategy: s.strategy };
    if (s.strategy === 'csr') {
      x.htmlAt = T.cdn; x.jsAt = x.htmlAt + T.js; x.dataAt = x.jsAt + T.api; x.content = x.dataAt + 20; x.interactive = x.content; x.inHTML = false;
      x.rows.push({ name: 'HTML', note: 'an empty <div id="root">', segs: [{ from: 0, to: x.htmlAt, cls: 'wl-dl', title: 'download' }] });
      x.rows.push({ name: 'JS bundle', segs: [{ from: x.htmlAt, to: x.jsAt, cls: 'wl-dl', title: 'download' }] });
      x.rows.push({ name: 'API: product data', segs: [{ from: x.jsAt, to: x.dataAt, cls: 'wl-dl', title: 'fetch' }] });
      x.rows.push({ name: 'React renders', segs: [{ from: x.dataAt, to: x.content, cls: 'wl-run', title: 'render' }] });
    } else if (s.strategy === 'ssr') {
      const srv = T.serverData + T.serverRender;
      x.htmlAt = srv + T.cdn; x.jsAt = x.htmlAt + T.js; x.content = x.htmlAt; x.interactive = x.jsAt + T.hydrate; x.inHTML = true;
      x.rows.push({ name: 'Server', note: 'fetches data, renders HTML', segs: [{ from: 0, to: T.serverData, cls: 'wl-srv', title: 'data' }, { from: T.serverData, to: srv, cls: 'wl-run', title: 'render' }] });
      x.rows.push({ name: 'HTML', note: 'with the content', segs: [{ from: srv, to: x.htmlAt, cls: 'wl-dl', title: 'download' }] });
      x.rows.push({ name: 'JS bundle', segs: [{ from: x.htmlAt, to: x.jsAt, cls: 'wl-dl', title: 'download' }] });
      x.rows.push({ name: 'Hydration', segs: [{ from: x.jsAt, to: x.interactive, cls: 'wl-run', title: 'hydrate' }] });
    } else {
      x.htmlAt = T.cdn; x.jsAt = x.htmlAt + T.js; x.content = x.htmlAt; x.interactive = x.jsAt + T.hydrate; x.inHTML = true;
      x.rows.push({ name: 'HTML from the CDN', note: 'built ahead of time', segs: [{ from: 0, to: x.htmlAt, cls: 'wl-dl', title: 'download' }] });
      x.rows.push({ name: 'JS bundle', segs: [{ from: x.htmlAt, to: x.jsAt, cls: 'wl-dl', title: 'download' }] });
      x.rows.push({ name: 'Hydration', segs: [{ from: x.jsAt, to: x.interactive, cls: 'wl-run', title: 'hydrate' }] });
    }
    x.bars = { title: `the page load with ${NAMES[s.strategy]}`, rows: x.rows, marks: [{ at: x.content, label: 'content visible', cls: 'paint' }, { at: x.interactive, label: 'buttons work', cls: 'live' }], legend: [['dl', 'downloading'], ['run', 'running'], ['srv', 'server waits for data']] };
    return x;
  }
  function render(s) {
    const steps = [];
    if (s.question === 'hydrate') {
      steps.push({ ok: true, text: `The server renders the component and sends: <code>${esc(s.serverHTML)}</code>` });
      steps.push({ ok: true, text: `In the browser, React renders the same component again to <b>hydrate</b> it (attach event handlers to the existing HTML): <code>${esc(s.clientHTML)}</code>` });
      const same = s.serverHTML === s.clientHTML;
      steps.push({ ok: same, text: same ? 'Both outputs are identical: React reuses the server HTML and only attaches the handlers.' : 'The outputs differ: React reports a <b>hydration mismatch</b> and has to fix up (or re-render) that part on the client. Users can see the text flicker.' });
      return { answer: same ? 'ok' : 'mismatch', steps };
    }
    const x = timing(s);
    steps.push({ ok: true, text: `Strategy: <b>${NAMES[s.strategy]}</b>.` });
    if (s.strategy === 'csr') steps.push({ ok: false, text: `The server sends the same <b>empty shell</b> to everyone (${x.htmlAt}ms). Nothing is visible until the JS bundle has downloaded (${x.jsAt}ms), fetched the data (${x.dataAt}ms) and rendered (${x.content}ms).` });
    if (s.strategy === 'ssr') steps.push({ ok: true, text: `The server waits for the data and renders the HTML <b>on every request</b>. The browser gets finished HTML at ${x.htmlAt}ms and paints the content immediately; React then downloads (${x.jsAt}ms) and <b>hydrates</b> (${x.interactive}ms).` });
    if (s.strategy === 'ssg' || s.strategy === 'isr') steps.push({ ok: true, text: `The HTML was rendered <b>at build time</b> and is served from a CDN near the user: content at ${x.htmlAt}ms. React hydrates at ${x.interactive}ms.` });
    let answer;
    if (s.question === 'seo') {
      answer = x.inHTML ? 'yes' : 'no';
      steps.push({ ok: x.inHTML, text: x.inHTML ? 'The product name is inside the HTML response, so crawlers and link previews (which often do not run JavaScript) see it.' : 'The HTML response contains only <code>&lt;div id="root"&gt;&lt;/div&gt;</code> and a script tag. A link preview bot that does not run JavaScript sees an empty page; Google can render JS, but later and less reliably.' });
    } else if (s.question === 'first') {
      answer = x.content + 'ms';
      steps.push({ ok: true, text: `First moment the product is on screen: <b>${x.content}ms</b>.` });
    } else if (s.question === 'click') {
      answer = s.at >= x.interactive ? 'yes' : 'no';
      steps.push({ ok: s.at >= x.content, text: `At ${s.at}ms the button is ${s.at >= x.content ? '' : '<b>not yet</b> '}visible (content at ${x.content}ms).` });
      steps.push({ ok: answer === 'yes', text: answer === 'yes' ? `At ${s.at}ms React has hydrated (${x.interactive}ms), so the click handler is attached.` : `But React only finishes hydrating at ${x.interactive}ms. Until then the button is plain HTML with <b>no click handler</b>: the click does nothing (the "uncanny valley" of SSR). Smaller bundles, code splitting and selective hydration shorten this gap.` });
    } else if (s.question === 'price') {
      const age = s.builtAgo * 60, changedAfterBuild = s.changedAgo < s.builtAgo;
      steps.push({ ok: true, text: `The page was built ${s.builtAgo} min ago; the price changed in the database ${s.changedAgo} min ago${changedAfterBuild ? ', after the build' : ''}.` });
      if (s.strategy === 'ssg') {
        answer = changedAfterBuild ? 'old' : 'new';
        steps.push({ ok: !changedAfterBuild, text: changedAfterBuild ? 'Static pages are only rendered at build time. Until the next build and deploy, every visitor gets the HTML with the <b>old price</b>.' : 'The build happened after the change, so the HTML has the new price.' });
      } else {
        const stale = age > s.revalidate;
        steps.push({ ok: true, text: `<code>revalidate: ${s.revalidate}</code>: the cached page counts as fresh for ${s.revalidate}s. It is ${age}s old, so it is ${stale ? '<b>stale</b>' : 'still fresh'}.` });
        if (!changedAfterBuild) answer = 'new';
        else if (s.visit === 'first') { answer = 'old'; steps.push({ ok: false, text: stale ? 'The first visitor after that still gets the <b>cached (old)</b> page immediately, and that request triggers a rebuild in the background (stale-while-revalidate).' : 'The page is still fresh, so the cached (old) page is served.' }); }
        else { answer = stale ? 'new' : 'old'; steps.push({ ok: stale, text: stale ? 'The background rebuild has finished, so the next visitor gets the regenerated page with the <b>new price</b>, without a redeploy.' : 'Still within the fresh period: the old page is served.' }); }
      }
    }
    return { answer, steps, bars: s.question === 'price' ? null : x.bars };
  }
  function pick(s) {
    const steps = [{ ok: true, text: `Needs: search engines / link previews ${s.seo ? '<b>must</b> see the content' : 'do not matter (it is behind a login)'}; the content is ${s.personal ? '<b>different for every user</b>' : 'the same for everyone'}; it changes ${s.changes}.` }];
    let answer;
    if (s.personal && !s.seo) { answer = 'csr'; steps.push({ ok: true, text: 'Per-user and behind a login: crawlers never see it, so server HTML buys little. A static shell plus API calls (CSR) is the simplest and cheapest; it can be cached on a CDN and the server only serves data.' }); }
    else if (s.personal) { answer = 'ssr'; steps.push({ ok: true, text: 'Different for every user and it must be indexed: render on the server for each request (SSR).' }); }
    else if (s.changes === 'rarely') { answer = 'ssg'; steps.push({ ok: true, text: 'Same for everyone and it rarely changes: build it once, serve static HTML from a CDN (SSG): the fastest and cheapest option. Rebuild when the content changes.' }); }
    else if (s.changes === 'on every request') { answer = 'ssr'; steps.push({ ok: true, text: 'It must be fresh on every request: SSR (or static plus client-side fetching for the live part).' }); }
    else { answer = 'isr'; steps.push({ ok: true, text: 'Same for everyone, but it changes during the day: static pages that are regenerated in the background (ISR, e.g. <code>revalidate: 60</code>) are fast like SSG and stay nearly fresh, without a redeploy.' }); }
    return { answer, steps };
  }
  function renderCard(s, esc) {
    if (s.question === 'hydrate') return `<div class="wl-cards"><div class="wl-card"><small>the component (rendered on the server, then hydrated in the browser)</small><pre>${esc(s.code)}</pre></div></div>`;
    if (s.question === 'price') return `<div class="wl-cards"><div class="wl-card"><small>${esc(NAMES[s.strategy])}</small><pre>${esc(s.strategy === 'isr' ? `// app/products/[id]/page.tsx\nexport const revalidate = ${s.revalidate}; // seconds` : '// app/products/[id]/page.tsx\n// no revalidate: rendered once, at build time')}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>the situation</small><pre>${esc(`page built ${s.builtAgo} min ago\nprice changed ${s.changedAgo} min ago\nnow: the ${s.visit === 'first' ? 'first visitor since the change' : 'next visitor, a moment later'}`)}</pre></div></div>`;
    const T = Object.assign({ cdn: 50, serverData: 300, serverRender: 50, js: 400, api: 300, hydrate: 100 }, s.t || {});
    const what = s.strategy === 'csr' ? '<div id="root"></div>\n<script src="app.js"></script>' : '<h1>Trail running shoes</h1>\n<p>$89</p>\n<button>Add to cart</button>\n<script src="app.js"></script>';
    return `<div class="wl-cards"><div class="wl-card"><small>${esc(NAMES[s.strategy])}: the HTML the server sends</small><pre>${esc(what)}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>timings</small><pre>${esc([s.strategy === 'ssr' ? `server data fetch: ${T.serverData}ms, render: ${T.serverRender}ms` : null, `HTML download: ${T.cdn}ms`, `JS bundle: ${T.js}ms`, s.strategy === 'csr' ? `API call from the browser: ${T.api}ms` : `hydration: ${T.hydrate}ms`].filter(Boolean).join('\n'))}</pre></div></div>`;
  }
  function pickCard(s, esc) {
    return `<div class="wl-card"><small>the page</small><pre>${esc(s.page)}\n\n· must appear in Google / link previews: ${s.seo ? 'yes' : 'no'}\n· different for each user: ${s.personal ? 'yes' : 'no'}\n· content changes: ${s.changes}</pre></div>`;
  }

  // ============================================================ service-worker caching strategies
  const SW_CODE = {
    'cache-first': 'self.addEventListener("fetch", e => {\n  e.respondWith(\n    caches.match(e.request).then(hit => hit || fetch(e.request))\n  );\n});',
    'network-first': 'self.addEventListener("fetch", e => {\n  e.respondWith(\n    fetch(e.request)\n      .then(res => { cache.put(e.request, res.clone()); return res; })\n      .catch(() => caches.match(e.request))\n  );\n});',
    'stale-while-revalidate': 'self.addEventListener("fetch", e => {\n  e.respondWith((async () => {\n    const hit = await caches.match(e.request);\n    const update = fetch(e.request)\n      .then(res => { cache.put(e.request, res.clone()); return res; });\n    return hit || update;\n  })());\n});',
  };
  function sw(s) {
    const steps = [];
    let cache = s.cached;
    const visit = (label) => {
      let shown;
      if (s.strategy === 'cache-first') {
        if (cache) { shown = cache; steps.push({ ok: true, text: `${label}: the cache has <b>${cache}</b>, so it is returned at once; the network is not used at all.` }); }
        else if (s.online) { shown = s.server; cache = s.server; steps.push({ ok: true, text: `${label}: nothing cached, so it goes to the network and gets <b>${s.server}</b>.` }); }
        else { shown = 'error'; steps.push({ ok: false, text: `${label}: nothing cached and no network: the request fails.` }); }
      } else if (s.strategy === 'network-first') {
        if (s.online) { shown = s.server; cache = s.server; steps.push({ ok: true, text: `${label}: online, so the network answers with <b>${s.server}</b> (and the cache is updated).` }); }
        else if (cache) { shown = cache; steps.push({ ok: true, text: `${label}: the network fails (offline), so the catch falls back to the cached <b>${cache}</b>.` }); }
        else { shown = 'error'; steps.push({ ok: false, text: `${label}: the network fails and <code>caches.match</code> finds nothing, so the page cannot load. A real app caches an <b>offline fallback page</b> during install and returns it here.` }); }
      } else {
        if (cache) {
          shown = cache;
          steps.push({ ok: true, text: `${label}: the cached <b>${cache}</b> is returned immediately (fast)…` });
          if (s.online) { cache = s.server; steps.push({ ok: true, text: `…and at the same time the network fetch puts <b>${s.server}</b> into the cache for next time.` }); }
          else steps.push({ ok: false, text: '…the background update fails (offline); the cache keeps the old copy.' });
        } else if (s.online) { shown = s.server; cache = s.server; steps.push({ ok: true, text: `${label}: nothing cached yet, so it waits for the network: <b>${s.server}</b>.` }); }
        else { shown = 'error'; steps.push({ ok: false, text: `${label}: nothing cached and offline: the request fails.` }); }
      }
      return shown;
    };
    steps.push({ ok: true, text: `The service worker sits between the page and the network. Strategy: <b>${s.strategy}</b>. You are ${s.online ? 'online' : '<b>offline</b>'}; the cache holds ${s.cached ? `<b>${s.cached}</b>` : 'nothing for this page'}; the server has <b>${s.server}</b>.` });
    const first = visit('This visit');
    const answer = s.question === 'next' ? visit('The next visit') : first;
    return { answer, steps };
  }
  function swCard(s, esc) {
    return `<div class="wl-cards"><div class="wl-card"><small>sw.js (${esc(s.strategy)})</small><pre>${esc(SW_CODE[s.strategy])}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>the situation</small><pre>${esc(`network: ${s.online ? 'online' : 'OFFLINE'}\ncache has: ${s.cached || 'nothing for this page'}\nserver has: ${s.server}\n\nquestion: ${s.question === 'next' ? 'what does the NEXT visit show?' : 'what does this visit show?'}`)}</pre></div></div>`;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  if (window.WebLab) { window.WebLab.extend('render', render, renderCard); window.WebLab.extend('pick', pick, pickCard); window.WebLab.extend('sw', sw, swCard); }

  const PICK = { csr: 'CSR: render in the browser', ssr: 'SSR: render on every request', ssg: 'SSG: build once, serve static', isr: 'ISR: static, regenerated in the background' };
  const SWL = { v1: 'version 1 (the old cached copy)', v2: 'version 2 (the new one)', error: 'an error: the page cannot load' };
  (window.WEB_TASKS = window.WEB_TASKS || []).push(
    { id: 'render-csr-seo', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'CSR and link previews', ask: 'Someone shares a product link in a chat app. Does the HTML response contain the product name?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'Shop built as a plain Vite + React app: links shared on WhatsApp or Slack show a blank preview with no product name or image.',
      hint: 'In CSR, when does the product name get into the page?',
      why: 'With <b>client-side rendering</b> the server sends the same empty shell to everyone; the content only exists after JavaScript runs. Link-preview bots usually do not run JavaScript, so they see nothing. That is the main reason public pages (shops, blogs, docs) use server or static rendering.',
      scenario: { question: 'seo', strategy: 'csr' } },
    { id: 'render-ssr-seo', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'SSR puts the content in the HTML', ask: 'The same page with server-side rendering. Does the HTML response contain the product name?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'The shop moved to Next.js: now the shared link shows the product name, price and image.',
      hint: 'With SSR, where is the HTML built?',
      why: 'With <b>SSR</b> the server runs your components for each request and sends finished HTML. Crawlers, link previews and users on slow phones all see the content without running JavaScript. Add Open Graph tags (<code>generateMetadata</code> in Next.js) for rich previews.',
      scenario: { question: 'seo', strategy: 'ssr' } },
    { id: 'render-csr-first', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'When does a CSR page show content?', ask: 'When is the product first visible on screen?', choices: ['50ms', '450ms', '770ms', '1000ms'],
      scene: 'Dashboard on a phone: users stare at a spinner because the bundle must download before the data request can even start (a request waterfall).',
      hint: 'In CSR, the data request can only start after the JS bundle has downloaded.',
      why: 'CSR is a <b>waterfall</b>: HTML (50ms) → JS bundle (400ms) → the app starts and fetches the data (300ms) → render (20ms) = 770ms. Each step waits for the one before it. Fixes: smaller bundles and code splitting, starting the data fetch earlier (preload, or fetching in a route loader in parallel with the code), or rendering on the server.',
      scenario: { question: 'first', strategy: 'csr' } },
    { id: 'render-ssr-click', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'SSR: visible but not yet clickable', ask: 'With SSR the user sees the button early. Does a click on "Add to cart" at 500ms work?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'Shop product page: analytics show "rage clicks" on Add to cart in the first second after the page appears.',
      hint: 'Seeing the HTML is not the same as having the event handlers attached.',
      why: 'SSR makes content <b>visible</b> early (400ms here), but it is only <b>interactive</b> after the JavaScript has downloaded and React has <b>hydrated</b> the HTML (900ms). In between, buttons look ready but do nothing. Measure it with INP / Total Blocking Time; shrink it with less JavaScript, code splitting, React Server Components (less to hydrate) and selective hydration with Suspense.',
      scenario: { question: 'click', strategy: 'ssr', at: 500 } },
    { id: 'render-ssg-price', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'Static pages and changing data', ask: 'The price was changed in the database after the build. Which price does a visitor see?', labels: { old: 'the old price', new: 'the new price' }, choices: ['old', 'new'],
      scene: 'Shop: marketing changes a price for a sale, but the static product page keeps showing the old price.',
      hint: 'When is a static page rendered?',
      why: '<b>Static generation</b> renders pages once, at build time. That makes them very fast and cheap, but data changes are not visible until you rebuild and redeploy (or switch that page to ISR / SSR).',
      scenario: { question: 'price', strategy: 'ssg', builtAgo: 120, changedAgo: 10, visit: 'first' } },
    { id: 'render-isr-price', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'ISR: who sees the new price?', ask: 'Now the page uses revalidate: 60. The first visitor since the price change arrives. Which price do they see?', labels: { old: 'the old price', new: 'the new price' }, choices: ['old', 'new'],
      scene: 'The same shop with ISR: prices update without a redeploy, but you must explain to the team why one visitor still saw the old price.',
      hint: 'ISR serves the cached page first and regenerates it in the background.',
      why: '<b>ISR</b> is stale-while-revalidate for pages: when the cached page is older than <code>revalidate</code>, the next request still gets the <b>stale page instantly</b> and triggers a rebuild in the background; the visitor after that gets the fresh page. So data is at most about one revalidate period plus one request behind. For data that must always be exact (stock at checkout), check it on the server at the moment of purchase.',
      scenario: { question: 'price', strategy: 'isr', builtAgo: 30, changedAgo: 10, revalidate: 60, visit: 'first' } },
    { id: 'render-hydration', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'render', title: 'Hydration mismatch', ask: 'Does hydrating this component cause a mismatch?', labels: { mismatch: 'Yes, a hydration mismatch', ok: 'No, it hydrates cleanly' }, choices: ['mismatch', 'ok'],
      scene: 'Next.js shop header: the console shows "Text content does not match server-rendered HTML" and the time flickers on load.',
      hint: 'The server renders at one moment, the browser hydrates a moment later.',
      why: 'Hydration expects the browser\'s first render to produce <b>exactly</b> the server HTML. Anything that differs between the two (the current time, <code>Math.random()</code>, <code>window</code> / <code>localStorage</code>, the user\'s locale or time zone) breaks that. Render a stable placeholder first and fill in the browser-only value in <code>useEffect</code> (it runs only in the browser, after hydration), or render that part only on the client.',
      scenario: { question: 'hydrate', code: 'function Clock() {\n  return <p>Updated {new Date().toLocaleTimeString()}</p>;\n}', serverHTML: '<p>Updated 10:00:00</p>', clientHTML: '<p>Updated 10:00:02</p>' } },
    { id: 'render-pick-docs', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'pick', title: 'Pick a strategy: documentation site', ask: 'Which rendering strategy fits best?', labels: PICK, choices: ['csr', 'ssr', 'ssg', 'isr'],
      scene: 'You are asked to build the docs / marketing site for your product.',
      hint: 'Same for everyone, rarely changes, must be found on Google.',
      why: 'Public, the same for every visitor and rarely changing: <b>SSG</b>. Pages are built once and served from a CDN, which is the fastest and cheapest option, and crawlers get full HTML. Rebuild on each content change (CI does it on merge).',
      scenario: { page: 'Product documentation and blog', seo: true, personal: false, changes: 'rarely' } },
    { id: 'render-pick-dashboard', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'pick', title: 'Pick a strategy: admin dashboard', ask: 'Which rendering strategy fits best?', labels: PICK, choices: ['csr', 'ssr', 'ssg', 'isr'],
      scene: 'The data dashboard project: everything is behind a login and different for each user.',
      hint: 'Will a search engine ever see this page?',
      why: 'Behind a login and personal: crawlers never see it, so the main benefit of server HTML is gone. A <b>CSR</b> single-page app (static shell on a CDN, data from an API, cached with React Query) is simple and fast after the first load. SSR can still help the first paint on slow devices, but it is not required.',
      scenario: { page: 'Admin dashboard (after login)', seo: false, personal: true, changes: 'all the time' } },
    { id: 'render-pick-shop', cat: 'Rendering: CSR, SSR, SSG', kind: 'rule', solver: 'pick', title: 'Pick a strategy: product pages', ask: 'Which rendering strategy fits best?', labels: PICK, choices: ['csr', 'ssr', 'ssg', 'isr'],
      scene: 'The Next.js shop: 5,000 product pages, the same for everyone, prices change a few times a day.',
      hint: 'It must be fast and indexed, and a little staleness is fine.',
      why: 'Public and the same for everyone, but changing during the day: <b>ISR</b> gives static speed and CDN caching, and pages refresh in the background without rebuilding all 5,000. The cart and the user menu are per-user, so they are rendered on the client (or as dynamic server parts) inside the static page.',
      scenario: { page: 'Product pages of an online shop', seo: true, personal: false, changes: 'a few times a day' } },
    // ------------------------------------------------------------ offline: service-worker caching strategies
    { id: 'sw-cache-first', cat: 'Offline & service workers', kind: 'rule', solver: 'sw', title: 'Cache first, offline', ask: 'You are offline. What does the page show?', labels: SWL, choices: ['v1', 'v2', 'error'],
      scene: 'Shop PWA: a customer opens the app on the train with no signal.',
      hint: 'Cache first never asks the network if the cache has an answer.',
      why: '<b>Cache first</b> answers from the cache whenever it can, so it works offline and is instant. The cost: users keep getting the cached copy until the cache is updated. Use it for files that never change under the same URL (hashed JS / CSS, fonts, images).',
      scenario: { strategy: 'cache-first', online: false, cached: 'v1', server: 'v2', question: 'shown' } },
    { id: 'sw-network-first', cat: 'Offline & service workers', kind: 'rule', solver: 'sw', title: 'Network first, online', ask: 'You are online; the cache has v1 and the server now has v2. What does the page show?', labels: SWL, choices: ['v1', 'v2', 'error'],
      scene: 'Chat app: the message list must be fresh when there is a connection, but still open offline.',
      hint: 'Network first only uses the cache when the network fails.',
      why: '<b>Network first</b> tries the network and falls back to the cache only when it fails. Users get fresh data online and the last copy offline; the cost is waiting for the network every time (add a timeout). Good for HTML pages and API data that should be fresh.',
      scenario: { strategy: 'network-first', online: true, cached: 'v1', server: 'v2', question: 'shown' } },
    { id: 'sw-swr', cat: 'Offline & service workers', kind: 'rule', solver: 'sw', title: 'Stale-while-revalidate', ask: 'Online, the cache has v1, the server has v2. What does the NEXT visit show?', labels: SWL, choices: ['v1', 'v2', 'error'],
      scene: 'Shop PWA: the product list must open instantly, and being one visit behind is fine.',
      hint: 'This visit gets the cache; what happens in the background?',
      why: '<b>Stale-while-revalidate</b> returns the cached copy immediately <b>and</b> fetches a fresh one in the background for next time. So this visit shows v1 and the next visit shows v2. It is fast like cache-first and catches up like network-first; it is the same idea as ISR and as React Query / SWR on the client.',
      scenario: { strategy: 'stale-while-revalidate', online: true, cached: 'v1', server: 'v2', question: 'next' } },
    { id: 'sw-offline-nocache', cat: 'Offline & service workers', kind: 'rule', solver: 'sw', title: 'Offline with nothing cached', ask: 'Network first, offline, and this page was never visited. What happens?', labels: SWL, choices: ['v1', 'v2', 'error'],
      scene: 'Shop PWA: offline, the user taps a product they have never opened.',
      hint: 'The network fails and the cache has nothing.',
      why: 'If both the network and the cache fail, the request fails and the user sees the browser\'s offline error. A good PWA caches an <b>offline fallback page</b> when the service worker installs and returns it here: <code>.catch(() => caches.match(e.request).then(hit => hit || caches.match("/offline.html")))</code>.',
      scenario: { strategy: 'network-first', online: false, cached: null, server: 'v2', question: 'shown' } },
    // ------------------------------------------------------------ browser APIs (these really run)
    { id: 'api-io-first', cat: 'Browser APIs', kind: 'measure', title: 'IntersectionObserver: the first callback', ask: 'An infinite feed loads 10 posts and watches the "Loading more…" line. Nobody scrolls. How many posts are in the feed?', choices: ['10', '20', '30'],
      scene: 'Dashboard infinite scroll: QA reports the feed loads page 2 immediately, even though nobody scrolled.',
      hint: 'When does an IntersectionObserver call its callback for the first time?',
      why: 'An <code>IntersectionObserver</code> calls the callback <b>once right after <code>observe()</code></b>, with the current state, even if the element is far off screen (then <code>isIntersecting</code> is false). This callback ignores that and always loads more, so page 2 loads at once (20 posts). Always check <code>entry.isIntersecting</code>. IntersectionObserver replaces scroll listeners for infinite scroll, lazy images and "seen" analytics: it does not run on every scroll event, so it does not slow scrolling down.',
      html: `<ul id="feed"></ul>
<p id="more">Loading more…</p>
<script>
  const feed = document.getElementById("feed");
  function loadMore() {
    for (let i = 0; i < 10; i++) {
      const li = document.createElement("li");
      li.textContent = "Post " + (feed.children.length + 1);
      li.style.height = "40px";
      feed.appendChild(li);
    }
  }
  loadMore();
  new IntersectionObserver(entries => {
    loadMore();
  }).observe(document.getElementById("more"));
</script>`,
      needsView: true,
      measure: async (d) => { await settle(d); return String(d.getElementById('feed').children.length); } },
    { id: 'api-io-visible', cat: 'Browser APIs', kind: 'measure', title: 'IntersectionObserver: load when visible', ask: 'Fixed version: the feed scrolls inside its own panel, the observer checks isIntersecting, and it starts with only 2 posts, so the "Loading more…" line is visible in the panel. How many posts are there once it settles?', choices: ['2', '12', '22'],
      scene: 'The same dashboard, fixed: the activity feed scrolls inside a side panel, and its first page is too short to fill the panel, so the next page must load by itself.',
      hint: 'The line is visible at first. After 10 more posts, is it still visible in the panel?',
      why: 'With <code>root: panel</code> the observer measures visibility inside that scrolling box (without a root it uses the browser window). The first callback reports <code>isIntersecting: true</code> because the line is visible, so 10 posts are added (12). That pushes the line below the bottom of the panel, the observer reports <code>false</code>, and loading stops until the user scrolls. This is the correct infinite-scroll pattern; also stop observing when there are no more pages (<code>observer.disconnect()</code>), and use <code>rootMargin: "200px"</code> to start loading a little before the end.',
      html: `<div id="panel" style="height: 140px; overflow: auto; border: 1px solid #ccc">
  <ul id="feed"></ul>
  <p id="more">Loading more…</p>
</div>
<script>
  const feed = document.getElementById("feed");
  function loadMore(n) {
    for (let i = 0; i < n; i++) {
      const li = document.createElement("li");
      li.textContent = "Post " + (feed.children.length + 1);
      li.style.height = "40px";
      feed.appendChild(li);
    }
  }
  loadMore(2);
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) loadMore(10);
  }, { root: document.getElementById("panel") }).observe(document.getElementById("more"));
</script>`,
      needsView: true,
      measure: async (d) => { await settle(d); return String(d.getElementById('feed').children.length); } },
    { id: 'api-storage-string', cat: 'Browser APIs', kind: 'measure', title: 'localStorage only stores strings', ask: 'The cart array is saved with setItem and read back with getItem. What comes back?', labels: { array: 'the same array of objects', json: 'the JSON text [{"id":7,"qty":2}]', object: 'the text "[object Object]"' }, choices: ['array', 'json', 'object'],
      scene: 'Checkout: the cart should survive a page refresh, so you save it in localStorage, and after a refresh the cart is broken.',
      hint: 'setItem turns its value into a string. How does an array of objects become a string?',
      why: '<code>localStorage</code> stores <b>strings only</b>: <code>setItem</code> calls <code>String(value)</code>, and an object becomes <code>"[object Object]"</code>, so the data is lost. Always <code>localStorage.setItem("cart", JSON.stringify(cart))</code> and <code>JSON.parse(localStorage.getItem("cart") ?? "[]")</code>. Remember too: it is synchronous (keep it small), limited to about 5MB, shared by every script on the origin (so never store tokens there), and private-mode browsers can throw on write.',
      html: `<script>
  const cart = [{ id: 7, qty: 2 }];
  localStorage.setItem("demo-cart", cart);
  window.saved = localStorage.getItem("demo-cart");
  localStorage.removeItem("demo-cart");
</script>`,
      measure: async (d, w) => { await wait(200); return w.saved === '[object Object]' ? 'object' : /^\[\{/.test(w.saved || '') ? 'json' : 'array'; } },
    { id: 'api-storage-event', cat: 'Browser APIs', kind: 'measure', title: 'The storage event and other tabs', ask: 'This tab listens for "storage" and then writes to localStorage. Does its own listener run?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'Chat app: when the user logs out in one tab, every other open tab should log out too.',
      hint: 'The storage event exists to tell you about changes made somewhere else.',
      why: 'The <code>storage</code> event fires in <b>other</b> tabs and windows of the same origin, never in the one that made the change. That makes it a simple way to sync tabs: on logout, write a key; the other tabs hear the event and log out too. For richer messages between tabs use <code>BroadcastChannel</code>.',
      html: `<script>
  window.heard = false;
  addEventListener("storage", () => { window.heard = true; });
  localStorage.setItem("demo-logout", String(Date.now()));
  localStorage.removeItem("demo-logout");
</script>`,
      measure: async (d, w) => { await wait(300); return w.heard ? 'yes' : 'no'; } },
    { id: 'api-history', cat: 'Browser APIs', kind: 'measure', title: 'pushState and popstate', ask: 'A router calls history.pushState. Does the popstate listener run?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'Dashboard: filters live in the URL (?page=2). Your hand-made router updates the URL but the screen does not change.',
      hint: 'popstate is for history moves the user makes.',
      why: '<code>history.pushState()</code> changes the URL and adds a history entry <b>without</b> loading a page and <b>without</b> firing <code>popstate</code>. <code>popstate</code> only fires when the user goes Back / Forward. So a router does two things: after its own <code>pushState</code> it renders the new route itself, and it listens to <code>popstate</code> to render when the user navigates. That is what React Router\'s <code>navigate()</code> and <code>&lt;Link&gt;</code> do for you.',
      html: `<script>
  window.popped = false;
  addEventListener("popstate", () => { window.popped = true; });
  history.pushState({ page: 2 }, "");
</script>`,
      measure: async (d, w) => { await wait(300); return w.popped ? 'yes' : 'no'; } },
  );

  // ============================================================ login & auth
  function auth(s) {
    const steps = [];
    if (s.question === 'oauth') {
      [
        'The user clicks "Sign in with Google". Your app makes a random <b>code_verifier</b>, keeps it, and sends only its hash (<code>code_challenge</code>) along.',
        'The browser is <b>redirected to Google</b> (<code>/authorize?client_id=…&amp;redirect_uri=…&amp;code_challenge=…&amp;state=…</code>). The user logs in <b>on Google\'s page</b>: your app never sees the password.',
        'Google redirects back to your <code>redirect_uri</code> with a short-lived <b>authorization code</b> (and the <code>state</code>, which you check against CSRF).',
        'Your app (best: your backend) sends the <b>code + code_verifier</b> to Google\'s token endpoint. Google checks that the verifier matches the hash from step 1, so a stolen code alone is useless.',
        'Google returns the <b>tokens</b> (an ID token saying who the user is, an access token for Google APIs). Your backend then starts its own session, usually an HttpOnly cookie.',
      ].forEach(text => steps.push({ ok: true, text }));
      return { answer: s.answer, steps };
    }
    const calls = s.calls || ['/api/orders'];
    let n = 0;
    steps.push({ ok: true, text: `The access token ${s.expired ? '<b>expired</b> a minute ago' : 'is still valid'}. The page needs ${calls.map(c => `<code>${c}</code>`).join(' and ')}${calls.length > 1 ? ' at the same time' : ''}.` });
    calls.forEach(c => { n++; steps.push({ ok: !s.expired, text: `${n}. GET ${c} with <code>Authorization: Bearer &lt;access token&gt;</code> → ${s.expired ? '<b>401 Unauthorized</b>' : '200 OK'}` }); });
    if (s.expired) {
      const refreshes = s.shared ? 1 : calls.length;
      for (let i = 0; i < refreshes; i++) { n++; steps.push({ ok: true, text: `${n}. POST /auth/refresh (the browser sends the HttpOnly refresh-token cookie) → a new access token${s.shared ? ', shared by every waiting request' : ''}` }); }
      if (!s.shared && calls.length > 1) steps.push({ ok: false, text: 'Each failed request starts its <b>own</b> refresh. With refresh-token rotation the second refresh may even be rejected (the first one already used the token) and log the user out.' });
      calls.forEach(c => { n++; steps.push({ ok: true, text: `${n}. GET ${c} again with the new token → 200 OK` }); });
    }
    return { answer: String(n), steps };
  }
  function authCard(s, esc) {
    if (s.question === 'oauth') return `<div class="wl-card"><small>the situation</small><pre>${esc('Your app has a "Sign in with Google" button.\nIt uses the OAuth 2.0 Authorization Code flow with PKCE\n(the recommended flow for browser apps).')}</pre></div>`;
    return `<div class="wl-cards"><div class="wl-card"><small>the fetch wrapper</small><pre>${esc(s.shared ? 'let refreshing = null;\nasync function api(url) {\n  let res = await fetch(url, { headers: auth() });\n  if (res.status === 401) {\n    refreshing ??= refresh().finally(() => (refreshing = null));\n    await refreshing;           // one refresh for everyone\n    res = await fetch(url, { headers: auth() });\n  }\n  return res;\n}' : 'async function api(url) {\n  let res = await fetch(url, { headers: auth() });\n  if (res.status === 401) {\n    await refresh();            // get a new access token\n    res = await fetch(url, { headers: auth() });\n  }\n  return res;\n}')}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>the situation</small><pre>${esc(`access token: ${s.expired ? 'EXPIRED' : 'valid'}\nrequests: ${(s.calls || ['/api/orders']).join(', ')}`)}</pre></div></div>`;
  }

  // ============================================================ live updates: polling, WebSocket, server-sent events
  function live(s) {
    const steps = [], sec = ms => (ms / 1000).toFixed(1) + 's';
    if (s.question === 'pick') {
      let answer;
      if (s.both) { answer = 'ws'; steps.push({ ok: true, text: 'Messages go <b>both ways</b>, many times a second (typing, sending, receiving): a <b>WebSocket</b> keeps one two-way connection open.' }); }
      else if (s.often) { answer = 'sse'; steps.push({ ok: true, text: 'Only the <b>server pushes</b>, and it should arrive at once: <b>Server-Sent Events</b> (<code>new EventSource(url)</code>) is plain HTTP, reconnects by itself and resumes with <code>Last-Event-ID</code>. No WebSocket server needed.' }); }
      else { answer = 'poll'; steps.push({ ok: true, text: 'The data changes rarely and a delay of a minute is fine: <b>polling</b> (fetch every N seconds, e.g. React Query <code>refetchInterval</code>) is the simplest thing that works, with nothing to keep open.' }); }
      return { answer, steps };
    }
    if (s.mode === 'poll') {
      const tick = Math.ceil(s.sentAt / s.interval) * s.interval, seen = tick + s.latency;
      steps.push({ ok: true, text: `The page asks the server every ${sec(s.interval)}: at ${Array.from({ length: Math.ceil(seen / s.interval) }, (_, i) => sec((i + 1) * s.interval)).join(', ')}…` });
      steps.push({ ok: true, text: `The message arrives on the server at ${sec(s.sentAt)}. The next poll after that is at ${sec(tick)}; its response arrives ${s.latency}ms later: <b>${sec(seen)}</b>, ${sec(seen - s.sentAt)} late.` });
      return { answer: sec(seen), steps };
    }
    if (s.question === 'lost') {
      steps.push({ ok: true, text: `The WebSocket is open; messages are pushed as they happen.` });
      steps.push({ ok: false, text: `At ${sec(s.drop)} the connection drops (Wi-Fi switch, laptop sleep). The browser fires <code>close</code>; a WebSocket does <b>not</b> reconnect by itself.` });
      steps.push({ ok: false, text: `At ${sec(s.sentAt)} the server pushes the message to every <b>open</b> connection: this client is not connected, so it is not delivered, and the server does not keep it for later.` });
      steps.push({ ok: true, text: `At ${sec(s.reconnect)} the client reconnects (your code, with backoff). Without more code, only <b>new</b> messages arrive. Fix: remember the last message id and ask "what did I miss since id 41?" after reconnecting (or use SSE with Last-Event-ID).` });
      return { answer: 'lost', steps };
    }
    const seen = s.sentAt + s.latency;
    steps.push({ ok: true, text: `The connection is already open, so the server pushes the message the moment it arrives (${sec(s.sentAt)}); it reaches the browser ${s.latency}ms later: <b>${sec(seen)}</b>.` });
    return { answer: sec(seen), steps };
  }
  function liveCard(s, esc) {
    if (s.question === 'pick') return `<div class="wl-card"><small>the feature</small><pre>${esc(s.feature)}</pre></div>`;
    const code = s.mode === 'poll' ? `setInterval(async () => {\n  const res = await fetch("/api/messages?since=" + lastId);\n  show(await res.json());\n}, ${s.interval});` : 'const ws = new WebSocket("wss://chat.example/ws");\nws.onmessage = e => show(JSON.parse(e.data));';
    return `<div class="wl-cards"><div class="wl-card"><small>the client</small><pre>${esc(code)}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>the situation</small><pre>${esc(`a message arrives on the server at ${(s.sentAt / 1000).toFixed(1)}s\nnetwork latency: ${s.latency}ms${s.question === 'lost' ? `\nthe connection drops at ${s.drop / 1000}s\nthe client reconnects at ${s.reconnect / 1000}s` : ''}`)}</pre></div></div>`;
  }
  if (window.WebLab) { window.WebLab.extend('auth', auth, authCard); window.WebLab.extend('live', live, liveCard); }

  (window.WEB_TASKS = window.WEB_TASKS || []).push(
    { id: 'auth-jwt-read', cat: 'Auth & login', kind: 'measure', title: 'A JWT is signed, not encrypted', ask: 'The token is signed with a secret the browser does not have. Can the page read the role inside it?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'Dashboard: after login you show the user\'s name from the JWT, and a teammate wants to put the user\'s address and plan into the token too.',
      hint: 'A JWT is three base64 parts: header.payload.signature.',
      why: 'A <b>JWT</b> is <code>header.payload.signature</code>, each part base64url-encoded. Anyone can <b>read</b> the payload (<code>atob</code>); the signature only lets the <b>server</b> detect changes. So never put secrets or private data in a JWT, and never trust a JWT\'s claims in the browser for security decisions: the server must verify it. (Encrypted tokens, JWE, exist but are rare in front-end work.)',
      html: `<script>
  // a token from the login response: header.payload.signature
  const payloadPart = btoa(JSON.stringify({ sub: "42", name: "Ada", role: "admin", exp: 1893456000 }));
  const token = "eyJhbGciOiJIUzI1NiJ9." + payloadPart + ".c2lnbmF0dXJl";

  const payload = JSON.parse(atob(token.split(".")[1]));
  window.role = payload.role;
</script>`,
      measure: async (d, w) => { await wait(200); return w.role === 'admin' ? 'yes' : 'no'; } },
    { id: 'auth-token-xss', cat: 'Auth & login', kind: 'measure', title: 'Tokens in localStorage and XSS', ask: 'The app keeps its access token in localStorage. An XSS bug lets an attacker\'s script run. Can it read the token?', labels: YESNO, choices: ['yes', 'no'],
      scene: 'Login for the dashboard: a tutorial says "save the JWT in localStorage". Your security reviewer says no.',
      hint: 'Which scripts may read localStorage?',
      why: 'Every script on the page can read <code>localStorage</code>, including an injected one, so one XSS bug leaks the token and the attacker can use it from anywhere until it expires. Safer: keep the session in an <b>HttpOnly</b>, <b>Secure</b>, <b>SameSite</b> cookie that JavaScript cannot read (see the cookie tasks), or keep a short-lived access token only in memory and refresh it through an HttpOnly cookie. XSS is still a disaster, but the token cannot be carried away.',
      html: `<script>
  // after login, the app saved the token
  localStorage.setItem("demo-token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.c2ln");
</script>
<script>
  // an XSS hole somewhere else injects this script:
  window.stolen = localStorage.getItem("demo-token");
  localStorage.removeItem("demo-token");
</script>`,
      measure: async (d, w) => { await wait(200); return w.stolen ? 'yes' : 'no'; } },
    { id: 'auth-refresh', cat: 'Auth & login', kind: 'rule', solver: 'auth', title: 'Expired token: refresh and retry', ask: 'How many requests does the app send to load the orders?', choices: ['1', '2', '3'],
      scene: 'Dashboard: users who leave the tab open over lunch come back to errors, because the 15-minute access token has expired.',
      hint: 'The first request fails with 401. What does the wrapper do then?',
      why: 'Short-lived <b>access tokens</b> (minutes) limit the damage if one leaks; a long-lived <b>refresh token</b> (in an HttpOnly cookie) gets new ones. A fetch wrapper (or an axios interceptor) catches the <code>401</code>, refreshes once, and retries: 3 requests, invisible to the user.',
      scenario: { expired: true, calls: ['/api/orders'] } },
    { id: 'auth-refresh-race', cat: 'Auth & login', kind: 'rule', solver: 'auth', title: 'Two requests, one expired token', ask: 'The dashboard loads orders and profile at the same time with an expired token. How many requests does this naive wrapper send?', choices: ['3', '5', '6'],
      scene: 'Dashboard: some users get logged out at random after lunch. In the Network panel you see two refresh calls at once.',
      hint: 'Each failed request runs the wrapper\'s 401 branch on its own.',
      why: 'Both requests get <code>401</code> and each calls <code>refresh()</code>: 2 + 2 + 2 = 6 requests, and with refresh-token rotation the second refresh can fail and log the user out. The fix is to <b>share one refresh promise</b> (<code>refreshing ??= refresh()</code>): every waiting request awaits the same refresh, giving 5 requests and no race. Libraries call this "token refresh queueing".',
      scenario: { expired: true, calls: ['/api/orders', '/api/profile'], shared: false } },
    { id: 'auth-oauth', cat: 'Auth & login', kind: 'rule', solver: 'auth', title: 'Sign in with Google: the OAuth flow', ask: 'In which order does "Sign in with Google" happen (Authorization Code flow with PKCE)?', labels: {
        a: 'redirect to Google → user logs in there → back with a code → exchange code + verifier for tokens',
        b: 'your form collects the Google password → send it to Google → get tokens',
        c: 'redirect to Google → back with the tokens in the URL → save them in localStorage',
      }, choices: ['a', 'b', 'c'],
      scene: 'Any app with social login: you add "Sign in with Google" with Auth0, Clerk, NextAuth or Firebase, and need to understand what they do for you.',
      hint: 'Your app must never see the Google password.',
      why: '<b>OAuth 2.0</b> lets users log in on the provider\'s own page; your app gets a one-time <b>code</b>, then exchanges it (with the PKCE verifier) for tokens. <b>OpenID Connect</b> adds the ID token that says who the user is. Option b would hand your app the password; option c is the old "implicit flow", now discouraged because tokens in URLs leak through history and logs.',
      scenario: { question: 'oauth', answer: 'a' } },
    // ------------------------------------------------------------ internationalisation (real Intl in the browser)
    { id: 'intl-price', cat: 'Internationalisation', kind: 'measure', title: 'Prices in another locale', ask: 'What does a German customer see for 1234.5 euros?', labels: { en: '€1,234.50', de: '1.234,50 €', fr: '1 234,50 €' }, choices: ['en', 'de', 'fr'],
      scene: 'Checkout: the shop starts selling in Germany. The total must look right to German customers.',
      hint: 'Germany swaps the roles of the dot and the comma.',
      why: '<code>Intl.NumberFormat(locale, { style: "currency", currency })</code> knows each locale\'s rules: the decimal and thousands separators, where the symbol goes, and the spacing (a non-breaking space). Never build prices with <code>"€" + n.toFixed(2)</code>. Keep money as integer cents and format only for display.',
      html: `<script>
  const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  window.out = fmt.format(1234.5);
</script>`,
      measure: async (d, w) => { await wait(200); const v = String(w.out).replace(/\s/g, ' '); return { '€1,234.50': 'en', '1.234,50 €': 'de', '1 234,50 €': 'fr' }[v] || v; } },
    { id: 'intl-date', cat: 'Internationalisation', kind: 'measure', title: 'Whose date format?', ask: 'What does a UK user see for 4 March 2026?', choices: ['3/4/2026', '04/03/2026', '2026-03-04'],
      scene: 'Dashboard: a British customer complains that a delivery date "4 March" was shown as 3/4 and they read it as 3 April.',
      hint: 'The UK puts the day first.',
      why: '<code>toLocaleDateString(locale)</code> / <code>Intl.DateTimeFormat</code> use each locale\'s order: en-US is month/day/year (3/4/2026), en-GB day/month/year (04/03/2026). Use the user\'s locale (<code>navigator.language</code> or their setting) instead of hard-coding a format, or show the month as a word to avoid any doubt.',
      html: `<script>
  const d = new Date(Date.UTC(2026, 2, 4)); // months start at 0: 2 = March
  window.out = d.toLocaleDateString("en-GB", { timeZone: "UTC" });
</script>`,
      measure: async (d, w) => { await wait(200); return String(w.out); } },
    { id: 'intl-timezone', cat: 'Internationalisation', kind: 'measure', title: 'Time zones move the date', ask: 'An order was placed at 2026-01-05 02:00 UTC. Which day does a user in New York see?', choices: ['Jan 4', 'Jan 5'],
      scene: 'Checkout confirmation email and order history disagree about the order date for US customers.',
      hint: '02:00 in UTC is the evening before in New York (UTC−5).',
      why: 'A <code>Date</code> is one moment in time; the <b>day</b> depends on the time zone you show it in. 02:00 UTC is 21:00 on 4 January in New York. Store and send times as UTC (ISO strings like <code>2026-01-05T02:00:00Z</code>), and format them in the user\'s time zone only for display. Date-only values (a birthday) should not be stored as midnight UTC. The new <code>Temporal</code> API makes this explicit.',
      html: `<script>
  const placed = new Date("2026-01-05T02:00:00Z");
  window.out = placed.toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric" });
</script>`,
      measure: async (d, w) => { await wait(200); return String(w.out); } },
    // ------------------------------------------------------------ live updates
    { id: 'live-poll', cat: 'Live updates', kind: 'rule', solver: 'live', title: 'Polling: how late is the news?', ask: 'The page polls every 5 seconds. A message reaches the server at 12.0s. When does the user see it?', choices: ['12.1s', '15.1s', '17.1s'],
      scene: 'Chat app, first version: messages show up a few seconds late, and the server log is full of "nothing new" requests.',
      hint: 'The page only learns about it at its next poll.',
      why: '<b>Polling</b> asks again and again. A message waits until the next poll (15s here, plus latency), so on average it is half an interval late, and most requests return nothing. It is still the right choice for data that changes rarely, because it is simple and works everywhere.',
      scenario: { mode: 'poll', interval: 5000, sentAt: 12000, latency: 100 } },
    { id: 'live-ws', cat: 'Live updates', kind: 'rule', solver: 'live', title: 'WebSocket: pushed at once', ask: 'Same message, now over an open WebSocket. When does the user see it?', choices: ['12.1s', '15.1s', '17.1s'],
      scene: 'Chat app, second version: messages appear instantly in every open window.',
      hint: 'With an open connection the server does not wait to be asked.',
      why: 'A <b>WebSocket</b> keeps one connection open in both directions, so the server <b>pushes</b> the message the moment it has it: 12.0s + 100ms. The cost: a server that holds many open connections, plus your own reconnect, heartbeat and authentication logic (next task).',
      scenario: { mode: 'ws', sentAt: 12000, latency: 100 } },
    { id: 'live-reconnect', cat: 'Live updates', kind: 'rule', solver: 'live', title: 'Messages lost while offline', ask: 'The connection drops at 20s and the client reconnects at 27s. Is the message sent at 25s shown?', labels: { lost: 'No, it is never shown', shown: 'Yes, after reconnecting' }, choices: ['lost', 'shown'],
      scene: 'Chat app: users on trains say messages "disappear". They were sent while the phone was switching networks.',
      hint: 'Who keeps the message while the client is not connected?',
      why: 'A WebSocket only delivers to connections that are open <b>now</b>; it does not reconnect by itself or replay what you missed. A robust client reconnects with exponential backoff, then asks the API for everything after the last message id it has (and de-duplicates). Libraries (Socket.IO, Ably, Pusher, Supabase Realtime) do much of this for you.',
      scenario: { mode: 'ws', question: 'lost', drop: 20000, sentAt: 25000, reconnect: 27000, latency: 100 } },
    { id: 'live-pick', cat: 'Live updates', kind: 'rule', solver: 'live', title: 'Pick: polling, SSE or WebSocket?', ask: 'Which one fits a live notifications bell (the server tells the browser about new notifications)?', labels: { poll: 'Polling every minute', sse: 'Server-Sent Events (EventSource)', ws: 'WebSocket' }, choices: ['poll', 'sse', 'ws'],
      scene: 'Dashboard: a notification bell should update the moment something happens.',
      hint: 'The data only flows one way: server → browser.',
      why: 'Choose the simplest tool that meets the need: <b>polling</b> for rare changes, <b>SSE</b> when only the server pushes (notifications, progress, live scores, streaming AI answers), and a <b>WebSocket</b> when both sides send often (chat, multiplayer, collaborative editing).',
      scenario: { question: 'pick', feature: 'A notification bell: the server tells the browser\nabout new notifications as soon as they happen.\nThe browser never sends anything back on this channel.', often: true, both: false } },
  );

  // right-to-left layouts are measured by the CSS lab
  window.CSS_TASKS.push({
    id: 'css-logical', cat: 'Internationalisation', title: 'Right-to-left and logical properties', ask: 'The page is in Arabic (dir="rtl"). Which side of the badge gets the 20px margin?',
    scene: 'Shop goes to the Middle East: the whole layout must mirror for Arabic and Hebrew, without a second stylesheet.',
    answer: 'choice', choices: ['left', 'right'], target: '.badge',
    hint: '"inline-start" is where the text begins.',
    why: '<b>Logical properties</b> follow the writing direction: <code>margin-inline-start</code> is the left margin in English but the <b>right</b> margin in a right-to-left language, where text starts on the right. Use <code>inline-start / inline-end</code> (and <code>padding-inline</code>, <code>inset-inline-start</code>, <code>text-align: start</code>) instead of left / right, and one stylesheet works for both directions.',
    html: `<style>
  .badge { margin-inline-start: 20px; background: #fde68a; padding: 2px 6px; }
</style>
<p dir="rtl">
  <span class="badge">جديد</span>
  <span>منتج جديد</span>
</p>`,
    measure: (d, w, $) => (parseFloat(style($('.badge'), 'margin-right')) === 20 ? 'right' : 'left'),
  });
})();

/*
 * JS Engine Lab — 🧰 DevTools & debugging: a method for finding any bug, and what each Chrome DevTools panel is for,
 * with the tricks experienced developers use. Brief by default; "+ Show details" adds how to do each trick.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const METHOD = [
    ['Reproduce it', 'Find exact steps that make the bug happen every time (browser, account, data, network).', 'If you cannot reproduce it, add logging or error monitoring (Sentry) and wait for the next occurrence with more context.'],
    ['Read the error', 'Read the whole message and the stack trace: which file and line, and which of your functions called it.', 'Click the file:line link in the Console to jump to the code; source maps show your original code instead of the bundle.'],
    ['Isolate it', 'Make the case smaller: remove parts until the bug disappears, then you know where it lives.', 'For "it worked last week": git bisect finds the commit that broke it.\n  git bisect start\n  git bisect bad            # now is broken\n  git bisect good v1.4.0    # this version worked\n  # test each commit git picks, mark good / bad, until it names the culprit'],
    ['Guess, then check', 'Form one hypothesis ("the id is undefined here") and check it with a breakpoint or a log, instead of changing code at random.', 'A breakpoint shows every variable at that moment; a logpoint logs without editing the code.'],
    ['Fix the cause', 'Fix why it happens, not just where it shows (a missing await, not a try/catch that hides it).', 'Ask "why" until you reach the real cause; check other places with the same pattern.'],
    ['Add a test', 'Write a test that fails without the fix and passes with it, so the bug cannot come back.', 'See the 🧪 Testing tasks.'],
    ['Write it down', 'In the PR or ticket: what was wrong, why, how it was fixed.', 'Future you (and your team) will meet a similar bug again.'],
  ];

  // panels: [name, icon, used for, [[trick, one line, how]]]
  const PANELS = [
    ['Elements', '🧱', 'See and edit the live HTML and CSS.', [
      ['Inspect an element', 'Pick anything on the page to jump to its HTML.', 'Ctrl+Shift+C (Cmd+Shift+C on Mac), then click the element.'],
      ['Edit live', 'Change text, attributes and CSS rules and see the result at once.', 'Double-click to edit; untick a CSS rule to switch it off; changes are lost on reload.'],
      ['Computed tab', 'The final value of every property, and which rule set it.', 'Elements → Computed → expand a property to see the winning rule (the cascade).'],
      ['Force a state', 'Show :hover, :focus or :active styles without holding the mouse.', 'Styles pane → :hov → tick :hover / :focus-visible.'],
      ['Flex and grid overlays', 'Draw the grid lines and flex gaps on the page.', 'Click the "grid" / "flex" badge next to the element, or use the Layout pane.'],
      ['Accessibility pane', 'The element\'s computed name and role, as a screen reader sees it.', 'Elements → Accessibility; also try "Full-page accessibility tree".'],
      ['Break on change', 'Pause when JavaScript changes this element.', 'Right-click the element → Break on → subtree modifications / attribute modifications.'],
    ]],
    ['Console', '💬', 'Run JavaScript on the page and read logs and errors.', [
      ['Better logging', 'console.table for arrays of objects, console.group, console.time / timeEnd, console.count, console.trace.', 'console.table(users) shows a sortable table; console.trace() prints how you got there.'],
      ['$0 and friends', '$0 is the element selected in Elements; $$("a") returns all links as an array.', 'copy(obj) puts JSON on your clipboard; $_ is the last result.'],
      ['Live expressions', 'Watch a value update constantly (the 👁 icon).', 'e.g. document.activeElement, to see where focus is while you press Tab.'],
      ['Preserve log', 'Keep logs across page reloads and navigations.', 'Console settings → Preserve log (also in Network).'],
      ['Filter', 'Show only errors, or only messages matching some text.', 'Use the level drop-down and the filter box; -text hides matches.'],
    ]],
    ['Sources', '🐞', 'Pause your code and step through it: the real debugger.', [
      ['Breakpoints', 'Pause on a line and inspect every variable, the scope and the call stack.', 'Click the line number; or write debugger; in your code.'],
      ['Conditional breakpoints and logpoints', 'Pause only when a condition is true, or log without editing code.', 'Right-click the line number → Add conditional breakpoint / Add logpoint.'],
      ['Step through', 'Over (next line), into (enter the function), out (back to the caller).', 'F10 over, F11 into, Shift+F11 out, F8 resume.'],
      ['Pause on exceptions', 'Stop exactly where an error is thrown, even if it is caught later.', 'Breakpoints pane → Pause on uncaught / caught exceptions.'],
      ['Fetch and event breakpoints', 'Pause when a request to a URL is sent, or when a click / keydown handler runs.', 'XHR/fetch Breakpoints → add a URL part; Event Listener Breakpoints → Mouse → click.'],
      ['Ignore library code', 'Skip node_modules while stepping.', 'Settings → Ignore list (on by default for node_modules in many setups).'],
      ['Local overrides', 'Edit a file from production and keep the change across reloads.', 'Sources → Overrides → choose a folder, then edit and save.'],
    ]],
    ['Network', '🌐', 'Every request the page makes: what, when, how big, how long, and the headers.', [
      ['Filter by type', 'Show only Fetch/XHR, JS, CSS, images…', 'The type buttons above the list; type in the filter box for a URL part.'],
      ['Headers, payload, response', 'See exactly what was sent and received (status, Cache-Control, CORS, cookies).', 'Click a request → Headers / Payload / Response / Timing.'],
      ['Throttle and offline', 'Test like a phone on a slow network, or with no network at all.', 'The throttling drop-down: Fast 4G / Slow 4G / Offline.'],
      ['Disable cache', 'Load everything fresh while DevTools is open.', 'Tick "Disable cache".'],
      ['Initiator', 'Which code made this request.', 'Hover the Initiator column, or open the Initiator tab.'],
      ['Copy and replay', 'Copy a request as fetch or cURL, or send it again.', 'Right-click → Copy → Copy as fetch; right-click → Replay XHR.'],
      ['Block a request', 'See what happens if a script, font or API fails.', 'Right-click → Block request URL.'],
      ['WebSockets', 'Read the messages of a live connection.', 'Click the WS request → Messages.'],
    ]],
    ['Performance', '⏱️', 'Record what the browser does, millisecond by millisecond: scripts, style, layout, paint.', [
      ['Live metrics', 'LCP, CLS and INP of the page as you use it.', 'Open Performance: the landing view shows live Core Web Vitals.'],
      ['Record a load or a click', 'See the main thread as a flame chart.', 'Record and reload (⟳), or record, click, stop.'],
      ['Long tasks', 'Tasks over 50ms have a red corner: they block clicks.', 'Click one; the Bottom-Up tab shows which functions took the time.'],
      ['Forced reflow', 'Purple Layout blocks with a warning mean layout thrashing.', 'Click the warning to jump to the code that read layout (see 🖥️ Code → Pixels).'],
      ['Throttle the CPU', 'Simulate a slower phone.', 'Settings (⚙) in the Performance panel → CPU: 4× slowdown.'],
    ]],
    ['Memory', '🧠', 'Find memory leaks: what is still in memory, and why.', [
      ['Heap snapshot', 'A picture of every object in memory.', 'Memory → Heap snapshot → Take snapshot.'],
      ['Compare snapshots', 'Take one, repeat an action 10 times, take another, compare: growth is a leak.', 'Select the second snapshot → Comparison view, sort by Delta.'],
      ['Detached DOM nodes', 'Elements removed from the page but still held in memory.', 'Filter the snapshot by "Detached".'],
      ['Retainers', 'The chain of references that keeps an object alive.', 'Select an object; read the Retainers pane from the bottom up.'],
    ]],
    ['Application', '🗃️', 'Storage, service workers and the PWA manifest.', [
      ['Storage', 'View and edit localStorage, sessionStorage, cookies and IndexedDB.', 'Application → Storage; the cookie table shows HttpOnly, Secure and SameSite.'],
      ['Service workers', 'Update, unregister, or bypass the service worker.', 'Application → Service workers → Update on reload / Bypass for network.'],
      ['Cache storage', 'What the service worker cached.', 'Application → Cache storage.'],
      ['Clear site data', 'Start fresh, like a first-time visitor.', 'Application → Storage → Clear site data.'],
    ]],
    ['Lighthouse, Rendering & more', '🔦', 'Audits, visual debugging and device emulation.', [
      ['Lighthouse', 'A performance, accessibility, best-practices and SEO report.', 'Lighthouse → Mobile → Analyze page load (use an incognito window).'],
      ['Paint flashing and layout shifts', 'Highlight what repaints and what moves.', 'Ctrl+Shift+P → "Show Rendering" → Paint flashing / Layout shift regions / FPS meter.'],
      ['Emulate preferences', 'Dark mode, reduced motion, vision deficiencies.', 'Rendering → Emulate CSS media feature prefers-color-scheme / prefers-reduced-motion.'],
      ['Coverage', 'How much of your JS and CSS is never used.', 'Ctrl+Shift+P → "Show Coverage" → reload.'],
      ['Device toolbar', 'Phone sizes, touch, pixel density.', 'Ctrl+Shift+M (Cmd+Shift+M on Mac).'],
    ]],
    ['React DevTools', '⚛️', 'A browser extension for React: the component tree and the Profiler.', [
      ['Components', 'See and edit each component\'s props, state and hooks.', 'Components tab; the <> button jumps to the source.'],
      ['Highlight updates', 'Flash components when they re-render.', 'Components settings (⚙) → "Highlight updates when components render".'],
      ['Profiler', 'Record an interaction and see which components rendered and how long they took.', 'Profiler → record → interact → stop; enable "Record why each component rendered" in settings.'],
      ['Find a component from the page', 'Pick an element on the page to select its component.', 'The picker icon in the Components tab.'],
    ]],
  ];

  const SHORTCUTS = [
    ['Open DevTools', 'F12 or Ctrl+Shift+I', 'Cmd+Option+I'],
    ['Inspect an element', 'Ctrl+Shift+C', 'Cmd+Shift+C'],
    ['Command menu (everything)', 'Ctrl+Shift+P', 'Cmd+Shift+P'],
    ['Open a file', 'Ctrl+P', 'Cmd+P'],
    ['Search all files', 'Ctrl+Shift+F', 'Cmd+Option+F'],
    ['Device toolbar', 'Ctrl+Shift+M', 'Cmd+Shift+M'],
    ['Resume / step over / into / out', 'F8 / F10 / F11 / Shift+F11', 'same'],
    ['Show / hide the drawer (Console under any panel)', 'Esc', 'Esc'],
    ['Hard reload (when DevTools is open)', 'right-click ⟳ → Empty cache and hard reload', 'same'],
  ];

  const STAGES = [
    { key: 'method', name: 'Debugging method', title: 'A method for finding any bug', say: 'Experienced developers are not faster at guessing: they follow steps.' },
    ...PANELS.map(([n, icon, use, tricks]) => ({ key: n, name: n, title: `${icon} ${n}`, say: use, tricks })),
    { key: 'keys', name: 'Shortcuts', title: 'Shortcuts worth knowing', say: 'Learn the command menu first: it can do almost everything by name.' },
  ];
  const UI = { stage: 0, detail: false };
  const VIEWS = {
    method: () => `<ol class="dp-steps">${METHOD.map(([t, b, d]) => `<li><b>${esc(t)}</b><span>${esc(b)}</span>${UI.detail ? `<pre>${esc(d)}</pre>` : ''}</li>`).join('')}</ol>`,
    keys: () => `<table class="iv-diff db-words"><thead><tr><th>what</th><th>Windows / Linux</th><th>Mac</th></tr></thead><tbody>${SHORTCUTS.map(([w, a, b]) => `<tr><td><b>${esc(w)}</b></td><td><code>${esc(a)}</code></td><td><code>${esc(b)}</code></td></tr>`).join('')}</tbody></table>`,
  };
  const tricksView = tricks => `<div class="db-grid dp-must">${tricks.map(([t, b, how]) => `<div class="db-card"><div class="db-h"><b>${esc(t)}</b></div><p>${esc(b)}</p>${UI.detail ? `<p class="dv-how">${esc(how)}</p>` : ''}</div>`).join('')}</div>
    ${UI.detail ? '' : '<p class="cl-note">"+ Show details" shows exactly where to click for each one. Try them now: press F12 on this page.</p>'}`;

  function ensure() {
    let m = $('dvLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'dvLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'DevTools and debugging');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-dvclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🧰 DevTools & debugging</h2><span class="cl-note">find any bug, and use every panel like a pro (Chrome / Edge)</span></div>
      <div class="px-rail" id="dvRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="dvTitle"></h3><p class="px-say" id="dvSay"></p><button class="btn small dp-detail" id="dvDetail" data-dvdetail></button><div id="dvBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="dvPrev">◀ Back</button><button class="btn small primary" id="dvNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('dvRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-dvstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('dvTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('dvSay').textContent = s.say;
    $('dvBody').innerHTML = s.tricks ? tricksView(s.tricks) : VIEWS[s.key]();
    $('dvDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('dvDetail').classList.toggle('hidden', s.key === 'keys');
    $('dvPrev').disabled = UI.stage === 0;
    $('dvNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap', 'projLab'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('dvLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnDevtools') || t.closest('[data-fmdevtools]')) { open(); return; }
    if (!$('dvLab') || $('dvLab').classList.contains('hidden')) return;
    const st = t.closest('[data-dvstage]');
    if (st) { UI.stage = +st.dataset.dvstage; draw(); return; }
    if (t.closest('[data-dvdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#dvPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#dvNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-dvclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('dvLab') && !$('dvLab').classList.contains('hidden')) close(); });

  window.DevtoolsLab = { open, close, go: i => { UI.stage = i; draw(); }, stages: STAGES, panels: PANELS };
})();

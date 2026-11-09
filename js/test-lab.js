/*
 * JS Engine Lab — the testing lab. You write tests (Jest-style expect + Testing-Library-style DOM queries);
 * they run against the correct code AND against hidden buggy versions ("mutants"). Good tests pass on the
 * correct code and fail on every bug. After a run, every bug is revealed with "caught" or "missed".
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = v => { try { return typeof v === 'string' ? JSON.stringify(v) : v === undefined ? 'undefined' : JSON.stringify(v); } catch (e) { return String(v); } };
  const UI = { task: null, nav: null };

  // ------------------------------------------------------------ the test API
  function makeExpect() {
    const build = (actual, neg) => {
      const m = (pass, msg) => { if (neg ? pass : !pass) throw new Error((neg ? 'expected NOT: ' : '') + msg); };
      const api = {
        toBe: e => m(Object.is(actual, e), `expected ${fmt(actual)} to be ${fmt(e)}`),
        toEqual: e => m(JSON.stringify(actual) === JSON.stringify(e), `expected ${fmt(actual)} to equal ${fmt(e)}`),
        toBeTruthy: () => m(!!actual, `expected ${fmt(actual)} to be truthy`),
        toBeFalsy: () => m(!actual, `expected ${fmt(actual)} to be falsy`),
        toBeNull: () => m(actual === null, `expected ${fmt(actual)} to be null`),
        toBeUndefined: () => m(actual === undefined, `expected ${fmt(actual)} to be undefined`),
        toContain: e => m(actual != null && actual.includes(e), `expected ${fmt(actual)} to contain ${fmt(e)}`),
        toHaveLength: n => m(actual != null && actual.length === n, `expected length ${n}, got ${actual == null ? actual : actual.length}`),
        toThrow: msg => { let threw = false, err; try { actual(); } catch (e) { threw = true; err = e; } m(threw && (!msg || String(err && err.message).includes(msg)), threw ? `expected the error to mention ${fmt(msg)}, got ${fmt(err && err.message)}` : 'expected the function to throw'); },
        toBeInTheDocument: () => m(!!(actual && actual.isConnected), 'expected the element to be in the document'),
        toHaveTextContent: t => m(!!actual && actual.textContent.includes(t), `expected text ${fmt(t)}, got ${fmt(actual && actual.textContent)}`),
      };
      if (!neg) api.not = build(actual, true);
      return api;
    };
    const expect = actual => build(actual, false);
    // await expect(promise).rejects.toThrow("…")
    expect.rejects = async (promise, msg) => { let err = null; try { await promise; } catch (e) { err = e; } if (!err) throw new Error('expected the promise to reject'); if (msg && !String(err.message).includes(msg)) throw new Error(`expected the rejection to mention ${fmt(msg)}, got ${fmt(err.message)}`); };
    return expect;
  }
  // accessible name: aria-label, then a <label>, then the text inside
  function nameOf(el, doc) {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    if (el.id) { const l = doc.querySelector(`label[for="${el.id}"]`); if (l) return l.textContent.trim(); }
    const wrap = el.closest('label'); if (wrap) return wrap.textContent.trim();
    return el.textContent.trim();
  }
  const ROLES = {
    button: 'button, [role="button"], input[type="submit"]', textbox: 'input:not([type]), input[type="text"], input[type="email"], textarea, [role="textbox"]',
    heading: 'h1, h2, h3, h4, h5, h6, [role="heading"]', checkbox: 'input[type="checkbox"], [role="checkbox"]', link: 'a[href], [role="link"]',
    alert: '[role="alert"]', status: '[role="status"]', listitem: 'li, [role="listitem"]', list: 'ul, ol, [role="list"]',
  };
  function makeScreen(doc) {
    const root = () => doc.body;
    const match = (txt, want) => (want instanceof RegExp ? want.test(txt) : txt === want);
    const one = (list, what) => { if (!list.length) throw new Error(`Unable to find ${what}`); if (list.length > 1) throw new Error(`Found ${list.length} elements for ${what}`); return list[0]; };
    const allByRole = (role, opts) => [...root().querySelectorAll(ROLES[role] || `[role="${role}"]`)].filter(el => !opts || opts.name == null || match(nameOf(el, doc), opts.name));
    const allByText = t => [...root().querySelectorAll('*')].filter(el => match(el.textContent.trim(), t) && ![...el.children].some(c => match(c.textContent.trim(), t)));
    const byLabel = t => { const l = [...root().querySelectorAll('label')].find(x => match(x.textContent.trim(), t)); if (!l) return []; const el = l.htmlFor ? doc.getElementById(l.htmlFor) : l.querySelector('input, textarea, select'); return el ? [el] : []; };
    const screen = {
      getByRole: (role, opts) => one(allByRole(role, opts), `role "${role}"${opts && opts.name != null ? ` named ${fmt(String(opts.name))}` : ''}`),
      queryByRole: (role, opts) => allByRole(role, opts)[0] || null,
      getAllByRole: (role, opts) => { const l = allByRole(role, opts); if (!l.length) throw new Error(`Unable to find role "${role}"`); return l; },
      getByText: t => one(allByText(t), `text ${fmt(String(t))}`),
      queryByText: t => allByText(t)[0] || null,
      getByLabelText: t => one(byLabel(t), `a field labelled ${fmt(String(t))}`),
      findByText: async t => { for (let i = 0; i < 50; i++) { const l = allByText(t); if (l.length) return l[0]; await new Promise(r => setTimeout(r, 20)); } throw new Error(`Unable to find text ${fmt(String(t))} (waited 1s)`); },
    };
    const user = {
      click: el => { if (!el) throw new Error('user.click: no element'); el.click(); },
      type: (el, text) => { if (!el) throw new Error('user.type: no element'); el.value += text; el.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true })); },
      clear: el => { el.value = ''; el.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true })); },
    };
    const render = component => { const c = doc.createElement('div'); doc.body.appendChild(c); component(c); return { container: c }; };
    return { screen, user, render };
  }
  // fake timers: code under test receives the clock and calls clock.setTimeout; tests move time with clock.tick(ms)
  function createClock() {
    let now = 0, seq = 0; const timers = [];
    return {
      setTimeout(fn, ms) { const id = ++seq; timers.push({ id, at: now + (ms || 0), fn }); return id; },
      clearTimeout(id) { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
      tick(ms) { const end = now + ms; for (;;) { timers.sort((a, b) => a.at - b.at); const t = timers[0]; if (!t || t.at > end) break; timers.shift(); now = t.at; t.fn(); } now = end; },
      now: () => now,
    };
  }

  // ------------------------------------------------------------ running one version of the code with the learner's tests
  let frame = null;
  function sandboxDoc() {
    if (!frame) { frame = document.createElement('iframe'); frame.style.display = 'none'; frame.title = 'test sandbox'; document.body.appendChild(frame); }
    const d = frame.contentDocument; d.open(); d.write('<!doctype html><html><head></head><body></body></html>'); d.close();
    return d;
  }
  async function runSuite(source, tests) {
    const doc = sandboxDoc();
    const list = [];
    const test = (name, fn) => list.push({ name: String(name), fn });
    const { screen, user, render } = makeScreen(doc);
    try { new Function('document', 'test', 'it', 'expect', 'render', 'screen', 'user', 'createClock', source + '\n;\n' + tests)(doc, test, test, makeExpect(), render, screen, user, createClock); }
    catch (e) { return { error: e.message, results: [] }; }
    const results = [];
    for (const t of list) {
      doc.body.innerHTML = '';
      try {
        await Promise.race([Promise.resolve().then(() => t.fn()), new Promise((_, rej) => setTimeout(() => rej(new Error('timed out after 2s')), 2000))]);
        results.push({ name: t.name, pass: true });
      } catch (e) { results.push({ name: t.name, pass: false, msg: e && e.message ? e.message : String(e) }); }
    }
    return { results };
  }
  function mutate(source, edits) {
    let out = source;
    for (const [from, to] of edits) { if (!out.includes(from)) return null; out = out.split(from).join(to); }
    return out;
  }
  async function runAll(task, tests) {
    const correct = await runSuite(task.impl, tests);
    const bugs = [];
    for (const b of task.bugs) {
      const src = mutate(task.impl, b.edits);
      if (src == null) { bugs.push({ b, error: 'bug definition does not match the code' }); continue; }
      const r = await runSuite(src, tests);
      bugs.push({ b, r, caught: !!r.error || r.results.some(x => !x.pass) });
    }
    return { correct, bugs };
  }

  // ------------------------------------------------------------ the window
  function ensure() {
    let m = $('testLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'testLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Testing lab');
    m.innerHTML = `<div class="modal-card wide cl-lab">
      <button class="close" data-tlclose aria-label="Close">✕</button>
      <div class="cl-head"><span class="cl-nav"><button class="btn small" id="tlPrev" title="Previous task">◀</button><button class="cl-count" id="tlList" title="All practice tasks"></button><button class="btn small primary" id="tlNext" title="Next task">▶</button></span><h2 class="modal-title" id="tlTitle"></h2></div>
      <div id="tlScene"></div>
      <p class="cl-note" id="tlAsk"></p>
      <div class="cl-grid tl-grid">
        <div class="cl-code"><span>The code under test <small>(read it; you cannot change it)</small></span><pre id="tlImpl" class="ts-js"></pre></div>
        <label class="cl-code"><span>Your tests <small>(test, expect, render, screen, user, createClock)</small></span><textarea id="tlTests" spellcheck="false"></textarea></label>
      </div>
      <div class="iv-row2"><button class="btn primary small" id="tlRun">▶ Run tests</button><button class="btn small" id="tlHint">💡 Hint</button><button class="btn small" id="tlSolution">Show a model answer</button><button class="btn small" id="tlReset">Reset tests</button></div>
      <div id="tlResult"></div>
      <div id="tlWhy" class="cl-why hidden"></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function open(id, nav) {
    const t = (window.TEST_TASKS || []).find(x => x.id === id);
    if (!t) return false;
    const m = ensure();
    Object.assign(UI, { task: t, nav: nav || null });
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    $('tlTitle').textContent = '🧪 ' + t.title;
    $('tlScene').innerHTML = window.ProjectLab && window.ProjectLab.sceneHTML ? window.ProjectLab.sceneHTML(t) : '';
    $('tlAsk').innerHTML = `${t.ask} <b>${t.bugs.length} hidden bug${t.bugs.length === 1 ? '' : 's'}</b> to catch.`;
    $('tlImpl').textContent = t.impl.trim();
    $('tlTests').value = t.starter;
    $('tlResult').innerHTML = '';
    $('tlWhy').classList.add('hidden');
    const pos = nav ? nav.position() : null;
    $('tlList').textContent = pos ? `🧪 Task ${pos.i + 1} / ${pos.n}` : 'All tasks';
    $('tlPrev').disabled = !pos || pos.i === 0;
    $('tlNext').disabled = !pos || pos.i === pos.n - 1;
    m.classList.remove('hidden');
    return true;
  }
  async function run() {
    const t = UI.task;
    $('tlResult').innerHTML = '<div class="cl-note">Running your tests on the correct code and on every buggy version…</div>';
    const r = await runAll(t, $('tlTests').value);
    UI.last = r;
    const cols = [{ label: 'correct code', res: r.correct }].concat(r.bugs.map((x, i) => ({ label: `bug ${i + 1}`, res: x.r || { error: x.error }, bug: x })));
    const names = (r.correct.results || []).map(x => x.name);
    const cell = (res, i, isBug) => { if (res.error) return `<td class="no" title="${esc(res.error)}">💥</td>`; const x = res.results[i]; return x.pass ? `<td class="${isBug ? 'meh' : 'ok'}">✓ pass</td>` : `<td class="${isBug ? 'ok' : 'no'}" title="${esc(x.msg || '')}">✗ fail</td>`; };
    const correctOk = !r.correct.error && r.correct.results.length > 0 && r.correct.results.every(x => x.pass);
    const caught = r.bugs.filter(x => x.caught).length;
    let verdict;
    if (r.correct.error) verdict = `<div class="iv-verdict bad">💥 Your tests do not run: ${esc(r.correct.error)}</div>`;
    else if (!r.correct.results.length) verdict = '<div class="iv-verdict bad">No tests yet: write at least one <code>test(…)</code>.</div>';
    else if (!correctOk) verdict = '<div class="iv-verdict bad">❌ A test fails on the <b>correct</b> code: that test is wrong (it would block a good change). Fix it first.</div>';
    else if (caught === r.bugs.length) verdict = `<div class="iv-verdict ok">✅ Your tests pass on the correct code and catch all ${r.bugs.length} bugs.</div>`;
    else verdict = `<div class="iv-verdict bad">Your tests catch ${caught} of ${r.bugs.length} bugs. A missed bug means: a broken version of this code would still pass your tests. Add tests for the cases below.</div>`;
    $('tlResult').innerHTML = verdict + (names.length ? `<table class="iv-diff tl-matrix"><thead><tr><th>your test</th>${cols.map(c => `<th>${esc(c.label)}</th>`).join('')}</tr></thead><tbody>${names.map((n, i) => `<tr><td>${esc(n)}</td>${cols.map((c, k) => cell(c.res, i, k > 0)).join('')}</tr>`).join('')}</tbody></table>` : '');
    const firstFail = (r.correct.results || []).find(x => !x.pass);
    $('tlWhy').innerHTML = `${firstFail ? `<p class="cl-note">On the correct code, "<b>${esc(firstFail.name)}</b>" failed: ${esc(firstFail.msg)}</p>` : ''}
      <h3>Under the hood: the hidden bugs</h3><ol class="wl-steps">${r.bugs.map((x, i) => `<li class="${x.caught ? 'ok' : 'no'}"><span>${x.caught ? '✓' : '✗'}</span><div><b>Bug ${i + 1}: ${x.caught ? 'caught' : 'missed'}.</b> ${x.b.what}${x.caught ? '' : ` <i>${esc(x.b.tip || '')}</i>`}</div></li>`).join('')}</ol>
      <h3>Why</h3><p>${t.why}</p>`;
    $('tlWhy').classList.remove('hidden');
    return r;
  }
  function close() { const m = $('testLab'); if (m) m.classList.add('hidden'); UI.task = null; }

  document.addEventListener('click', e => {
    const t = e.target;
    if (!$('testLab') || $('testLab').classList.contains('hidden')) return;
    if (t.closest('#tlRun')) { run(); return; }
    if (t.closest('#tlHint')) { $('tlResult').innerHTML = `<div class="cl-hint">💡 ${esc(UI.task.hint || '')}</div>`; return; }
    if (t.closest('#tlSolution')) { $('tlTests').value = UI.task.solution; return; }
    if (t.closest('#tlReset')) { $('tlTests').value = UI.task.starter; return; }
    if (t.closest('#tlPrev') && UI.nav) { UI.nav.go(-1); return; }
    if (t.closest('#tlNext') && UI.nav) { UI.nav.go(1); return; }
    if (t.closest('#tlList') && UI.nav) { close(); UI.nav.list(); return; }
    if (t.closest('[data-tlclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('testLab') && !$('testLab').classList.contains('hidden')) close(); });

  window.TestLab = { open, close, current: () => (UI.task ? UI.task.id : null), run, runAll, setTests: v => { $('tlTests').value = v; } };
})();

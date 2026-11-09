/*
 * JS Engine Lab — the CSS lab: HTML & CSS practice in a real browser frame.
 * A task renders in a live preview; you predict a value, Check compares it with what the browser really
 * computed, and "Under the hood" shows the cascade (every matching rule, its specificity, the winner)
 * and the box model of the element. The code is editable: change it and the preview follows.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const tasks = () => window.CSS_TASKS || [];
  const BASE = 'body{margin:8px;font:16px/1.4 system-ui,sans-serif;color:#1f2328;background:#fff}';
  const UI = { task: null, expected: null, checked: false, onNav: null };

  // ------------------------------------------------------------ specificity: (ids, classes/attributes/pseudo-classes, elements)
  function specificity(sel) {
    let a = 0, b = 0, c = 0;
    let s = sel.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, ' ');
    s = s.replace(/:(?:not|is|has)\(((?:[^()]|\([^()]*\))*)\)/g, (m, inner) => {
      const best = inner.split(',').map(x => specificity(x.trim())).sort((x, y) => y[0] - x[0] || y[1] - x[1] || y[2] - x[2])[0] || [0, 0, 0];
      a += best[0]; b += best[1]; c += best[2]; return ' ';
    });
    a += (s.match(/#[\w-]+/g) || []).length;
    b += (s.match(/\.[\w-]+/g) || []).length + (s.match(/\[[^\]]*\]/g) || []).length + (s.match(/(^|[^:]):(?!:)[\w-]+/g) || []).length;
    c += (s.match(/::[\w-]+/g) || []).length;
    const bare = s.replace(/#[\w-]+|\.[\w-]+|\[[^\]]*\]|::?[\w-]+(\([^)]*\))?/g, ' ');
    c += (bare.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length;
    return [a, b, c];
  }
  const cmp = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];

  // every declaration of `prop` that applies to `el`, sorted the way the cascade decides
  function cascade(doc, el, prop) {
    const win = doc.defaultView, rows = [];
    let order = 0;
    const visit = rules => {
      for (const r of rules) {
        if (r.type === 4) { if (win.matchMedia(r.media.mediaText).matches) visit(r.cssRules); else order += r.cssRules.length; continue; } // @media
        if (r.type !== 1) continue;
        order++;
        const value = r.style.getPropertyValue(prop);
        if (!value) continue;
        r.selectorText.split(',').map(x => x.trim()).forEach(sel => {
          let ok = false;
          try { ok = el.matches(sel); } catch (e) { ok = false; }
          if (ok) rows.push({ sel, spec: specificity(sel), value, important: r.style.getPropertyPriority(prop) === 'important', order, inline: false });
        });
      }
    };
    for (const sh of doc.styleSheets) { try { visit(sh.cssRules); } catch (e) { /* cross-origin sheet */ } }
    const iv = el.style.getPropertyValue(prop);
    if (iv) rows.push({ sel: 'style="…" (inline)', spec: null, value: iv, important: el.style.getPropertyPriority(prop) === 'important', order: 1e9, inline: true });
    rows.sort((x, y) => (y.important - x.important) || (y.inline - x.inline) || (x.spec && y.spec ? -cmp(x.spec, y.spec) : 0) || (y.order - x.order));
    return rows;
  }

  // ------------------------------------------------------------ the window
  function ensure() {
    let m = $('cssLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'cssLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'CSS lab');
    m.innerHTML = `<div class="modal-card wide cl-lab">
      <button class="close" data-csclose aria-label="Close">✕</button>
      <div class="cl-head"><span class="cl-nav"><button class="btn small" id="csPrev" title="Previous task">◀</button><button class="cl-count" id="csList" title="All practice tasks"></button><button class="btn small primary" id="csNext" title="Next task">▶</button></span><h2 class="modal-title" id="csTitle"></h2></div>
      <div id="csScene"></div>
      <div class="cl-grid">
        <label class="cl-code"><span>HTML &amp; CSS <small>(edit it: the preview follows)</small></span><textarea id="csCode" spellcheck="false"></textarea></label>
        <div class="cl-prev"><span>Preview <small id="csWidth"></small></span><iframe id="csFrame" title="Preview" sandbox="allow-same-origin"></iframe></div>
      </div>
      <div class="cl-ask"><b id="csAsk"></b><div id="csInput"></div>
        <div class="iv-row2"><button class="btn primary small" id="csCheck">Check</button><button class="btn small" id="csShow">Just show me</button><button class="btn small" id="csHint">💡 Hint</button><button class="btn small" id="csReset">Reset code</button></div>
        <div id="csResult"></div></div>
      <div id="csWhy" class="cl-why hidden"></div>
    </div>`;
    document.body.appendChild(m);
    let timer = null;
    $('csCode').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => render(false), 250); });
    return m;
  }
  function frameDoc() { try { return $('csFrame').contentDocument; } catch (e) { return null; } }
  function render(measure) {
    const t = UI.task, f = $('csFrame');
    f.style.width = (t.width || 400) + 'px';
    void f.offsetWidth; // apply the new width before the page inside is laid out (its vw units depend on it)
    $('csWidth').textContent = `· ${t.width || 400}px wide`;
    f.onload = () => {
      const d = frameDoc();
      if (measure && d) { try { UI.expected = t.measure(d, d.defaultView, s => d.querySelector(s)); } catch (e) { UI.expected = null; } }
      if (UI.checked) explain();
    };
    f.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}</style></head><body>${$('csCode').value}</body></html>`;
  }

  function inputHTML(t) {
    if (t.answer === 'choice') return `<div class="cl-choices">${t.choices.map(c => `<button class="btn small cl-choice" data-choice="${esc(c)}">${esc(c)}</button>`).join('')}</div>`;
    const ph = t.answer === 'px' ? 'a number, e.g. 120' : t.answer === 'color' ? 'a colour, e.g. red or #00f' : t.answer === 'number' ? 'a whole number' : 'your answer';
    return `<input id="csAnswer" class="cl-answer" placeholder="${ph}" autocomplete="off"${t.answer === 'px' ? ' inputmode="decimal"' : ''}>${t.answer === 'px' ? ' <span class="cl-unit">px</span>' : ''}`;
  }
  // compare an answer with the measured value (colours are compared after the browser normalises them)
  function sameAnswer(t, given) {
    const exp = UI.expected;
    if (exp == null) return false;
    const g = String(given || '').trim();
    if (!g) return false;
    if (t.answer === 'px') { const n = parseFloat(g); return isFinite(n) && Math.abs(n - exp) <= 1; }
    if (t.answer === 'number') return parseInt(g, 10) === exp;
    if (t.answer === 'color') {
      const d = frameDoc(); if (!d) return false;
      const probe = d.createElement('i'); probe.style.color = ''; probe.style.color = g;
      if (!probe.style.color) return false;
      d.body.appendChild(probe); const got = d.defaultView.getComputedStyle(probe).color; probe.remove();
      return got === exp;
    }
    return g.toLowerCase() === String(exp).toLowerCase();
  }
  const shown = t => (t.answer === 'px' ? Math.round(UI.expected * 10) / 10 + 'px' : String(UI.expected));

  function check(given) {
    const t = UI.task;
    const ok = sameAnswer(t, given);
    UI.checked = true;
    $('csResult').innerHTML = ok ? `<div class="iv-verdict ok">✅ Right: the browser computed <b>${esc(shown(t))}</b>.</div>` : `<div class="iv-verdict bad">❌ Not quite. The browser computed <b>${esc(shown(t))}</b>${given ? ` (you said ${esc(given)})` : ''}.</div>`;
    explain();
  }

  // ------------------------------------------------------------ under the hood: why, the cascade, the box model
  function explain() {
    const t = UI.task, d = frameDoc();
    const box = $('csWhy');
    box.classList.remove('hidden');
    let html = `<h3>Why</h3><p>${t.why}</p>`;
    const el = d && t.target ? d.querySelector(t.target) : null;
    if (el) {
      d.querySelectorAll('[data-cs-target]').forEach(x => x.removeAttribute('data-cs-target'));
      el.setAttribute('data-cs-target', '');
      if (!d.getElementById('csTargetStyle')) { const s = d.createElement('style'); s.id = 'csTargetStyle'; s.textContent = '[data-cs-target]{outline:2px dashed #e5534b!important;outline-offset:2px}'; d.head.appendChild(s); }
      if (t.prop) {
        const rows = cascade(d, el, t.prop);
        const computed = d.defaultView.getComputedStyle(el).getPropertyValue(t.prop);
        html += `<h3>Under the hood: the cascade for <code>${esc(t.prop)}</code> on <code>${esc(t.target)}</code></h3>`;
        html += rows.length ? `<table class="iv-diff cl-cascade"><thead><tr><th></th><th>declared by</th><th>specificity</th><th>value</th></tr></thead><tbody>${rows.map((r, i) => `<tr class="${i === 0 ? 'win' : 'lose'}"><td>${i === 0 ? '✓ wins' : '✗'}</td><td><code>${esc(r.sel)}</code></td><td>${r.inline ? 'inline' : `(${r.spec.join(',')})`}${r.important ? ' <b>!important</b>' : ''}</td><td><code>${esc(r.value)}</code></td></tr>`).join('')}</tbody></table>
          <p class="cl-note">Order of the checks: <b>!important</b> → <b>inline style</b> → <b>specificity</b> (ids, classes, elements) → <b>source order</b> (later wins). Computed value: <code>${esc(computed)}</code>.</p>`
          : `<p class="cl-note">No rule sets <code>${esc(t.prop)}</code> on this element, so it gets ${['color', 'font-size', 'font-family', 'line-height', 'visibility'].includes(t.prop) ? 'the value <b>inherited</b> from its parent' : 'the property\'s <b>initial</b> value (it is not inherited)'}: <code>${esc(computed)}</code>.</p>`;
      }
      if (t.box || ['width', 'height'].includes(t.prop)) {
        const cs = d.defaultView.getComputedStyle(el), n = p => Math.round(parseFloat(cs.getPropertyValue(p)) * 10) / 10 || 0;
        const r = el.getBoundingClientRect();
        const cw = Math.round((r.width - n('padding-left') - n('padding-right') - n('border-left-width') - n('border-right-width')) * 10) / 10;
        const ch = Math.round((r.height - n('padding-top') - n('padding-bottom') - n('border-top-width') - n('border-bottom-width')) * 10) / 10;
        const side = (k, v) => `<span class="bm-${k}">${v}</span>`;
        const ring = (name, cls, p, inner) => `<div class="bm ${cls}"><small>${name}</small>${side('t', n(p + '-top' + (p === 'border' ? '-width' : '')))}${side('r', n(p + '-right' + (p === 'border' ? '-width' : '')))}${side('b', n(p + '-bottom' + (p === 'border' ? '-width' : '')))}${side('l', n(p + '-left' + (p === 'border' ? '-width' : '')))}${inner}</div>`;
        html += `<h3>Under the hood: the box model of <code>${esc(t.target)}</code> <small>(box-sizing: ${esc(cs.boxSizing)}, display: ${esc(cs.display)})</small></h3>
          <div class="bm-wrap">${ring('margin', 'bm-m', 'margin', ring('border', 'bm-bo', 'border', ring('padding', 'bm-p', 'padding', `<div class="bm-c">${cw} × ${ch}</div>`)))}</div>
          <p class="cl-note">On screen: ${Math.round(r.width * 10) / 10} × ${Math.round(r.height * 10) / 10}px (content + padding + border).</p>`;
      }
    }
    box.innerHTML = html;
  }

  // ------------------------------------------------------------ open a task
  function open(id, nav) {
    const t = tasks().find(x => x.id === id);
    if (!t) return false;
    const m = ensure();
    UI.task = t; UI.expected = null; UI.checked = false; UI.onNav = nav || null;
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    $('csTitle').textContent = '🎨 ' + t.title;
    $('csAsk').textContent = t.ask;
    $('csScene').innerHTML = window.ProjectLab && window.ProjectLab.sceneHTML ? window.ProjectLab.sceneHTML(t) : '';
    $('csInput').innerHTML = inputHTML(t);
    $('csResult').innerHTML = '';
    $('csWhy').classList.add('hidden');
    $('csCode').value = t.html;
    const pos = nav ? nav.position() : null;
    $('csList').textContent = pos ? `🎨 Task ${pos.i + 1} / ${pos.n}` : 'All tasks';
    $('csPrev').disabled = !pos || pos.i === 0;
    $('csNext').disabled = !pos || pos.i === pos.n - 1;
    m.classList.remove('hidden');
    render(true);
    const inp = $('csAnswer');
    if (inp) { inp.onkeydown = e => { if (e.key === 'Enter') check(inp.value); }; setTimeout(() => inp.focus(), 50); }
    m.querySelectorAll('[data-choice]').forEach(b => { b.onclick = () => { m.querySelectorAll('[data-choice]').forEach(x => x.classList.toggle('on', x === b)); check(b.dataset.choice); }; });
    return true;
  }

  document.addEventListener('click', e => {
    const t = e.target;
    if (!$('cssLab') || $('cssLab').classList.contains('hidden')) return;
    if (t.closest('#csCheck')) { const inp = $('csAnswer'); const on = $('cssLab').querySelector('[data-choice].on'); check(inp ? inp.value : on ? on.dataset.choice : ''); return; }
    if (t.closest('#csShow')) { UI.checked = true; $('csResult').innerHTML = `<div class="iv-verdict">The browser computed <b>${esc(shown(UI.task))}</b>.</div>`; explain(); return; }
    if (t.closest('#csHint')) { $('csResult').innerHTML = `<div class="cl-hint">💡 ${esc(UI.task.hint || '')}</div>`; return; }
    if (t.closest('#csReset')) { $('csCode').value = UI.task.html; render(false); return; }
    if (t.closest('#csPrev') && UI.onNav) { UI.onNav.go(-1); return; }
    if (t.closest('#csNext') && UI.onNav) { UI.onNav.go(1); return; }
    if (t.closest('#csList') && UI.onNav) { close(); UI.onNav.list(); return; }
    if (t.closest('[data-csclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('cssLab') && !$('cssLab').classList.contains('hidden')) close(); });
  function close() { const m = $('cssLab'); if (m) m.classList.add('hidden'); UI.task = null; }

  window.CSSLab = { open, close, current: () => (UI.task ? UI.task.id : null), specificity, cascade, expected: () => UI.expected, check: v => check(v) };
})();

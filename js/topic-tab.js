/*
 * JS Engine Lab — a shared builder for the simple 📚 Topics tabs (AI at work, Tax & money, Open source):
 * a window with a rail of steps, Back / Next, a "+ Show details" toggle, and a "What would you do?" quiz
 * whose situations are also 🏋️ Practice tasks.
 *
 * makeTopicTab({ id, title, sub, button, map, api, cat, icon, solver, scene, hint, stages, situations })
 *   stages: [{ key, name, title, say, view: detail => html, detail: true if "+ Show details" changes it }]
 *   situations: [{ id, title, q, a, choices: [[key, label]], why }]
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // small helpers the tabs use to build their pages
  const H = {
    esc,
    table: (head, rows) => `<table class="iv-diff db-words">${head ? `<thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td>${i ? esc(c) : `<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
    cards: items => `<div class="db-grid">${items.map(([t, d, ex]) => `<div class="db-card"><div class="db-h"><b>${esc(t)}</b></div><p>${esc(d)}</p>${ex ? `<pre class="px-src">${esc(ex)}</pre>` : ''}</div>`).join('')}</div>`,
    list: (items, ordered) => `<${ordered ? 'ol' : 'ul'}>${items.map(x => `<li>${esc(x)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`,
    code: s => `<pre class="px-src">${esc(s)}</pre>`,
    note: s => `<p class="cl-note">${esc(s)}</p>`,
    more: what => `<p class="cl-note">"+ Show details" adds ${esc(what)}.</p>`,
  };

  function makeTopicTab(cfg) {
    const P = cfg.id; // short prefix for ids and data attributes
    const S = cfg.situations || [];
    const STAGES = cfg.stages.concat(S.length ? [{ key: 'quiz', name: 'What would you do?', title: 'What would you do?', say: 'Real situations. Pick an answer to see why.', view: () => quiz() }] : []);
    const UI = { stage: 0, detail: false, answers: {} };
    const quiz = () => S.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a, label = k => x.choices.find(c => c[0] === k)[1];
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-${P}q="${i}" data-${P}a="${k}">${esc(l)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Right' : `❌ Better: <b>${esc(label(x.a))}</b>`}. ${esc(x.why)}</p>` : ''}</div>`;
    }).join('');

    if (S.length) {
      if (window.WebLab) window.WebLab.extend(cfg.solver, s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
        (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
      (window.WEB_TASKS = window.WEB_TASKS || []).push(...S.map(x => ({
        id: x.id, cat: cfg.cat, kind: 'rule', solver: cfg.solver, icon: cfg.icon, kindLabel: 'what would you do?',
        title: x.title, ask: 'What would you do?', scene: cfg.scene,
        choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
        hint: cfg.hint, why: `${esc(x.why)} See the ${cfg.title} tab.`, scenario: { q: x.q, a: x.a, why: x.why },
      })));
    }

    function ensure() {
      let m = $(P + 'Lab');
      if (m) return m;
      m = document.createElement('div');
      m.id = P + 'Lab';
      m.className = 'modal hidden';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-label', cfg.title.replace(/^\S+\s/, ''));
      m.innerHTML = `<div class="modal-card wide cl-lab px-card">
        <button class="close" data-${P}close aria-label="Close">✕</button>
        <div class="cl-head"><h2 class="modal-title">${esc(cfg.title)}</h2><span class="cl-note">${esc(cfg.sub)}</span></div>
        <div class="px-rail" id="${P}Rail"></div>
        <div class="px-main db-main"><div class="px-view"><h3 id="${P}Title"></h3><p class="px-say" id="${P}Say"></p><button class="btn small dp-detail" id="${P}Detail" data-${P}detail></button><div id="${P}Body"></div></div></div>
        <div class="px-controls"><button class="btn small" id="${P}Prev">◀ Back</button><button class="btn small primary" id="${P}Next">Next ▶</button></div>
      </div>`;
      document.body.appendChild(m);
      return m;
    }
    function draw() {
      const s = STAGES[UI.stage];
      $(P + 'Rail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-${P}stage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
      $(P + 'Title').textContent = `${UI.stage + 1} · ${s.title}`;
      $(P + 'Say').textContent = s.say;
      $(P + 'Body').innerHTML = s.view(UI.detail, H);
      $(P + 'Detail').textContent = UI.detail ? '− Brief view' : '+ Show details';
      $(P + 'Detail').classList.toggle('hidden', !s.detail);
      $(P + 'Prev').disabled = UI.stage === 0;
      $(P + 'Next').disabled = UI.stage === STAGES.length - 1;
      if (cfg.afterDraw) cfg.afterDraw(s.key, $(P + 'Body'));
    }
    function open(stage) {
      const m = ensure();
      if (window.JSLabAPI) window.JSLabAPI.closeModals();
      UI.stage = stage || 0;
      m.classList.remove('hidden');
      draw();
    }
    function close() { const m = $(P + 'Lab'); if (m) m.classList.add('hidden'); }
    const isOpen = () => $(P + 'Lab') && !$(P + 'Lab').classList.contains('hidden');
    document.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('#' + cfg.button) || t.closest(`[data-fm${cfg.map}]`)) { open(); return; }
      if (!isOpen()) return;
      const st = t.closest(`[data-${P}stage]`);
      if (st) { UI.stage = +st.getAttribute(`data-${P}stage`); draw(); return; }
      const a = t.closest(`[data-${P}q]`);
      if (a) { UI.answers[+a.getAttribute(`data-${P}q`)] = a.getAttribute(`data-${P}a`); const box = $(P + 'Body').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
      if (t.closest(`[data-${P}detail]`)) { UI.detail = !UI.detail; draw(); return; }
      if (t.closest('#' + P + 'Prev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
      if (t.closest('#' + P + 'Next')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
      if (t.closest(`[data-${P}close]`)) close();
      if (cfg.onClick) cfg.onClick(t, draw);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) close(); });
    const api = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, situations: S, stages: STAGES, redraw: () => isOpen() && draw() };
    window[cfg.api] = api;
    return api;
  }
  window.makeTopicTab = makeTopicTab;
})();

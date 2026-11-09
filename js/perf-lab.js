/*
 * JS Engine Lab — 📊 Performance: how performance is measured in real projects, and how the score % is made.
 *   1 measure a page (real browser metrics) → 2 the Lighthouse score → 3 real users (p75, % good)
 *   → 4 fix it and compare → 5 tracking it in your project.
 * REAL: FCP, LCP, CLS, long tasks (TBT) and INP come from PerformanceObserver inside the test page.
 * MODELLED: the score uses Lighthouse's published curves and weights; the 1,000 real users are simulated;
 * Speed Index is estimated (it needs a video of the page loading).
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ------------------------------------------------------------ Lighthouse scoring (v10+, mobile)
  const METRICS = [
    { key: 'fcp', name: 'First Contentful Paint', short: 'FCP', weight: 10, p10: 1800, median: 3000, unit: 'ms', what: 'first text or image on screen' },
    { key: 'si', name: 'Speed Index', short: 'SI', weight: 10, p10: 3387, median: 5800, unit: 'ms', what: 'how fast the page visibly fills in (estimated here)' },
    { key: 'lcp', name: 'Largest Contentful Paint', short: 'LCP', weight: 25, p10: 2500, median: 4000, unit: 'ms', what: 'the main content (biggest image or text) on screen' },
    { key: 'tbt', name: 'Total Blocking Time', short: 'TBT', weight: 30, p10: 200, median: 600, unit: 'ms', what: 'time the page could not react, from long JavaScript tasks' },
    { key: 'cls', name: 'Cumulative Layout Shift', short: 'CLS', weight: 25, p10: 0.1, median: 0.25, unit: '', what: 'how much things jump around' },
  ];
  function erf(x) {
    const s = Math.sign(x); x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    return s * (1 - y * Math.exp(-x * x));
  }
  // Lighthouse's log-normal curve: the p10 value scores 0.9 (90), the median scores 0.5 (50)
  function curve(m, value) {
    if (value <= 0) return 1;
    const x = Math.log(Math.max(Number.MIN_VALUE, value / m.median)) * 0.9061938024368232 / -Math.log(m.p10 / m.median);
    const p = (1 - erf(x)) / 2;
    if (value <= m.p10) return Math.max(0.9, Math.min(1, p));
    if (value <= m.median) return Math.max(0.5, Math.min(0.8999999999999999, p));
    return Math.max(0, Math.min(0.49999999999999994, p));
  }
  function score(v) {
    const parts = METRICS.map(m => { const val = v[m.key]; const s = val == null ? null : curve(m, val); return { m, value: val, score: s, points: s == null ? null : s * m.weight }; });
    const have = parts.filter(p => p.score != null), w = have.reduce((a, p) => a + p.m.weight, 0);
    return { parts, total: w ? Math.round(have.reduce((a, p) => a + p.points, 0) / w * 100) : null, complete: have.length === parts.length };
  }
  const band = s => (s == null ? '' : s >= 90 ? 'good' : s >= 50 ? 'ok' : 'bad');

  // ------------------------------------------------------------ real users: 1,000 simulated visits
  const CWV = [
    { key: 'lcp', name: 'LCP', good: 2500, poor: 4000, fmt: v => (v / 1000).toFixed(1) + 's' },
    { key: 'inp', name: 'INP', good: 200, poor: 500, fmt: v => Math.round(v) + 'ms' },
    { key: 'cls', name: 'CLS', good: 0.1, poor: 0.25, fmt: v => v.toFixed(2) },
  ];
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function field(lab, seed) {
    const r = rng(seed || 7), N = 1000;
    const pick = list => { let x = r(); for (const [v, p] of list) { if ((x -= p) <= 0) return v; } return list[list.length - 1][0]; };
    const jitter = () => Math.exp((r() + r() + r() - 1.5) * 0.35);
    const visits = [];
    for (let i = 0; i < N; i++) {
      const cpu = pick([[1, 0.35], [2.5, 0.45], [5, 0.2]]);   // fast laptop / mid-range phone / cheap phone
      const net = pick([[1, 0.5], [2, 0.35], [4, 0.15]]);     // fast / 4G / slow connection
      visits.push({
        lcp: lab.lcp * (0.35 * cpu + 0.65 * net) * jitter(),
        inp: lab.inp * cpu * jitter(),
        cls: lab.cls * (0.6 + 0.8 * r()) + (r() < 0.1 ? 0.03 : 0),
      });
    }
    return CWV.map(c => {
      const vals = visits.map(v => v[c.key]).sort((a, b) => a - b);
      const good = vals.filter(v => v <= c.good).length, poor = vals.filter(v => v > c.poor).length;
      return { c, vals, p75: vals[Math.floor(N * 0.75) - 1], good: good / N * 100, ni: (N - good - poor) / N * 100, poor: poor / N * 100 };
    });
  }

  // ------------------------------------------------------------ the test page
  const FIXES = [
    { key: 'smallImg', label: 'Optimised hero image', note: 'AVIF, 120 KB instead of a 1.6 MB JPEG: it arrives in 250ms instead of 1400ms' },
    { key: 'sized', label: 'width and height on the image', note: 'the browser reserves its space before it loads' },
    { key: 'split', label: 'Split the startup script', note: '35 small tasks of 10ms instead of one 350ms task (small enough to stay under 50ms even on a slow phone)' },
    { key: 'yieldClick', label: 'Update first, heavy work after paint', note: '"Add to cart" shows the result at once, then does its 250ms of work' },
  ];
  const OBSERVERS = `window.__perf = { fcp: null, lcp: null, lcpEl: null, cls: 0, long: [], inp: null, events: [] };
  (function () {
    const po = (type, cb, opts) => { try { new PerformanceObserver(l => l.getEntries().forEach(cb)).observe(Object.assign({ type: type, buffered: true }, opts || {})); } catch (e) {} };
    po('paint', e => { if (e.name === 'first-contentful-paint') __perf.fcp = e.startTime; });
    po('largest-contentful-paint', e => { __perf.lcp = e.startTime; __perf.lcpEl = e.element ? e.element.tagName.toLowerCase() + (e.element.id ? '#' + e.element.id : '') : '?'; });
    po('layout-shift', e => { if (!e.hadRecentInput) __perf.cls += e.value; });
    po('longtask', e => { __perf.long.push({ t: e.startTime, d: e.duration }); });
    po('event', e => { if (e.interactionId) { __perf.events.push({ name: e.name, d: e.duration }); __perf.inp = Math.max(__perf.inp || 0, e.duration); } }, { durationThreshold: 16 });
  })();`;
  let IMG = null;
  function heroImage() {
    if (IMG) return IMG;
    const c = document.createElement('canvas'); c.width = 600; c.height = 338;
    const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 600, 338);
    gr.addColorStop(0, '#0ea5e9'); gr.addColorStop(1, '#4f46e5');
    g.fillStyle = gr; g.fillRect(0, 0, 600, 338);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.font = 'bold 44px system-ui, sans-serif'; g.fillText('👟 Trail X2', 40, 190);
    IMG = c.toDataURL('image/jpeg', 0.8);
    return IMG;
  }
  function pageHTML(cfg) {
    const conf = { img: heroImage(), imgDelay: cfg.smallImg ? 250 : 1400, split: !!cfg.split, yieldClick: !!cfg.yieldClick };
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script>${OBSERVERS}<\/script>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    header { padding: 10px 12px; background: #111827; color: #fff; font-weight: 700; }
    main { padding: 12px; }
    .hero { display: block; width: 100%; height: auto; border-radius: 8px; background: #e5e7eb; }
    h1 { margin: 10px 0 4px; font-size: 20px; }
    p { margin: 4px 0; color: #334155; }
    button { margin-top: 8px; padding: 8px 12px; font: inherit; }
  </style>
</head>
<body>
  <header>Trail Shop</header>
  <main>
    <img id="hero" class="hero" alt=""${cfg.sized ? ' width="1200" height="675"' : ''}>
    <h1>Trail running shoes</h1>
    <p>Grip on wet rock, light on long runs.</p>
    <p><b>$89</b></p>
    <button id="buy">Add to cart</button>
    <p id="cart"></p>
  </main>
  <script>
    const cfg = ${JSON.stringify(conf)};
    function busy(ms) { const t = performance.now(); let i = 0; while (performance.now() - t < ms && i < 2e7) i++; }
    // the hero image "downloads" (a slow network is simulated with a delay)
    setTimeout(() => { document.getElementById("hero").src = cfg.img; }, cfg.imgDelay);
    // startup JavaScript (think: hydration, analytics), just after the first paint
    setTimeout(() => {
      if (cfg.split) for (let i = 0; i < 35; i++) setTimeout(() => busy(10), i * 12);
      else busy(350);
    }, 150);
    document.getElementById("buy").onclick = () => {
      const cart = document.getElementById("cart");
      if (cfg.yieldClick) { cart.textContent = "Added to cart ✓"; requestAnimationFrame(() => setTimeout(() => busy(250), 0)); }
      else { busy(250); cart.textContent = "Added to cart ✓"; }
    };
  <\/script>
</body>
</html>`;
  }

  // ------------------------------------------------------------ measuring
  const UI = { stage: 0, cfg: {}, run: null, runs: [], timer: null, device: 'phone', detail: false };
  // The page is measured on this computer. "Mid-range phone" estimates what Lighthouse's mobile test would see:
  // it slows the CPU 4× and the network to slow 4G (about 3× slower downloads, plus ~600ms of connection set-up).
  function values(raw, device) {
    if (!raw) return null;
    const si = (a, b) => (a != null && b != null ? Math.round((a + b) / 2) : null);
    const tbtAt = k => Math.round(raw.long.reduce((a, d) => a + Math.max(0, d * k - 50), 0));
    if (device !== 'phone') return { fcp: raw.fcp, lcp: raw.lcp, cls: raw.cls, tbt: tbtAt(1), si: si(raw.fcp, raw.lcp), inp: raw.inp };
    const fcp = raw.fcp == null ? null : Math.round(raw.fcp * 4 + 600);
    const image = raw.lcp != null && /^img/.test(raw.lcpEl || '') && raw.lcp >= raw.imgDelay;
    const lcp = raw.lcp == null ? null : Math.round(image ? (raw.lcp - raw.imgDelay) * 4 + raw.imgDelay * 3 + 600 : raw.lcp * 4 + 600);
    return { fcp, lcp, cls: raw.cls, tbt: tbtAt(4), si: si(fcp, lcp), inp: raw.inp == null ? null : Math.round(raw.inp * 4) };
  }
  const DEVICE = { phone: 'a mid-range phone (estimated, like Lighthouse mobile)', computer: 'this computer (measured)' };
  function measure() {
    clearInterval(UI.timer);
    const f = $('pfFrame'), started = performance.now(), cfg = Object.assign({}, UI.cfg);
    const run = { cfg, done: false, raw: null, notes: [] };
    UI.run = run;
    const endAt = (cfg.smallImg ? 250 : 1400) + 1600;
    f.onload = () => {
      UI.timer = setInterval(() => {
        const w = f.contentWindow, P = w && w.__perf;
        if (!P || UI.run !== run) return;
        const t = performance.now() - started;
        if (!run.done && t >= endAt) {
          run.done = true;
          const long = P.long.filter(x => P.fcp == null || x.t >= P.fcp).map(x => x.d);
          run.raw = { fcp: P.fcp, lcp: P.lcp, cls: Math.round(P.cls * 1000) / 1000, long, inp: null, lcpEl: P.lcpEl, imgDelay: cfg.smallImg ? 250 : 1400 };
          if (P.fcp == null || P.lcp == null) run.notes.push('This browser did not report paint timings for the test frame, so FCP / LCP are missing.');
          UI.runs.unshift(run);
          UI.runs.length = Math.min(UI.runs.length, 6);
        }
        if (run.done && P.inp != null && P.inp !== run.raw.inp) run.raw.inp = Math.round(P.inp);
        draw();
      }, 250);
    };
    f.srcdoc = pageHTML(cfg);
    draw();
  }
  // values for the real-user model; INP falls back to what this page's click handler costs until you click it
  // (the field model starts from this computer's numbers and applies its own mix of phones and networks)
  const labForField = raw => ({ lcp: raw.lcp != null ? raw.lcp : raw.imgDelay + 150, inp: raw.inp != null ? raw.inp : UI.run.cfg.yieldClick ? 40 : 280, cls: raw.cls || 0 });

  // ------------------------------------------------------------ the views
  const STAGES = [
    { key: 'measure', name: 'Measure', title: 'Measure the page', say: 'The browser measures the page while it loads. These numbers are what every performance tool starts from.' },
    { key: 'score', name: 'The score', title: 'How the score % is made', say: 'Lighthouse turns each number into a 0–100 score on a curve, then takes a weighted average.' },
    { key: 'field', name: 'Real users', title: 'Real users: the 75th percentile', say: 'Google judges your site by real visits (phones, slow networks), at the 75th percentile, not by one test on your laptop.' },
    { key: 'fix', name: 'Fix it', title: 'Fix it and compare', say: 'Switch fixes on (right), measure again, and compare the runs.' },
    { key: 'track', name: 'In your project', title: 'How teams track it', say: 'Measure real users in production, and stop regressions in CI.' },
  ];
  const fmt = (m, v) => (v == null ? '—' : m.unit === 'ms' ? (v >= 1000 ? (v / 1000).toFixed(2) + 's' : Math.round(v) + 'ms') : v.toFixed(3));
  const ring = (s, size) => { const r = size / 2 - 6, c = 2 * Math.PI * r, pct = s == null ? 0 : s / 100; return `<svg width="${size}" height="${size}" class="pf-ring ${band(s)}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="fg" stroke-dasharray="${c * pct} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle">${s == null ? '…' : s}</text></svg>`; };
  function curveSVG(m, value) {
    const W = 220, H = 70, max = m.median * 3, X = v => 6 + (W - 12) * Math.min(v, max) / max, Y = s => H - 12 - (H - 22) * s;
    let d = ''; for (let i = 0; i <= 60; i++) { const v = max * i / 60; d += (i ? 'L' : 'M') + X(v).toFixed(1) + ',' + Y(curve(m, v)).toFixed(1); }
    const dot = value == null ? '' : `<circle cx="${X(value)}" cy="${Y(curve(m, value))}" r="4" class="pf-dot ${band(curve(m, value) * 100)}"/>`;
    return `<svg width="${W}" height="${H}" class="pf-curve"><path d="${d}"/><line x1="${X(m.p10)}" x2="${X(m.p10)}" y1="8" y2="${H - 12}" class="p10"/><line x1="${X(m.median)}" x2="${X(m.median)}" y1="8" y2="${H - 12}" class="med"/><text x="${X(m.p10) + 3}" y="8">90 at ${fmt(m, m.p10)}</text><text x="${X(m.median) + 3}" y="${H - 1}">50 at ${fmt(m, m.median)}</text>${dot}</svg>`;
  }
  function histo(f) {
    const W = 260, H = 70, max = Math.max(f.c.poor * 1.6, f.p75 * 1.3), bins = 26, counts = new Array(bins).fill(0);
    f.vals.forEach(v => { counts[Math.min(bins - 1, Math.floor(v / max * bins))]++; });
    const top = Math.max(...counts), bw = W / bins, X = v => Math.min(W, v / max * W);
    return `<svg width="${W}" height="${H + 14}" class="pf-hist">${counts.map((n, i) => { const v = (i + 0.5) * max / bins; return `<rect x="${i * bw + 1}" y="${H - H * n / top}" width="${bw - 2}" height="${H * n / top}" class="${v <= f.c.good ? 'good' : v <= f.c.poor ? 'ok' : 'bad'}"/>`; }).join('')}
      <line x1="${X(f.p75)}" x2="${X(f.p75)}" y1="0" y2="${H}" class="p75"/><text x="${Math.min(W - 40, X(f.p75) + 3)}" y="10">p75 ${f.c.fmt(f.p75)}</text><text x="0" y="${H + 12}">0</text><text x="${W}" y="${H + 12}" text-anchor="end">${f.c.fmt(max)}</text></svg>`;
  }
  const VIEWS = {
    measure() {
      const r = UI.run;
      if (!r || !r.done) return `<p class="cl-note">⏱️ Measuring the page as it loads… (the hero image is still "downloading")</p>`;
      const pc = values(r.raw, 'computer'), ph = values(r.raw, 'phone'), longs = r.raw.long.length;
      const ms = (m, v) => `<code>${fmt(m, v)}</code>`;
      const row = (name, a, b, what) => `<tr><td><b>${name}</b><br><small>${what}</small></td><td>${a}</td><td>${b}</td></tr>`;
      return `<table class="iv-diff pf-table"><thead><tr><th>metric</th><th>this computer<br><small>measured</small></th><th>mid-range phone<br><small>estimated</small></th></tr></thead><tbody>
        ${row('FCP', ms(METRICS[0], pc.fcp), ms(METRICS[0], ph.fcp), 'first text or image on screen')}
        ${row('LCP', ms(METRICS[2], pc.lcp), ms(METRICS[2], ph.lcp), `the biggest element on screen${r.raw.lcpEl ? ` (it was <code>${esc(r.raw.lcpEl)}</code>)` : ''}`)}
        ${row('CLS', `<code>${pc.cls.toFixed(3)}</code>`, `<code>${ph.cls.toFixed(3)}</code>`, `how much the layout jumped${pc.cls > 0.1 ? ' (the image pushed the text down)' : ''}`)}
        ${row('TBT', `<code>${pc.tbt}ms</code>`, `<code>${ph.tbt}ms</code>`, `blocking time: each long task (&gt;50ms) counts its time over 50ms (${longs} long task${longs === 1 ? '' : 's'})`)}
        ${row('INP', pc.inp != null ? `<code>${pc.inp}ms</code>` : 'click "Add to cart"', ph.inp != null ? `<code>${ph.inp}ms</code>` : '—', 'how long a click took until the screen updated')}
        </tbody></table>${r.notes.map(n => `<p class="cl-note">${esc(n)}</p>`).join('')}
        <p class="cl-note">Measured on this computer; the phone column estimates a Lighthouse mobile test.</p>
        <p class="cl-note dt">"This computer" is measured live with <code>PerformanceObserver</code> inside the test page (right). "Mid-range phone" estimates what Lighthouse's mobile test would see: it slows the CPU 4× (long tasks take 4× longer) and the network to slow 4G (downloads about 3× slower, plus connection set-up). That is why the same page often scores 95+ on a desktop and much lower on mobile.</p>`;
    },
    score() {
      const r = UI.run;
      if (!r || !r.done) return '<p class="cl-note">Waiting for the measurement…</p>';
      const S = score(values(r.raw, UI.device));
      return `<div class="pf-total">${ring(S.total, 110)}<div><b>Performance score: ${S.total == null ? '—' : S.total + ' / 100'}</b><br><small>on ${DEVICE[UI.device]} · switch on the right</small><br><small>0–49 poor · 50–89 needs improvement · 90–100 good</small>${S.complete ? '' : '<br><small>(some metrics are missing, so the weights are spread over the others)</small>'}</div></div>
        <table class="iv-diff pf-table"><thead><tr><th>metric</th><th>value</th><th>its score</th><th>weight</th><th>points</th><th class="dt">the curve</th></tr></thead><tbody>
        ${S.parts.map(p => `<tr><td><b>${p.m.short}</b><br><small>${esc(p.m.what)}</small></td><td><code>${fmt(p.m, p.value)}</code></td><td class="pf-s ${band(p.score == null ? null : p.score * 100)}">${p.score == null ? '—' : Math.round(p.score * 100)}</td><td>${p.m.weight}%</td><td>${p.points == null ? '—' : p.points.toFixed(1)}</td><td class="dt">${curveSVG(p.m, p.value)}</td></tr>`).join('')}
        </tbody></table>
        <p class="cl-note">score = Σ (metric score × weight)</p>
        <p class="cl-note dt">The curves and weights are Lighthouse's (mobile); at the first line a metric scores 90, at the second 50. TBT and LCP carry the most weight. Speed Index is estimated here.</p>`;
    },
    field() {
      const r = UI.run;
      if (!r || !r.done) return '<p class="cl-note">Waiting for the measurement…</p>';
      const F = field(labForField(r.raw), 7), pass = F.every(f => f.p75 <= f.c.good);
      return `<p>1,000 simulated real visits, judged at the 75th percentile.</p><p class="dt">The visits: 35% fast laptops, 45% mid-range phones, 20% cheap phones; 50% fast, 35% 4G, 15% slow connections.</p>
        ${F.map(f => `<div class="pf-field"><div><b>${f.c.name}</b> at p75: <b class="pf-s ${f.p75 <= f.c.good ? 'good' : f.p75 <= f.c.poor ? 'ok' : 'bad'}">${f.c.fmt(f.p75)}</b><small> (good ≤ ${f.c.fmt(f.c.good)}, poor &gt; ${f.c.fmt(f.c.poor)})</small>
          <div class="pf-split"><span class="good" style="width:${f.good}%">${f.good >= 8 ? Math.round(f.good) + '%' : ''}</span><span class="ok" style="width:${f.ni}%">${f.ni >= 8 ? Math.round(f.ni) + '%' : ''}</span><span class="bad" style="width:${f.poor}%">${f.poor >= 8 ? Math.round(f.poor) + '%' : ''}</span></div></div><div class="dt">${histo(f)}</div></div>`).join('')}
        <div class="px-verdict ${pass ? 'composite' : 'layout'}">${pass ? '✅ <b>Passes Core Web Vitals</b>: at least 75% of visits are good on LCP, INP and CLS.' : '❌ <b>Fails Core Web Vitals</b>: for at least one metric, more than 25% of visits are not good.'}</div>
        <p class="cl-note dt">Why p75: it covers most users but ignores the worst outliers. Google's real data (CrUX, Search Console, PageSpeed Insights "field data") works this way, over 28 days. The phone / computer switch does not apply here: real visitors already include every kind of device. ${r.raw.inp == null ? 'INP uses what this page\'s click handler costs; click "Add to cart" to use your own measurement.' : ''}</p>`;
    },
    fix() {
      const runs = UI.runs.filter(x => x.raw);
      const row = (x, i) => { const v = values(x.raw, UI.device), s = score(v).total; return `<tr${i === 0 ? ' class="hl"' : ''}><td>${i === 0 ? 'latest' : '#' + (runs.length - i)}</td><td>${FIXES.filter(fx => x.cfg[fx.key]).map(fx => esc(fx.label)).join(', ') || 'none'}</td><td class="pf-s ${band(s)}">${s == null ? '—' : s}</td><td>${fmt(METRICS[2], v.lcp)}</td><td>${v.cls.toFixed(3)}</td><td>${v.tbt}ms</td><td>${v.inp != null ? v.inp + 'ms' : '—'}</td></tr>`; };
      return `<p>Turn fixes on in the panel on the right; the page is measured again each time. Scores are for ${DEVICE[UI.device]}.</p>
        ${runs.length ? `<table class="iv-diff pf-table"><thead><tr><th>run</th><th>fixes on</th><th>score</th><th>LCP</th><th>CLS</th><th>TBT</th><th>INP</th></tr></thead><tbody>${runs.map(row).join('')}</tbody></table>` : '<p class="cl-note">Measuring…</p>'}
        <ul class="pf-why dt"><li><b>Image</b>: smaller and modern formats → faster LCP. Also: <code>fetchpriority="high"</code> on the LCP image, a CDN.</li>
        <li><b>width / height</b> (or <code>aspect-ratio</code>) → no layout shift → CLS 0.</li>
        <li><b>Split long tasks</b> (or <code>scheduler.yield()</code>, less JavaScript, code splitting) → TBT drops.</li>
        <li><b>Update first, work later</b> → the click paints at once → good INP.</li></ul>`;
    },
    track() {
      return `<p><b>1. Real users (field data)</b>: the <code>web-vitals</code> library reports each visitor's numbers to your analytics.</p>
        <pre class="px-src dt">import { onLCP, onINP, onCLS } from "web-vitals";

const send = metric =>
  navigator.sendBeacon("/analytics", JSON.stringify(metric));

onLCP(send);
onINP(send);
onCLS(send);</pre>
        <p><b>2. Stop regressions (lab data in CI)</b>: Lighthouse CI fails a pull request when the score drops.</p>
        <pre class="px-src dt">// lighthouserc.json
{
  "ci": {
    "collect": { "url": ["http://localhost:4173/"], "numberOfRuns": 3 },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}</pre>
        <ul class="pf-why dt"><li><b>Lab data</b> (Lighthouse, DevTools): one controlled test, great for debugging; it varies by a few points from run to run, so run it 3–5 times.</li>
        <li><b>Field data</b> (CrUX, web-vitals, PageSpeed Insights): real visitors; this is what Google uses for search ranking.</li>
        <li>Also common: a <b>bundle-size budget</b> (e.g. size-limit) and a dashboard of p75 values per page.</li></ul>`;
    },
  };

  // ------------------------------------------------------------ the window
  function ensure() {
    let m = $('perfLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'perfLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Performance');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-pfclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">📊 Performance</h2><span class="cl-note">how it is measured in real projects, and where the % comes from</span></div>
      <div class="px-rail" id="pfRail"></div>
      <div class="px-main">
        <div class="px-view"><h3 id="pfTitle"></h3><p class="px-say" id="pfSay"></p><button class="btn small dp-detail" id="pfDetail" data-pfdetail></button><div id="pfBody"></div></div>
        <div class="px-preview"><span class="px-cap">The test page (click "Add to cart" to measure INP)</span>
          <div class="px-screen" style="width:340px"><iframe id="pfFrame" title="Test page" sandbox="allow-scripts allow-same-origin" style="width:340px;height:330px"></iframe></div>
          <div class="pf-fixes"><b>Score it as</b>
            <label><input type="radio" name="pfDevice" value="phone" checked> a mid-range phone <small class="dt">like Lighthouse mobile (the number teams usually report); estimated from this computer's measurement</small></label>
            <label><input type="radio" name="pfDevice" value="computer"> this computer <small class="dt">exactly what was measured</small></label>
            <b>Fixes</b>${FIXES.map(fx => `<label><input type="checkbox" data-pffix="${fx.key}"> ${esc(fx.label)}<small class="dt">${esc(fx.note)}</small></label>`).join('')}
          <button class="btn small primary" id="pfAgain">↻ Measure again</button></div></div>
      </div>
      <div class="px-controls"><button class="btn small" id="pfPrev">◀ Back</button><button class="btn small primary" id="pfNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    if (!$('perfLab')) return;
    const s = STAGES[UI.stage];
    $('pfRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-pfstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('pfTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('pfSay').textContent = s.say;
    $('pfBody').innerHTML = VIEWS[s.key]();
    $('perfLab').classList.toggle('is-brief', !UI.detail);
    $('pfDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('pfPrev').disabled = UI.stage === 0;
    $('pfNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open() {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    m.classList.remove('hidden');
    UI.stage = 0;
    measure();
  }
  function close() { clearInterval(UI.timer); const m = $('perfLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnPerf') || t.closest('[data-fmperf]')) { if ($('frontendMap')) $('frontendMap').classList.add('hidden'); open(); return; }
    if (!$('perfLab') || $('perfLab').classList.contains('hidden')) return;
    const st = t.closest('[data-pfstage]');
    if (st) { UI.stage = +st.dataset.pfstage; draw(); return; }
    if (t.closest('#pfPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#pfNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-pfdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#pfAgain')) { measure(); return; }
    if (t.closest('[data-pfclose]')) close();
  });
  document.addEventListener('change', e => {
    if (e.target.name === 'pfDevice') { UI.device = e.target.value; draw(); return; }
    const k = e.target.dataset && e.target.dataset.pffix;
    if (k) { UI.cfg[k] = e.target.checked; if (UI.stage < 3) UI.stage = 3; measure(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('perfLab') && !$('perfLab').classList.contains('hidden')) close(); });

  window.PerfLab = { open, close, go: i => { UI.stage = i; draw(); }, score, curve, field, values, metrics: METRICS, device: d => { UI.device = d; draw(); }, run: () => UI.run, runs: () => UI.runs, setFix: (k, on) => { UI.cfg[k] = on; measure(); }, frame: () => $('pfFrame') };
})();

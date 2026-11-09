/*
 * JS Engine Lab — 🖥️ Code → Pixels: how the browser turns your HTML, CSS and JS into what you see.
 *   1 bytes → 2 tokens and the DOM → 3 CSSOM and computed styles → 4 render tree → 5 layout → 6 paint
 *   → 7 layers and compositing → 8 pixels → 9 what re-runs when your JavaScript changes something.
 * REAL (measured from the page really rendering in a frame): the bytes, the DOM, the CSS rules, computed styles,
 * the render tree, every box's position and size, and which properties your JS changed.
 * MODELLED (browsers do not expose them to JavaScript): the tokenizer, the paint commands and the layers.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const WIDTH = 360;

  const EXAMPLES = [
    { id: 'card', title: 'A product card', code: `<!doctype html>
<html>
<head>
  <title>Card</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 16px; }
    .card { width: 220px; padding: 12px; border: 2px solid #4f46e5; border-radius: 8px; }
    .card h2 { margin: 0 0 6px; font-size: 18px; color: #4f46e5; }
    .price::before { content: "$"; }
    .hidden { display: none; }
    button { margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Running shoes</h2>
    <p class="price">89</p>
    <p class="hidden">Out of stock</p>
    <button id="buy">Add to cart</button>
  </div>
  <script>
    document.getElementById("buy").addEventListener("click", () => {
      document.querySelector(".card").style.width = "260px";
    });
  </script>
</body>
</html>` },
    { id: 'changes', title: 'Three kinds of change', code: `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 16px; }
    .row { display: flex; gap: 6px; margin-bottom: 12px; }
    .box { width: 120px; padding: 12px; background: #c7d2fe; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="row">
    <button id="color">Colour</button>
    <button id="size">Width</button>
    <button id="move">Transform</button>
  </div>
  <div class="box">Box</div>
  <p>Text below the box</p>
  <script>
    const box = document.querySelector(".box");
    document.getElementById("color").onclick = () => { box.style.background = box.style.background ? "" : "#fca5a5"; };
    document.getElementById("size").onclick = () => { box.style.width = box.style.width ? "" : "200px"; };
    document.getElementById("move").onclick = () => { box.style.transform = box.style.transform ? "" : "translateX(80px)"; };
  </script>
</body>
</html>` },
    { id: 'layers', title: 'Layers and stacking', code: `<!doctype html>
<html>
<head>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    header { position: fixed; top: 0; left: 0; right: 0; padding: 8px; background: #111827; color: #fff; z-index: 10; }
    main { padding: 48px 12px 12px; }
    .badge { display: inline-block; padding: 4px 8px; background: #f59e0b; will-change: transform; }
    .spinner { width: 24px; height: 24px; margin-top: 10px; border: 3px solid #ddd; border-top-color: #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .tip { position: absolute; top: 96px; left: 150px; padding: 4px 8px; background: #fef3c7; z-index: 2; }
  </style>
</head>
<body>
  <header>Fixed header</header>
  <main>
    <p>Normal content is painted into the root layer.</p>
    <span class="badge">will-change</span>
    <div class="spinner"></div>
    <div class="tip">absolute, z-index: 2</div>
  </main>
</body>
</html>` },
    { id: 'script', title: 'A script in the middle', code: `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 16px; }
    p { color: #334155; }
    .late { color: #16a34a; font-weight: bold; }
  </style>
</head>
<body>
  <p>First paragraph</p>
  <script>
    // runs while the parser is paused right here
    const count = document.querySelectorAll("p").length;
    document.body.insertAdjacentHTML("beforeend", "<p class=late>The script saw " + count + " paragraph(s)</p>");
  </script>
  <p>Second paragraph</p>
</body>
</html>` },
    { id: 'thrash', title: 'Layout thrashing', code: `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 12px; }
    button { margin: 0 4px 8px 0; }
    .bar { height: 4px; margin: 1px 0; width: 40px; background: #93c5fd; }
  </style>
</head>
<body>
  <button id="bad">Read + write in a loop</button>
  <button id="good">All reads, then all writes</button>
  <div id="bars"></div>
  <script>
    const holder = document.getElementById("bars");
    for (let i = 0; i < 300; i++) holder.insertAdjacentHTML("beforeend", '<div class="bar"></div>');
    const bars = [...document.querySelectorAll(".bar")];

    // ❌ read a size, write a style, read again…: layout runs on every read
    document.getElementById("bad").onclick = () => {
      for (const bar of bars) {
        bar.style.width = (bar.offsetWidth + 1) + "px";
      }
    };

    // ✅ all reads first, then all writes: layout runs once, in the next frame
    document.getElementById("good").onclick = () => {
      const widths = bars.map(bar => bar.offsetWidth);
      bars.forEach((bar, i) => { bar.style.width = (widths[i] + 1) + "px"; });
    };
  </script>
</body>
</html>` },
    { id: 'react', title: 'A React component', jsx: `function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="card">
      <h2>Cart</h2>
      <p className={count > 2 ? "warn" : ""}>Items: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add item</button>
    </div>
  );
}

render(<App />, document.getElementById("root"));`, code: `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 16px; }
    .card { width: 220px; padding: 12px; border: 2px solid #4f46e5; border-radius: 8px; }
    .card h2 { margin: 0 0 6px; font-size: 18px; color: #4f46e5; }
    .warn { color: #dc2626; font-weight: bold; }
  </style>
</head>
<body>
  <div id="root"></div>
  <!-- loads a mini React: React.createElement, useState, render -->
  <script data-mini-react></script>
  <script>
    // what the JSX compiler (Babel, esbuild, SWC) turns the JSX into
    function App() {
      const [count, setCount] = useState(0);
      return React.createElement("div", { className: "card" },
        React.createElement("h2", null, "Cart"),
        React.createElement("p", { className: count > 2 ? "warn" : "" }, "Items: ", count),
        React.createElement("button", { onClick: () => setCount(count + 1) }, "Add item"));
    }
    render(React.createElement(App), document.getElementById("root"));
  </script>
</body>
</html>` },
  ];

  // a mini React (the same idea as React: elements → diff → the smallest DOM changes; no fibers or scheduling).
  // It is put into pages that contain <script data-mini-react></script>.
  function miniReact() {
    const ops = [];
    let hooks = [], hookIndex = 0, rootElement = null, rootEl = null, prev = null, renders = [], updates = 0;
    const React = { createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() }; } };
    function useState(initial) {
      const i = hookIndex++;
      if (!(i in hooks)) hooks[i] = initial;
      return [hooks[i], v => { hooks[i] = typeof v === 'function' ? v(hooks[i]) : v; update(); }];
    }
    function expand(v) {
      if (v == null || typeof v === 'boolean') return null;
      if (typeof v !== 'object') return String(v);
      if (typeof v.type === 'function') { renders.push(v.type.name || 'Component'); return expand(v.type(Object.assign({}, v.props, { children: v.children }))); }
      return { type: v.type, props: v.props, children: v.children.map(expand).filter(c => c !== null) };
    }
    const attr = k => (k === 'className' ? 'class' : k);
    const describe = v => (typeof v === 'string' ? 'text "' + v + '"' : '<' + v.type + '>');
    function setProps(el, before, after, log) {
      Object.keys(after).forEach(k => {
        if (k.startsWith('on')) { el[k.toLowerCase()] = after[k]; return; }
        if (before[k] !== after[k]) { el.setAttribute(attr(k), after[k]); if (log) ops.push('set ' + attr(k) + '="' + after[k] + '" on <' + el.nodeName.toLowerCase() + '>'); }
      });
    }
    function create(v) {
      if (typeof v === 'string') return document.createTextNode(v);
      const el = document.createElement(v.type);
      setProps(el, {}, v.props, false);
      v.children.forEach(c => el.appendChild(create(c)));
      return el;
    }
    function patch(parent, node, a, b) {
      if (a === undefined) { parent.appendChild(create(b)); ops.push('insert ' + describe(b)); return; }
      if (b === undefined) { parent.removeChild(node); ops.push('remove ' + describe(a)); return; }
      if (typeof a === 'string' && typeof b === 'string') { if (a !== b) { node.data = b; ops.push('set text "' + b + '"'); } return; }
      if (typeof a === 'string' || typeof b === 'string' || a.type !== b.type) { parent.replaceChild(create(b), node); ops.push('replace with ' + describe(b)); return; }
      setProps(node, a.props, b.props, true);
      const kids = [...node.childNodes];
      for (let i = 0; i < Math.max(a.children.length, b.children.length); i++) patch(node, kids[i], a.children[i], b.children[i]);
    }
    const count = v => (typeof v === 'string' ? 0 : 1 + v.children.reduce((s, c) => s + count(c), 0));
    function update() {
      hookIndex = 0; renders = []; ops.length = 0; updates++;
      const v = expand(rootElement);
      if (!prev) { rootEl.appendChild(create(v)); ops.push('create the whole tree: ' + count(v) + ' elements, with createElement and appendChild'); }
      else patch(rootEl, rootEl.firstChild, prev, v);
      prev = v;
      window.__react = { tree: v, renders: renders.slice(), ops: ops.slice(), updates };
    }
    window.React = React;
    window.useState = useState;
    window.render = (element, el) => { rootElement = element; rootEl = el; update(); };
  }
  const MINI_REACT = '(' + miniReact.toString() + ')();';
  const isReact = () => /<script data-mini-react><\/script>/.test(UI.code);
  const expandCode = code => code.replace(/<script data-mini-react><\/script>/, '<script>' + MINI_REACT + '<\/script>');

  const STAGES = [
    { key: 'bytes', name: 'Bytes', title: 'The bytes arrive', say: 'The browser downloads your page as bytes and decodes them (UTF-8) into text.' },
    { key: 'dom', name: 'DOM', title: 'HTML → tokens → the DOM tree', say: 'The HTML parser cuts the text into tokens (tags and text) and builds the DOM tree from them, one token at a time.' },
    { key: 'react', react: true, name: 'React', title: 'JavaScript builds the rest of the DOM (React)', say: 'Here the HTML is almost empty. React calls your components, gets a tree of plain objects, and creates the DOM from it.' },
    { key: 'css', name: 'CSSOM', title: 'CSS → the CSSOM → computed styles', say: 'The CSS is parsed into the CSSOM, and the cascade gives every element its final, computed style.' },
    { key: 'render', name: 'Render tree', title: 'The render tree', say: 'Only what will be drawn goes on: no <head>, no scripts, nothing with display: none; ::before and ::after are added.' },
    { key: 'layout', name: 'Layout', title: 'Layout (reflow)', say: 'Layout works out the exact position and size of every box, from the viewport width down.' },
    { key: 'paint', name: 'Paint', title: 'Paint', say: 'Paint turns the boxes into a list of drawing commands (backgrounds, borders, text) in stacking order.' },
    { key: 'layers', name: 'Composite', title: 'Layers and compositing', say: 'Some parts get their own layer; the compositor (on the GPU) stacks the layers into one picture.' },
    { key: 'pixels', name: 'Pixels', title: 'Pixels on the screen', say: 'The finished frame is shown at the next screen refresh: every 16.7ms on a 60Hz screen.' },
    { key: 'change', name: 'Changes', title: 'When your JavaScript changes something', say: 'Use the page. The browser re-runs only the stages that your change can affect: that is what makes an update cheap or expensive.' },
  ];
  // the React step only appears for pages that use React
  const active = () => STAGES.filter(s => !s.react || isReact());
  const cur = () => active()[Math.min(UI.stage, active().length - 1)];

  const UI = { ex: EXAMPLES[0], code: EXAMPLES[0].code, stage: 0, sub: null, playing: false, timer: null, model: null, live: null, sel: 0, log: [], pending: null, muts: [], hl: -1, speed: 1, count: null };

  // ============================================================ the parser side (from the source text)
  function tokenize(src) {
    const out = [];
    const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?([a-zA-Z][\w-]*)\b[^>]*>|[^<]+|</gi;
    let m;
    while ((m = re.exec(src))) {
      const s = m[0];
      if (s.startsWith('<!--')) out.push({ type: 'comment', text: s });
      else if (/^<!doctype/i.test(s)) out.push({ type: 'doctype', text: s });
      else if (m[1]) {
        const name = m[1].toLowerCase();
        if (s[1] === '/') out.push({ type: 'end', name, text: s });
        else {
          out.push({ type: 'start', name, text: s });
          if (name === 'script' || name === 'style') {
            const close = src.toLowerCase().indexOf('</' + name, re.lastIndex);
            const end = close < 0 ? src.length : close;
            const raw = src.slice(re.lastIndex, end);
            if (raw.trim()) out.push({ type: 'raw', name, text: raw });
            re.lastIndex = end;
          }
        }
      } else if (s.trim()) out.push({ type: 'text', text: s });
    }
    return out;
  }
  function preorder(root) {
    const out = [];
    (function walk(n) {
      if (n.nodeType === 1) { out.push(n); [...n.childNodes].forEach(walk); }
      else if (n.nodeType === 3 && n.data.trim()) out.push(n);
      else if (n.nodeType === 8) out.push(n);
    })(root);
    return out;
  }
  // for each token, how many DOM nodes exist once it has been handled
  function revealMap(tokens, nodes) {
    let p = 0;
    const isRaw = n => n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName);
    const find = test => { for (let q = p; q < nodes.length; q++) if (test(nodes[q])) return q + 1; return p; };
    return tokens.map(t => {
      if (t.type === 'start') p = find(n => n.nodeType === 1 && n.nodeName.toLowerCase() === t.name);
      else if (t.type === 'text') p = find(n => n.nodeType === 3 && !isRaw(n));
      else if (t.type === 'raw') p = find(n => n.nodeType === 3 && isRaw(n));
      else if (t.type === 'comment') p = find(n => n.nodeType === 8);
      return p;
    });
  }
  const label = el => {
    if (el.nodeType === 3) { const s = el.data.replace(/\s+/g, ' ').trim(); return `"${s.length > 38 ? s.slice(0, 37) + '…' : s}"`; }
    if (el.nodeType === 8) return '<!-- comment -->';
    const cls = el.getAttribute && el.getAttribute('class');
    return el.nodeName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls.trim().split(/\s+/).join('.') : '');
  };
  function analyse(code) {
    const bytes = new TextEncoder().encode(code);
    const tokens = tokenize(code);
    const parsed = new DOMParser().parseFromString(code, 'text/html');
    const nodes = preorder(parsed.documentElement);
    return { bytes, tokens, parsed, nodes, reveal: revealMap(tokens, nodes) };
  }

  // ============================================================ the rendering side (measured from the live frame)
  const SKIP = new Set(['HEAD', 'SCRIPT', 'STYLE', 'META', 'TITLE', 'LINK', 'TEMPLATE', 'BASE', 'NOSCRIPT']);
  function measure(doc) {
    const w = doc.defaultView;
    const flat = [];
    const rectOf = r => ({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
    function walk(el) {
      const node = { el, label: label(el), kids: [] };
      if (SKIP.has(el.nodeName)) { node.out = 'not drawn: no box'; return node; }
      const cs = w.getComputedStyle(el);
      if (cs.display === 'none') { node.out = 'display: none'; return node; }
      if (cs.visibility === 'hidden') node.note = 'visibility: hidden (takes space, not painted)';
      if (cs.display === 'contents') node.note = 'display: contents (no box of its own)';
      node.cs = cs; node.rect = rectOf(el.getBoundingClientRect());
      flat.push(node);
      const pseudo = ps => { const c = w.getComputedStyle(el, ps).content; return c && c !== 'none' && c !== 'normal' ? { pseudo: ps, label: `${label(el)}${ps} ${c}`, kids: [] } : null; };
      const before = pseudo('::before');
      if (before) node.kids.push(before);
      el.childNodes.forEach(c => {
        if (c.nodeType === 1) node.kids.push(walk(c));
        else if (c.nodeType === 3 && c.data.trim()) {
          const range = doc.createRange(); range.selectNodeContents(c);
          const rs = [...range.getClientRects()];
          const r = rs.length ? rs.reduce((a, b) => ({ left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) }), { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 }) : null;
          const t = { text: c.data.replace(/\s+/g, ' ').trim(), label: label(c), kids: [], parent: node, rect: r ? rectOf({ left: r.left, top: r.top, width: r.right - r.left, height: r.bottom - r.top }) : null };
          node.kids.push(t); flat.push(t);
        }
      });
      const after = pseudo('::after');
      if (after) node.kids.push(after);
      return node;
    }
    const tree = walk(doc.documentElement);
    // CSS rules, straight from the CSSOM
    const rules = [];
    [...doc.styleSheets].forEach(sheet => { let list; try { list = sheet.cssRules; } catch (e) { return; } [...list].forEach(r => rules.push(r.selectorText ? { sel: r.selectorText, body: r.style.cssText } : { sel: r.cssText.split('{')[0].trim(), body: '…' })); });
    return { tree, flat, rules, paint: paintList(tree, w, doc), layers: layerList(flat, w) };
  }
  const transparent = c => !c || c === 'transparent' || /rgba\(\d+, \d+, \d+, 0\)/.test(c);
  // MODELLED: a simplified CSS painting order (root background, negative z-index, normal flow, then positioned by z-index)
  function paintList(tree, w, doc) {
    const flow = [], neg = [], pos = [];
    function rec(node, list) {
      if (node.out || node.pseudo) return;
      if (node.text != null) { if (node.rect && node.parent.cs.visibility !== 'hidden') list.push({ kind: 'text', label: node.label, rect: node.rect, color: node.parent.cs.color, font: `${node.parent.cs.fontWeight} ${node.parent.cs.fontSize} ${node.parent.cs.fontFamily}`, text: node.text, lh: node.parent.cs.lineHeight }); return; }
      const el = node.el, cs = node.cs;
      let target = list;
      const root = el === doc.documentElement || el === doc.body;
      if (!root && cs.position !== 'static') { const z = cs.zIndex === 'auto' ? 0 : +cs.zIndex, group = []; (z < 0 ? neg : pos).push({ z, items: group }); target = group; }
      if (cs.visibility !== 'hidden') {
        if (!transparent(cs.backgroundColor) || cs.backgroundImage !== 'none') target.push({ kind: 'background', label: node.label, rect: node.rect, color: cs.backgroundColor, radius: cs.borderRadius, root });
        const bw = ['Top', 'Right', 'Bottom', 'Left'].map(s => parseFloat(cs['border' + s + 'Width']) || 0);
        if (bw.some(Boolean) && cs.borderTopStyle !== 'none') target.push({ kind: 'border', label: node.label, rect: node.rect, color: cs.borderTopColor, widths: bw, radius: cs.borderRadius });
      }
      node.kids.forEach(k => rec(k, target));
    }
    rec(tree, flow);
    const rootItems = flow.filter(x => x.root), rest = flow.filter(x => !x.root);
    const groups = arr => arr.sort((a, b) => a.z - b.z).flatMap(g => g.items.map(x => Object.assign(x, { z: g.z })));
    return [...rootItems, ...groups(neg), ...rest, ...groups(pos)];
  }
  // MODELLED: the usual reasons Chrome gives an element its own compositing layer
  function layerList(flat, w) {
    const layers = [{ name: 'Root layer (the document)', reason: 'everything that is not on a layer of its own', nodes: [] }];
    const owner = new Map();
    flat.forEach(n => {
      if (n.text != null) { (owner.get(n.parent) || layers[0]).nodes.push(n); return; }
      const cs = n.cs, el = n.el, why = [];
      if (cs.position === 'fixed') why.push('position: fixed (it must not move while the page scrolls)');
      if (/transform|opacity/.test(cs.willChange)) why.push('will-change: ' + cs.willChange);
      if (/matrix3d/.test(cs.transform)) why.push('a 3D transform');
      try { if (el.getAnimations && el.getAnimations().some(a => a.effect && a.effect.getKeyframes().some(k => 'transform' in k || 'opacity' in k))) why.push('an animation of transform / opacity'); } catch (e) { /* older browsers */ }
      if (/^(VIDEO|CANVAS|IFRAME)$/.test(el.nodeName)) why.push('video / canvas / iframe');
      const parentOwner = el.parentElement && [...owner.keys()].find(k => k.el === el.parentElement);
      if (why.length) { const l = { name: n.label, reason: why.join(', '), nodes: [n] }; layers.push(l); owner.set(n, l); }
      else { const l = parentOwner ? owner.get(parentOwner) : layers[0]; l.nodes.push(n); owner.set(n, l); }
    });
    return layers;
  }

  // ============================================================ watching what your JavaScript changes
  const LAYOUT_P = ['width', 'height', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'display', 'position', 'top', 'right', 'bottom', 'left', 'font-size', 'font-weight', 'font-family', 'line-height', 'flex-grow', 'flex-shrink', 'flex-basis', 'flex-direction', 'grid-template-columns', 'float', 'box-sizing', 'white-space', 'letter-spacing'];
  const PAINT_P = ['color', 'background-color', 'background-image', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'box-shadow', 'outline-color', 'outline-style', 'visibility', 'border-top-left-radius', 'text-decoration-line'];
  const COMP_P = ['transform', 'opacity', 'filter', 'translate', 'rotate', 'scale'];
  function snap(doc) {
    const w = doc.defaultView, m = new Map();
    doc.querySelectorAll('body, body *').forEach(el => {
      if (SKIP.has(el.nodeName)) return;
      const cs = w.getComputedStyle(el), st = {};
      [...LAYOUT_P, ...PAINT_P, ...COMP_P].forEach(p => { st[p] = cs.getPropertyValue(p); });
      m.set(el, { st, box: [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight].join() });
    });
    return m;
  }
  function instrument(frame) {
    const w = frame.contentWindow, doc = frame.contentDocument;
    if (!w || w.__pxWatched) return;
    w.__pxWatched = true;
    new w.MutationObserver(list => { UI.muts.push(...list); }).observe(doc, { subtree: true, childList: true, characterData: true });
    watchLayout(w);
    const start = e => {
      UI.muts = [];
      const p = { before: snap(doc), t0: w.performance.now(), what: `${e.type} on ${label(e.target.nodeType === 1 ? e.target : e.target.parentElement)}`, reactBefore: w.__react ? w.__react.updates : null };
      UI.count = { on: true, dirty: false, reads: 0, writes: 0, forced: 0 };
      p.count = UI.count;
      UI.pending = p;
      // measure after the next frame (a timer backs it up: frames can be paused, e.g. in a background tab)
      const done = () => { if (p.done) return; p.done = true; try { finish(p, doc); } catch (err) { console.error(err); } };
      w.requestAnimationFrame(() => w.requestAnimationFrame(done));
      setTimeout(done, 150);
    };
    const handled = () => { if (UI.pending && UI.pending.js == null) { UI.pending.js = w.performance.now() - UI.pending.t0; UI.pending.count.on = false; } };
    ['click', 'input'].forEach(type => { w.addEventListener(type, start, true); w.addEventListener(type, handled, false); });
  }
  // Count forced layouts while your event handler runs: a layout READ (offsetWidth, getBoundingClientRect…)
  // after a WRITE (a style, a class, the DOM) forces the browser to run layout right there, inside your JavaScript.
  function watchLayout(w) {
    const C = () => (UI.count && UI.count.on ? UI.count : null);
    const write = () => { const c = C(); if (c) { c.writes++; c.dirty = true; } };
    const read = () => { const c = C(); if (c) { c.reads++; if (c.dirty) { c.forced++; c.dirty = false; } } };
    const wrapGet = (proto, name) => { const d = Object.getOwnPropertyDescriptor(proto, name); if (d && d.get) Object.defineProperty(proto, name, Object.assign({}, d, { get() { read(); return d.get.call(this); } })); };
    const wrapSet = (proto, name) => { const d = Object.getOwnPropertyDescriptor(proto, name); if (d && d.set) Object.defineProperty(proto, name, Object.assign({}, d, { set(v) { write(); d.set.call(this, v); } })); };
    const wrapFn = (proto, name, fn) => { const f = proto[name]; if (typeof f === 'function') proto[name] = function (...a) { fn(); return f.apply(this, a); }; };
    ['offsetWidth', 'offsetHeight', 'offsetTop', 'offsetLeft'].forEach(n => wrapGet(w.HTMLElement.prototype, n));
    ['clientWidth', 'clientHeight', 'clientTop', 'clientLeft', 'scrollWidth', 'scrollHeight', 'scrollTop', 'scrollLeft'].forEach(n => wrapGet(w.Element.prototype, n));
    ['getBoundingClientRect', 'getClientRects'].forEach(n => wrapFn(w.Element.prototype, n, read));
    wrapFn(w, 'getComputedStyle', read);
    ['className', 'innerHTML', 'id'].forEach(n => wrapSet(w.Element.prototype, n));
    wrapSet(w.Node.prototype, 'textContent');
    ['setAttribute', 'removeAttribute', 'insertAdjacentHTML', 'append', 'prepend', 'remove'].forEach(n => wrapFn(w.Element.prototype, n, write));
    ['appendChild', 'insertBefore', 'removeChild', 'replaceChild'].forEach(n => wrapFn(w.Node.prototype, n, write));
    ['add', 'remove', 'toggle', 'replace'].forEach(n => wrapFn(w.DOMTokenList.prototype, n, write));
    ['setProperty', 'removeProperty'].forEach(n => wrapFn(w.CSSStyleDeclaration.prototype, n, write));
    // el.style.width = … cannot be watched on the prototype, so el.style hands out a watching proxy while a handler runs
    const sd = Object.getOwnPropertyDescriptor(w.HTMLElement.prototype, 'style');
    if (sd && sd.get) Object.defineProperty(w.HTMLElement.prototype, 'style', Object.assign({}, sd, {
      get() {
        const s = sd.get.call(this);
        if (!C()) return s;
        return new Proxy(s, {
          set(t, k, v) { write(); t[k] = v; return true; },
          get(t, k) { const v = t[k]; return typeof v === 'function' ? v.bind(t) : v; },
        });
      },
    }));
  }
  function finish(p, doc) {
    const after = snap(doc), changes = [];
    let moved = 0;
    after.forEach((a, el) => {
      const b = p.before.get(el);
      if (!b) { changes.push({ el: label(el), prop: 'added to the DOM', from: '', to: '', kind: 'layout' }); return; }
      if (a.box !== b.box) moved++;
      Object.keys(a.st).forEach(k => { if (a.st[k] !== b.st[k]) changes.push({ el: label(el), prop: k, from: b.st[k], to: a.st[k], kind: LAYOUT_P.includes(k) ? 'layout' : PAINT_P.includes(k) ? 'paint' : 'composite' }); });
    });
    p.before.forEach((b, el) => { if (!after.has(el)) changes.push({ el: label(el), prop: 'removed from the DOM', from: '', to: '', kind: 'layout' }); });
    if (UI.muts.some(m => m.type === 'characterData' || (m.type === 'childList' && [...m.addedNodes, ...m.removedNodes].some(n => n.nodeType === 3)))) changes.push({ el: 'text', prop: 'text changed', from: '', to: '', kind: 'layout' });
    const kind = changes.some(c => c.kind === 'layout') ? 'layout' : changes.some(c => c.kind === 'paint') ? 'paint' : changes.some(c => c.kind === 'composite') ? 'composite' : 'none';
    p.count.on = false;
    const w = doc.defaultView, r = w.__react;
    const react = r && p.reactBefore != null && r.updates !== p.reactBefore ? { renders: r.renders, ops: r.ops } : null;
    UI.log.unshift({ what: p.what, js: p.js == null ? null : p.js, changes, kind, moved, reads: p.count.reads, writes: p.count.writes, forced: p.count.forced, react });
    UI.log.length = Math.min(UI.log.length, 8);
    if (UI.pending === p) UI.pending = null;
    if (cur().key === 'change') draw();
  }
  const RUNS = { layout: ['style', 'layout', 'paint', 'composite'], paint: ['style', 'paint', 'composite'], composite: ['style', 'composite'], none: [] };
  function frameBar(entry) {
    const on = entry ? RUNS[entry.kind] : [];
    const cell = (k, name, extra) => `<span class="px-f ${entry && (k === 'input' || k === 'js' || on.includes(k)) ? 'on ' + k : ''}">${name}${extra || ''}</span>`;
    const forced = entry && entry.forced ? `<span class="px-f on forced">⚠️ Layout ×${entry.forced} <small>forced, inside your JS</small></span>` : '';
    const react = entry && entry.react ? `<span class="px-f on react">⚛️ React: render ${entry.react.renders.join(', ') || '—'} + diff</span>` : '';
    return `<div class="px-frame">${cell('input', '👆 Input')}${cell('js', 'JavaScript', entry && entry.js != null ? ` <small>${entry.js.toFixed(1)}ms</small>` : '')}${react}${forced}${cell('style', 'Style')}${cell('layout', 'Layout')}${cell('paint', 'Paint')}${cell('composite', 'Composite')}<span class="px-f on pixels">🖥️ frame</span></div>
      <div class="px-budget"><span>one frame: 16.7ms at 60Hz. Everything above has to fit in it, or the page stutters.${entry && entry.js > 16.7 ? ` <b>This handler alone took ${entry.js.toFixed(1)}ms: frames were dropped.</b>` : ''}</span></div>`;
  }
  const VERDICT = {
    layout: e => `<b>Layout ran</b> (the most expensive path): a size, position or text changed, so the browser re-measured, then repainted and re-composited. ${e.moved} box${e.moved === 1 ? '' : 'es'} moved or changed size.`,
    paint: e => `<b>Paint ran, layout did not</b>: only how things look changed (a colour, a shadow). Boxes moved: ${e.moved}.`,
    composite: e => `<b>Only compositing ran</b> (the cheapest path): transform / opacity move or fade a painted layer without new layout or paint. Layout boxes moved: ${e.moved}. That is why animations should use transform and opacity.`,
    none: () => 'Nothing visible changed, so the browser had no rendering work to do.',
  };

  // ============================================================ the window
  function ensure() {
    let m = $('pixelsLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'pixelsLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Code to pixels');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-pxclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🖥️ Code → Pixels</h2>
        <label class="px-pick">Example <select id="pxExample">${EXAMPLES.map(e => `<option value="${e.id}">${esc(e.title)}</option>`).join('')}</select></label>
        <button class="btn small" id="pxEditToggle">✏️ Edit the code</button>
        <label class="px-pick">Play speed <select id="pxSpeed"><option value="1">slow</option><option value="0.5">normal</option><option value="0.25">fast</option></select></label></div>
      <div id="pxEdit" class="px-edit hidden"><textarea id="pxCode" spellcheck="false"></textarea><div class="iv-row2"><button class="btn primary small" id="pxRun">▶ Run it from the start</button><span class="cl-note">One HTML page with its &lt;style&gt; and &lt;script&gt;.</span></div></div>
      <div class="px-rail" id="pxRail"></div>
      <div class="px-main">
        <div class="px-view"><h3 id="pxTitle"></h3><p class="px-say" id="pxSay"></p><div id="pxBody"></div><details class="px-more" id="pxMore"><summary>Under the hood</summary><div id="pxMoreBody"></div></details></div>
        <div class="px-preview"><span class="px-cap" id="pxCap"></span>
          <div class="px-screen" id="pxScreen" style="width:${WIDTH}px"><iframe id="pxFrame" title="Your page" sandbox="allow-scripts allow-same-origin" style="width:${WIDTH}px"></iframe><div class="px-overlay" id="pxOverlay"></div></div></div>
      </div>
      <div class="px-controls"><button class="btn small" id="pxPrev">◀ Back</button><button class="btn small" id="pxPlay">⏵ Play slowly</button><button class="btn small primary" id="pxNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function run() {
    stop();
    const code = expandCode(UI.code);
    UI.model = analyse(code);
    UI.live = null; UI.log = []; UI.sel = 0; UI.hl = -1;
    const f = $('pxFrame');
    f.onload = () => {
      const doc = f.contentDocument;
      if (!doc) return;
      f.style.height = Math.min(Math.max(doc.documentElement.scrollHeight, 140), 460) + 'px';
      UI.live = measure(doc);
      instrument(f);
      draw();
    };
    f.srcdoc = code;
    draw();
  }
  function open(exampleId) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    if (window.JSPractice) { const pl = $('practiceList'); if (pl) pl.classList.add('hidden'); }
    if (exampleId) { const e = EXAMPLES.find(x => x.id === exampleId); if (e) { UI.ex = e; UI.code = e.code; } }
    $('pxExample').value = UI.ex.id;
    $('pxCode').value = UI.code;
    UI.stage = 0; UI.sub = null;
    m.classList.remove('hidden');
    run();
  }
  function close() { stop(); const m = $('pixelsLab'); if (m) m.classList.add('hidden'); }
  function go(i, sub) { UI.stage = Math.max(0, Math.min(active().length - 1, i)); UI.sub = sub == null ? null : sub; draw(); }

  // ------------------------------------------------------------ playing slowly
  const subCount = () => { const k = cur().key; return k === 'dom' ? UI.model.tokens.length : k === 'paint' && UI.live ? UI.live.paint.length : 0; };
  function stop() { UI.playing = false; clearTimeout(UI.timer); const b = $('pxPlay'); if (b) b.textContent = '⏵ Play slowly'; }
  function play() {
    if (UI.playing) { stop(); return; }
    UI.playing = true; $('pxPlay').textContent = '⏸ Pause';
    if (UI.stage === active().length - 1) go(0, 0);
    else if (subCount() && UI.sub == null) go(UI.stage, 0);
    tick();
  }
  function tick() {
    if (!UI.playing) return;
    const n = subCount();
    let delay;
    if (n && UI.sub != null && UI.sub < n) { UI.sub++; delay = (cur().key === 'dom' ? 650 : 750) * UI.speed; draw(); }
    else if (UI.stage < active().length - 1) { UI.stage++; UI.sub = subCount() ? 0 : null; delay = 3200 * UI.speed; draw(); }
    else { stop(); return; }
    UI.timer = setTimeout(tick, delay);
  }

  // ------------------------------------------------------------ drawing a stage
  function draw() {
    if (!$('pixelsLab') || !UI.model) return;
    UI.stage = Math.min(UI.stage, active().length - 1);
    const s = cur();
    $('pxRail').innerHTML = active().map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}${x.react ? ' react' : ''}" data-pxstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('pxTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('pxSay').textContent = s.say;
    $('pxPrev').disabled = UI.stage === 0;
    $('pxNext').disabled = UI.stage === active().length - 1;
    const v = VIEWS[s.key]();
    $('pxBody').innerHTML = v.body;
    $('pxMoreBody').innerHTML = v.more || '';
    $('pxMore').classList.toggle('hidden', !v.more);
    screen(v.screen || 'empty', v);
    const now = $('pxBody').querySelector('.now');
    if (now && UI.playing) now.scrollIntoView({ block: 'nearest' });
  }
  const waiting = '<p class="cl-note">Rendering the page…</p>';
  const tree = (node, show, idx, fresh) => {
    const i = idx.get(node);
    if (i == null || i >= show) return '';
    const kids = node.nodeType === 1 ? [...node.childNodes].map(c => tree(c, show, idx, fresh)).join('') : '';
    return `<li class="${i === fresh ? 'now' : ''} ${node.nodeType === 3 ? 'tx' : node.nodeType === 8 ? 'cm' : ''}"><span>${esc(label(node))}</span>${kids ? `<ul>${kids}</ul>` : ''}</li>`;
  };
  const liveTree = (node, mode) => {
    if (node.pseudo) return `<li class="add"><span>+ ${esc(node.label)}</span></li>`;
    if (node.text != null) return `<li class="tx"><span>${esc(node.label)}</span></li>`;
    if (node.out) return mode === 'render' ? `<li class="out"><span>${esc(node.label)}</span> <small>✗ ${esc(node.out)}</small></li>` : '';
    return `<li><span>${esc(node.label)}</span>${node.note ? ` <small>${esc(node.note)}</small>` : ''}${node.kids.length ? `<ul>${node.kids.map(k => liveTree(k, mode)).join('')}</ul>` : ''}</li>`;
  };
  const VIEWS = {
    bytes() {
      const b = UI.model.bytes, show = [...b.slice(0, 40)];
      const text = new TextDecoder().decode(b.slice(0, 40));
      return {
        body: `<p><b>${b.length.toLocaleString()} bytes</b> come in over the network. The first ones:</p>
          <div class="px-hex">${show.map(x => `<span>${x.toString(16).padStart(2, '0')}</span>`).join('')}</div>
          <p>Decoded as UTF-8, they are the text:</p><pre class="px-src">${esc(text)}…</pre>`,
        more: `<ul><li>On a real network the bytes arrive in packets of about 1.4KB (here: ${Math.ceil(b.length / 1460)}), over TCP or QUIC (HTTP/3), after DNS lookup and the TLS handshake.</li>
          <li>The parser does not wait for the whole file: it starts on the first packet (<b>streaming</b>), so the top of a page can appear while the rest is still downloading.</li>
          <li>The <code>&lt;meta charset&gt;</code> or the <code>Content-Type</code> header says which encoding to use; letters like é or emoji take 2–4 bytes in UTF-8.</li></ul>`,
      };
    },
    dom() {
      const M = UI.model, n = UI.sub == null ? M.tokens.length : UI.sub;
      const show = n === 0 ? 0 : M.reveal[n - 1];
      const idx = new Map(M.nodes.map((x, i) => [x, i]));
      const events = [];
      M.tokens.slice(0, n).forEach(t => {
        if (t.type === 'start' && t.name === 'style') events.push('🎨 a &lt;style&gt;: its text goes to the CSS parser (stage 3)');
        if (t.type === 'start' && t.name === 'link' && /stylesheet/.test(t.text)) events.push('🎨 a stylesheet link: the CSS file starts downloading');
        if (t.type === 'start' && t.name === 'script') events.push(/\ssrc=/.test(t.text) ? (/\s(async|defer)/.test(t.text) ? '📜 an async / defer script: it downloads without stopping the parser' : '⏸ a normal script with src: the parser <b>stops</b> until it has downloaded and run') : '⏸ an inline script: the parser <b>stops</b>, the script runs now, and it can only see the elements above it');
      });
      const tok = M.tokens.map((t, i) => `<li class="tk ${t.type} ${i === n - 1 ? 'now' : ''} ${i >= n ? 'later' : ''}">${t.type === 'raw' ? `<i>${t.name} text</i> (${t.text.trim().length} characters)` : esc(t.type === 'text' ? '"' + t.text.replace(/\s+/g, ' ').trim() + '"' : t.text.replace(/\s+/g, ' '))}<small>${{ start: 'start tag', end: 'end tag', text: 'text', raw: 'raw text', comment: 'comment', doctype: 'doctype' }[t.type]}</small></li>`).join('');
      return {
        body: `<div class="px-two"><div><b>Tokens</b> <small>(${n} / ${M.tokens.length})</small><ol class="px-tokens">${tok}</ol></div>
          <div><b>The DOM tree</b> <small>(${show} nodes)</small><ul class="px-tree">${tree(M.parsed.documentElement, show, idx, show - 1)}</ul></div></div>
          ${events.length ? `<ul class="px-events">${events.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
          ${UI.sub != null && UI.sub < M.tokens.length ? '' : '<button class="btn small" data-pxreplay>⏵ Watch this step token by token</button>'}`,
        more: `<ul><li>The <b>tokenizer</b> is a state machine that reads one character at a time (a "tag open" state, an "attribute name" state…). This tokenizer view is a <b>model</b>; the DOM tree is the real one the browser's parser built (<code>DOMParser</code>).</li>
          <li>The tree builder fixes mistakes for you: it adds <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code> if they are missing, closes an open <code>&lt;p&gt;</code> before a <code>&lt;div&gt;</code>, and adds <code>&lt;tbody&gt;</code> to tables. HTML never "fails to parse".</li>
          <li>While a script blocks the parser, a <b>preload scanner</b> reads ahead and starts downloading the images, CSS and scripts it finds.</li>
          <li>Whitespace between tags becomes text nodes too; they are hidden here to keep the tree readable.</li></ul>`,
      };
    },
    react() {
      const w = $('pxFrame').contentWindow, r = w && w.__react;
      if (!r) return { body: waiting };
      const scripts = [...UI.code.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
      const compiled = (scripts[scripts.length - 1] || '').replace(/^\n|\s+$/g, '').replace(/^ {4}/gm, '');
      const vt = v => (typeof v === 'string' ? `<li class="tx"><span>"${esc(v)}"</span></li>`
        : `<li><span>{ type: "${esc(v.type)}"${Object.keys(v.props).map(k => `, ${esc(k)}: ${typeof v.props[k] === 'function' ? 'ƒ' : JSON.stringify(v.props[k])}`).join('')} }</span>${v.children.length ? `<ul>${v.children.map(vt).join('')}</ul>` : ''}</li>`);
      return {
        screen: 'empty',
        body: `${UI.ex.jsx && UI.code === UI.ex.code ? `<p><b>1. You write JSX</b></p><pre class="px-src">${esc(UI.ex.jsx)}</pre>` : ''}
          <p><b>${UI.ex.jsx ? '2' : '1'}. The compiler (Babel, esbuild, SWC) turns it into plain function calls</b> <small>(the browser cannot read JSX)</small></p><pre class="px-src">${esc(compiled)}</pre>
          <p><b>${UI.ex.jsx ? '3' : '2'}. React calls your components and gets a tree of plain objects</b> <small>(elements; ${esc(r.renders.join(', '))} ran)</small></p><ul class="px-tree">${vt(r.tree)}</ul>
          <p><b>${UI.ex.jsx ? '4' : '3'}. React creates the DOM from it</b></p><ul class="px-events">${r.ops.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
          <p class="cl-note">The HTML parser only saw an empty <code>&lt;div id="root"&gt;</code> (step 2): everything inside it was built by JavaScript. That is client-side rendering. The next steps work on this DOM.</p>`,
        more: `<ul><li>This page runs a <b>mini React</b> (about 60 lines, in <code>js/pixels.js</code>) with the same idea as React: components return elements, a new render is compared with the old one, and only the differences are applied to the DOM.</li>
          <li>Real React adds a lot: the <b>fiber</b> tree (work that can be paused and prioritised), batched updates, <b>keys</b> for lists, effects that run after the browser has painted, and React DOM's event system. See them all in ReactVisual.</li>
          <li>With server rendering (SSR) the HTML already contains this DOM, and React only attaches the event handlers: <b>hydration</b>.</li></ul>`,
      };
    },
    css() {
      if (!UI.live) return { body: waiting };
      const els = UI.live.flat.filter(x => x.el && x.el.closest && x.el.closest('body'));
      const sel = els[Math.min(UI.sel, els.length - 1)] || els[0];
      const props = ['display', 'position', 'width', 'height', 'margin', 'padding', 'color', 'background-color', 'font-size', 'font-weight', 'border', 'z-index', 'transform', 'opacity'];
      return {
        body: `<p><b>Your CSS rules</b> <small>(the CSSOM: ${UI.live.rules.length} rules)</small></p>
          <ol class="px-rules">${UI.live.rules.map(r => `<li><code>${esc(r.sel)}</code> <small>${esc(r.body)}</small></li>`).join('') || '<li>No author CSS: only the browser\'s default styles.</li>'}</ol>
          <p><b>Computed style</b> of <select id="pxSel">${els.map((x, i) => `<option value="${i}"${x === sel ? ' selected' : ''}>${esc(x.label)}</option>`).join('')}</select> <small>(the final value of every property after the cascade)</small></p>
          ${sel ? `<table class="iv-diff px-computed"><tbody>${props.map(p => `<tr><td>${p}</td><td><code>${esc(sel.cs.getPropertyValue(p))}</code></td></tr>`).join('')}</tbody></table>` : ''}`,
        more: `<ul><li>Before your CSS, the browser applies its own <b>user-agent stylesheet</b>: that is why <code>h2</code> is bold and <code>p</code> has margins.</li>
          <li>For each element and property the <b>cascade</b> picks one value (importance → layer → specificity → order); inherited properties such as <code>color</code> and <code>font-size</code> come from the parent; everything else gets its initial value. Practise it in the 🎨 CSS tasks.</li>
          <li>Computed values are absolute: <code>2em</code> becomes pixels, colours become <code>rgb(…)</code>. This table is read from <code>getComputedStyle</code>.</li></ul>`,
      };
    },
    render() {
      if (!UI.live) return { body: waiting };
      return {
        body: `<ul class="px-tree px-render">${liveTree(UI.live.tree, 'render')}</ul><p class="cl-note">✗ = left out · + = added (::before / ::after). Read from the live page.</p>`,
        more: `<ul><li>The render tree (Chrome calls it the <b>layout tree</b>) only contains things that create boxes. <code>visibility: hidden</code> elements stay in (they take space), <code>display: none</code> ones do not.</li>
          <li>A JavaScript change to the DOM or to a class can change this tree, which is one reason DOM changes can be expensive.</li></ul>`,
      };
    },
    layout() {
      if (!UI.live) return { body: waiting };
      const rows = UI.live.flat.filter(x => x.rect);
      return {
        screen: 'boxes', boxes: rows,
        body: `<p>Every box, in pixels from the top-left of the ${WIDTH}px-wide viewport:</p>
          <table class="iv-diff px-boxes"><thead><tr><th>box</th><th>x</th><th>y</th><th>width</th><th>height</th></tr></thead><tbody>${rows.map((x, i) => `<tr data-pxbox="${i}" class="${i === UI.hl ? 'hl' : ''}"><td>${esc(x.label)}</td><td>${x.rect.x}</td><td>${x.rect.y}</td><td>${x.rect.w}</td><td>${x.rect.h}</td></tr>`).join('')}</tbody></table>
          <p class="cl-note">Click a row to find its box in the picture. These are real measurements (<code>getBoundingClientRect</code>).</p>`,
        more: `<ul><li>Layout starts from the viewport: <code>%</code> widths, <code>vw</code>, flexbox and grid are all resolved here, and text is broken into lines.</li>
          <li>Layout is expensive on big pages. Reading a size (<code>offsetWidth</code>, <code>getBoundingClientRect</code>) right after changing styles forces the browser to do layout <b>immediately</b> (forced synchronous layout); doing that in a loop is "layout thrashing".</li></ul>`,
      };
    },
    paint() {
      if (!UI.live) return { body: waiting };
      const P = UI.live.paint, n = UI.sub == null ? P.length : UI.sub;
      const what = x => x.kind === 'background' ? `fill ${x.color} rectangle` : x.kind === 'border' ? `stroke a ${x.widths[0]}px ${x.color} border` : `draw text ${x.label}`;
      return {
        screen: 'paint', paint: P.slice(0, n),
        body: `<p>The paint commands, in the order they are drawn <small>(${n} / ${P.length})</small>:</p>
          <ol class="px-paint">${P.map((x, i) => `<li class="${i === n - 1 ? 'now' : ''} ${i >= n ? 'later' : ''}"><b>${esc(x.label)}</b> <small>${esc(what(x))}${x.z != null ? ` · stacking z-index ${x.z}` : ''}</small></li>`).join('')}</ol>
          ${UI.sub != null && UI.sub < P.length ? '' : '<button class="btn small" data-pxreplay>⏵ Watch it paint command by command</button>'}`,
        more: `<ul><li>This list is a <b>model</b> of the CSS painting order: the root background first, then negative z-index, then the normal flow (backgrounds, borders, then text), then positioned elements by z-index. That is why <code>z-index</code> only matters for positioned elements.</li>
          <li>Paint only records commands. <b>Rasterization</b> later turns them into pixels, in tiles (about 256×256), usually on the GPU and in parallel.</li></ul>`,
      };
    },
    layers() {
      if (!UI.live) return { body: waiting };
      const L = UI.live.layers;
      return {
        screen: 'layers', layers: L,
        body: `<p><b>${L.length} layer${L.length === 1 ? '' : 's'}</b>:</p><ol class="px-layers">${L.map((l, i) => `<li><span class="px-lc" style="--i:${i}"></span><b>${esc(l.name)}</b><small>${esc(l.reason)}</small></li>`).join('')}</ol>
          <p class="cl-note">The compositor stacks these layers. Moving or fading a layer (transform / opacity) needs no new layout or paint, only compositing.</p>`,
        more: `<ul><li>Which elements get layers is a <b>model</b> of Chrome's main reasons (fixed position, <code>will-change</code>, animated transform / opacity, 3D transforms, video and canvas). See the real ones in DevTools → More tools → <b>Layers</b>.</li>
          <li>The compositor runs on its own thread, so a transform animation keeps running smoothly even while JavaScript keeps the main thread busy.</li>
          <li>Each layer costs GPU memory: do not put <code>will-change</code> on everything.</li></ul>`,
      };
    },
    pixels() {
      const M = UI.model, L = UI.live;
      const count = (n, what) => `<li><b>${n}</b> ${what}</li>`;
      return {
        screen: 'live',
        body: `<p>Your page, as the browser built it:</p><ul class="px-sum">${count(M.bytes.length, 'bytes')}${count(M.tokens.length, 'tokens')}${count(M.nodes.length, 'DOM nodes (from the parser)')}${L ? count(L.rules.length, 'CSS rules') + count(L.flat.length, 'boxes and text runs in the render tree') + count(L.paint.length, 'paint commands') + count(L.layers.length, 'layers') : ''}</ul>
          <p>All of this happens for the first frame, usually in well under a second. After that, the browser only redoes the parts that change: next step.</p>`,
        more: '<ul><li>The browser shows a new frame only when something changed, timed to the screen\'s refresh (vsync). Your page can ask to run code just before the next frame with <code>requestAnimationFrame</code>.</li><li>DevTools → Performance: record a page load and you will see these stages as Parse HTML, Recalculate Style, Layout, Paint and Composite Layers.</li></ul>',
      };
    },
    change() {
      const last = UI.log[0];
      const tip = { card: 'Click <b>Add to cart</b> in the page.', changes: 'Click each button in the page: <b>Colour</b>, <b>Width</b>, <b>Transform</b>, and compare.', thrash: 'Click <b>Read + write in a loop</b>, then <b>All reads, then all writes</b>, and compare the forced layouts and the time.', react: 'Click <b>Add item</b> a few times (the text turns red after 2).', layers: 'This page has no buttons: pick "Three kinds of change" or edit the code.', script: 'This page has no buttons: pick "Three kinds of change" or edit the code.' }[UI.ex.id] || 'Click something in the page.';
      const thrash = last && last.forced ? `<div class="px-verdict thrash">⚠️ <b>Layout thrashing.</b> Your code read a size right after changing something, <b>${last.forced} times</b>, so the browser had to run layout ${last.forced} times inside your handler instead of once in the next frame (${last.reads} reads, ${last.writes} writes, ${last.js != null ? last.js.toFixed(1) + 'ms' : ''}). Fix: do all the reads first, then all the writes (or put the writes in requestAnimationFrame).</div>`
        : last && last.reads && last.writes ? `<div class="px-verdict ok">✅ No forced layout: ${last.reads} reads happened before the ${last.writes} writes, so layout runs once, in the next frame (${last.js != null ? last.js.toFixed(1) + 'ms' : ''}).</div>` : '';
      const react = last && last.react ? `<div class="px-verdict react">⚛️ <b>React</b>: setState → re-rendered <b>${esc(last.react.renders.join(', '))}</b> → compared the new element tree with the old one → DOM changes: ${last.react.ops.length ? last.react.ops.map(o => `<code>${esc(o)}</code>`).join(', ') : 'none'}. Only those DOM changes reach the browser stages below.</div>` : '';
      return {
        screen: 'live',
        body: `<p class="px-tip">👉 ${tip}</p>${frameBar(last)}
          ${last ? `${react}${thrash}<div class="px-verdict ${last.kind}">${VERDICT[last.kind](last)}</div>
            <p><b>What your JavaScript changed</b> <small>(${esc(last.what)})</small></p>
            ${last.changes.length ? `<table class="iv-diff"><tbody>${last.changes.slice(0, 12).map(c => `<tr><td>${esc(c.el)}</td><td><code>${esc(c.prop)}</code></td><td><code>${esc(c.from)}</code> → <code>${esc(c.to)}</code></td><td class="px-k ${c.kind}">${c.kind}</td></tr>`).join('')}</tbody></table>` : '<p class="cl-note">No style or DOM change was detected.</p>'}
            ${UI.log.length > 1 ? `<p class="cl-note">Earlier: ${UI.log.slice(1).map(e => `${esc(e.what)} → ${e.kind}`).join(' · ')}</p>` : ''}` : '<p class="cl-note">Nothing yet.</p>'}`,
        more: `<table class="iv-diff"><thead><tr><th>changing…</th><th>re-runs</th></tr></thead><tbody>
          <tr><td>width, height, margin, padding, font-size, display, position, top / left, adding or removing elements, changing text</td><td class="px-k layout">style → layout → paint → composite</td></tr>
          <tr><td>color, background, border-color, box-shadow, visibility, border-radius</td><td class="px-k paint">style → paint → composite</td></tr>
          <tr><td>transform, opacity, filter (on an element with its own layer)</td><td class="px-k composite">style → composite</td></tr></tbody></table>
          <p class="cl-note">The changes are measured (computed styles and box positions before and after your click); which stages run follows these rules, which is how Chrome works. Changes are grouped: setting ten styles in one handler still gives one style / layout / paint per frame, unless you force layout by reading a size in between.</p>`,
      };
    },
  };

  // the right-hand screen: empty, wireframe boxes, painting, layers, or the live page
  function screen(mode, v) {
    const f = $('pxFrame'), o = $('pxOverlay'), cap = $('pxCap'), scr = $('pxScreen');
    f.style.visibility = mode === 'live' ? 'visible' : 'hidden';
    scr.classList.toggle('px-blank', mode !== 'live');
    scr.classList.toggle('px-3d', mode === 'layers');
    cap.textContent = { empty: 'The screen: nothing to show yet, the browser is still building.', boxes: 'The screen after layout: only boxes, nothing painted yet.', paint: 'The screen while painting.', layers: 'The layers, pulled apart.', live: 'The screen: your real page.' }[mode];
    const box = (r, cls, style, inner) => (r ? `<div class="${cls}" style="left:${r.x}px;top:${r.y}px;width:${Math.max(r.w, 1)}px;height:${Math.max(r.h, 1)}px;${style || ''}">${inner || ''}</div>` : '');
    if (mode === 'boxes') o.innerHTML = v.boxes.map((x, i) => box(x.rect, `px-b ${x.text != null ? 'tx' : ''} ${i === UI.hl ? 'hl' : ''}`, '', x.text != null ? '' : `<small>${esc(x.label.split(/[#.]/)[0])}</small>`)).join('');
    else if (mode === 'paint') o.innerHTML = v.paint.map(x => x.kind === 'background' ? box(x.rect, 'px-p', `background:${x.color};border-radius:${x.radius}`)
      : x.kind === 'border' ? box(x.rect, 'px-p', `border:${x.widths[0]}px solid ${x.color};border-radius:${x.radius};box-sizing:border-box`)
      : box(x.rect, 'px-p px-t', `color:${x.color};font:${x.font};line-height:${x.lh}`, esc(x.text))).join('');
    else if (mode === 'layers') o.innerHTML = v.layers.map((l, i) => `<div class="px-layer" style="--i:${i};height:${f.offsetHeight}px"><span>${esc(l.name)}</span>${l.nodes.filter(n => n.rect).map(n => box(n.rect, 'px-p', n.text != null ? 'background:rgba(100,116,139,.35)' : `background:${transparent(n.cs.backgroundColor) ? 'transparent' : n.cs.backgroundColor};outline:1px dashed rgba(100,116,139,.6)`)).join('')}</div>`).join('');
    else o.innerHTML = '';
  }

  // ------------------------------------------------------------ events
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnPixels') || t.closest('[data-fmpixels]')) { if ($('frontendMap')) $('frontendMap').classList.add('hidden'); open(); return; }
    if (!$('pixelsLab') || $('pixelsLab').classList.contains('hidden')) return;
    const st = t.closest('[data-pxstage]');
    if (st) { stop(); go(+st.dataset.pxstage); return; }
    if (t.closest('#pxPrev')) { stop(); go(UI.stage - 1); return; }
    if (t.closest('#pxNext')) { stop(); go(UI.stage + 1); return; }
    if (t.closest('#pxPlay')) { play(); return; }
    if (t.closest('[data-pxreplay]')) { stop(); UI.sub = 0; draw(); UI.playing = true; $('pxPlay').textContent = '⏸ Pause'; UI.timer = setTimeout(tickSub, 500); return; }
    const row = t.closest('[data-pxbox]');
    if (row) { UI.hl = +row.dataset.pxbox === UI.hl ? -1 : +row.dataset.pxbox; draw(); return; }
    if (t.closest('#pxEditToggle')) { $('pxEdit').classList.toggle('hidden'); return; }
    if (t.closest('#pxRun')) { UI.code = $('pxCode').value; UI.stage = 0; UI.sub = null; run(); return; }
    if (t.closest('[data-pxclose]')) close();
  });
  // replay one stage's tokens / paint commands, then stop there
  function tickSub() {
    if (!UI.playing) return;
    if (UI.sub < subCount()) { UI.sub++; draw(); UI.timer = setTimeout(tickSub, (cur().key === 'dom' ? 650 : 750) * UI.speed); }
    else { UI.sub = null; stop(); draw(); }
  }
  document.addEventListener('change', e => {
    if (e.target.id === 'pxExample') { const ex = EXAMPLES.find(x => x.id === e.target.value); const wasChange = cur().key === 'change'; UI.ex = ex; UI.code = ex.code; $('pxCode').value = ex.code; UI.stage = wasChange ? active().length - 1 : 0; UI.sub = null; run(); }
    if (e.target.id === 'pxSpeed') UI.speed = +e.target.value;
    if (e.target.id === 'pxSel') { UI.sel = +e.target.value; draw(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('pixelsLab') && !$('pixelsLab').classList.contains('hidden')) close(); });

  window.PixelsLab = { open, close, go, stage: () => UI.stage, model: () => UI.model, live: () => UI.live, log: () => UI.log, frame: () => $('pxFrame'), examples: EXAMPLES, stages: () => active() };
})();

/*
 * JS Engine Lab — 🌳 Expression tree: type a JavaScript expression and see how the engine groups it
 * (precedence and associativity) as a tree, the order it evaluates the parts, which parts short-circuit
 * and are skipped, and the result, checked against the real JavaScript engine.
 * The parser is a small Pratt parser for expressions only (no statements, no function calls).
 * Its 12 "what does it give?" tasks are also 🏋️ Practice tasks (topic "Expressions & precedence");
 * their answers come from running the real expression.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // the variables an expression can use
  const SCOPE = { n: 5, a: 0, b: '', c: 'hi', list: [10, 20, 30], user: { name: 'Ada', address: null } };
  const SCOPE_TEXT = 'const n = 5, a = 0, b = "", c = "hi";\nconst list = [10, 20, 30];\nconst user = { name: "Ada", address: null };';

  // ------------------------------------------------------------ show a value the way the console would
  function fmt(v) {
    if (typeof v === 'string') return JSON.stringify(v);
    if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (Array.isArray(v)) return `[${v.map(fmt).join(', ')}]`;
    if (v && typeof v === 'object') { const k = Object.keys(v); return k.length ? `{ ${k.map(x => `${x}: ${fmt(v[x])}`).join(', ')} }` : '{}'; }
    return String(v);
  }

  // ------------------------------------------------------------ tokens
  const PUNCT = ['===', '!==', '**', '==', '!=', '<=', '>=', '&&', '||', '??', '?.', '<', '>', '+', '-', '*', '/', '%', '!', '(', ')', '[', ']', '{', '}', '?', ':', '.', ','];
  function tokenize(src) {
    const out = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1]))) {
        const m = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i.exec(src.slice(i));
        out.push({ t: 'num', v: Number(m[0]), s: m[0] }); i += m[0].length; continue;
      }
      if (ch === '"' || ch === "'") {
        let j = i + 1, s = '';
        while (j < src.length && src[j] !== ch) { if (src[j] === '\\') { s += src[j + 1]; j += 2; } else s += src[j++]; }
        if (j >= src.length) throw new SyntaxError('a string is not closed');
        out.push({ t: 'str', v: s, s: src.slice(i, j + 1) }); i = j + 1; continue;
      }
      if (/[A-Za-z_$]/.test(ch)) {
        const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
        out.push({ t: 'id', v: m[0], s: m[0] }); i += m[0].length; continue;
      }
      // "?." followed by a digit is "? .5", not optional chaining
      const p = PUNCT.find(x => src.startsWith(x, i) && !(x === '?.' && /[0-9]/.test(src[i + 2])));
      if (!p) throw new SyntaxError(`unexpected character ${ch}`);
      out.push({ t: 'p', v: p, s: p }); i += p.length;
    }
    out.push({ t: 'end', v: '', s: '' });
    return out;
  }

  // ------------------------------------------------------------ parser (Pratt): bigger number = binds tighter
  const BP = { '?': 2, '??': 3, '||': 3, '&&': 4, '==': 8, '!=': 8, '===': 8, '!==': 8, '<': 9, '>': 9, '<=': 9, '>=': 9, '+': 11, '-': 11, '*': 12, '/': 12, '%': 12, '**': 13, '.': 17, '?.': 17, '[': 17 };
  const LITERALS = { true: true, false: false, null: null, undefined: undefined, NaN: NaN, Infinity: Infinity };
  function parse(src) {
    const toks = tokenize(src);
    let k = 0;
    const peek = () => toks[k], next = () => toks[k++];
    const expect = v => { if (peek().v !== v || peek().t === 'str') throw new SyntaxError(`expected ${v}`); next(); };
    function nud() {
      const tk = next();
      if (tk.t === 'num' || tk.t === 'str') return { type: 'lit', value: tk.v, text: tk.s };
      if (tk.t === 'id') {
        if (tk.v === 'typeof') return { type: 'unary', op: 'typeof', arg: expr(14) };
        if (tk.v in LITERALS) return { type: 'lit', value: LITERALS[tk.v], text: tk.v };
        return { type: 'id', name: tk.v };
      }
      if (tk.v === '(') { const e = expr(0); expect(')'); e.paren = true; return e; }
      if (tk.v === '[') {
        const items = [];
        while (peek().v !== ']') { items.push(expr(0)); if (peek().v === ',') next(); else break; }
        expect(']');
        return { type: 'array', items };
      }
      if (tk.v === '{') { expect('}'); return { type: 'object' }; }
      if (['!', '-', '+'].includes(tk.v)) return { type: 'unary', op: tk.v, arg: expr(14) };
      if (tk.t === 'end') throw new SyntaxError('the expression ends too early');
      throw new SyntaxError(`unexpected ${tk.v}`);
    }
    const isLogic = e => e.type === 'logic' && !e.paren && (e.op === '||' || e.op === '&&');
    function expr(rbp) {
      let left = nud();
      for (;;) {
        const tk = peek();
        if (tk.t !== 'p') break;
        const bp = BP[tk.v];
        if (!bp || bp <= rbp) break;
        next();
        if (tk.v === '.' || tk.v === '?.') {
          if (tk.v === '?.' && peek().v === '[') { next(); const index = expr(0); expect(']'); left = { type: 'member', obj: left, index, optional: true }; continue; }
          const name = next();
          if (name.t !== 'id') throw new SyntaxError('expected a property name');
          left = { type: 'member', obj: left, prop: name.v, optional: tk.v === '?.' };
        } else if (tk.v === '[') {
          const index = expr(0); expect(']');
          left = { type: 'member', obj: left, index, optional: false };
        } else if (tk.v === '?') {
          const yes = expr(0); expect(':'); const no = expr(1);
          left = { type: 'cond', test: left, yes, no };
        } else if (tk.v === '**') {
          // JavaScript forbids -2 ** 2: it would be unclear whether you mean (-2) ** 2 or -(2 ** 2)
          if (left.type === 'unary' && !left.paren) throw new SyntaxError('a unary operator (like -x or !x) cannot be on the left of ** without brackets');
          left = { type: 'bin', op: '**', left, right: expr(bp - 1) }; // right-associative
        } else {
          const right = expr(bp);
          const op = tk.v;
          if (op === '&&' || op === '||' || op === '??') {
            // ?? cannot be mixed with && or || without brackets
            if (op === '??' ? (isLogic(left) || isLogic(right)) : ((left.type === 'logic' && left.op === '??' && !left.paren) || (right.type === 'logic' && right.op === '??' && !right.paren))) throw new SyntaxError('?? cannot be mixed with && or || without brackets');
            left = { type: 'logic', op, left, right };
          } else left = { type: 'bin', op, left, right };
        }
      }
      return left;
    }
    const tree = expr(0);
    if (peek().t !== 'end') throw new SyntaxError(peek().v === ',' ? 'the comma operator is not supported here' : peek().v === '(' ? 'function calls are not supported here' : `unexpected ${peek().v}`);
    return tree;
  }

  // ------------------------------------------------------------ the source text of a node
  function text(e) {
    let s;
    if (e.type === 'lit') s = e.text;
    else if (e.type === 'id') s = e.name;
    else if (e.type === 'array') s = `[${e.items.map(text).join(', ')}]`;
    else if (e.type === 'object') s = '{}';
    else if (e.type === 'unary') s = e.op === 'typeof' ? `typeof ${text(e.arg)}` : `${e.op}${text(e.arg)}`;
    else if (e.type === 'member') s = e.index ? `${text(e.obj)}${e.optional ? '?.' : ''}[${text(e.index)}]` : `${text(e.obj)}${e.optional ? '?.' : '.'}${e.prop}`;
    else if (e.type === 'cond') s = `${text(e.test)} ? ${text(e.yes)} : ${text(e.no)}`;
    else s = `${text(e.left)} ${e.op} ${text(e.right)}`;
    return e.paren ? `(${s})` : s;
  }
  const label = e => e.type === 'lit' ? e.text : e.type === 'id' ? e.name : e.type === 'array' ? '[ ]' : e.type === 'object' ? '{}' : e.type === 'unary' ? e.op : e.type === 'member' ? (e.index ? (e.optional ? '?.[ ]' : '[ ]') : (e.optional ? '?.' : '.') + e.prop) : e.type === 'cond' ? '? :' : e.op;
  const kids = e => e.type === 'unary' ? [e.arg] : e.type === 'member' ? [e.obj].concat(e.index ? [e.index] : []) : e.type === 'cond' ? [e.test, e.yes, e.no] : e.type === 'array' ? e.items : (e.left ? [e.left, e.right] : []);

  // ------------------------------------------------------------ evaluate, recording every step (the operators are JavaScript's own)
  const OPS = {
    '+': (x, y) => x + y, '-': (x, y) => x - y, '*': (x, y) => x * y, '/': (x, y) => x / y, '%': (x, y) => x % y, '**': (x, y) => x ** y,
    '==': (x, y) => x == y, '!=': (x, y) => x != y, '===': (x, y) => x === y, '!==': (x, y) => x !== y, // eslint-disable-line eqeqeq
    '<': (x, y) => x < y, '>': (x, y) => x > y, '<=': (x, y) => x <= y, '>=': (x, y) => x >= y,
  };
  const SHORT = {}; // an optional chain that stopped early
  function evaluate(tree) {
    const steps = [];
    const skip = e => { e.skipped = true; kids(e).forEach(skip); };
    const done = (e, v, note) => { e.value = v; e.order = steps.length + 1; steps.push({ text: text(e), value: v, note }); return v; };
    function ev(e, inChain) {
      let v;
      if (e.type === 'lit') return e.value;
      if (e.type === 'id') {
        if (!(e.name in SCOPE)) throw new ReferenceError(`${e.name} is not defined`);
        return done(e, SCOPE[e.name], 'look up the variable');
      }
      if (e.type === 'array') return done(e, e.items.map(x => ev(x)), 'create an array');
      if (e.type === 'object') return done(e, {}, 'create an object');
      if (e.type === 'unary') {
        if (e.op === 'typeof' && e.arg.type === 'id' && !(e.arg.name in SCOPE)) return done(e, 'undefined', 'typeof of an undeclared variable does not throw');
        const x = ev(e.arg);
        v = e.op === '!' ? !x : e.op === '-' ? -x : e.op === '+' ? +x : typeof x;
        return done(e, v, { '!': 'convert to boolean and flip', '-': 'convert to a number and negate', '+': 'convert to a number', typeof: 'the type, as a string' }[e.op]);
      }
      if (e.type === 'member') {
        const o = ev(e.obj, true);
        if (o === SHORT) { skip(e); return inChain ? SHORT : undefined; }
        if (e.optional && o == null) {
          if (e.index) skip(e.index);
          e.value = undefined; e.order = steps.length + 1;
          steps.push({ text: text(e), value: undefined, note: `${fmt(o)}?. stops the chain here: the rest is skipped` });
          return inChain ? SHORT : undefined;
        }
        if (o == null) throw new TypeError(`Cannot read properties of ${fmt(o)}`);
        const key = e.index ? ev(e.index) : e.prop;
        return done(e, o[key], `read the property ${fmt(String(key))}`);
      }
      if (e.type === 'cond') {
        const t = ev(e.test);
        const take = t ? e.yes : e.no;
        skip(t ? e.no : e.yes);
        v = ev(take);
        return done(e, v, `${fmt(t)} is ${t ? 'truthy' : 'falsy'}: take the ${t ? 'first' : 'second'} branch`);
      }
      if (e.type === 'logic') {
        const l = ev(e.left);
        const stop = e.op === '&&' ? !l : e.op === '||' ? !!l : l != null;
        if (stop) { skip(e.right); return done(e, l, `${fmt(l)} is ${e.op === '??' ? 'not null / undefined' : l ? 'truthy' : 'falsy'}: short-circuit, the right side never runs`); }
        v = ev(e.right);
        return done(e, v, `${fmt(l)} is ${e.op === '??' ? 'null / undefined' : l ? 'truthy' : 'falsy'}: the result is the right side`);
      }
      const l = ev(e.left), r = ev(e.right);
      v = OPS[e.op](l, r);
      return done(e, v, coercionNote(e.op, l, r));
    }
    let value, error = null;
    try { value = ev(tree); } catch (err) { error = err; }
    return { value, error, steps };
  }
  function coercionNote(op, l, r) {
    if (op === '+' && (typeof l === 'string' || typeof r === 'string')) return 'one side is a string: join as text';
    if (op === '+' && (typeof l === 'object' || typeof r === 'object')) return 'objects turn into strings first ([] → "", {} → "[object Object]")';
    if (['-', '*', '/', '%', '**'].includes(op) && (typeof l !== 'number' || typeof r !== 'number')) return 'both sides convert to numbers';
    if (op === '==' && typeof l !== typeof r) return '== converts the types before comparing';
    if (['<', '>', '<=', '>='].includes(op) && typeof l === 'boolean') return 'the boolean converts to a number (true → 1, false → 0)';
    return '';
  }

  // ------------------------------------------------------------ what the real engine says
  function realJS(src) {
    const names = Object.keys(SCOPE);
    try { return { value: new Function(...names, `return (${src});`)(...names.map(n => SCOPE[n])) }; } catch (err) { return { error: err }; }
  }
  const resultKey = r => r.error ? r.error.name : fmt(r.value);
  function run(src) {
    let tree = null, ours, parseError = null;
    try { tree = parse(src); } catch (err) { parseError = err; }
    ours = tree ? evaluate(tree) : { error: parseError, steps: [] };
    const real = realJS(src);
    return { tree, ours, real, agree: resultKey(ours) === resultKey(real) };
  }

  // ------------------------------------------------------------ draw the tree as SVG
  function treeSVG(tree) {
    let leaf = 0;
    const W = 74, H = 66;
    (function place(e, depth) {
      const ks = kids(e);
      e.depth = depth;
      if (!ks.length) { e.x = leaf++ * W + W / 2; return; }
      ks.forEach(c => place(c, depth + 1));
      e.x = (ks[0].x + ks[ks.length - 1].x) / 2;
    })(tree, 0);
    const nodes = [];
    (function walk(e) { nodes.push(e); kids(e).forEach(walk); })(tree);
    const width = Math.max(leaf * W, W), height = (Math.max(...nodes.map(e => e.depth)) + 1) * H + 10;
    const y = e => e.depth * H + 22;
    const lines = nodes.flatMap(e => kids(e).map(c => `<line x1="${e.x}" y1="${y(e) + 13}" x2="${c.x}" y2="${y(c) - 13}" class="${c.skipped ? 'skip' : ''}"/>`)).join('');
    const boxes = nodes.map(e => {
      const op = !['lit', 'id', 'array', 'object'].includes(e.type);
      const val = e.skipped ? 'skipped' : 'value' in e && e.type !== 'lit' ? fmt(e.value) : '';
      return `<g class="ex-node${op ? ' op' : ''}${e.skipped ? ' skip' : ''}">
        <rect x="${e.x - 32}" y="${y(e) - 13}" width="64" height="26" rx="13"/>
        <text x="${e.x}" y="${y(e) + 4}">${esc(label(e))}</text>
        ${e.order ? `<circle cx="${e.x + 30}" cy="${y(e) - 12}" r="8"/><text class="ex-ord" x="${e.x + 30}" y="${y(e) - 9}">${e.order}</text>` : ''}
        ${val ? `<text class="ex-val" x="${e.x}" y="${y(e) + 26}">${esc(val.length > 14 ? val.slice(0, 13) + '…' : val)}</text>` : ''}</g>`;
    }).join('');
    return `<svg class="ex-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="The expression as a tree">${lines}${boxes}</svg>`;
  }

  // ------------------------------------------------------------ the 🌳 tab
  const EXAMPLES = ['1 + 2 * 3', '2 ** 3 ** 2', '"5" - 2 + "1"', '3 > 2 > 1', '0 || "" || null', 'a ?? 5', 'n > 3 && "big" || "small"', 'user.address?.city', 'list[1] + list.length', '[] + {}', 'typeof typeof 1', 'a ? b : c ? "c" : "none"', 'a || b ?? "x"', '-2 ** 2'];
  const PRECEDENCE = [
    ['( … )', 'brackets', 'always first'], ['. ?. [ ]', 'property access, optional chaining', 'left to right'], ['! - + typeof', 'unary', 'right to left'],
    ['**', 'power', 'right to left: 2 ** 3 ** 2 = 2 ** 9'], ['* / %', 'multiply, divide, remainder', 'left to right'], ['+ -', 'add / join, subtract', 'left to right'],
    ['< > <= >=', 'compare', 'left to right'], ['== != === !==', 'equality', 'left to right'], ['&&', 'and', 'left to right, short-circuits'],
    ['|| ??', 'or, nullish', 'short-circuit; ?? cannot mix with && / || without brackets'], ['? :', 'conditional', 'right to left'],
  ];
  const UI = { src: '1 + 2 * 3', detail: false };
  function ensure() {
    let m = $('exLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'exLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Expression tree');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-exclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🌳 Expression tree</h2><span class="cl-note">how JavaScript groups and evaluates an expression</span></div>
      <div class="px-main db-main"><div class="px-view">
        <p class="px-say">Type an expression. The tree shows how precedence groups it; the numbers show the order the engine evaluates the parts. Greyed-out parts never run (short-circuit).</p>
        <div class="ex-row"><input id="exInput" class="cl-search ex-input" spellcheck="false" autocomplete="off" aria-label="Expression"><button class="btn small" data-exdetail id="exDetail"></button></div>
        <div class="ex-examples">${EXAMPLES.map(x => `<button class="btn small" data-exsrc="${esc(x)}"><code>${esc(x)}</code></button>`).join('')}</div>
        <pre class="px-src ex-scope">${esc(SCOPE_TEXT)}</pre>
        <div id="exBody"></div>
      </div></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const r = run(UI.src);
    const real = r.real.error ? `<b>${esc(r.real.error.name)}</b>` : `<b>${esc(fmt(r.real.value))}</b>`;
    const ours = r.ours.error ? `${esc(r.ours.error.name)}: ${esc(r.ours.error.message)}` : '';
    $('exBody').innerHTML = `
      <p class="ex-result">Result: ${real} <span class="${r.agree ? 'ex-ok' : 'ex-bad'}">${r.agree ? '✓ checked with the real JavaScript engine' : '⚠ this tool and the real engine disagree'}</span></p>
      ${ours ? `<p class="cl-note">${ours}</p>` : ''}
      ${r.tree ? `<div class="ex-tree">${treeSVG(r.tree)}</div>` : ''}
      ${r.ours.steps.length ? `<p><b>The order it runs</b></p><ol class="ex-steps">${r.ours.steps.map(s => `<li><code>${esc(s.text)}</code> → <b>${esc(fmt(s.value))}</b>${s.note ? ` <small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ol>` : ''}
      ${UI.detail ? `<p><b>Precedence, highest first</b></p><table class="iv-diff db-words"><tbody>${PRECEDENCE.map(([o, w, a]) => `<tr><td><code>${esc(o)}</code></td><td>${esc(w)}</td><td>${esc(a)}</td></tr>`).join('')}</tbody></table>
        <p class="cl-note">Precedence decides the grouping (the tree); evaluation then goes left to right through the tree. Brackets cost nothing and make code clearer: use them when you have to think about precedence.</p>` : '<p class="cl-note">"+ Show precedence" adds the full precedence table.</p>'}`;
    $('exDetail').textContent = UI.detail ? '− Hide precedence' : '+ Show precedence';
    if ($('exInput').value !== UI.src) $('exInput').value = UI.src;
  }
  function open(src) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['webLab'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    if (typeof src === 'string') UI.src = src;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('exLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    const go = t.closest('[data-extree]');
    if (go) { open(go.dataset.extree); return; }
    if (t.closest('#btnExpr') || t.closest('[data-fmexpr]')) { open(); return; }
    if (!$('exLab') || $('exLab').classList.contains('hidden')) return;
    const ex = t.closest('[data-exsrc]');
    if (ex) { UI.src = ex.dataset.exsrc; draw(); return; }
    if (t.closest('[data-exdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('[data-exclose]')) close();
  });
  document.addEventListener('input', e => { if (e.target.id === 'exInput') { UI.src = e.target.value; draw(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('exLab') && !$('exLab').classList.contains('hidden')) close(); });

  // ------------------------------------------------------------ practice tasks: the answer comes from running the real expression
  const TASKS = [
    ['ex-mul', 'Multiply before add', '1 + 2 * 3', ['9', '7'], 'A price line shows base + tax * qty.', '* binds tighter than +, so it is 1 + (2 * 3). In the tree, * sits below +: it runs first.'],
    ['ex-pow', 'Power is right-to-left', '2 ** 3 ** 2', ['64', '512'], 'A growth formula in a dashboard.', '** is right-associative: 2 ** (3 ** 2) = 2 ** 9 = 512, unlike + and *, which go left to right.'],
    ['ex-minus-str', 'Strings with - and +', '"5" - 2 + "1"', ['4', '"31"', '"321"'], 'A form value (a string) is used in a calculation.', 'Left to right: "5" - 2 converts to numbers (3), then 3 + "1" joins as text ("31"). Convert input values with Number() first.'],
    ['ex-compare-chain', 'Chained comparison', '3 > 2 > 1', ['true', 'false'], 'Someone checks a range like max > value > min.', 'It is (3 > 2) > 1 → true > 1 → 1 > 1 → false. JavaScript has no chained comparisons: write a > b && b > c.'],
    ['ex-or-chain', 'A chain of ||', '0 || "" || null', ['0', '""', 'null'], 'A fallback chain for a display value.', '|| returns the first truthy value, or the last value if none is truthy. All three are falsy, so the result is the last one: null.'],
    ['ex-nullish', '?? keeps 0', 'a ?? 5', ['0', '5'], 'A quantity field that may be 0 gets a default.', '?? only falls back for null and undefined. a is 0, so the result is 0. With || the result would be 5, a common bug for counts and prices.'],
    ['ex-and-or', '&& and || together', 'n > 3 && "big" || "small"', ['"big"', '"small"', 'true'], 'A label is picked with && and ||.', '&& binds tighter: (n > 3 && "big") || "small". n > 3 is true, so && gives "big", which is truthy, so || returns it and skips "small". A ternary (n > 3 ? "big" : "small") is clearer.'],
    ['ex-optional', 'Optional chaining', 'user.address?.city', ['undefined', 'TypeError', 'null'], 'A profile page shows the city of a user without an address.', 'user.address is null, so ?. stops the chain and the whole expression is undefined, without an error. user.address.city would throw a TypeError.'],
    ['ex-plus-obj', 'Array plus object', '[] + {}', ['"[object Object]"', '0', '"{}"'], 'A bug report shows "[object Object]" on the page.', '+ with objects turns both into strings: [] → "" and {} → "[object Object]". Seeing "[object Object]" in the UI means an object was used as text.'],
    ['ex-typeof', 'typeof typeof', 'typeof typeof 1', ['"number"', '"string"'], 'A tricky interview question.', 'typeof 1 is "number", a string, and typeof of a string is "string". typeof always returns a string.'],
    ['ex-mix-error', 'Mixing ?? with ||', 'a || b ?? "x"', ['"x"', '""', 'SyntaxError'], 'A teammate writes a default with both || and ??.', 'JavaScript does not allow ?? next to || or && without brackets, because the intent is unclear. Write (a || b) ?? "x" or a || (b ?? "x").'],
    ['ex-neg-pow', 'A minus before **', '-2 ** 2', ['4', '-4', 'SyntaxError'], 'A maths helper squares a negative number.', 'A unary minus on the left of ** is a SyntaxError: it could mean (-2) ** 2 = 4 or -(2 ** 2) = -4. Brackets are required.'],
  ];
  if (window.WebLab) window.WebLab.extend('expr', s => {
    const r = run(s.expr);
    const steps = r.ours.steps.map(x => ({ ok: true, text: `<code>${esc(x.text)}</code> → <b>${esc(fmt(x.value))}</b>${x.note ? ` (${esc(x.note)})` : ''}` }));
    if (r.real.error) steps.push({ ok: false, text: `The real engine: <b>${esc(r.real.error.name)}</b>: ${esc(r.real.error.message)}` });
    return { answer: resultKey(r.real), steps };
  }, (s, e) => `<div class="wl-card"><small>with</small><pre>${e(SCOPE_TEXT)}</pre><small>what does this give?</small><pre>${e(s.expr)}</pre><button class="btn small" data-extree="${e(s.expr)}">🌳 See it as a tree</button></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...TASKS.map(([id, title, expr, choices, scene, why]) => ({
    id, cat: 'Expressions & precedence', kind: 'rule', solver: 'expr', icon: '🌳', kindLabel: 'what does it give?',
    title, ask: 'What does it give?', scene, choices,
    hint: 'Which operator binds tighter, and which way does it group? Does anything short-circuit?',
    why: `${esc(why)} Open 🌳 Expression tree to see the grouping and the order.`, scenario: { expr, a: resultKey(realJS(expr)) },
  })));

  window.ExpressionTree = { open, close, parse, evaluate, run, fmt, text, tasks: TASKS };
})();

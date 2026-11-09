/*
 * JS Engine Lab — the TypeScript lab. The real TypeScript compiler (vendor/typescript.js, loaded on first use)
 * checks each task, so "does it compile?", "what is the type?" and "which line fails?" are always TypeScript's answers.
 * "Under the hood" shows every inferred type, the exact compiler errors, and the JavaScript that really runs.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const UI = { task: null, expected: null, nav: null };

  // a small standard library (the full lib.d.ts files are not bundled with the compiler)
  const LIB = `
interface Object {}
interface Function { apply(this: Function, thisArg: any, argArray?: any): any; call(this: Function, thisArg: any, ...argArray: any[]): any; bind(this: Function, thisArg: any, ...argArray: any[]): any; }
interface CallableFunction extends Function {}
interface NewableFunction extends Function {}
interface IArguments { length: number; [index: number]: any; }
interface String { readonly length: number; toUpperCase(): string; toLowerCase(): string; trim(): string; includes(s: string): boolean; split(sep: string): string[]; slice(a?: number, b?: number): string; startsWith(s: string): boolean; }
interface Number { toFixed(digits?: number): string; }
interface Boolean {}
interface RegExp { test(s: string): boolean; }
interface Symbol {}
interface Array<T> { length: number; [n: number]: T; push(...items: T[]): number; pop(): T | undefined; map<U>(fn: (value: T, index: number) => U): U[]; filter<S extends T>(fn: (value: T, index: number) => value is S): S[]; filter(fn: (value: T, index: number) => unknown): T[]; find(fn: (value: T) => unknown): T | undefined; reduce<U>(fn: (acc: U, value: T) => U, init: U): U; includes(x: T): boolean; join(sep?: string): string; forEach(fn: (value: T, index: number) => void): void; }
interface ReadonlyArray<T> { readonly length: number; readonly [n: number]: T; map<U>(fn: (value: T) => U): U[]; includes(x: T): boolean; }
interface TemplateStringsArray extends ReadonlyArray<string> {}
interface PromiseLike<T> { then<R>(fn: (value: T) => R | PromiseLike<R>): PromiseLike<R>; }
interface Promise<T> { then<R>(fn: (value: T) => R | PromiseLike<R>): Promise<R>; catch(fn: (reason: any) => void): Promise<T>; }
interface PromiseConstructor { new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>; resolve<T>(value: T): Promise<T>; }
declare type PromiseConstructorLike = new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) => PromiseLike<T>;
declare var Promise: PromiseConstructor;
interface PromiseConstructor { all<T>(values: readonly (T | PromiseLike<T>)[]): Promise<T[]>; reject(reason?: any): Promise<never>; }
declare var Object: { keys(o: object): string[]; values<T>(o: { [k: string]: T }): T[]; entries<T>(o: { [k: string]: T }): [string, T][]; assign<T, U>(a: T, b: U): T & U; freeze<T>(o: T): Readonly<T> };
declare var Array: { isArray(x: any): x is any[]; from<T>(x: ArrayLike<T>): T[] };
interface ArrayLike<T> { readonly length: number; readonly [n: number]: T; }
declare var Number: { (x?: any): number; isNaN(x: unknown): boolean; isInteger(x: unknown): boolean };
declare var String: { (x?: any): string };
interface Response { ok: boolean; status: number; json(): Promise<any>; text(): Promise<string>; }
declare function fetch(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }): Promise<Response>;
interface Error { name: string; message: string; }
declare var Error: { new (message?: string): Error };
interface Map<K, V> { get(key: K): V | undefined; set(key: K, value: V): this; has(key: K): boolean; }
declare var Map: { new <K, V>(): Map<K, V> };
declare var console: { log(...args: any[]): void; error(...args: any[]): void };
declare function setTimeout(fn: () => void, ms?: number): number;
declare var JSON: { parse(text: string): any; stringify(value: unknown): string };
declare var Math: { max(...n: number[]): number; min(...n: number[]): number; round(n: number): number };
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Record<K extends keyof any, T> = { [P in K]: T };
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type NonNullable<T> = T & {};
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
interface HTMLElement { textContent: string | null; }
interface HTMLInputElement extends HTMLElement { value: string; checked: boolean; }
interface HTMLButtonElement extends HTMLElement { disabled: boolean; }
declare namespace JSX { interface Element { readonly __jsx: true } interface IntrinsicElements { [tag: string]: any } interface ElementChildrenAttribute { children: {} } }
declare namespace React {
  type ReactNode = string | number | boolean | null | undefined | JSX.Element | ReactNode[];
  interface ChangeEvent<T> { target: T; }
  interface MouseEvent<T> { currentTarget: T; clientX: number; }
  type FC<P = {}> = (props: P) => JSX.Element | null;
  function useState<S>(initial: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  function useRef<T>(initial: T | null): { current: T | null };
}`;

  // ------------------------------------------------------------ loading and running the compiler
  let loading = null;
  function loadTS() {
    if (window.ts) return Promise.resolve(window.ts);
    if (!loading) loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'vendor/typescript.js';
      s.onload = () => resolve(window.ts);
      s.onerror = () => reject(new Error('Could not load the TypeScript compiler'));
      document.head.appendChild(s);
    });
    return loading;
  }
  function analyse(code, tsx) {
    const ts = window.ts;
    const name = tsx ? 'main.tsx' : 'main.ts';
    const files = { 'lib.d.ts': LIB, [name]: code };
    const options = { noLib: true, strict: true, target: ts.ScriptTarget.ES5, jsx: ts.JsxEmit.Preserve, noEmit: true, types: [] };
    const host = {
      getSourceFile: (f, lang) => (files[f] != null ? ts.createSourceFile(f, files[f], lang, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS) : undefined),
      getDefaultLibFileName: () => 'lib.d.ts', writeFile: () => {}, getCurrentDirectory: () => '', getDirectories: () => [], fileExists: f => files[f] != null,
      readFile: f => files[f], getCanonicalFileName: f => f, useCaseSensitiveFileNames: () => true, getNewLine: () => '\n',
    };
    const program = ts.createProgram([name, 'lib.d.ts'], options, host);
    const sf = program.getSourceFile(name), checker = program.getTypeChecker();
    const errors = ts.getPreEmitDiagnostics(program, sf).filter(d => d.file && d.file.fileName === name).map(d => ({
      line: sf.getLineAndCharacterOfPosition(d.start).line + 1, code: d.code, text: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    }));
    // every named variable / function / parameter, with the type TypeScript gives it
    const types = [];
    const visit = node => {
      if ((ts.isVariableDeclaration(node) || ts.isParameter(node)) && ts.isIdentifier(node.name)) types.push({ name: node.name.text, line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, type: checker.typeToString(checker.getTypeAtLocation(node.name), undefined, ts.TypeFormatFlags.NoTruncation) });
      else if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name)) node.name.elements.forEach(el => { if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) types.push({ name: el.name.text, line: sf.getLineAndCharacterOfPosition(el.getStart()).line + 1, type: checker.typeToString(checker.getTypeAtLocation(el.name), undefined, ts.TypeFormatFlags.NoTruncation) }); });
      else if (ts.isFunctionDeclaration(node) && node.name) types.push({ name: node.name.text + '()', line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, type: checker.typeToString(checker.getTypeAtLocation(node.name), undefined, ts.TypeFormatFlags.NoTruncation) });
      else if (ts.isTypeAliasDeclaration(node)) types.push({ name: 'type ' + node.name.text, line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, type: checker.typeToString(checker.getTypeAtLocation(node.name), undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias) });
      ts.forEachChild(node, visit);
    };
    visit(sf);
    const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.Preserve }, fileName: name }).outputText;
    return { errors, types, js };
  }
  // the right answer for a task, from the compiler
  function answerOf(t, r) {
    if (t.answer === 'compiles') return r.errors.length ? 'error' : 'compiles';
    if (t.answer === 'errorline') return r.errors.length ? 'line ' + r.errors[0].line : 'no error';
    if (t.answer === 'type') { const x = r.types.find(v => v.name === t.target); return x ? x.type : '?'; }
    return null;
  }

  // ------------------------------------------------------------ the window
  function ensure() {
    let m = $('tsLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'tsLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'TypeScript lab');
    m.innerHTML = `<div class="modal-card wide cl-lab">
      <button class="close" data-tsclose aria-label="Close">✕</button>
      <div class="cl-head"><span class="cl-nav"><button class="btn small" id="tsPrev" title="Previous task">◀</button><button class="cl-count" id="tsList" title="All practice tasks"></button><button class="btn small primary" id="tsNext" title="Next task">▶</button></span><h2 class="modal-title" id="tsTitle"></h2></div>
      <div id="tsScene"></div>
      <label class="cl-code ts-code"><span>TypeScript <small id="tsFile"></small> <small>(edit it: TypeScript re-checks as you type)</small></span><textarea id="tsCode" spellcheck="false"></textarea></label>
      <div class="cl-ask"><b id="tsAsk"></b><div class="cl-choices" id="tsChoices"></div>
        <div class="iv-row2"><button class="btn small" id="tsShow">Just show me</button><button class="btn small" id="tsHint">💡 Hint</button><button class="btn small" id="tsReset">Reset code</button></div>
        <div id="tsResult"></div></div>
      <div id="tsWhy" class="cl-why hidden"></div>
    </div>`;
    document.body.appendChild(m);
    let timer = null;
    $('tsCode').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { if (UI.checked) explain(); }, 300); });
    return m;
  }
  const labelOf = (t, k) => (t.labels && t.labels[k]) || k;
  function open(id, nav) {
    const t = (window.TS_TASKS || []).find(x => x.id === id);
    if (!t) return false;
    const m = ensure();
    Object.assign(UI, { task: t, expected: null, nav: nav || null, checked: false });
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    $('tsTitle').textContent = '🔷 ' + t.title;
    $('tsAsk').textContent = t.ask;
    $('tsScene').innerHTML = window.ProjectLab && window.ProjectLab.sceneHTML ? window.ProjectLab.sceneHTML(t) : '';
    $('tsFile').textContent = t.tsx ? '(main.tsx, strict)' : '(main.ts, strict)';
    $('tsCode').value = t.code;
    $('tsResult').innerHTML = '<div class="cl-note">Loading the TypeScript compiler…</div>';
    $('tsWhy').classList.add('hidden');
    const pos = nav ? nav.position() : null;
    $('tsList').textContent = pos ? `🔷 Task ${pos.i + 1} / ${pos.n}` : 'All tasks';
    $('tsPrev').disabled = !pos || pos.i === 0;
    $('tsNext').disabled = !pos || pos.i === pos.n - 1;
    $('tsChoices').innerHTML = t.choices.map(k => `<button class="btn small cl-choice" data-tschoice="${esc(k)}">${esc(labelOf(t, k))}</button>`).join('');
    m.classList.remove('hidden');
    m.querySelectorAll('[data-tschoice]').forEach(b => { b.onclick = () => { m.querySelectorAll('[data-tschoice]').forEach(x => x.classList.toggle('on', x === b)); check(b.dataset.tschoice); }; });
    loadTS().then(() => { if (UI.task !== t) return; UI.expected = answerOf(t, analyse(t.code, t.tsx)); $('tsResult').innerHTML = ''; }, e => { $('tsResult').innerHTML = `<div class="iv-verdict bad">${esc(e.message)}</div>`; });
    return true;
  }
  function check(given) {
    const t = UI.task;
    if (UI.expected == null) { $('tsResult').innerHTML = '<div class="cl-note">The compiler is still loading: try again in a second.</div>'; return; }
    UI.checked = true;
    const ok = given != null && given === UI.expected;
    $('tsResult').innerHTML = given == null ? `<div class="iv-verdict">TypeScript says: <b>${esc(labelOf(t, UI.expected))}</b>.</div>`
      : ok ? `<div class="iv-verdict ok">✅ Right: <b>${esc(labelOf(t, UI.expected))}</b>.</div>` : `<div class="iv-verdict bad">❌ Not quite. TypeScript says: <b>${esc(labelOf(t, UI.expected))}</b>.</div>`;
    explain();
  }
  function explain() {
    const t = UI.task, r = analyse($('tsCode').value, t.tsx);
    const edited = $('tsCode').value !== t.code;
    $('tsWhy').innerHTML = `<h3>Why</h3><p>${t.why}</p>
      <h3>Under the hood: what TypeScript sees${edited ? ' (your edited code)' : ''}</h3>
      ${r.errors.length ? `<ol class="wl-steps">${r.errors.map(e => `<li class="no"><span>✗</span><div><b>line ${e.line}</b> · TS${e.code}: ${esc(e.text)}</div></li>`).join('')}</ol>` : '<ol class="wl-steps"><li class="ok"><span>✓</span><div>No type errors.</div></li></ol>'}
      <table class="iv-diff ts-types"><thead><tr><th>name</th><th>line</th><th>type TypeScript gives it</th></tr></thead><tbody>${r.types.map(v => `<tr><td><code>${esc(v.name)}</code></td><td>${v.line}</td><td><code>${esc(v.type)}</code></td></tr>`).join('')}</tbody></table>
      <h3>Under the hood: the JavaScript that actually runs</h3><p class="cl-note">Types are only checked at compile time: the compiler erases them, so none of this exists at runtime.</p><pre class="ts-js">${esc(r.js.trim())}</pre>`;
    $('tsWhy').classList.remove('hidden');
  }
  function close() { const m = $('tsLab'); if (m) m.classList.add('hidden'); UI.task = null; }

  document.addEventListener('click', e => {
    const t = e.target;
    if (!$('tsLab') || $('tsLab').classList.contains('hidden')) return;
    if (t.closest('#tsShow')) { check(null); return; }
    if (t.closest('#tsHint')) { $('tsResult').innerHTML = `<div class="cl-hint">💡 ${esc(UI.task.hint || '')}</div>`; return; }
    if (t.closest('#tsReset')) { $('tsCode').value = UI.task.code; if (UI.checked) explain(); return; }
    if (t.closest('#tsPrev') && UI.nav) { UI.nav.go(-1); return; }
    if (t.closest('#tsNext') && UI.nav) { UI.nav.go(1); return; }
    if (t.closest('#tsList') && UI.nav) { close(); UI.nav.list(); return; }
    if (t.closest('[data-tsclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('tsLab') && !$('tsLab').classList.contains('hidden')) close(); });

  window.TSLab = { open, close, current: () => (UI.task ? UI.task.id : null), expected: () => UI.expected, check, load: loadTS, analyse, answerOf };
})();

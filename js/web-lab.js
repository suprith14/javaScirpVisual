/*
 * JS Engine Lab — the Web lab: network, security and loading-performance practice.
 * Two kinds of task:
 *   rule:    a request / response scenario (CORS, HTTP caching, cookies, script loading). The answer comes from
 *            the browser's rules, written out step by step, so "Under the hood" shows every check (✓ / ✗).
 *   measure: real HTML runs in a sandboxed frame (XSS, CSP, layout shift) and the answer is what really happened.
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const UI = { task: null, expected: null, steps: null, timeline: null, checked: false, nav: null };

  // ------------------------------------------------------------ CORS: what the browser checks for fetch() to another origin
  const SAFE_CT = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];
  function cors(s) {
    const steps = [];
    const o = new URL(s.origin), u = new URL(s.url);
    const same = o.origin === u.origin;
    steps.push({ ok: true, text: `The page is on <code>${esc(o.origin)}</code> and asks <code>${esc(u.origin)}</code>: ${same ? '<b>same origin</b> (scheme, host and port all match), so CORS does not apply.' : '<b>cross-origin</b> (scheme, host or port differ), so CORS rules apply.'}` });
    if (same) return { answer: 'read', steps };
    const headers = s.headers || {};
    const custom = Object.keys(headers).filter(h => { const k = h.toLowerCase(); return k === 'content-type' ? !SAFE_CT.includes(String(headers[h]).toLowerCase()) : !['accept', 'accept-language', 'content-language'].includes(k); });
    const simpleMethod = ['GET', 'HEAD', 'POST'].includes(s.method);
    const simple = simpleMethod && !custom.length;
    steps.push({ ok: true, text: simple ? 'It is a <b>simple request</b> (GET/HEAD/POST with only basic headers): no preflight, the browser sends it directly.' : `It is <b>not</b> a simple request (${!simpleMethod ? `method ${esc(s.method)}` : `header ${custom.map(h => `<code>${esc(h)}${h.toLowerCase() === 'content-type' ? ': ' + esc(headers[h]) : ''}</code>`).join(', ')}`}), so the browser first sends a <b>preflight</b> <code>OPTIONS</code> request to ask permission.` });
    const srv = s.server || {};
    const originOk = srv.acao === '*' ? !s.credentials : srv.acao === o.origin;
    const credOk = !s.credentials || srv.acac === 'true';
    const originText = () => (srv.acao ? `<code>Access-Control-Allow-Origin: ${esc(srv.acao)}</code>` : 'no <code>Access-Control-Allow-Origin</code> header');
    if (!simple) {
      const methodsOk = simpleMethod || (srv.acam || '').toUpperCase().split(',').map(x => x.trim()).includes(s.method);
      const allowed = (srv.acah || '').toLowerCase().split(',').map(x => x.trim());
      const headersOk = custom.every(h => allowed.includes(h.toLowerCase()));
      steps.push({ ok: originOk, text: `Preflight: the server answers with ${originText()}${s.credentials ? ' (credentials need the exact origin, never *)' : ''}.` });
      if (!simpleMethod) steps.push({ ok: methodsOk, text: `Preflight: <code>Access-Control-Allow-Methods: ${esc(srv.acam || '(none)')}</code> ${methodsOk ? 'includes' : 'does not include'} ${esc(s.method)}.` });
      if (custom.length) steps.push({ ok: headersOk, text: `Preflight: <code>Access-Control-Allow-Headers: ${esc(srv.acah || '(none)')}</code> ${headersOk ? 'allows' : 'does not allow'} ${custom.map(h => `<code>${esc(h)}</code>`).join(', ')}.` });
      if (s.credentials) steps.push({ ok: credOk, text: `Preflight: credentials need <code>Access-Control-Allow-Credentials: true</code> (${srv.acac === 'true' ? 'present' : 'missing'}).` });
      if (!(originOk && methodsOk && headersOk && credOk)) { steps.push({ ok: false, text: 'The preflight fails, so the browser <b>never sends the real request</b>. JavaScript gets a TypeError ("Failed to fetch").' }); return { answer: 'preflight', steps }; }
      steps.push({ ok: true, text: 'The preflight succeeds, so the browser sends the real request.' });
    }
    steps.push({ ok: true, text: 'The real request reaches the server and <b>the server runs it</b> (a POST would really change data), then sends its response.' });
    steps.push({ ok: originOk, text: `The response has ${originText()}: ${originOk ? 'it allows this origin' : srv.acao === '*' && s.credentials ? '"*" is not allowed when credentials are sent' : 'it does not allow this origin'}.` });
    if (s.credentials) steps.push({ ok: credOk, text: `With <code>credentials: "include"</code> the response also needs <code>Access-Control-Allow-Credentials: true</code> (${srv.acac === 'true' ? 'present' : 'missing'}).` });
    if (!originOk || !credOk) { steps.push({ ok: false, text: 'The browser <b>hides the response</b> from JavaScript: fetch rejects with a TypeError, even though the server did the work. CORS protects the response, not the server.' }); return { answer: 'blocked', steps }; }
    steps.push({ ok: true, text: 'JavaScript can read the response.' });
    return { answer: 'read', steps };
  }

  // ------------------------------------------------------------ HTTP caching: a second request for the same file
  function cache(s) {
    const steps = [];
    const cc = s.cacheControl.toLowerCase();
    const maxAge = (/max-age=(\d+)/.exec(cc) || [])[1];
    steps.push({ ok: true, text: `The first response said <code>Cache-Control: ${esc(s.cacheControl)}</code>${s.etag ? ' and <code>ETag: "v1"</code>' : ''}. Now the page needs the file again, <b>${s.age} seconds</b> later.` });
    if (cc.includes('no-store')) { steps.push({ ok: false, text: '<code>no-store</code>: the browser was not allowed to keep a copy at all, so it downloads everything again.' }); return { answer: 'download', steps }; }
    const noCache = cc.includes('no-cache');
    const fresh = !noCache && maxAge != null && s.age < +maxAge;
    if (noCache) steps.push({ ok: false, text: '<code>no-cache</code> does not mean "do not cache": the copy is stored, but must be <b>checked with the server</b> before every use.' });
    else if (maxAge != null) steps.push({ ok: fresh, text: `<code>max-age=${maxAge}</code>: the copy is fresh for ${maxAge}s. Its age is ${s.age}s, so it is ${fresh ? '<b>still fresh</b>' : '<b>stale</b>'}.` });
    else steps.push({ ok: false, text: 'No freshness information: the browser treats the copy as stale.' });
    if (fresh) { steps.push({ ok: true, text: 'Fresh copy: served straight from the cache, <b>no request is sent</b>.' }); return { answer: 'cache', steps }; }
    if (!s.etag) { steps.push({ ok: false, text: 'There is no validator (<code>ETag</code> or <code>Last-Modified</code>), so the browser cannot ask "has it changed?": it downloads it again.' }); return { answer: 'download', steps }; }
    steps.push({ ok: true, text: 'The browser sends a <b>conditional request</b> with <code>If-None-Match: "v1"</code>.' });
    if (s.changed) { steps.push({ ok: false, text: 'The file has changed, so the server sends <code>200 OK</code> with the new file.' }); return { answer: 'download', steps }; }
    steps.push({ ok: true, text: 'The file has not changed: the server answers <code>304 Not Modified</code> with no body, and the browser uses its copy.' });
    return { answer: '304', steps };
  }

  // ------------------------------------------------------------ cookies: is it sent with this request? can JavaScript read it?
  const site = host => host.split('.').slice(-2).join('.');
  function cookie(s) {
    const steps = [], c = s.cookie;
    steps.push({ ok: true, text: `The cookie was set with <code>${esc(setCookieText(c))}</code>.` });
    if (s.question === 'read') {
      steps.push({ ok: !c.httpOnly, text: c.httpOnly ? '<code>HttpOnly</code>: the cookie is <b>invisible to JavaScript</b> (<code>document.cookie</code> does not show it), so a script injected by XSS cannot steal it. It is still sent to the server.' : 'No <code>HttpOnly</code> flag: page scripts can read it with <code>document.cookie</code> (and so can an XSS attack).' });
      return { answer: c.httpOnly ? 'no' : 'yes', steps };
    }
    const target = new URL(s.target), from = new URL(s.from);
    if (c.secure && target.protocol !== 'https:') { steps.push({ ok: false, text: '<code>Secure</code>: only sent over HTTPS, and this request is plain HTTP.' }); return { answer: 'no', steps }; }
    if (c.path && !target.pathname.startsWith(c.path)) { steps.push({ ok: false, text: `<code>Path=${esc(c.path)}</code>: only sent to URLs under ${esc(c.path)}; this request goes to ${esc(target.pathname)}.` }); return { answer: 'no', steps }; }
    const same = site(from.hostname) === site(target.hostname);
    const kindText = { navigation: 'a top-level link click (GET navigation)', form: 'a form POST', fetch: 'a fetch / image / iframe request' }[s.kind];
    steps.push({ ok: true, text: `The request comes from ${esc(from.hostname)} (${kindText}) and goes to ${esc(target.hostname)}: ${same ? '<b>same-site</b>' : '<b>cross-site</b>'}.` });
    if (same) { steps.push({ ok: true, text: 'Same-site requests always get the cookie, whatever SameSite says.' }); return { answer: 'yes', steps }; }
    const ss = (c.sameSite || 'Lax');
    if (ss === 'None' && !c.secure) { steps.push({ ok: false, text: '<code>SameSite=None</code> without <code>Secure</code> is rejected by the browser: the cookie was never stored.' }); return { answer: 'no', steps }; }
    if (ss === 'Strict') { steps.push({ ok: false, text: '<code>SameSite=Strict</code>: never sent on cross-site requests, not even when you follow a link.' }); return { answer: 'no', steps }; }
    if (ss === 'Lax') {
      const ok = s.kind === 'navigation';
      steps.push({ ok, text: `<code>SameSite=Lax</code>${c.sameSite ? '' : ' (what Chrome and Edge assume when SameSite is not set; set it yourself for other browsers)'}: sent on cross-site <b>top-level GET navigations</b> only, not on cross-site form POSTs, fetches, images or iframes. That blocks most CSRF attacks.` });
      return { answer: ok ? 'yes' : 'no', steps };
    }
    steps.push({ ok: true, text: '<code>SameSite=None; Secure</code>: sent on every cross-site request (needed for embeds and third-party widgets, and exactly what CSRF abuses).' });
    return { answer: 'yes', steps };
  }
  function setCookieText(c) { return `Set-Cookie: ${c.name}=…` + (c.path ? `; Path=${c.path}` : '') + (c.secure ? '; Secure' : '') + (c.httpOnly ? '; HttpOnly' : '') + (c.sameSite ? `; SameSite=${c.sameSite}` : ''); }

  // ------------------------------------------------------------ loading: when do scripts run, when can the page paint?
  // A simplified browser: every file starts downloading at 0ms (the preload scanner finds them); the parser reads
  // the tags in order (10ms each). CSS blocks rendering and the scripts after it; a normal script stops the parser
  // until it has downloaded and run; async runs as soon as it arrives; defer runs after parsing, in order.
  function load(s) {
    const steps = [], order = [];
    const rows = s.tags.map(x => ({ name: x.name, kind: x.type, dl: x.download }));
    const row = n => rows.find(r => r.name === n);
    let t = 0, cssDone = 0;
    const asyncQ = []; // async scripts the parser has already found (a script can only run after its tag is parsed)
    const run = (r, start, text) => { r.start = start; r.end = start + 20; t = r.end; order.push(r.name); steps.push({ ok: true, text }); };
    // async scripts run as soon as they arrive, between the parser's steps (they never wait for CSS or for each other's order)
    const runAsync = (limit, late) => {
      asyncQ.sort((a, b) => row(a).dl - row(b).dl);
      while (asyncQ.length && row(asyncQ[0]).dl <= limit) {
        const r = row(asyncQ.shift());
        const start = Math.max(r.dl, t);
        run(r, start, late ? `${start}ms: <code>${esc(r.name)}</code> (async) arrives late and runs, even after DOMContentLoaded: async scripts wait for nothing.` : `${start}ms: <code>${esc(r.name)}</code> (async) has arrived, so it runs right away, pausing whatever the parser was doing.`);
      }
    };
    for (const tag of s.tags) {
      runAsync(t);
      t += 10;
      const r = row(tag.name);
      if (tag.type === 'css') {
        cssDone = Math.max(cssDone, tag.download);
        steps.push({ ok: true, text: `${t}ms: the parser finds <code>${esc(tag.name)}</code>. CSS does not stop the parser, but nothing can be painted, and no later normal script can run, until it arrives (${tag.download}ms).` });
      } else if (tag.type === 'sync') {
        const ready = Math.max(tag.download, cssDone);
        steps.push({ ok: false, text: `${t}ms: the parser reaches <code>${esc(tag.name)}</code> (a normal script) and <b>stops</b> until it has downloaded (${tag.download}ms)${cssDone > tag.download ? ` and the CSS before it has arrived (${cssDone}ms)` : ''}.` });
        runAsync(ready);
        run(r, Math.max(ready, t), `${Math.max(ready, t)}ms: <code>${esc(tag.name)}</code> runs; then the parser continues.`);
      } else {
        if (tag.type === 'async') asyncQ.push(tag.name);
        steps.push({ ok: true, text: `${t}ms: the parser finds <code>${esc(tag.name)}</code> (${tag.type}): it downloads in the background and the parser <b>keeps going</b>.` });
      }
    }
    runAsync(t);
    const parseEnd = t;
    steps.push({ ok: true, text: `${parseEnd}ms: the parser reaches the end of the HTML.` });
    for (const tag of s.tags.filter(x => x.type === 'defer')) {
      const ready = Math.max(t, tag.download, cssDone);
      runAsync(ready);
      run(row(tag.name), Math.max(ready, t), `${Math.max(ready, t)}ms: <code>${esc(tag.name)}</code> (defer) runs: after parsing, in document order${tag.download > parseEnd ? ', once it has arrived' : ''}.`);
    }
    steps.push({ ok: true, text: `${t}ms: <code>DOMContentLoaded</code> fires (after every defer script).` });
    runAsync(Infinity, true);
    // "does this script wait for the stylesheet?" or "in which order do the scripts run?"
    const answer = s.question === 'waits' ? (row(s.target).start >= cssDone ? 'yes' : 'no') : order.join(', ');
    return { answer, steps, timeline: { rows, parseEnd, cssDone } };
  }
  // ------------------------------------------------------------ Git: replay commands on a tiny model of a repository
  // commits are named by their message; rebase and cherry-pick make NEW commits (shown with a prime: B')
  function git(s) {
    const steps = [], commits = {}, branches = {};
    let head = { branch: 'main' }, seq = 0;
    const tip = () => (head.branch ? branches[head.branch] : head.commit);
    const make = (msg, parents) => { const id = msg; commits[id] = { id, msg, parents: parents.filter(Boolean), seq: ++seq }; return id; };
    const ancestors = id => { const out = new Set(), todo = [id]; while (todo.length) { const c = todo.pop(); if (!c || out.has(c)) continue; out.add(c); todo.push(...commits[c].parents); } return out; };
    const move = id => { if (head.branch) branches[head.branch] = id; else head.commit = id; };
    const log = ref => [...ancestors(branches[ref] || ref)].sort((a, b) => commits[b].seq - commits[a].seq);
    const fresh = msg => { let m = msg + "'"; while (commits[m]) m += "'"; return m; };
    branches.main = make(s.start || 'A', []);
    for (const cmd of s.commands) {
      const [, verb, rest = ''] = /^git (\S+)\s*(.*)$/.exec(cmd);
      const arg = rest.replace(/^-c\s+|^-b\s+/, '').replace(/^"|"$/g, '').replace(/^-m\s+"?|"$/g, '');
      if (verb === 'commit') { move(make(arg, [tip()])); steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: a new commit <b>${esc(arg)}</b> on ${head.branch ? `<b>${head.branch}</b>` : 'a detached HEAD'}, whose parent is the previous tip.` }); }
      else if (verb === 'branch') { branches[arg] = tip(); steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: a branch is just a <b>name pointing at a commit</b>. ${esc(arg)} now points at ${esc(tip())}; HEAD stays where it is.` }); }
      else if (verb === 'switch' || verb === 'checkout') {
        if (/^-[cb]\s/.test(rest)) { branches[arg] = tip(); head = { branch: arg }; steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: create <b>${esc(arg)}</b> at ${esc(tip())} and switch to it.` }); }
        else if (branches[arg]) { head = { branch: arg }; steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: HEAD now points to <b>${esc(arg)}</b> (at ${esc(branches[arg])}).` }); }
        else { head = { commit: arg }; steps.push({ ok: false, text: `<code>${esc(cmd)}</code>: ${esc(arg)} is a commit, not a branch: <b>detached HEAD</b>. New commits made here belong to no branch.` }); }
      } else if (verb === 'merge') {
        const target = branches[arg], cur = tip();
        if (ancestors(target).has(cur)) { move(target); steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: ${esc(head.branch)} has no commits of its own since ${esc(arg)} started, so git just moves the pointer forward: a <b>fast-forward</b>, no merge commit.` }); }
        else if (ancestors(cur).has(target)) steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: already up to date.` });
        else { move(make(`Merge ${arg}`, [cur, target])); steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: both branches have new commits, so git creates a <b>merge commit</b> with <b>two parents</b> (${esc(cur)} and ${esc(target)}). History keeps both lines.` }); }
      } else if (verb === 'rebase') {
        const onto = branches[arg], base = ancestors(onto);
        const mine = log(head.branch).filter(c => !base.has(c)).reverse();
        let cur = onto;
        const made = mine.map(c => { cur = make(fresh(c), [cur]); return cur; });
        move(cur);
        steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: git takes the commits only on ${esc(head.branch)} (${mine.map(esc).join(', ') || 'none'}) and <b>replays</b> them on top of ${esc(arg)} as <b>new commits</b> (${made.map(esc).join(', ')}): same changes, new ids. The old ones are left behind; never rebase commits others already have.` });
      } else if (verb === 'reset') {
        const n = +((/~(\d+)/.exec(rest) || [])[1] || 1); let c = tip(); for (let i = 0; i < n; i++) c = commits[c].parents[0];
        const gone = tip(); move(c);
        steps.push({ ok: false, text: `<code>${esc(cmd)}</code>: the branch pointer moves <b>back</b> to ${esc(c)}. ${esc(gone)} is no longer on the branch (history is <b>rewritten</b>; only the reflog still remembers it).` });
      } else if (verb === 'revert') {
        const bad = tip(); move(make(`Revert ${bad}`, [bad]));
        steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: a <b>new commit</b> that undoes ${esc(bad)}. Nothing is rewritten, so it is safe on a shared branch.` });
      } else if (verb === 'cherry-pick') {
        const src = branches[arg] || arg, copy = fresh(src); move(make(copy, [tip()]));
        steps.push({ ok: true, text: `<code>${esc(cmd)}</code>: the change of ${esc(src)} is <b>copied</b> as a new commit ${esc(copy)} on ${esc(head.branch)}.` });
      }
    }
    const answer = s.question === 'reachable' ? (Object.values(branches).some(b => ancestors(b).has(s.target)) ? 'yes' : 'no') : log(s.branch).join(' → ');
    return { answer, steps, graph: { commits, branches, head } };
  }
  function graphHTML(g) {
    const list = Object.values(g.commits).sort((a, b) => a.seq - b.seq);
    // a commit stays in its parent's lane if it is that parent's first child; otherwise it starts a new lane
    const lane = {}, continued = new Set(); let lanes = 0;
    list.forEach(c => { const p = c.parents[0]; if (p == null) lane[c.id] = lanes++; else if (!continued.has(p)) { continued.add(p); lane[c.id] = lane[p]; } else lane[c.id] = lanes++; });
    const W = 70, H = 46, x = c => 30 + (c.seq - 1) * W, y = c => 24 + lane[c.id] * H;
    const h = 30 + (Math.max(...list.map(c => lane[c.id])) + 1) * H, w = 60 + list.length * W;
    const edges = list.flatMap(c => c.parents.map(p => `<line x1="${x(g.commits[p])}" y1="${y(g.commits[p])}" x2="${x(c)}" y2="${y(c)}" class="gg-edge"/>`)).join('');
    const reach = new Set(); Object.values(g.branches).forEach(b => { const todo = [b]; while (todo.length) { const k = todo.pop(); if (!k || reach.has(k)) continue; reach.add(k); todo.push(...g.commits[k].parents); } });
    if (g.head.commit) { const todo = [g.head.commit]; while (todo.length) { const k = todo.pop(); if (!k || reach.has(k)) continue; reach.add(k); todo.push(...g.commits[k].parents); } }
    const labels = {};
    Object.entries(g.branches).forEach(([b, id]) => { (labels[id] = labels[id] || []).push(b + (g.head.branch === b ? ' (HEAD)' : '')); });
    if (g.head.commit) (labels[g.head.commit] = labels[g.head.commit] || []).push('HEAD (detached)');
    const nodes = list.map(c => `<g class="${reach.has(c.id) ? '' : 'gg-lost'}"><circle cx="${x(c)}" cy="${y(c)}" r="12" class="gg-node${c.parents.length > 1 ? ' merge' : ''}"/><text x="${x(c)}" y="${y(c) + 4}" class="gg-id">${esc(c.id.length > 6 ? c.id.slice(0, 5) + '…' : c.id)}</text>${labels[c.id] ? `<text x="${x(c)}" y="${y(c) - 17}" class="gg-ref">${esc(labels[c.id].join(', '))}</text>` : ''}<title>${esc(c.msg)}</title></g>`).join('');
    return `<div class="gg-wrap"><svg width="${w}" height="${h + 10}" role="img" aria-label="Commit graph">${edges}${nodes}</svg><div class="wl-legend"><span>● commit (newer to the right)</span><span>labels: branches pointing at it</span><span class="gg-l">faded: no branch reaches it any more</span></div></div>`;
  }

  // ------------------------------------------------------------ npm: does a version range accept a version?
  function semver(s) {
    const steps = [], p = v => v.split('.').map(Number);
    const [M, m, pt] = p(s.version), r = s.range;
    steps.push({ ok: true, text: `package.json says <code>"${esc(s.pkg)}": "${esc(r)}"</code>. The registry has <b>${esc(s.version)}</b>. Versions are MAJOR.MINOR.PATCH: breaking changes · new features · fixes.` });
    let ok, why;
    if (/^\d/.test(r)) { ok = r === s.version; why = 'An exact version accepts only that version.'; }
    else if (r[0] === '^') {
      const [a, b, c] = p(r.slice(1));
      if (a > 0) { ok = M === a && (m > b || (m === b && pt >= c)); why = `<code>^${a}.x.x</code> accepts any version with the same <b>major</b> (${a}) that is at least ${a}.${b}.${c}: new features and fixes, never breaking changes.`; }
      else { ok = M === 0 && m === b && pt >= c; why = `For 0.x versions the caret is stricter: <code>^0.${b}.${c}</code> only accepts <b>0.${b}.x</b> (≥ 0.${b}.${c}), because before 1.0 a minor bump may break things.`; }
    } else if (r[0] === '~') { const [a, b, c] = p(r.slice(1)); ok = M === a && m === b && pt >= c; why = `<code>~${a}.${b}.${c}</code> accepts only <b>patch</b> updates: ${a}.${b}.x with x ≥ ${c}.`; }
    steps.push({ ok, text: why });
    steps.push({ ok, text: `${esc(s.version)} ${ok ? 'is' : 'is <b>not</b>'} accepted. (The lockfile, package-lock.json, records the exact version installed, so everyone gets the same one until you update.)` });
    return { answer: ok ? 'yes' : 'no', steps };
  }
  const SOLVERS = { cors, cache, cookie, load, git, semver };
  const CARDS = {}; // scenario cards for solvers added with WebLab.extend
  const scene = t => (window.ProjectLab && window.ProjectLab.sceneHTML ? window.ProjectLab.sceneHTML(t) : '');

  // ------------------------------------------------------------ the cards that describe a rule scenario
  function scenarioHTML(t) {
    const s = t.scenario;
    if (CARDS[t.solver]) return CARDS[t.solver](t.scenario, esc);
    if (t.solver === 'cors') {
      const opts = [`method: "${s.method}"`].concat(s.headers && Object.keys(s.headers).length ? [`headers: { ${Object.entries(s.headers).map(([k, v]) => `"${k}": "${v}"`).join(', ')} }`] : []).concat(s.credentials ? ['credentials: "include"'] : []);
      const srv = s.server || {};
      const h = [srv.acao && `Access-Control-Allow-Origin: ${srv.acao}`, srv.acam && `Access-Control-Allow-Methods: ${srv.acam}`, srv.acah && `Access-Control-Allow-Headers: ${srv.acah}`, srv.acac && `Access-Control-Allow-Credentials: ${srv.acac}`].filter(Boolean);
      return `<div class="wl-cards"><div class="wl-card"><small>the page at ${esc(s.origin)} runs</small><pre>fetch("${esc(s.url)}", {\n  ${esc(opts.join(',\n  '))}\n})</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>the server's CORS headers (on every response)</small><pre>${h.length ? esc(h.join('\n')) : '(no CORS headers)'}</pre></div></div>`;
    }
    if (t.solver === 'cache') return `<div class="wl-cards"><div class="wl-card"><small>first response for ${esc(s.file)}</small><pre>HTTP/1.1 200 OK\nCache-Control: ${esc(s.cacheControl)}${s.etag ? '\nETag: "v1"' : ''}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>later</small><pre>${s.age} seconds later the page needs\n${esc(s.file)} again.\nThe file on the server ${s.changed ? 'HAS changed' : 'has not changed'}.</pre></div></div>`;
    if (t.solver === 'cookie') return `<div class="wl-cards"><div class="wl-card"><small>bank.example set this cookie</small><pre>${esc(setCookieText(s.cookie))}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>the situation</small><pre>${s.question === 'read' ? 'A script on the page runs\ndocument.cookie' : esc(`${{ navigation: 'A link click', form: 'A form POST', fetch: 'A fetch()' }[s.kind]} on ${s.from}\nsends a request to ${s.target}`)}</pre></div></div>`;
    if (t.solver === 'git') return `<div class="wl-cards"><div class="wl-card"><small>the repository starts with one commit (${esc(s.start || 'A')}) on main, then you run</small><pre>${esc(s.commands.join('\n'))}</pre></div></div>`;
    if (t.solver === 'semver') return `<div class="wl-cards"><div class="wl-card"><small>package.json</small><pre>"dependencies": {
  "${esc(s.pkg)}": "${esc(s.range)}"
}</pre></div><div class="wl-arrow">→</div><div class="wl-card"><small>npm install</small><pre>The newest ${esc(s.pkg)} on the registry is ${esc(s.version)}.</pre></div></div>`;
    if (t.solver === 'load') return `<div class="wl-card"><small>the HTML (download times in brackets)</small><pre>${esc(s.tags.map(x => (x.type === 'css' ? `<link rel="stylesheet" href="${x.name}">` : `<script${x.type === 'sync' ? '' : ' ' + x.type} src="${x.name}"></script>`) + `   (${x.download}ms)`).join('\n'))}\n&lt;p&gt;… the rest of the page …&lt;/p&gt;</pre></div>`;
    return '';
  }
  function waterfallHTML(tl) {
    const max = Math.max(tl.parseEnd, ...tl.rows.map(r => Math.max(r.dl, r.end || 0))) + 20;
    const pct = v => (100 * v / max).toFixed(1) + '%';
    return `<div class="wl-fall">${tl.rows.map(r => `<div class="wl-row"><span class="wl-name">${esc(r.name)} <small>${r.kind}</small></span><span class="wl-track"><i class="wl-dl" style="left:0;width:${pct(r.dl)}" title="download ${r.dl}ms"></i>${r.start != null ? `<i class="wl-run" style="left:${pct(r.start)};width:${pct(r.end - r.start)}" title="runs ${r.start}–${r.end}ms"></i>` : ''}</span></div>`).join('')}
      <div class="wl-row"><span class="wl-name">parser</span><span class="wl-track"><i class="wl-parse" style="left:0;width:${pct(tl.parseEnd)}"></i></span></div>
      <div class="wl-legend"><span class="dl">downloading</span><span class="run">running</span><span class="parse">parsing the HTML (with pauses)</span></div></div>`;
  }

  // a general timeline: rows of coloured bars plus labelled moments (used by the rendering-strategy tasks)
  function barsHTML(b) {
    const max = b.max || Math.max(...b.rows.flatMap(r => r.segs.map(s => s.to)), ...(b.marks || []).map(m => m.at)) + 60;
    const pct = v => (100 * v / max).toFixed(1) + '%';
    const marks = (b.marks || []).map(m => `<i class="wl-mark ${m.cls || ''}" style="left:${pct(m.at)}" title="${esc(m.label)} at ${m.at}ms"></i>`).join('');
    return `<div class="wl-fall">${b.rows.map(r => `<div class="wl-row"><span class="wl-name">${esc(r.name)}${r.note ? ` <small>${esc(r.note)}</small>` : ''}</span><span class="wl-track">${r.segs.map(s => `<i class="${s.cls}" style="left:${pct(s.from)};width:${pct(Math.max(s.to - s.from, 4))}" title="${esc(s.title || '')} ${s.from}–${s.to}ms"></i>`).join('')}${marks}</span></div>`).join('')}
      <div class="wl-legend">${(b.legend || []).map(([c, l]) => `<span class="${c}">${esc(l)}</span>`).join('')}${(b.marks || []).map(m => `<span class="mk ${m.cls || ''}">${esc(m.label)}: ${m.at}ms</span>`).join('')}</div></div>`;
  }

  // ------------------------------------------------------------ the window
  function ensure() {
    let m = $('webLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'webLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Web lab');
    m.innerHTML = `<div class="modal-card wide cl-lab">
      <button class="close" data-wbclose aria-label="Close">✕</button>
      <div class="cl-head"><span class="cl-nav"><button class="btn small" id="wbPrev" title="Previous task">◀</button><button class="cl-count" id="wbList" title="All practice tasks"></button><button class="btn small primary" id="wbNext" title="Next task">▶</button></span><h2 class="modal-title" id="wbTitle"></h2></div>
      <div id="wbScenario"></div>
      <div id="wbLive" class="wl-live hidden"><span>Runs in a sandboxed frame <small>(the answer is what really happens)</small></span><pre id="wbCode"></pre><iframe id="wbFrame" title="Sandbox" sandbox="allow-scripts allow-same-origin"></iframe></div>
      <div class="cl-ask"><b id="wbAsk"></b><div class="cl-choices" id="wbChoices"></div>
        <div class="iv-row2"><button class="btn small" id="wbShow">Just show me</button><button class="btn small" id="wbHint">💡 Hint</button></div>
        <div id="wbResult"></div></div>
      <div id="wbWhy" class="cl-why hidden"></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function labelOf(t, key) { return (t.labels && t.labels[key]) || key; }
  function open(id, nav) {
    const t = (window.WEB_TASKS || []).find(x => x.id === id);
    if (!t) return false;
    const m = ensure();
    Object.assign(UI, { task: t, expected: null, steps: null, timeline: null, checked: false, nav: nav || null });
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    $('wbTitle').textContent = (t.icon || (t.kind === 'measure' ? '🧪' : '🌐')) + ' ' + t.title;
    $('wbAsk').textContent = t.ask;
    $('wbResult').innerHTML = '';
    $('wbWhy').classList.add('hidden');
    const pos = nav ? nav.position() : null;
    $('wbList').textContent = pos ? `🌐 Task ${pos.i + 1} / ${pos.n}` : 'All tasks';
    $('wbPrev').disabled = !pos || pos.i === 0;
    $('wbNext').disabled = !pos || pos.i === pos.n - 1;
    $('wbChoices').innerHTML = t.choices.map(k => `<button class="btn small cl-choice" data-wbchoice="${esc(k)}">${esc(labelOf(t, k))}</button>`).join('');
    if (t.kind === 'rule') {
      $('wbLive').classList.add('hidden');
      $('wbScenario').innerHTML = scene(t) + scenarioHTML(t);
      const r = SOLVERS[t.solver](t.scenario);
      UI.expected = r.answer; UI.steps = r.steps; UI.timeline = r.timeline || null; UI.graph = r.graph || null; UI.bars = r.bars || null;
    } else {
      $('wbScenario').innerHTML = scene(t) + (t.intro ? `<p class="cl-note">${t.intro}</p>` : '');
      UI.bars = null;
      $('wbLive').classList.remove('hidden');
      $('wbCode').textContent = t.html.trim();
      const f = $('wbFrame');
      f.onload = () => {
        let d, w;
        try { d = f.contentDocument; w = f.contentWindow; } catch (e) { return; }
        // only keep the answer if this task is still the one on screen (a slow measurement must not overwrite the next task)
        Promise.resolve().then(() => t.measure(d, w)).then(v => { if (UI.task === t) UI.expected = v; }, () => { if (UI.task === t) UI.expected = null; });
      };
      // observers only report while the frame is rendering, and browsers pause rendering for frames scrolled out of view
      if (t.needsView) setTimeout(() => f.scrollIntoView({ block: 'nearest' }), 0);
      f.srcdoc = `<!doctype html><html><head><meta charset="utf-8">${t.head || ''}<style>body{margin:8px;font:15px/1.4 system-ui,sans-serif}</style></head><body>${t.html}</body></html>`;
    }
    m.classList.remove('hidden');
    m.querySelectorAll('[data-wbchoice]').forEach(b => { b.onclick = () => { m.querySelectorAll('[data-wbchoice]').forEach(x => x.classList.toggle('on', x === b)); check(b.dataset.wbchoice); }; });
    return true;
  }
  function check(given) {
    const t = UI.task;
    UI.checked = true;
    if (UI.expected == null) { $('wbResult').innerHTML = '<div class="iv-verdict">The sandbox is still running: try again in a moment.</div>'; return; }
    const ok = given != null && String(given) === String(UI.expected);
    $('wbResult').innerHTML = given == null ? `<div class="iv-verdict">Answer: <b>${esc(labelOf(t, UI.expected))}</b>.</div>`
      : ok ? `<div class="iv-verdict ok">✅ Right: <b>${esc(labelOf(t, UI.expected))}</b>.</div>` : `<div class="iv-verdict bad">❌ Not quite. The answer is <b>${esc(labelOf(t, UI.expected))}</b>.</div>`;
    let html = `<h3>Why</h3><p>${t.why}</p>`;
    if (UI.steps) html += `<h3>Under the hood: what the browser checks</h3><ol class="wl-steps">${UI.steps.map(s => `<li class="${s.ok ? 'ok' : 'no'}"><span>${s.ok ? '✓' : '✗'}</span><div>${s.text}</div></li>`).join('')}</ol>`;
    if (UI.timeline) html += `<h3>Under the hood: the loading waterfall</h3>${waterfallHTML(UI.timeline)}`;
    if (UI.bars) html += `<h3>Under the hood: ${esc(UI.bars.title || 'the timeline')}</h3>${barsHTML(UI.bars)}`;
    if (UI.graph) html += `<h3>Under the hood: the commit graph after the commands</h3>${graphHTML(UI.graph)}`;
    $('wbWhy').innerHTML = html;
    $('wbWhy').classList.remove('hidden');
  }
  function close() { const m = $('webLab'); if (m) m.classList.add('hidden'); UI.task = null; }

  document.addEventListener('click', e => {
    const t = e.target;
    if (!$('webLab') || $('webLab').classList.contains('hidden')) return;
    if (t.closest('#wbShow')) { check(null); return; }
    if (t.closest('#wbHint')) { $('wbResult').innerHTML = `<div class="cl-hint">💡 ${esc(UI.task.hint || '')}</div>`; return; }
    if (t.closest('#wbPrev') && UI.nav) { UI.nav.go(-1); return; }
    if (t.closest('#wbNext') && UI.nav) { UI.nav.go(1); return; }
    if (t.closest('#wbList') && UI.nav) { close(); UI.nav.list(); return; }
    if (t.closest('[data-wbclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('webLab') && !$('webLab').classList.contains('hidden')) close(); });

  window.WebLab = { open, close, current: () => (UI.task ? UI.task.id : null), expected: () => UI.expected, check, solvers: SOLVERS, extend: (name, solver, card) => { SOLVERS[name] = solver; if (card) CARDS[name] = card; } };
})();

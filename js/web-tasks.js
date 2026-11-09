/*
 * JS Engine Lab — network, security and web-performance practice (opened by js/web-lab.js).
 * rule tasks: the answer comes from the browser's rules (solver), shown step by step after you answer.
 * measure tasks: the HTML really runs in a sandboxed frame and the answer is what happened.
 */
(function () {
  'use strict';
  const CORS = { read: 'JavaScript can read the response', blocked: 'The request is sent, but JavaScript cannot read the response', preflight: 'The preflight fails: the real request is never sent' };
  const CACHE = { cache: 'From the cache: no request at all', '304': 'Asks the server, gets 304 Not Modified, uses the copy', download: 'Downloads the whole file again (200)' };
  const YESNO = { yes: 'Yes', no: 'No' };
  const XSS = { runs: 'The attacker\'s code runs', safe: 'Nothing runs' };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const SVG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><rect width="300" height="150" fill="#9cf"/></svg>');
  // how far the text below the image moves when the image arrives
  const shift = async (d, w) => {
    const p = d.getElementById('text'), img = d.getElementById('hero');
    const before = p.getBoundingClientRect().top;
    await new Promise(r => { img.onload = r; img.onerror = r; img.src = SVG; });
    await wait(30);
    return Math.round(p.getBoundingClientRect().top - before) > 0 ? 'jumps' : 'stays';
  };

  window.WEB_TASKS = [
    // ------------------------------------------------------------ CORS
    { id: 'net-cors-public', cat: 'Network & HTTP', kind: 'rule', solver: 'cors', title: 'CORS: a public API', ask: 'Can the page read the products?', labels: CORS, choices: ['read', 'blocked', 'preflight'],
      hint: 'Is it a simple request? What does Access-Control-Allow-Origin say?',
      why: 'The <b>same-origin policy</b> stops a page from reading responses from other origins. <b>CORS</b> lets the server opt in: <code>Access-Control-Allow-Origin: *</code> means "any site may read this" (fine for public data without cookies). A plain GET is a simple request, so there is no preflight.',
      scenario: { origin: 'https://shop.example', url: 'https://api.example/products', method: 'GET', server: { acao: '*' } } },
    { id: 'net-cors-missing', cat: 'Network & HTTP', kind: 'rule', solver: 'cors', title: 'CORS: no headers', ask: 'What happens?', labels: CORS, choices: ['read', 'blocked', 'preflight'],
      hint: 'A simple request is always sent. Who decides whether JavaScript may read the answer?',
      why: 'A simple request is <b>always sent</b>: the server receives it and answers. Without <code>Access-Control-Allow-Origin</code> the browser then <b>hides the response</b> from JavaScript ("CORS error"). So CORS is not a server-side protection: a server must still check who is calling (and CSRF still matters).',
      scenario: { origin: 'https://shop.example', url: 'https://api.example/orders', method: 'POST', headers: { 'Content-Type': 'text/plain' }, server: {} } },
    { id: 'net-cors-json', cat: 'Network & HTTP', kind: 'rule', solver: 'cors', title: 'CORS: sending JSON', ask: 'What happens?', labels: CORS, choices: ['read', 'blocked', 'preflight'],
      hint: 'Is "Content-Type: application/json" one of the simple content types?',
      why: '<code>Content-Type: application/json</code> is not one of the three "simple" types (form data and plain text), so the browser first sends a <b>preflight</b> <code>OPTIONS</code> request. The server allows the origin but not the <code>Content-Type</code> header, so the preflight fails and the POST is never sent. Fix: <code>Access-Control-Allow-Headers: Content-Type</code>.',
      scenario: { origin: 'https://shop.example', url: 'https://api.example/cart', method: 'POST', headers: { 'Content-Type': 'application/json' }, server: { acao: 'https://shop.example', acam: 'GET, POST' } } },
    { id: 'net-cors-credentials', cat: 'Network & HTTP', kind: 'rule', solver: 'cors', title: 'CORS with cookies', ask: 'The request sends cookies. Can the page read the answer?', labels: CORS, choices: ['read', 'blocked', 'preflight'],
      hint: 'Is "*" allowed when credentials are included?',
      why: 'With <code>credentials: "include"</code> the browser sends cookies, so the rules get stricter: <code>Access-Control-Allow-Origin</code> must be the <b>exact</b> origin (never <code>*</code>) and <code>Access-Control-Allow-Credentials: true</code> must be present. Otherwise any site could read a logged-in user\'s data.',
      scenario: { origin: 'https://shop.example', url: 'https://api.example/me', method: 'GET', credentials: true, server: { acao: '*', acac: 'true' } } },
    { id: 'net-cors-port', cat: 'Network & HTTP', kind: 'rule', solver: 'cors', title: 'Is localhost:3000 the same as localhost:8080?', ask: 'The dev server calls the API. What happens?', labels: CORS, choices: ['read', 'blocked', 'preflight'],
      hint: 'An origin is scheme + host + PORT.',
      why: 'An <b>origin</b> is scheme + host + port. <code>http://localhost:3000</code> and <code>http://localhost:8080</code> differ in port, so they are different origins and CORS applies. That is why front-end dev servers use a <b>proxy</b> (or the API sends CORS headers in development).',
      scenario: { origin: 'http://localhost:3000', url: 'http://localhost:8080/api/todos', method: 'GET', server: {} } },
    // ------------------------------------------------------------ HTTP caching
    { id: 'net-cache-fresh', cat: 'Network & HTTP', kind: 'rule', solver: 'cache', title: 'Caching: max-age', ask: 'What does the browser do?', labels: CACHE, choices: ['cache', '304', 'download'],
      hint: 'Is the copy younger than max-age?',
      why: '<code>max-age=3600</code> makes the response <b>fresh</b> for an hour. While fresh, the browser uses its copy without asking the server at all: the fastest request is the one that is never sent.',
      scenario: { file: 'logo.png', cacheControl: 'max-age=3600', etag: true, age: 60, changed: false } },
    { id: 'net-cache-nocache', cat: 'Network & HTTP', kind: 'rule', solver: 'cache', title: 'Caching: no-cache', ask: 'What does the browser do?', labels: CACHE, choices: ['cache', '304', 'download'],
      hint: 'no-cache does not mean "do not store".',
      why: '<code>no-cache</code> means "store it, but <b>check with the server before every use</b>". With an <code>ETag</code> the check is cheap: <code>If-None-Match</code> → <code>304 Not Modified</code> with no body. Typical for HTML pages, which must always be up to date. To really forbid storing, use <code>no-store</code>.',
      scenario: { file: 'index.html', cacheControl: 'no-cache', etag: true, age: 5, changed: false } },
    { id: 'net-cache-stale', cat: 'Network & HTTP', kind: 'rule', solver: 'cache', title: 'Caching: a stale copy that changed', ask: 'What does the browser do?', labels: CACHE, choices: ['cache', '304', 'download'],
      hint: 'The copy is older than max-age, and the file has changed.',
      why: 'After 120s the copy is <b>stale</b> (max-age was 60), so the browser revalidates with <code>If-None-Match</code>. The file has changed, so the server answers <code>200</code> with the new version (and a new ETag).',
      scenario: { file: 'news.json', cacheControl: 'max-age=60', etag: true, age: 120, changed: true } },
    { id: 'net-cache-hashed', cat: 'Network & HTTP', kind: 'rule', solver: 'cache', title: 'Caching: hashed file names', ask: 'A day later, what does the browser do?', labels: CACHE, choices: ['cache', '304', 'download'],
      hint: 'max-age=31536000 is one year.',
      why: 'Build tools put a <b>hash of the content</b> in file names (<code>app.3f9a1c.js</code>). The file can then be cached "forever" (<code>max-age=31536000, immutable</code>): a new version gets a new name, which the (never cached) HTML points to. This is the standard caching strategy for JS, CSS and images.',
      scenario: { file: 'app.3f9a1c.js', cacheControl: 'public, max-age=31536000, immutable', etag: true, age: 86400, changed: false } },
    // ------------------------------------------------------------ cookies, CSRF
    { id: 'sec-cookie-httponly', cat: 'Security', kind: 'rule', solver: 'cookie', title: 'HttpOnly cookies', ask: 'Can the page\'s JavaScript read the session cookie?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'What is HttpOnly for?',
      why: '<code>HttpOnly</code> hides a cookie from <code>document.cookie</code>. Session cookies should always be HttpOnly: if an attacker manages to run script on the page (XSS), they still cannot steal the session. The browser keeps sending it to the server.',
      scenario: { question: 'read', cookie: { name: 'session', httpOnly: true, secure: true, sameSite: 'Lax' } } },
    { id: 'sec-csrf-lax', cat: 'Security', kind: 'rule', solver: 'cookie', title: 'CSRF and SameSite=Lax', ask: 'An evil site auto-submits a form to the bank. In Chrome or Edge, is the session cookie sent?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'SameSite is not set. What does Chrome use when it is missing?',
      why: '<b>CSRF</b> (cross-site request forgery): another site makes your browser send a request to the bank, hoping your cookie comes with it. Chrome and Edge treat a cookie without <code>SameSite</code> as <code>SameSite=Lax</code> (since 2020): the cookie is not sent on a cross-site POST, so the forged transfer arrives logged out. Firefox and Safari do not apply that default, so <b>always set <code>SameSite=Lax</code> (or Strict) yourself</b>, and still add a CSRF token or check the <code>Origin</code> header on the server.',
      scenario: { question: 'sent', kind: 'form', from: 'https://evil.example/win-a-prize', target: 'https://bank.example/transfer', cookie: { name: 'session', secure: true, httpOnly: true } } },
    { id: 'sec-lax-link', cat: 'Security', kind: 'rule', solver: 'cookie', title: 'SameSite=Lax and links', ask: 'You click a link to the bank on a news site. Is the cookie sent?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'Lax allows one kind of cross-site request.',
      why: '<code>Lax</code> still sends the cookie on <b>top-level GET navigations</b>, so following a link to the bank keeps you logged in. That is why GET requests must never change data: a link (or an image) could trigger them.',
      scenario: { question: 'sent', kind: 'navigation', from: 'https://news.example/article', target: 'https://bank.example/account', cookie: { name: 'session', secure: true, httpOnly: true, sameSite: 'Lax' } } },
    { id: 'sec-samesite-none', cat: 'Security', kind: 'rule', solver: 'cookie', title: 'SameSite=None', ask: 'A widget on another site calls the bank with fetch. Is the cookie sent?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'None means "send it on every request". What else must it have?',
      why: '<code>SameSite=None; Secure</code> sends the cookie on every cross-site request: needed for embedded widgets and some single sign-on flows, but it brings back the CSRF risk, so those endpoints need CSRF tokens. <code>None</code> without <code>Secure</code> is rejected by the browser.',
      scenario: { question: 'sent', kind: 'fetch', from: 'https://blog.example', target: 'https://bank.example/widget', cookie: { name: 'widget', secure: true, sameSite: 'None' } } },
    { id: 'sec-cookie-path', cat: 'Security', kind: 'rule', solver: 'cookie', title: 'Cookie Path', ask: 'The bank\'s own page /home loads data. Is the admin cookie sent?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'Compare the request path with Path=…',
      why: '<code>Path=/admin</code> limits a cookie to URLs under <code>/admin</code>. (It is not a security boundary: pages under other paths of the same origin can still read it through an iframe; use separate subdomains for real isolation.)',
      scenario: { question: 'sent', kind: 'fetch', from: 'https://bank.example/home', target: 'https://bank.example/home/data', cookie: { name: 'admin', secure: true, httpOnly: true, sameSite: 'Strict', path: '/admin' } } },
    // ------------------------------------------------------------ XSS and CSP (these really run)
    { id: 'sec-xss-img', cat: 'Security', kind: 'measure', title: 'XSS: innerHTML with an image', ask: 'A comment is shown with innerHTML. Does the attacker\'s code run?', labels: XSS, choices: ['runs', 'safe'],
      hint: '<script> tags added with innerHTML do not run. But do event attributes?',
      why: 'Assigning user text to <code>innerHTML</code> parses it as HTML. <code>&lt;script&gt;</code> tags inserted this way do not run, but <b>event-handler attributes do</b>: the broken image fires <code>onerror</code>, and the attacker\'s code runs with full access to the page (cookies without HttpOnly, the DOM, requests as the user). That is <b>XSS</b>.',
      html: `<div id="comment"></div>
<script>
  const userText = '<img src="x" onerror="window.hacked = true">';
  document.getElementById("comment").innerHTML = userText;
</script>`,
      measure: async (d, w) => { await wait(300); return w.hacked ? 'runs' : 'safe'; } },
    { id: 'sec-xss-text', cat: 'Security', kind: 'measure', title: 'XSS: textContent', ask: 'Now the comment is shown with textContent. Does the code run?', labels: XSS, choices: ['runs', 'safe'],
      hint: 'textContent never parses HTML.',
      why: '<code>textContent</code> (and React\'s <code>{text}</code>) treat the value as <b>text</b>: the angle brackets are shown, nothing is parsed, nothing runs. Use text APIs for user content; if you really need HTML, sanitize it (DOMPurify) and avoid <code>dangerouslySetInnerHTML</code> with raw input.',
      html: `<div id="comment"></div>
<script>
  const userText = '<img src="x" onerror="window.hacked = true">';
  document.getElementById("comment").textContent = userText;
</script>`,
      measure: async (d, w) => { await wait(300); return w.hacked ? 'runs' : 'safe'; } },
    { id: 'sec-csp', cat: 'Security', kind: 'measure', title: 'Content-Security-Policy', ask: 'The page has a CSP that only allows scripts from its own files. Does the inline script run?', labels: { runs: 'Yes, it runs', safe: 'No, the browser blocks it' }, choices: ['runs', 'safe'],
      hint: 'script-src \'self\' allows script files from the same origin. What about inline code?',
      why: 'A <b>Content-Security-Policy</b> tells the browser which scripts may run. <code>script-src \'self\'</code> allows only script <b>files</b> from the site\'s own origin, so inline <code>&lt;script&gt;</code> blocks and <code>onerror=</code> attributes are blocked: even if an attacker injects HTML, their code does not run. It is the second line of defence after escaping.',
      head: `<meta http-equiv="Content-Security-Policy" content="script-src 'self'">`,
      html: `<p>Hello</p>
<script>window.ran = true;</script>`,
      measure: async (d, w) => { await wait(200); return w.ran ? 'runs' : 'safe'; } },
    // ------------------------------------------------------------ loading performance
    { id: 'perf-script-order', cat: 'Web performance', kind: 'rule', solver: 'load', title: 'async vs defer: the order', ask: 'In which order do the scripts run?',
      choices: ['a.js, b.js, c.js, d.js', 'a.js, d.js, c.js, b.js', 'd.js, a.js, c.js, b.js', 'a.js, c.js, d.js, b.js'],
      hint: 'A normal script stops the parser. Async runs when it arrives. Defer runs after parsing, in order.',
      why: '<b>Normal</b> scripts stop the parser until they have downloaded and run (and they wait for the CSS above them). <b>async</b> scripts run as soon as they arrive, in no particular order, even after <code>DOMContentLoaded</code>. <b>defer</b> scripts run after the HTML is parsed, in document order, before <code>DOMContentLoaded</code>. Use <code>defer</code> (or <code>type="module"</code>, deferred by default) for app code and <code>async</code> for independent scripts such as analytics.',
      scenario: { question: 'order', tags: [{ name: 'styles.css', type: 'css', download: 200 }, { name: 'a.js', type: 'sync', download: 300 }, { name: 'b.js', type: 'async', download: 600 }, { name: 'c.js', type: 'defer', download: 50 }, { name: 'd.js', type: 'async', download: 100 }] } },
    { id: 'perf-css-blocks', cat: 'Web performance', kind: 'rule', solver: 'load', title: 'CSS blocks the script after it', ask: 'main.js downloads in 50ms. Does it have to wait for styles.css (400ms)?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'A normal script might read styles (getComputedStyle), so…',
      why: 'A normal script might read computed styles, so the browser will not run it until every stylesheet <b>above</b> it has loaded. A slow stylesheet in the head therefore delays both the first paint and the scripts after it. Keep critical CSS small, inline the most important part, and load scripts with <code>defer</code>.',
      scenario: { question: 'waits', target: 'main.js', tags: [{ name: 'styles.css', type: 'css', download: 400 }, { name: 'main.js', type: 'sync', download: 50 }] } },
    { id: 'perf-cls', cat: 'Web performance', kind: 'measure', title: 'Layout shift: an image without a size', ask: 'When the image finishes loading, does the text below it move?', labels: { jumps: 'Yes, the text jumps down', stays: 'No, it stays where it is' }, choices: ['jumps', 'stays'],
      hint: 'Before it loads, how much space does an image with no size take?',
      intro: 'The script sets the image\'s <code>src</code> after the page has been laid out, like a slow network would.',
      why: 'Until it loads, an image with no size takes no space. When it arrives the browser must make room, and everything below <b>jumps</b>: a layout shift, measured by <b>CLS</b> (Cumulative Layout Shift, one of the Core Web Vitals). It makes people click the wrong thing.',
      html: `<h3>News</h3>
<img id="hero" alt="photo">
<p id="text">The first paragraph of the article.</p>`,
      measure: shift },
    { id: 'perf-cls-fixed', cat: 'Web performance', kind: 'measure', title: 'Layout shift: reserve the space', ask: 'Now the image has width and height attributes. Does the text move?', labels: { jumps: 'Yes, the text jumps down', stays: 'No, it stays where it is' }, choices: ['jumps', 'stays'],
      hint: 'Can the browser work out the image\'s height before it loads?',
      intro: 'Same page, but the image box has a size before the file arrives.',
      why: 'With <code>width</code> + <code>height</code> attributes (or CSS <code>aspect-ratio</code>) the browser knows the box size before the file arrives and reserves the space: nothing moves, CLS stays 0. Do the same for ads, embeds and late content: give them a fixed or minimum height.',
      html: `<h3>News</h3>
<img id="hero" alt="photo" width="300" height="150" style="display: block;">
<p id="text">The first paragraph of the article.</p>`,
      measure: shift },
    // ------------------------------------------------------------ Git (a small model of a repository; the graph shows the result)
    { id: 'git-ff', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: fast-forward merge', ask: 'What does git log show on main afterwards (newest first)?',
      choices: ['C → B → A', 'Merge feature → C → B → A', 'A'],
      hint: 'Did main get any new commit of its own while feature was being worked on?',
      why: 'A branch is only a <b>pointer</b> to a commit. When main has not moved since feature branched off, merging needs no new commit: git just moves main forward to C (a <b>fast-forward</b>). <code>git merge --no-ff</code> forces a merge commit if you want the branch to stay visible in history.',
      scenario: { commands: ['git switch -c feature', 'git commit -m "B"', 'git commit -m "C"', 'git switch main', 'git merge feature'], branch: 'main' } },
    { id: 'git-merge', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: a merge commit', ask: 'What does git log show on main afterwards (newest first)?',
      choices: ['Merge feature → C → B → A', 'C → B → A', 'B → C → A'],
      hint: 'Both branches got a commit after they split.',
      why: 'When both branches have new commits, <code>git merge</code> creates a <b>merge commit</b> with two parents, keeping both lines of history exactly as they happened. (Conflicts happen when both changed the same lines; you fix the file and commit.)',
      scenario: { commands: ['git switch -c feature', 'git commit -m "B"', 'git switch main', 'git commit -m "C"', 'git merge feature'], branch: 'main' } },
    { id: 'git-rebase', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: rebase rewrites commits', ask: 'What does git log show on feature after the rebase?',
      choices: ["B' → C → A", 'B → C → A', 'Merge main → C → B → A'],
      hint: 'Rebase replays the commits; are they the same commits?',
      why: '<code>git rebase main</code> replays feature\'s commits on top of main, giving a <b>straight</b> history without a merge commit. But the replayed commits are <b>new</b> commits (new ids: B\'), and the old B is abandoned. That is why you never rebase commits that others have already pulled: their history would no longer match yours. Rebase your own local branch; merge shared ones.',
      scenario: { commands: ['git switch -c feature', 'git commit -m "B"', 'git switch main', 'git commit -m "C"', 'git switch feature', 'git rebase main'], branch: 'feature' } },
    { id: 'git-reset', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: reset --hard', ask: 'Commit C was a mistake. What does git log show on main after the reset?',
      choices: ['B → A', 'Revert C → C → B → A', 'C → B → A'],
      hint: 'reset moves the branch pointer.',
      why: '<code>git reset --hard HEAD~1</code> moves the branch pointer back one commit and throws away the changes: C disappears from the branch (history is rewritten; <code>git reflog</code> can still find it for a while). Fine for local commits, dangerous for pushed ones.',
      scenario: { commands: ['git commit -m "B"', 'git commit -m "C"', 'git reset --hard HEAD~1'], branch: 'main' } },
    { id: 'git-revert', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: revert on a shared branch', ask: 'C is already pushed. What does git log show after git revert?',
      choices: ['Revert C → C → B → A', 'B → A', 'C → B → A'],
      hint: 'revert adds instead of removing.',
      why: '<code>git revert</code> creates a <b>new commit</b> that undoes C. Nothing is rewritten, so everyone else\'s history still matches: the safe way to undo something on <code>main</code> or any pushed branch.',
      scenario: { commands: ['git commit -m "B"', 'git commit -m "C"', 'git revert HEAD'], branch: 'main' } },
    { id: 'git-detached', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: detached HEAD', ask: 'After switching back to main, is commit X on any branch?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'Which branch pointer moved when X was committed?',
      why: 'Checking out a <b>commit</b> (not a branch) gives a <b>detached HEAD</b>: new commits are made, but no branch points to them. After switching away, nothing references X, so it is lost (git eventually garbage-collects it). Fix: <code>git switch -c experiment</code> before or right after committing.',
      scenario: { commands: ['git commit -m "B"', 'git checkout A', 'git commit -m "X"', 'git switch main'], question: 'reachable', target: 'X' } },
    { id: 'git-cherry', cat: 'Git & tools', kind: 'rule', solver: 'git', title: 'Git: cherry-pick a fix', ask: 'What does git log show on main after the cherry-pick?',
      choices: ["Fix' → C → A", 'Fix → C → A', 'C → Fix → A'],
      hint: 'cherry-pick copies one commit.',
      why: '<code>git cherry-pick</code> copies the <b>change</b> of one commit onto the current branch as a new commit (Fix\'), without merging the rest of the branch. Typical use: bring an urgent fix to a release branch.',
      scenario: { commands: ['git switch -c hotfix', 'git commit -m "Fix"', 'git switch main', 'git commit -m "C"', 'git cherry-pick hotfix'], branch: 'main' } },
    // ------------------------------------------------------------ npm version ranges
    { id: 'npm-caret', cat: 'Git & tools', kind: 'rule', solver: 'semver', title: 'npm: the caret range', ask: 'Will npm install accept this version?', labels: YESNO, choices: ['yes', 'no'],
      hint: '^ allows everything except a new major version.',
      why: '<code>^</code> (the default when you <code>npm install</code> a package) accepts new <b>minor</b> and <b>patch</b> versions, which by semver promise not to break anything, but never a new major version.',
      scenario: { pkg: 'lodash', range: '^4.17.0', version: '4.18.1' } },
    { id: 'npm-major', cat: 'Git & tools', kind: 'rule', solver: 'semver', title: 'npm: a new major version', ask: 'Will npm install accept this version?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'Which part of the version changed?',
      why: 'A new <b>major</b> version (18 → 19) may contain breaking changes, so <code>^18.2.0</code> never installs it. You upgrade on purpose: read the migration guide, run the codemods, and run your tests.',
      scenario: { pkg: 'react', range: '^18.2.0', version: '19.0.0' } },
    { id: 'npm-tilde', cat: 'Git & tools', kind: 'rule', solver: 'semver', title: 'npm: the tilde range', ask: 'Will npm install accept this version?', labels: YESNO, choices: ['yes', 'no'],
      hint: '~ allows only fixes.',
      why: '<code>~1.4.2</code> accepts only <b>patch</b> releases (1.4.x). Use it for packages you do not trust to keep minor releases compatible.',
      scenario: { pkg: 'left-pad', range: '~1.4.2', version: '1.5.0' } },
    { id: 'npm-zero', cat: 'Git & tools', kind: 'rule', solver: 'semver', title: 'npm: caret on a 0.x package', ask: 'Will npm install accept this version?', labels: YESNO, choices: ['yes', 'no'],
      hint: 'Before 1.0.0, semver treats the minor number as "major".',
      why: 'Before 1.0.0 anything may change, so npm treats the <b>minor</b> number like a major one: <code>^0.2.3</code> accepts 0.2.x only. Watch out for this with young packages.',
      scenario: { pkg: 'tiny-lib', range: '^0.2.3', version: '0.3.0' } },
  ];
})();

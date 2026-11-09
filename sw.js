/*
 * JS Engine Lab â€” service worker: keeps every file of the app in a cache, so it works offline
 * once it has been opened over http(s) (for example with "npx serve" or GitHub Pages).
 * Change VERSION whenever you change the files, so visitors get the new version.
 */
const VERSION = 'js-engine-lab-v45';
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon.svg",
  "css/fonts.css",
  "css/styles.css",
  "js/css-tasks.js",
  "js/css-lab.js",
  "js/web-tasks.js",
  "js/web-lab.js",
  "js/real-world-tasks.js",
  "js/ts-tasks.js",
  "js/ts-lab.js",
  "js/test-tasks.js",
  "js/test-lab.js",
  "js/projects.js",
  "js/frontend-map.js",
  "js/pixels.js",
  "js/perf-lab.js",
  "js/databases.js",
  "js/deployment.js",
  "js/process.js",
  "js/devtools.js",
  "js/interview-prep.js",
  "js/companies-data.js",
  "js/corporate.js",
  "js/terminal.js",
  "js/roles-pay.js",
  "js/topic-tab.js",
  "js/ai-work.js",
  "js/tax-money.js",
  "js/open-source.js",
  "js/earn-more.js",
  "js/freelancing.js",
  "js/design-basics.js",
  "js/stay-current.js",
  "js/health-career.js",
  "js/business.js",
  "js/expression-tree.js",
  "js/js-extras-tasks.js",
  "js/get-hired.js",
  "vendor/typescript.js",
  "js/practice.js",
  "js/app.js",
  "js/app-config.js",
  "js/challenges.js",
  "js/engine/browser.js",
  "js/engine/builtins.js",
  "js/engine/classes.js",
  "js/engine/core.js",
  "js/engine/evalviz.js",
  "js/engine/expressions.js",
  "js/engine/extras.js",
  "js/engine/members.js",
  "js/engine/methods.js",
  "js/engine/node.js",
  "js/engine/nodeplus.js",
  "js/engine/observers.js",
  "js/engine/platform.js",
  "js/engine/program.js",
  "js/engine/promises.js",
  "js/engine/protos.js",
  "js/engine/statements.js",
  "js/engine/threads.js",
  "js/engine/typescript.js",
  "js/examples.js",
  "js/explain.js",
  "js/interview.js",
  "js/interview-extra.js",
  "js/interview-engine.js",
  "js/interview-design.js",
  "js/interview-more.js",
  "js/lessons.js",
  "js/write-it.js",
  "vendor/acorn.js",
  "vendor/codemirror/closebrackets.min.js",
  "vendor/codemirror/codemirror.min.css",
  "vendor/codemirror/codemirror.min.js",
  "vendor/codemirror/javascript.min.js",
  "vendor/codemirror/matchbrackets.min.js",
  "vendor/fonts/Inter-400.woff2",
  "vendor/fonts/Inter-500.woff2",
  "vendor/fonts/Inter-600.woff2",
  "vendor/fonts/Inter-700.woff2",
  "vendor/fonts/JetBrainsMono-400.woff2",
  "vendor/fonts/JetBrainsMono-600.woff2",
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// cached files load instantly; the network copy refreshes the cache in the background
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
    return cached || fresh;
  }));
});

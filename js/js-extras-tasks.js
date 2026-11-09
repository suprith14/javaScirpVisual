/*
 * JS Engine Lab — more 🏋️ Practice tasks:
 *  · 📅 Dates: Temporal — the new date/time API (in Chrome 144+, Firefox 139+). These really run in the browser.
 *  · 🟩 Node.js: streams & crypto — Web Streams and Web Crypto (the same APIs Node has as globals) really run here;
 *    the Node-only ones (fs streams, pipeline, backpressure, scrypt, timingSafeEqual) are "which one?" tasks.
 * Running tasks print their answer with show(); errors are shown by their name (e.g. RangeError).
 */
(function () {
  'use strict';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // the page each running task loads: show(v) prints the answer; an uncaught error prints its name
  const HEAD = `<script>
  window.show = v => { const o = document.getElementById("out"); o.textContent = String(v); o.dataset.done = "1"; };
  window.addEventListener("error", e => show(e.error ? e.error.name : "Error"));
  window.addEventListener("unhandledrejection", e => show(e.reason && e.reason.name || "Error"));
<\/script>`;
  const page = code => `<pre id="out">running…</pre>\n<script type="module">\n${code.trim()}\n<\/script>`;
  const measure = d => new Promise(resolve => {
    let tries = 0;
    (function poll() {
      const o = d.getElementById('out');
      if (o && o.dataset.done) return resolve(o.textContent);
      if (++tries > 150) return resolve(null);
      setTimeout(poll, 20);
    })();
  });
  const running = (id, cat, icon, title, ask, choices, code, why, scene, hint, extra) => Object.assign({
    id, cat, icon, kind: 'measure', title, ask, choices, head: HEAD, html: page(code), measure, why, scene, hint,
    intro: 'This code really runs in your browser; the answer is what it prints.',
  }, extra || {});

  const T = 'Dates: Temporal', TI = '📅';
  const needsTemporal = { intro: 'This code really runs in your browser (Temporal is built into Chrome / Edge 144+ and Firefox 139+). If your browser is older, it prints ReferenceError.' };
  const TEMPORAL = [
    running('tp-add-month', T, TI, 'Add a month to 31 January', 'What does it print?', ['2026-02-28', '2026-03-03', 'RangeError'], `
const d = Temporal.PlainDate.from("2026-01-31");
show(d.add({ months: 1 }).toString());`,
    'Temporal clamps to the last valid day by default (overflow: "constrain"), so it is 28 February. The old Date with setMonth(1) rolls over to 3 March, a classic billing-date bug. Pass { overflow: "reject" } to get a RangeError instead.',
    'Subscriptions: the next billing date after 31 January.', 'What should "one month after 31 January" be?', needsTemporal),
    running('tp-immutable', T, TI, 'Temporal objects never change', 'What does it print?', ['2026-05-10', '2026-05-11'], `
const d = Temporal.PlainDate.from("2026-05-10");
d.add({ days: 1 });
show(d.toString());`,
    'Every Temporal object is immutable: add() returns a new date and leaves d alone. Here the result is thrown away, so d is still 10 May. (Date\'s setDate changes the object itself, which causes shared-state bugs.) Write const next = d.add({ days: 1 }).',
    'A date picker: "next day" seems to do nothing.', 'Does add() change d, or return something new?', needsTemporal),
    running('tp-month', T, TI, 'Months start at 1', 'What does it print?', ['2', '3'], `
show(Temporal.PlainDate.from("2026-03-15").month);`,
    'In Temporal, March is 3. In the old Date, getMonth() returns 2 for March (months count from 0), which is behind countless off-by-one bugs.',
    'A report groups orders by month.', 'Does Temporal count months from 0 or from 1?', needsTemporal),
    running('tp-until', T, TI, 'The time between two dates', 'What does it print?', ['P2M', 'P59D', 'P1M28D'], `
const start = Temporal.PlainDate.from("2026-01-01");
show(start.until("2026-03-01").toString());`,
    'until() returns a Duration in ISO format. For dates it counts in days unless you ask for bigger units: 31 + 28 = 59 days, "P59D". start.until(end, { largestUnit: "month" }) gives "P2M".',
    'A trial page shows "days left".', 'What is the largest unit until() uses by default for dates?', needsTemporal),
    running('tp-dst', T, TI, 'An hour across a clock change', 'In New York, clocks jump from 2:00 to 3:00 on 8 March 2026. What does it print?', ['2026-03-08T02:30:00-05:00[America/New_York]', '2026-03-08T03:30:00-04:00[America/New_York]', '2026-03-08T02:30:00-04:00[America/New_York]'], `
const t = Temporal.ZonedDateTime.from("2026-03-08T01:30[America/New_York]");
show(t.add({ hours: 1 }).toString());`,
    'ZonedDateTime knows the time zone\'s rules. 2:30 does not exist that night (the clock skips from 2:00 to 3:00), so one real hour after 1:30 EST is 3:30 EDT, and the offset changes from -05:00 to -04:00. Use ZonedDateTime for anything a person sees on a clock; PlainDate / PlainTime when there is no time zone.',
    'Reminders: a meeting 1 hour after 1:30 AM on the night clocks change.', 'Does 2:30 exist in New York that night?', needsTemporal),
    running('tp-invalid', T, TI, 'An impossible date', 'What does it print?', ['2026-03-02', '2026-02-28', 'RangeError'], `
show(Temporal.PlainDate.from("2026-02-30").toString());`,
    'Temporal rejects an invalid date string with a RangeError instead of guessing. (new Date(2026, 1, 30) quietly becomes 2 March.) Catch the error to show "invalid date" in a form.',
    'A form accepts a date typed by the user.', 'Does Temporal guess, or refuse?', needsTemporal),
    running('tp-equals', T, TI, 'Comparing two dates', 'What does it print?', ['true, true', 'false, true', 'false, false'], `
const a = Temporal.PlainDate.from("2026-07-01");
const b = Temporal.PlainDate.from("2026-07-01");
show(\`\${a === b}, \${a.equals(b)}\`);`,
    'a and b are two different objects, so === is false (it compares references, like any object). equals() compares the values. To sort, use Temporal.PlainDate.compare(a, b) (-1, 0 or 1).',
    'Highlight today in a calendar.', 'Does === compare the objects or the dates?', needsTemporal),
    running('tp-sort', T, TI, 'Sorting dates', 'What does it print?', ['2026-02-15, 2026-09-30, 2026-12-01', '2026-12-01, 2026-02-15, 2026-09-30', 'TypeError'], `
const dates = ["2026-12-01", "2026-02-15", "2026-09-30"]
  .map(s => Temporal.PlainDate.from(s));
dates.sort(Temporal.PlainDate.compare);
show(dates.join(", "));`,
    'Temporal.PlainDate.compare is a ready-made compare function for sort(): earliest first. join() calls toString() on each date, which gives the ISO form.',
    'An order history sorted by delivery date.', 'What does compare return, and what does sort do with it?', needsTemporal),
  ];

  const N = 'Node.js: streams & crypto', NI = '🟩';
  const RUNNING_NODE = [
    running('ns-pull', N, NI, 'How much does a stream read ahead?', 'Nobody reads from the stream yet. What does it print?', ['0', '3', 'never stops'], `
let pulls = 0;
const stream = new ReadableStream({
  pull(controller) { pulls++; controller.enqueue(pulls); },
}, { highWaterMark: 3 });

await new Promise(r => setTimeout(r, 50));
show(pulls);`,
    'A stream fills its queue up to the highWaterMark, then stops calling pull() until someone reads. That is backpressure: a slow reader never makes the source produce unlimited data. Node streams work the same way (highWaterMark, and pause until drained). ReadableStream is the same API in browsers and in Node.',
    'Streaming a big CSV export to the browser without loading it all into memory.', 'When does a stream stop asking the source for more?'),
    running('ns-transform', N, NI, 'A transform stream', 'What does it print?', ['1 chunks: HELLO STREAM', '2 chunks: HELLO STREAM', '12 chunks: HELLO STREAM'], `
const source = new ReadableStream({
  start(c) { c.enqueue("hello "); c.enqueue("stream"); c.close(); },
});
const upper = new TransformStream({
  transform(chunk, c) { c.enqueue(chunk.toUpperCase()); },
});
let count = 0, text = "";
for await (const chunk of source.pipeThrough(upper)) { count++; text += chunk; }
show(\`\${count} chunks: \${text}\`);`,
    'Streams move data chunk by chunk: each chunk goes through transform() as it arrives, so the work starts before all the data is there. Two chunks in, two chunks out. This is how fetch() response bodies, compression (CompressionStream) and AI token streaming work.',
    'Showing an AI answer word by word as it streams in.', 'Is the data processed all at once, or chunk by chunk?'),
    running('ns-uuid', N, NI, 'crypto.randomUUID()', 'What does it print?', ['32 chars, version 1', '36 chars, version 4', '36 chars, version 7'], `
const id = crypto.randomUUID();
show(\`\${id.length} chars, version \${id[14]}\`);`,
    'randomUUID() makes a random version-4 UUID: 36 characters (32 hex digits + 4 dashes), with "4" as the version digit. It uses a secure random generator, unlike Math.random(). The same function exists in Node (crypto.randomUUID).',
    'Giving each cart item a client-side id before it is saved.', 'Which UUID version is the random one?'),
    running('ns-sha', N, NI, 'A SHA-256 hash', 'What does it print?', ['32 hex chars, starts ba7816bf', '64 hex chars, starts ba7816bf', '256 hex chars, starts ba7816bf'], `
const bytes = new TextEncoder().encode("abc");
const hash = await crypto.subtle.digest("SHA-256", bytes);
const hex = [...new Uint8Array(hash)]
  .map(b => b.toString(16).padStart(2, "0")).join("");
show(\`\${hex.length} hex chars, starts \${hex.slice(0, 8)}\`);`,
    'SHA-256 always gives 256 bits = 32 bytes = 64 hex characters, whatever the input size, and the same input always gives the same hash. Used for file checksums, cache keys and integrity checks (Subresource Integrity). Not for passwords: it is too fast to guess.',
    'Checking a downloaded file is not corrupted.', '256 bits is how many bytes, and how many hex digits?'),
  ];

  // Node-only situations ("which one?")
  const NODE_RULES = [
    { id: 'nr-bigfile', title: 'Sending a 2 GB file', q: 'An Express route sends a 2 GB log file to the user.', a: 'stream', choices: [['stream', 'fs.createReadStream(path).pipe(res)'], ['read', 'res.send(await fs.promises.readFile(path))'], ['json', 'Read it, then res.json(lines)']], why: 'readFile loads all 2 GB into memory before sending, for every user at the same time; the server runs out of memory. A read stream sends it in small chunks (64 KB by default), using a little memory no matter how big the file is.' },
    { id: 'nr-pipeline', title: 'pipe() or pipeline()?', q: 'You read a file, gzip it and write it out. One step fails halfway.', a: 'pipeline', choices: [['pipeline', 'await pipeline(read, gzip, write) from "node:stream/promises"'], ['pipe', 'read.pipe(gzip).pipe(write)'], ['try', 'Wrap .pipe() in try / catch']], why: 'With .pipe(), an error in one stream does not close the others: you get leaked file handles and no single place to catch the error. pipeline() connects them, destroys every stream if one fails, and gives one promise to await or catch.' },
    { id: 'nr-drain', title: 'write() returned false', q: 'You write many rows to a file stream in a loop, and writable.write() starts returning false.', a: 'drain', choices: [['drain', 'Stop writing and wait for the "drain" event'], ['ignore', 'Keep writing: it is only a warning'], ['retry', 'Write the same row again']], why: 'false means the stream\'s buffer is full (it passed highWaterMark). The data is still queued, but if you keep writing, memory keeps growing. Wait for "drain", then continue. That is backpressure; pipeline() and for await...of handle it for you.' },
    { id: 'nr-password', title: 'Storing passwords', q: 'Your Node API stores user passwords.', a: 'slow', choices: [['slow', 'A slow password hash: bcrypt, argon2 or crypto.scrypt, with a salt'], ['sha', 'SHA-256 of the password'], ['encrypt', 'Encrypt them with AES and keep the key on the server']], why: 'SHA-256 is fast, so attackers can try billions of guesses per second. Password hashes (bcrypt, argon2, scrypt) are slow on purpose and salted. Encryption can be reversed by anyone who gets the key; passwords should never be recoverable.' },
    { id: 'nr-timing', title: 'Comparing a secret token', q: 'A webhook handler checks the signature header against the expected HMAC.', a: 'safe', choices: [['safe', 'crypto.timingSafeEqual(a, b) on equal-length buffers'], ['eq', 'a === b'], ['includes', 'expected.includes(header)']], why: '=== stops at the first different character, so the response time leaks how much of the signature was right, which lets an attacker guess it piece by piece. timingSafeEqual always takes the same time. (Check the lengths match first: it throws otherwise.)' },
    { id: 'nr-random', title: 'A reset-password token', q: 'You need a token for a password-reset link.', a: 'bytes', choices: [['bytes', 'crypto.randomBytes(32).toString("hex")'], ['math', 'Math.random().toString(36)'], ['time', 'Date.now() plus the user id']], why: 'Math.random() and timestamps are predictable, so an attacker could guess someone\'s reset link. randomBytes uses the operating system\'s secure random generator. Store only a hash of the token, and make it expire.' },
  ];
  if (window.WebLab) window.WebLab.extend('nodex', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
    (s, e) => `<div class="wl-card"><small>the situation (Node.js)</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...TEMPORAL, ...RUNNING_NODE, ...NODE_RULES.map(x => ({
    id: x.id, cat: N, kind: 'rule', solver: 'nodex', icon: NI, kindLabel: 'which one?',
    title: x.title, ask: 'Which one?', scene: 'A Node.js backend (Express / Next.js API routes).',
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'What happens to memory, errors or attackers with each option?', why: esc(x.why), scenario: { q: x.q, a: x.a, why: x.why },
  })));
  window.JS_EXTRAS = { temporal: TEMPORAL, node: RUNNING_NODE, nodeRules: NODE_RULES };
})();

/*
 * JS Engine Lab — practice tasks about what happens under the hood:
 * the prototype chain, the rendering step, garbage collection, parsing and the JIT,
 * numbers and strings inside the engine, and call stack limits.
 * Each one is "predict the output"; stepping through it shows the engine at work.
 */
window.JS_INTERVIEW.push(
  // ------------------------------------------------------------ prototypes
  {
    id: 'proto-lookup', cat: 'Prototypes', title: 'Walking the prototype chain', level: 'Easy', ask: 'Where does each property come from?',
    why: 'When a property is not on the object itself, the engine follows its hidden <code>[[Prototype]]</code> link, then that object\'s link, until it finds the property or reaches <code>null</code> (then the result is <code>undefined</code>). <code>Object.keys</code> and <code>hasOwnProperty</code> see only the object\'s own properties; <code>in</code> looks along the whole chain. Step through: the Heap numbers each object the engine checks.',
    code: `const animal = { eats: true, describe() { return "eats: " + this.eats; } };
const dog = Object.create(animal);
dog.barks = true;
console.log(dog.barks, dog.eats);
console.log(dog.describe());
console.log(Object.keys(dog), "eats" in dog, dog.hasOwnProperty("eats"));
console.log(dog.flies);`,
  },
  {
    id: 'proto-shadow', cat: 'Prototypes', title: 'Writing creates an own property', level: 'Medium', ask: 'What happens to base.count?',
    why: '<code>a.count++</code> <b>reads</b> <code>count</code> through the chain (0, from <code>base</code>), but the <b>write</b> always goes onto <code>a</code> itself. Now <code>a</code> has its own <code>count</code> that hides ("shadows") the one on the prototype. Deleting it makes the prototype\'s value visible again.',
    code: `const base = { count: 0 };
const a = Object.create(base);
a.count++;
console.log(a.count, base.count, a.hasOwnProperty("count"));
delete a.count;
console.log(a.count);`,
  },
  {
    id: 'proto-class', cat: 'Prototypes', title: 'Class methods live on the prototype', level: 'Medium', ask: 'What does d.bark() print after the patch?',
    why: 'A class is mostly syntax for the same mechanism: <code>new Dog()</code> creates an object whose <code>[[Prototype]]</code> is <code>Dog.prototype</code>, and the methods are stored once on that prototype, not copied into each instance. Changing <code>Dog.prototype.bark</code> therefore changes it for every existing dog.',
    code: `class Dog {
  constructor(name) { this.name = name; }
  bark() { return this.name + " barks"; }
}
const d = new Dog("Rex");
console.log(Object.getPrototypeOf(d) === Dog.prototype);
console.log(d.hasOwnProperty("bark"), typeof Dog.prototype.bark);
Dog.prototype.bark = function () { return "patched " + this.name; };
console.log(d.bark());`,
  },
  {
    id: 'proto-instanceof', cat: 'Prototypes', title: 'instanceof checks the chain', level: 'Medium', ask: 'Is b an Animal?',
    why: '<code>x instanceof F</code> walks the prototype chain of <code>x</code> and asks: is <code>F.prototype</code> somewhere on it? Linking <code>Bird.prototype</code> to <code>Animal.prototype</code> (what <code>class Bird extends Animal</code> does for you) makes every bird pass both checks.',
    code: `function Animal() {}
function Bird() {}
Bird.prototype = Object.create(Animal.prototype);
const b = new Bird();
console.log(b instanceof Bird, b instanceof Animal);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(b)) === Animal.prototype);`,
  },
  // ------------------------------------------------------------ the rendering step
  {
    id: 'raf-order', cat: 'Rendering & frames', title: 'Where requestAnimationFrame runs', level: 'Medium', ask: 'Put the five lines in order.',
    why: 'The event loop does: one task → all microtasks → (sometimes) a <b>rendering step</b>. A rAF callback does not go into the task queue: it waits for the next rendering step (about every 16.7ms at 60fps), runs there, and its own microtasks run right after it, before the paint. Step through to see the "Rendering step" and "Style → layout → paint" steps.',
    code: `console.log("1 sync");
requestAnimationFrame(() => {
  console.log("4 frame");
  Promise.resolve().then(() => console.log("5 microtask after the frame callback"));
});
setTimeout(() => console.log("3 timeout"), 0);
Promise.resolve().then(() => console.log("2 microtask"));`,
  },
  {
    id: 'raf-nested', cat: 'Rendering & frames', title: 'rAF inside rAF waits a whole frame', level: 'Hard', ask: 'Does the timeout or frame B come first?',
    why: 'A rAF callback requested <b>during</b> a rendering step waits for the <b>next</b> frame (about 16.7ms later); that is what makes a rAF loop run once per frame. The 0ms timer set in frame A is an ordinary task, so it runs as soon as the rendering step is over, long before the next frame.',
    code: `requestAnimationFrame(() => {
  console.log("frame A");
  requestAnimationFrame(() => console.log("frame B (next frame)"));
  setTimeout(() => console.log("timeout set in frame A"), 0);
});`,
  },
  {
    id: 'raf-starve', cat: 'Rendering & frames', title: 'Microtasks can block painting', level: 'Hard', ask: 'How many microtasks run before the frame?',
    why: 'The browser can only render when the Microtask Queue is <b>empty</b>. Each microtask here queues the next one, so all 50 run before the rendering step. With an endless chain (or a long loop in one task) the page never repaints: it looks frozen. Split long work with <code>setTimeout</code> or <code>scheduler.yield()</code> so frames can happen in between.',
    code: `let n = 0;
function again() { n++; if (n < 50) Promise.resolve().then(again); }
requestAnimationFrame(() => console.log("frame runs after", n, "microtasks"));
Promise.resolve().then(again);`,
  },
  // ------------------------------------------------------------ memory and garbage collection
  {
    id: 'gc-reachable', cat: 'Memory & garbage collection', title: 'Reachable means alive', level: 'Easy', ask: 'After user = null, is the object gone?',
    why: 'The garbage collector frees an object only when nothing can <b>reach</b> it from a root (global variables, the call stack, queued callbacks). Setting <code>user = null</code> removes one reference, but the array still holds the object. Only after the array lets go is it unreachable. Turn on the garbage view (View → Garbage) and watch it turn grey.',
    code: `let user = { name: "Ada" };
const admins = [user];
user = null;
console.log(admins[0].name);
admins.length = 0;
console.log(admins.length);`,
  },
  {
    id: 'gc-closure', cat: 'Memory & garbage collection', title: 'A closure keeps its variables alive', level: 'Medium', ask: 'How long do the big arrays stay in memory?',
    why: 'Each returned function closes over <code>big</code>, so as long as the function is reachable (here: in <code>handlers</code>), its array stays in memory, even if nobody reads it. Event handlers and callbacks you forget to remove are the classic leak. Dropping the functions makes the arrays unreachable.',
    code: `function makeHandler() {
  const big = new Array(5).fill("data"); // imagine 50 MB
  return () => big.length;               // the closure keeps big alive
}
const handlers = [];
for (let i = 0; i < 3; i++) handlers.push(makeHandler());
console.log(handlers.length, handlers[0]());
handlers.length = 0;
console.log("dropped");`,
  },
  {
    id: 'gc-weakmap', cat: 'Memory & garbage collection', title: 'Map vs WeakMap', level: 'Medium', ask: 'Which one keeps the object alive?',
    why: 'A <code>Map</code> holds its keys <b>strongly</b>: the object stays alive as long as the map does (a cache that only grows is a leak). A <code>WeakMap</code> holds keys <b>weakly</b>: when nothing else references the key object, the entry can be collected. That is why WeakMap keys must be objects and it cannot be iterated or sized.',
    code: `const cache = new Map();
let a = { name: "ada" };
cache.set(a, a.name.toUpperCase());
a = null;
console.log(cache.size); // still 1: the Map keeps the object alive
const weak = new WeakMap();
let b = { name: "bob" };
weak.set(b, "BOB");
console.log(weak.get(b), weak.has({ name: "bob" }));
b = null; // nothing keeps it alive now`,
  },
  {
    id: 'gc-interval', cat: 'Memory & garbage collection', title: 'Timers keep callbacks alive', level: 'Easy', ask: 'When can the callback be collected?',
    why: 'A running interval is a root: the browser keeps its callback, and everything the callback closes over, alive until <code>clearInterval</code>. Forgotten intervals (and listeners on long-lived objects) are among the most common leaks in web apps.',
    code: `let ticks = 0;
const id = setInterval(() => {
  ticks++;
  if (ticks === 3) { clearInterval(id); console.log("stopped after", ticks); }
}, 10);`,
  },
  // ------------------------------------------------------------ parsing and the JIT
  {
    id: 'parse-asi-return', cat: 'Parsing & the JIT', title: 'return on its own line', level: 'Medium', ask: 'What does getUser() return?',
    why: 'Before running anything the engine <b>parses</b> the source into a syntax tree. Automatic semicolon insertion adds a <code>;</code> after a <code>return</code> that is followed by a line break, so the function returns <code>undefined</code>; the object below becomes an unreachable block. Keep the <code>{</code> on the same line as <code>return</code>.',
    code: `function getUser() {
  return
  { name: "Ada" };
}
console.log(getUser());`,
  },
  {
    id: 'parse-asi-array', cat: 'Parsing & the JIT', title: 'A line that starts with [', level: 'Hard', ask: 'Why does this crash?',
    why: 'No semicolon is inserted before a line that starts with <code>[</code> or <code>(</code>, so the parser reads <code>[1, 2][3, 4].forEach(...)</code>: an index into the first array (<code>[3, 4]</code> is the comma operator, i.e. index 4), which is <code>undefined</code>, then <code>.forEach</code> on undefined throws.',
    code: `let result = "ok";
try {
  const list = [1, 2]
  [3, 4].forEach(n => console.log(n))
} catch (e) { result = e.name; }
console.log(result);`,
  },
  {
    id: 'parse-first', cat: 'Parsing & the JIT', title: 'Parse first, run later', level: 'Medium', ask: 'Does "inside" ever print?',
    why: 'Code is parsed completely <b>before</b> any of it runs. A syntax error anywhere means nothing in that script runs, not even the lines before the mistake. Here the broken code is built with <code>new Function</code>, so only that part fails (with a <code>SyntaxError</code> while parsing) and the rest of the program carries on. Parsing first is also why function declarations can be called before their line (hoisting).',
    code: `console.log(square(4));
function square(n) { return n * n; }
try {
  new Function("console.log('inside'); let x = ;");
} catch (e) { console.log(e.name); }
console.log("after");`,
  },
  {
    id: 'jit-shapes', cat: 'Parsing & the JIT', title: 'Hidden classes and inline caches', level: 'Hard', ask: 'Which objects share a shape?',
    why: 'Engines give objects with the same properties added in the same order the same <b>hidden class</b> (shape). The read <code>p.x</code> remembers where <code>x</code> lives for each shape it has seen (an <b>inline cache</b>). One shape: fast. Here <code>{ y, x }</code> and <code>{ x, y, z }</code> are different shapes, so the cache becomes polymorphic and optimised code is thrown away (deoptimisation). Turn on View → Engine internals and step through.',
    code: `function point(x, y) { return { x, y }; }
const pts = [point(1, 2), point(3, 4), { y: 6, x: 5 }, { x: 7, y: 8, z: 9 }];
let sum = 0;
for (const p of pts) sum += p.x;
console.log(sum);`,
  },
  {
    id: 'jit-types', cat: 'Parsing & the JIT', title: 'Changing types deoptimises', level: 'Medium', ask: 'What do the three calls return?',
    why: 'A hot function is compiled to fast machine code that <b>assumes</b> the types it has seen (here: two numbers). Calling it with a string or an array breaks that assumption: the engine throws the optimised code away and falls back to the slower interpreter. The result is still correct (<code>+</code> turns the other value into a string), only slower. Keeping a function\'s argument types stable keeps it fast.',
    code: `function add(a, b) { return a + b; }
for (let i = 0; i < 3; i++) add(i, 1); // always numbers
console.log(add(2, 3), add("2", 3), add(2, [3]));`,
  },
  // ------------------------------------------------------------ numbers and strings inside
  {
    id: 'num-float', cat: 'Numbers & strings inside', title: '0.1 + 0.2', level: 'Easy', ask: 'Is 0.1 + 0.2 equal to 0.3?',
    why: 'Every JavaScript number is a 64-bit <b>floating-point</b> value (IEEE 754): 52 bits of digits in base 2. 0.1 and 0.2 have no exact base-2 form (like 1/3 in base 10), so they are stored slightly off, and the sum is 0.30000000000000004. Compare with a tolerance (<code>Number.EPSILON</code>), round for display, or count money in whole cents.',
    code: `console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3, Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);
console.log((0.1 + 0.2).toFixed(2));`,
  },
  {
    id: 'num-safe', cat: 'Numbers & strings inside', title: 'The largest safe integer', level: 'Medium', ask: 'Why are max + 1 and max + 2 equal?',
    why: 'With 53 bits of precision, integers are exact only up to 2⁵³ − 1 (<code>Number.MAX_SAFE_INTEGER</code>). Above it, not every integer can be stored, so neighbours collapse into the same value. <code>BigInt</code> (<code>2n</code>) stores integers of any size exactly; it cannot be mixed with normal numbers, and division drops the fraction (7n / 2n is 3n, -7n / 2n is -3n).',
    code: `const max = Number.MAX_SAFE_INTEGER;
console.log(max);
console.log(max + 1 === max + 2);
console.log(String(BigInt(max) + 2n));
console.log(typeof 10n, String(10n / 3n));`,
  },
  {
    id: 'num-specials', cat: 'Numbers & strings inside', title: 'NaN, -0, Infinity and sort', level: 'Medium', ask: 'Predict each line.',
    why: '<code>9.95</code> is really stored as 9.9499999…, so it rounds down. <code>NaN</code> is the only value not equal to itself (use <code>Number.isNaN</code>); <code>Object.is</code> tells <code>-0</code> and <code>0</code> apart. Dividing by zero gives <code>Infinity</code>. And <code>sort()</code> without a compare function compares <b>strings</b>, so "10" comes before "9".',
    code: `console.log(9.95.toFixed(1));
console.log(NaN === NaN, Number.isNaN(NaN), Object.is(-0, 0));
console.log(1 / 0, -1 / 0);
console.log([10, 9, 1].sort().join(","), [10, 9, 1].sort((a, b) => a - b).join(","));`,
  },
  {
    id: 'str-utf16', cat: 'Numbers & strings inside', title: 'Why "😀".length is 2', level: 'Medium', ask: 'How long is the string?',
    why: 'Strings are stored as <b>UTF-16 code units</b> (16 bits each). Characters outside the basic range, like most emoji, need two units (a "surrogate pair"), so <code>length</code> counts 2 for one emoji. Iterating (<code>[...s]</code>, <code>for…of</code>, <code>Array.from</code>) works in whole code points; <code>split("")</code> and indexing work in units and can cut an emoji in half.',
    code: `const s = "héllo 😀";
console.log(s.length, [...s].length);
console.log("😀".charCodeAt(0), "😀".codePointAt(0));
console.log("😀".split("").length, Array.from("😀").length);`,
  },
  {
    id: 'str-immutable', cat: 'Numbers & strings inside', title: 'Strings cannot change', level: 'Easy', ask: 'Does s[0] = "b" work?',
    why: 'Strings are <b>immutable</b> primitive values: no operation changes a string in place. Assigning to an index is silently ignored (in strict mode it throws). Methods like <code>toUpperCase</code> and <code>+=</code> build a <b>new</b> string; <code>+=</code> then points the variable at it.',
    code: `let s = "cat";
s[0] = "b";
console.log(s);
const t = s.toUpperCase();
console.log(s, t);
s += "s";
console.log(s);`,
  },
  // ------------------------------------------------------------ call stack limits
  {
    id: 'stack-overflow', cat: 'Call stack limits', title: 'Maximum call stack size exceeded', level: 'Easy', ask: 'What error does endless recursion throw?',
    why: 'Each call pushes an execution context onto the call stack, and the stack has a fixed size (around ten thousand frames in browsers; the visualizer stops at 40 so you can watch it). Recursion without a base case keeps pushing until the engine throws a <code>RangeError</code>. It is a normal error, so it can be caught.',
    code: `function down(n) { return down(n + 1); }
try {
  down(0);
} catch (e) {
  console.log(e instanceof RangeError, e.message);
}`,
  },
  {
    id: 'stack-loop', cat: 'Call stack limits', title: 'Turn deep recursion into a loop', level: 'Medium', ask: 'Which version survives a large n?',
    why: 'The recursive version needs one stack frame per number, so a big input overflows the stack. The loop does the same work in a single frame with a running total. Any recursion can be rewritten with a loop and, if needed, your own array as a stack. (JavaScript engines do not do tail-call optimisation, except Safari.)',
    code: `function sumTo(n) { return n === 0 ? 0 : n + sumTo(n - 1); }
function sumToLoop(n) { let total = 0; for (let i = 1; i <= n; i++) total += i; return total; }
console.log(sumTo(10), sumToLoop(10));
let deep;
try { deep = sumTo(100000); } catch (e) { deep = e.name; }
console.log(deep, sumToLoop(100));`,
  },
  {
    id: 'stack-async', cat: 'Call stack limits', title: 'Recursion through setTimeout', level: 'Medium', ask: 'Does the stack grow?',
    why: 'Each <code>countdown</code> call schedules the next one and <b>returns</b>, so its frame is popped before the next call starts from the event loop. The stack never holds more than one <code>countdown</code>, however many rounds there are. This is how long-running work is split without overflowing the stack or freezing the page.',
    code: `function countdown(n) {
  if (n === 0) { console.log("done, the stack never grew"); return; }
  setTimeout(() => countdown(n - 1), 0);
}
countdown(3);
console.log("started");`,
  },

  // ------------------------------------------------------------ write the mechanism yourself (✍️ write-it tasks)
  {
    id: 'w-objectcreate', cat: 'Prototypes', title: 'Build Object.create and a property lookup', level: 'Medium', ask: 'Write objectCreate and lookup.',
    why: '<code>objectCreate(proto)</code>: a constructor function whose <code>prototype</code> is <code>proto</code> makes <code>new F()</code> link the new object to it, which is what <code>Object.create</code> does. <code>lookup</code> does what the engine does on every property read: check the object\'s <b>own</b> properties, then move to <code>Object.getPrototypeOf(o)</code>, until <code>null</code>.',
    code: `function objectCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
function lookup(obj, key) {
  let steps = 0;
  for (let o = obj; o !== null; o = Object.getPrototypeOf(o)) {
    if (Object.keys(o).includes(key)) return key + " found " + steps + " step(s) up";
    steps++;
  }
  return key + " not found";
}
const animal = { eats: true };
const dog = objectCreate(animal);
dog.barks = true;
console.log(Object.getPrototypeOf(dog) === animal, dog.eats);
console.log(lookup(dog, "barks"));
console.log(lookup(dog, "eats"));
console.log(lookup(dog, "flies"));`,
  },
  {
    id: 'w-marksweep', cat: 'Memory & garbage collection', title: 'Write a mark-and-sweep garbage collector', level: 'Hard', ask: 'Write markAndSweep(heap, roots).',
    why: 'This is how real collectors start: <b>mark</b> everything reachable from the roots (here with your own stack, so deep graphs can\'t overflow the call stack), then <b>sweep</b>: whatever was not marked is garbage. Cycles (D ↔ E) are no problem: they are collected as soon as no root reaches them, which is why JavaScript does not leak on circular references the way simple reference counting would.',
    code: `function markAndSweep(heap, roots) {
  const marked = new Set();
  const stack = [...roots];
  while (stack.length) {
    const id = stack.pop();
    if (marked.has(id)) continue;
    marked.add(id);
    for (const ref of heap[id]) stack.push(ref);
  }
  return Object.keys(heap).filter(id => !marked.has(id));
}
const heap = { A: ["B"], B: ["C"], C: [], D: ["E"], E: ["D"], F: [] };
console.log(markAndSweep(heap, ["A"]).join(","));
console.log(markAndSweep(heap, ["A", "D"]).join(","));
console.log(markAndSweep(heap, []).length);`,
  },
  {
    id: 'w-rafloop', cat: 'Rendering & frames', title: 'Write an animation loop with requestAnimationFrame', level: 'Medium', ask: 'Write animate(from, to, frames, onFrame).',
    why: 'An animation updates a value <b>once per frame</b>: each rAF callback draws the next step and asks for the next frame, until the last one. Wrapping it in a Promise lets the caller wait for the end. Because every callback runs in the rendering step, each value is painted, never skipped or drawn twice.',
    code: `function animate(from, to, frames, onFrame) {
  return new Promise(resolve => {
    let i = 0;
    function tick() {
      i++;
      onFrame(from + (to - from) * i / frames);
      if (i < frames) requestAnimationFrame(tick);
      else resolve("done after " + i + " frames");
    }
    requestAnimationFrame(tick);
  });
}
const seen = [];
animate(0, 100, 4, x => seen.push(x)).then(msg => {
  console.log(seen.join(" "));
  console.log(msg);
});
console.log("animation started");`,
  },
  {
    id: 'w-ownstack', cat: 'Call stack limits', title: 'Walk a deep tree with your own stack', level: 'Medium', ask: 'Write sumTree(root) without recursion.',
    why: 'A recursive walk needs one call-stack frame per level, so a deep tree can overflow it. Using an array as <b>your own stack</b> moves that memory to the heap, where it can grow: pop a node, add its value, push its children. This pattern (an explicit stack) works for any recursive algorithm.',
    code: `function sumTree(root) {
  let total = 0;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    total += node.value;
    for (const child of node.children) stack.push(child);
  }
  return total;
}
const small = { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [{ value: 4, children: [] }] }] };
let deep = { value: 1, children: [] };
for (let i = 0; i < 200; i++) deep = { value: 1, children: [deep] }; // deeper than the visualizer's call stack
console.log(sumTree(small), sumTree(deep));`,
  },
  {
    id: 'w-money', cat: 'Numbers & strings inside', title: 'Exact money and real character counts', level: 'Easy', ask: 'Write addMoney and charCount.',
    why: 'Floating-point numbers can\'t store most decimal fractions exactly, so money is safest in <b>whole cents</b>: convert, add integers, convert back. <code>length</code> counts UTF-16 units, so an emoji counts 2; spreading the string (<code>[...s]</code>) iterates by code points, which counts what people see as characters (for most text).',
    code: `function addMoney(a, b) {
  return (Math.round(a * 100) + Math.round(b * 100)) / 100;
}
function charCount(s) {
  return [...s].length;
}
console.log(0.1 + 0.2, addMoney(0.1, 0.2));
console.log(addMoney(19.99, 0.01));
console.log("héllo 😀".length, charCount("héllo 😀"));`,
  },
  {
    id: 'w-shapes', cat: 'Parsing & the JIT', title: 'Objects with one stable shape', level: 'Medium', ask: 'Write makePoint so every point has the same shape.',
    why: 'Engines give objects that get the same properties in the same order the same hidden class, which keeps property reads monomorphic (fast). A factory that always creates every property, in one order, with a default for missing values (<code>?? 0</code>) instead of leaving it out, guarantees that. Turn on View → Engine internals and step through: the read stays monomorphic.',
    views: ['internals'],
    code: `function makePoint(x, y) {
  return { x: x ?? 0, y: y ?? 0 }; // same properties, same order, every time
}
const pts = [makePoint(1, 2), makePoint(3), makePoint(undefined, 5)];
console.log(pts.map(p => Object.keys(p).join(",")).join(" / "));
let sum = 0;
for (const p of pts) sum += p.x + p.y;
console.log(sum);`,
  },
);
// tasks that are clearer with an engine view switched on
['gc-reachable', 'gc-closure', 'gc-weakmap', 'gc-interval'].forEach(id => { const q = window.JS_INTERVIEW.find(x => x.id === id); if (q) q.views = ['gcView']; });
['jit-shapes'].forEach(id => { const q = window.JS_INTERVIEW.find(x => x.id === id); if (q) q.views = ['internals']; });

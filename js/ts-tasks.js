/*
 * JS Engine Lab — TypeScript practice (opened by js/ts-lab.js; the real compiler, strict mode, decides every answer).
 *   answer: 'compiles' (does it type-check?), 'type' (the type of `target`), 'errorline' (the first line with an error)
 */
(function () {
  'use strict';
  const C = { compiles: 'It compiles', error: 'Type error' };
  window.TS_TASKS = [
    // ------------------------------------------------------------ inference and narrowing
    { id: 'ts-literal', cat: 'TypeScript: types & inference', title: 'let vs const inference', ask: 'What type does TypeScript give b?', answer: 'type', target: 'b',
      choices: ['string', '"hi"', 'any'],
      hint: 'A const can never change…',
      why: 'TypeScript <b>infers</b> types from values. A <code>let</code> can be reassigned, so it gets the wide type <code>string</code>; a <code>const</code> never changes, so it gets the <b>literal type</b> <code>"hi"</code>. Literal types are the base of unions like <code>"up" | "down"</code>.',
      code: `let a = "hi";
const b = "hi";` },
    { id: 'ts-union', cat: 'TypeScript: types & inference', title: 'Using a union without narrowing', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'Does a number have toUpperCase?',
      why: 'With a union <code>string | number</code> you may only use what <b>both</b> types have. <code>toUpperCase</code> exists only on strings, so TypeScript reports an error until you <b>narrow</b> the type.',
      code: `function shout(x: string | number) {
  return x.toUpperCase();
}` },
    { id: 'ts-narrow', cat: 'TypeScript: types & inference', title: 'Narrowing with typeof', ask: 'What is the type of x inside the if?', answer: 'type', target: 'inside',
      choices: ['string | number', 'string', 'number'],
      hint: 'After the typeof check, what can x still be?',
      why: 'TypeScript follows your <b>control flow</b>: inside <code>if (typeof x === "string")</code> it knows x is a <code>string</code> (narrowing). Other narrowing tools: <code>in</code>, <code>instanceof</code>, <code>===</code> checks, truthiness, and your own type guards.',
      code: `function shout(x: string | number) {
  if (typeof x === "string") {
    const inside = x;
    return inside.toUpperCase();
  }
  return x.toFixed(1);
}` },
    { id: 'ts-unknown', cat: 'TypeScript: types & inference', title: 'any vs unknown', ask: 'Which line has the type error?', answer: 'errorline', choices: ['line 3', 'line 4', 'no error'],
      hint: 'any switches checking off; unknown forces you to check first.',
      why: '<code>any</code> turns type checking <b>off</b>: anything goes, and mistakes reach runtime. <code>unknown</code> is the safe version: you must narrow it (check its type) before using it. Use <code>unknown</code> for data you do not control, such as <code>JSON.parse</code> results or API responses.',
      code: `const raw = '{"name":"Ada"}';
const a: any = JSON.parse(raw);
const b: unknown = JSON.parse(raw);
console.log(a.name, b.name);` },
    { id: 'ts-optional', cat: 'TypeScript: types & inference', title: 'Optional parameters and strictNullChecks', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'What is s when the caller leaves it out?',
      why: 'An optional parameter <code>s?: string</code> has the type <code>string | undefined</code>. In strict mode TypeScript will not let you read <code>s.length</code> until you handle <code>undefined</code>, which removes a whole class of "cannot read properties of undefined" bugs. Fix: <code>s?.length ?? 0</code>.',
      code: `function len(s?: string) {
  return s.length;
}` },
    { id: 'ts-nullish', cat: 'TypeScript: types & inference', title: 'Optional chaining keeps the type honest', ask: 'What type does n have?', answer: 'type', target: 'n',
      choices: ['number', 'number | undefined', 'any'],
      hint: '?. can give undefined, and ?? replaces it.',
      why: '<code>s?.length</code> is <code>number | undefined</code> (undefined when s is missing); <code>?? 0</code> replaces undefined, so the result is a plain <code>number</code>. TypeScript tracks this exactly.',
      code: `function len(s?: string) {
  const n = s?.length ?? 0;
  return n;
}` },
    // ------------------------------------------------------------ objects and structural typing
    { id: 'ts-excess', cat: 'TypeScript: objects & interfaces', title: 'Excess property check', ask: 'Which line has the type error?', answer: 'errorline', choices: ['line 3', 'line 5', 'no error'],
      hint: 'An object literal written straight into a typed variable is checked strictly.',
      why: 'TypeScript is <b>structural</b>: an object with extra properties is still a <code>User</code> (line 5 is fine). But an object <b>literal</b> assigned directly gets an extra "excess property" check (line 3), because an unknown property there is almost always a typo.',
      code: `interface User { name: string; age: number }
const extra = { name: "Ada", age: 36, admin: true };
const u1: User = { name: "Ada", age: 36, admin: true };
const u2: User = extra;
console.log(u1, u2);` },
    { id: 'ts-readonly', cat: 'TypeScript: objects & interfaces', title: 'readonly', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'What does readonly forbid?',
      why: '<code>readonly</code> forbids assigning to a property after creation (checked only by TypeScript: at runtime the object is still mutable, unlike <code>Object.freeze</code>). Use <code>Readonly&lt;T&gt;</code> / <code>readonly T[]</code> for state that must not be mutated, such as React props and state.',
      code: `interface Point { readonly x: number; readonly y: number }
const p: Point = { x: 1, y: 2 };
p.x = 5;` },
    { id: 'ts-literal-union', cat: 'TypeScript: objects & interfaces', title: 'String literal unions', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'Is "left" one of the allowed values?',
      why: 'A union of string literals is an enum without runtime code: only the listed strings are allowed, and editors autocomplete them. Typos like <code>"left"</code> are caught at compile time.',
      code: `type Direction = "up" | "down";
function move(d: Direction) { return d; }
move("left");` },
    { id: 'ts-discriminated', cat: 'TypeScript: objects & interfaces', title: 'Discriminated unions and exhaustiveness', ask: 'A new shape was added. Which line fails?', answer: 'errorline', choices: ['line 5', 'line 7', 'no error'],
      hint: 'What type is shape in the default branch now?',
      why: 'Each member of a <b>discriminated union</b> has a literal <code>kind</code>; a <code>switch</code> on it narrows the type in each case. The <code>never</code> check in <code>default</code> makes TypeScript fail when a case is <b>missing</b>: here <code>"square"</code> reaches it, so you cannot forget to handle a new variant. Redux actions and reducer state use this pattern.',
      code: `type Shape = { kind: "circle"; r: number } | { kind: "rect"; w: number; h: number } | { kind: "square"; side: number };
function area(shape: Shape) {
  switch (shape.kind) {
    case "circle": return 3.14 * shape.r * shape.r;
    case "rect": return shape.w * shape.h;
    default: {
      const unreachable: never = shape;
      return unreachable;
    }
  }
}` },
    // ------------------------------------------------------------ generics
    { id: 'ts-generic', cat: 'TypeScript: generics & utility types', title: 'Generic functions keep the type', ask: 'What type does x have?', answer: 'type', target: 'x',
      choices: ['number | undefined', 'any', 'number[]', 'unknown'],
      hint: 'T is inferred from the argument.',
      why: 'A <b>generic</b> function has a type parameter <code>T</code> that is filled in at each call: here from <code>[10, 20]</code>, so <code>T = number</code> and the result is <code>number | undefined</code> (the array may be empty). Without generics you would need <code>any</code> and lose the type.',
      code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}
const x = first([10, 20]);` },
    { id: 'ts-constraint', cat: 'TypeScript: generics & utility types', title: 'Generic constraints', ask: 'Which line has the type error?', answer: 'errorline', choices: ['line 4', 'line 5', 'line 6', 'no error'],
      hint: 'Which arguments have a length?',
      why: '<code>T extends { length: number }</code> is a <b>constraint</b>: T can be anything that has a numeric <code>length</code> (strings, arrays, your own objects), but not a number.',
      code: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("hello", "hi");
longest([1, 2], [3]);
longest(10, 20);` },
    { id: 'ts-keyof', cat: 'TypeScript: generics & utility types', title: 'keyof and indexed access', ask: 'What type does age have?', answer: 'type', target: 'age',
      choices: ['number', 'string | number', 'any'],
      hint: 'T[K] looks up the type of property K.',
      why: '<code>K extends keyof T</code> allows only real property names, and <code>T[K]</code> is the type of that property, so <code>get(user, "age")</code> is a <code>number</code> and <code>get(user, "email")</code> would not compile. This is how typed helpers like lodash <code>get</code> or form libraries work.',
      code: `function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Ada", age: 36 };
const age = get(user, "age");` },
    { id: 'ts-partial', cat: 'TypeScript: generics & utility types', title: 'Partial for updates', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'What does Partial do to every property?',
      why: '<code>Partial&lt;User&gt;</code> makes every property optional: perfect for a "patch" with just the fields that change. It is a <b>mapped type</b>: <code>{ [P in keyof T]?: T[P] }</code>. Others: <code>Required</code>, <code>Readonly</code>, <code>Pick</code>, <code>Omit</code>, <code>Record</code>.',
      code: `interface User { id: number; name: string; age: number }
function update(user: User, patch: Partial<User>): User {
  return { ...user, ...patch };
}
update({ id: 1, name: "Ada", age: 36 }, { age: 37 });` },
    { id: 'ts-omit', cat: 'TypeScript: generics & utility types', title: 'Omit a secret field', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'Is password part of PublicUser?',
      why: '<code>Omit&lt;User, "password"&gt;</code> builds a type without that field, so the object literal with a password is rejected (excess property). Deriving types from one source (<code>User</code>) keeps them in sync when fields change.',
      code: `interface User { id: number; name: string; password: string }
type PublicUser = Omit<User, "password">;
const shown: PublicUser = { id: 1, name: "Ada", password: "hunter2" };` },
    { id: 'ts-returntype', cat: 'TypeScript: generics & utility types', title: 'ReturnType: types from code', ask: 'What type does u have?', answer: 'type', target: 'u',
      choices: ['{ id: number; name: string; }', 'any', 'object'],
      hint: 'ReturnType reads the return type of a function type.',
      why: '<code>typeof makeUser</code> takes the type of a value, and <code>ReturnType</code> extracts what it returns, using <code>infer</code> inside a conditional type. Deriving types from code avoids writing them twice.',
      code: `function makeUser(name: string) {
  return { id: 1, name };
}
type User = ReturnType<typeof makeUser>;
const u: User = makeUser("Ada");` },
    { id: 'ts-record', cat: 'TypeScript: generics & utility types', title: 'Record needs every key', ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'Record<"light" | "dark", string> requires which keys?',
      why: '<code>Record&lt;K, V&gt;</code> is an object with exactly the keys K, each of type V. With a union of keys, every key is required, so forgetting <code>dark</code> is a compile error: handy for theme maps or translations.',
      code: `type Theme = "light" | "dark";
const background: Record<Theme, string> = {
  light: "#fff",
};` },
    { id: 'ts-async', cat: 'TypeScript: generics & utility types', title: 'Typing async functions', ask: 'What type does p have?', answer: 'type', target: 'p',
      choices: ['number', 'Promise<number>', 'any'],
      hint: 'What does an async function always return?',
      why: 'An <code>async</code> function always returns a <b>Promise</b>, so <code>load()</code> is <code>Promise&lt;number&gt;</code>, not <code>number</code>: you must <code>await</code> it. <code>Awaited&lt;T&gt;</code> unwraps a promise type.',
      code: `async function load(): Promise<number> {
  return 42;
}
const p = load();` },
    { id: 'ts-guard', cat: 'TypeScript: generics & utility types', title: 'Custom type guards', ask: 'What type does fish have?', answer: 'type', target: 'fish',
      choices: ['Fish[]', '(Fish | Bird)[]', 'Bird[]'],
      hint: 'p is Fish tells TypeScript what a true result means.',
      why: 'A function returning <code>p is Fish</code> is a <b>type guard</b>: when it returns true, TypeScript narrows to <code>Fish</code>. Passed to <code>filter</code>, it makes the result <code>Fish[]</code> instead of <code>(Fish | Bird)[]</code>.',
      code: `interface Fish { swim(): void }
interface Bird { fly(): void }
function isFish(p: Fish | Bird): p is Fish {
  return "swim" in p;
}
declare const pets: (Fish | Bird)[];
const fish = pets.filter(isFish);` },
    // ------------------------------------------------------------ React with TypeScript
    { id: 'ts-react-props', cat: 'TypeScript: React', title: 'Typing component props', tsx: true, ask: 'Which line has the type error?', answer: 'errorline', choices: ['line 2', 'line 5', 'line 6', 'no error'],
      hint: 'Which props are required?',
      why: 'A props type makes every usage checked: <code>onClick</code> is required, so <code>&lt;Button label="Save" /&gt;</code> fails to compile. Mark optional props with <code>?</code> and give them defaults.',
      code: `type ButtonProps = { label: string; onClick: () => void };
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
const ok = <Button label="Save" onClick={() => {}} />;
const missing = <Button label="Save" />;` },
    { id: 'ts-react-never', cat: 'TypeScript: React', title: 'useState([]) is never[]', tsx: true, ask: 'What type does items have?', answer: 'type', target: 'items',
      choices: ['string[]', 'never[]', 'any[]'],
      hint: 'What can TypeScript infer from an empty array?',
      why: 'From an empty array TypeScript cannot know the element type, so in strict mode <code>useState([])</code> infers <code>never[]</code>, and <code>setItems(["a"])</code> fails. Give the type explicitly: <code>useState&lt;string[]&gt;([])</code>. The same goes for <code>useState(null)</code> → use <code>useState&lt;User | null&gt;(null)</code>.',
      code: `function List() {
  const [items, setItems] = React.useState([]);
  return null;
}` },
    { id: 'ts-react-event', cat: 'TypeScript: React', title: 'Typing an input event', tsx: true, ask: 'Does it compile?', answer: 'compiles', labels: C, choices: ['compiles', 'error'],
      hint: 'ChangeEvent<HTMLInputElement> has a target with a value.',
      why: 'React event types are generic over the element: <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code> gives <code>e.target.value: string</code>. Writing the handler inline (<code>onChange={e =&gt; …}</code>) lets TypeScript infer it for you.',
      code: `function NameInput() {
  const [name, setName] = React.useState("");
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  return <input value={name} onChange={onChange} />;
}` },
  ];
})();

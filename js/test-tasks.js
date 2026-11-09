/*
 * JS Engine Lab — testing practice (opened by js/test-lab.js).
 * impl: the correct code; bugs: hidden broken versions (exact text edits of impl) your tests must catch.
 */
(function () {
  'use strict';
  window.TEST_TASKS = [
    {
      id: 't-sumeven', cat: 'Testing', title: 'Unit test: sumEven', ask: 'Write tests for <code>sumEven(numbers)</code>, which adds up the even numbers.',
      impl: `function sumEven(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) total += numbers[i];
  }
  return total;
}`,
      bugs: [
        { what: 'adds the <b>odd</b> numbers instead (<code>% 2 === 1</code>).', tip: 'Test a list that mixes odd and even numbers.', edits: [['numbers[i] % 2 === 0', 'numbers[i] % 2 === 1']] },
        { what: 'skips the <b>first</b> number (the loop starts at 1).', tip: 'Put an even number first in one of your lists.', edits: [['let i = 0;', 'let i = 1;']] },
        { what: 'returns <code>undefined</code> for an <b>empty list</b> instead of 0.', tip: 'Edge cases: what should sumEven([]) return?', edits: [['  let total = 0;\n', '  if (numbers.length === 0) return;\n  let total = 0;\n']] },
      ],
      starter: `test("adds even numbers", () => {
  expect(sumEven([2, 4])).toBe(6);
});`,
      solution: `test("adds only the even numbers", () => {
  expect(sumEven([1, 2, 3, 4])).toBe(6);
});
test("counts the first number too", () => {
  expect(sumEven([8, 1])).toBe(8);
});
test("an empty list gives 0", () => {
  expect(sumEven([])).toBe(0);
});`,
      hint: 'Test the normal case, a mixed list, and the edge cases (empty list, even number in the first position).',
      why: 'A test suite is good when a <b>broken</b> version of the code fails it. This is how <b>mutation testing</b> (Stryker) measures tests: it makes small bugs on purpose and checks your tests notice. One "happy path" example is not enough: think of <b>edge cases</b> (empty input, first and last element, mixed values).',
    },
    {
      id: 't-price', cat: 'Testing', title: 'Unit test: formatPrice', ask: 'Write tests for <code>formatPrice(cents)</code>: 1250 → "$12.50", -500 → "-$5.00".',
      impl: `function formatPrice(cents) {
  const sign = cents < 0 ? "-" : "";
  return sign + "$" + (Math.abs(cents) / 100).toFixed(2);
}`,
      bugs: [
        { what: 'shows only <b>one decimal</b> ("$12.5").', tip: 'Check the exact string, with two decimals.', edits: [['toFixed(2)', 'toFixed(1)']] },
        { what: '<b>drops the minus sign</b> for refunds.', tip: 'Test a negative amount.', edits: [['const sign = cents < 0 ? "-" : "";', 'const sign = "";']] },
        { what: 'shows <b>"-$-5.00"</b> for negatives (forgot Math.abs).', tip: 'Test a negative amount and compare the whole string.', edits: [['(Math.abs(cents) / 100)', '(cents / 100)']] },
      ],
      starter: `test("formats dollars", () => {
  expect(formatPrice(1250)).toBe("$12.50");
});`,
      solution: `test("formats dollars and cents", () => {
  expect(formatPrice(1250)).toBe("$12.50");
});
test("formats refunds", () => {
  expect(formatPrice(-500)).toBe("-$5.00");
});
test("formats zero", () => {
  expect(formatPrice(0)).toBe("$0.00");
});`,
      hint: 'Positive, negative and zero amounts; compare the full string with toBe.',
      why: 'For formatting functions, test the <b>exact output</b> (<code>toBe</code> with the full string), and cover each <b>branch</b> of the code: here the sign. Code coverage tools show untested branches, but only good assertions catch wrong values.',
    },
    {
      id: 't-debounce', cat: 'Testing', title: 'Testing timers: debounce with a fake clock', ask: 'Write tests for <code>debounce(fn, ms, clock)</code>. Use <code>const clock = createClock()</code> and <code>clock.tick(ms)</code> to move time.',
      impl: `function debounce(fn, ms, clock) {
  let timer = null;
  return (...args) => {
    clock.clearTimeout(timer);
    timer = clock.setTimeout(() => fn(...args), ms);
  };
}`,
      bugs: [
        { what: 'calls the function <b>immediately</b>, without waiting.', tip: 'Check that nothing was called before you tick the clock.', edits: [['    timer = clock.setTimeout(() => fn(...args), ms);', '    fn(...args);']] },
        { what: '<b>never cancels</b> the previous timer, so every call fires.', tip: 'Call it 3 times quickly, tick, and expect ONE call.', edits: [['    clock.clearTimeout(timer);\n', '']] },
        { what: 'passes the <b>first</b> call\'s arguments instead of the last.', tip: 'Check which argument the function received.', edits: [['  let timer = null;\n  return (...args) => {', '  let timer = null, firstArgs = null;\n  return (...args) => {\n    if (!firstArgs) firstArgs = args;'], ['() => fn(...args), ms)', '() => fn(...firstArgs), ms)']] },
      ],
      starter: `test("calls the function after the delay", () => {
  const clock = createClock();
  const calls = [];
  const save = debounce(x => calls.push(x), 100, clock);
  save("a");
  clock.tick(100);
  expect(calls).toHaveLength(1);
});`,
      solution: `test("waits for the delay", () => {
  const clock = createClock();
  const calls = [];
  const save = debounce(x => calls.push(x), 100, clock);
  save("a");
  expect(calls).toHaveLength(0);
  clock.tick(99);
  expect(calls).toHaveLength(0);
  clock.tick(1);
  expect(calls).toEqual(["a"]);
});
test("only the last of several quick calls runs", () => {
  const clock = createClock();
  const calls = [];
  const save = debounce(x => calls.push(x), 100, clock);
  save("a"); save("b"); save("c");
  clock.tick(100);
  expect(calls).toEqual(["c"]);
});`,
      hint: 'Check the state before the delay, exactly at the delay, and with several quick calls.',
      why: 'Code with timers is tested with <b>fake timers</b> (Jest <code>jest.useFakeTimers()</code> / Vitest <code>vi.useFakeTimers()</code> and <code>advanceTimersByTime</code>): the test controls time, so it is instant and never flaky. Here the clock is passed in (dependency injection), which makes the code easy to test without any library.',
    },
    {
      id: 't-async', cat: 'Testing', title: 'Testing async code and errors', ask: 'Write tests for <code>loadUserName(id, fetchJson)</code>. Pass in a fake <code>fetchJson</code>, and use <code>async</code> tests and <code>await expect.rejects(promise, "message")</code>.',
      impl: `async function loadUserName(id, fetchJson) {
  const res = await fetchJson("/users/" + id);
  if (res.status === 404) throw new Error("User not found");
  return res.body.name || "Anonymous";
}`,
      bugs: [
        { what: '<b>returns null</b> for a missing user instead of throwing.', tip: 'Test the 404 case: the promise must reject with "User not found".', edits: [['throw new Error("User not found")', 'return null']] },
        { what: 'uses the <b>wrong URL</b> ("/user/" instead of "/users/").', tip: 'Make your fake fetchJson record the URL it was called with, and check it.', edits: [['"/users/" + id', '"/user/" + id']] },
        { what: 'returns <b>undefined</b> when the user has no name.', tip: 'Test a user without a name: expect "Anonymous".', edits: [['res.body.name || "Anonymous"', 'res.body.name']] },
      ],
      starter: `test("returns the user's name", async () => {
  const fakeFetch = async url => ({ status: 200, body: { name: "Ada" } });
  expect(await loadUserName(1, fakeFetch)).toBe("Ada");
});`,
      solution: `test("calls the right URL and returns the name", async () => {
  const urls = [];
  const fakeFetch = async url => { urls.push(url); return { status: 200, body: { name: "Ada" } }; };
  expect(await loadUserName(7, fakeFetch)).toBe("Ada");
  expect(urls).toEqual(["/users/7"]);
});
test("a missing user rejects", async () => {
  const fakeFetch = async () => ({ status: 404, body: {} });
  await expect.rejects(loadUserName(1, fakeFetch), "User not found");
});
test("a user without a name is Anonymous", async () => {
  const fakeFetch = async () => ({ status: 200, body: {} });
  expect(await loadUserName(1, fakeFetch)).toBe("Anonymous");
});`,
      hint: 'A fake fetchJson can return any status and record the URL. Test success, 404 and missing data.',
      why: 'Async tests must <b>await</b> the code (or return the promise), otherwise they finish before it does and always pass. Replace the network with a <b>fake</b> (a stub or <code>vi.fn()</code> / MSW) so you control every case, including errors, and you can assert how it was called.',
    },
    {
      id: 't-counter', cat: 'Testing', title: 'Component test: a counter (Testing Library style)', ask: 'Write tests for the <code>Counter</code> component. Use <code>render(Counter)</code>, <code>screen.getByRole("button", { name: "…" })</code>, <code>user.click(…)</code> and <code>screen.getByText(…)</code>.',
      impl: `function Counter(container) {
  let count = 0;
  container.innerHTML = '<p>Count: <span>0</span></p><button>Increment</button><button>Reset</button>';
  const [inc, reset] = container.querySelectorAll("button");
  const out = container.querySelector("span");
  inc.addEventListener("click", () => { count++; out.textContent = count; });
  reset.addEventListener("click", () => { count = 0; out.textContent = count; });
}`,
      bugs: [
        { what: 'adds <b>2</b> per click.', tip: 'Click once and check the exact text.', edits: [['count++;', 'count += 2;']] },
        { what: '<b>Reset</b> sets the number but never updates the screen.', tip: 'Click Increment, then Reset, and check what the user SEES.', edits: [['reset.addEventListener("click", () => { count = 0; out.textContent = count; });', 'reset.addEventListener("click", () => { count = 0; });']] },
        { what: 'the Increment "button" is a <b>&lt;div&gt;</b>: it works with a mouse but not with a keyboard or a screen reader.', tip: 'Find it by its role: getByRole("button", { name: "Increment" }).', edits: [["<button>Increment</button><button>Reset</button>';\n  const [inc, reset] = container.querySelectorAll(\"button\");", "<div class=\"btn\">Increment</div><button>Reset</button>';\n  const inc = container.querySelector(\".btn\"), reset = container.querySelector(\"button\");"]] },
      ],
      starter: `test("starts at 0", () => {
  render(Counter);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});`,
      solution: `test("increments by one", () => {
  render(Counter);
  user.click(screen.getByRole("button", { name: "Increment" }));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
test("reset goes back to 0 on screen", () => {
  render(Counter);
  user.click(screen.getByRole("button", { name: "Increment" }));
  user.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});`,
      hint: 'Test what the user sees after each interaction, and find buttons by their role and name.',
      why: 'Testing Library\'s rule: test like a <b>user</b>, not the implementation. Find elements by <b>role and accessible name</b> (<code>getByRole("button", { name })</code>), interact with <code>user</code> events, and assert on visible text. A <code>&lt;div&gt;</code> "button" fails <code>getByRole</code>, so these tests also catch accessibility bugs. In React the API is the same: <code>render(&lt;Counter /&gt;)</code>.',
    },
    {
      id: 't-form', cat: 'Testing', title: 'Component test: form validation', ask: 'Write tests for <code>SignupForm</code>: an empty email must show "Email is required" as an <b>alert</b>; a valid one shows "Welcome, …".',
      impl: `function SignupForm(container) {
  container.innerHTML = '<form><label for="email">Email</label><input id="email"><button>Sign up</button><p class="msg"></p></form>';
  const form = container.querySelector("form"), input = container.querySelector("#email"), msg = container.querySelector(".msg");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) { msg.setAttribute("role", "alert"); msg.textContent = "Email is required"; }
    else if (!email.includes("@")) { msg.setAttribute("role", "alert"); msg.textContent = "Enter a valid email"; }
    else { msg.removeAttribute("role"); msg.textContent = "Welcome, " + email; }
  });
}`,
      bugs: [
        { what: 'never shows "Email is required" (an empty email is accepted).', tip: 'Submit the empty form and expect the alert.', edits: [['if (!email) { msg.setAttribute("role", "alert"); msg.textContent = "Email is required"; }\n    else if', 'if']] },
        { what: 'the error message is plain text, <b>not an alert</b>: screen readers do not announce it.', tip: 'Find the message with getByRole("alert").', edits: [['if (!email) { msg.setAttribute("role", "alert"); msg.textContent = "Email is required"; }', 'if (!email) { msg.textContent = "Email is required"; }']] },
        { what: 'rejects <b>valid</b> emails too.', tip: 'Type a valid email and expect the welcome message.', edits: [['!email.includes("@")', 'email.includes("@")']] },
      ],
      starter: `test("has an email field", () => {
  render(SignupForm);
  expect(screen.getByLabelText("Email")).toBeTruthy();
});`,
      solution: `test("an empty email shows an alert", () => {
  render(SignupForm);
  user.click(screen.getByRole("button", { name: "Sign up" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
});
test("a valid email is welcomed", () => {
  render(SignupForm);
  user.type(screen.getByLabelText("Email"), "ada@example.com");
  user.click(screen.getByRole("button", { name: "Sign up" }));
  expect(screen.getByText("Welcome, ada@example.com")).toBeInTheDocument();
});`,
      hint: 'Submit by clicking the button. Check the error by its role, and test a valid email too.',
      why: 'Form tests cover the <b>error path and the happy path</b>, through the UI: type into the field found by its <b>label</b>, click the submit button, check the message. Asserting <code>role="alert"</code> makes sure errors are announced to screen-reader users (WCAG), which a visual check would miss.',
    },
  ];
})();

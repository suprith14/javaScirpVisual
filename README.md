# JS Engine Lab

An interactive tool for learning exactly how JavaScript executes. Every program is shown step by step:

- the **creation phase** (hoisting) and the **execution phase**
- the **call stack** and the **memory and scopes** of each execution context
- the **heap**, with garbage collection
- **Web APIs**, the **microtask and callback queues**, and the **event loop**

Lessons, prediction quizzes and auto-checked coding challenges take you from understanding the engine to writing the code yourself.

## How to run

Open `index.html` in any modern browser. No install or build step is needed.

The editor (CodeMirror) and the fonts are stored in `vendor/`, so everything works offline.

Open `tests.html` after changing the engine. It runs every lesson, feature program and challenge, and compares the output with real JavaScript in your browser (currently 151 checks).

## Learning workflow

**🏋️ Practice** (the one button in the top bar) is a single numbered list of every hands-on task: 231 code questions, 33 challenges, 34 HTML, CSS and accessibility tasks, 51 network, security, performance, rendering-strategy, offline, browser-API and Git/npm tasks, 22 TypeScript tasks, 6 testing tasks and 7 real-project briefs, grouped by topic in learning order (basics → scope → closures → `this` → call stack limits → types → numbers and strings inside → arrays → objects, classes and prototypes → modern syntax → errors → the event loop, rendering and async → modules → the DOM → Node.js → memory and garbage collection → parsing and the JIT → patterns → data structures and algorithms → testing), easier first within each topic. Each task opens straight into doing it:

- 🎯 **predict the output**: the prediction box opens at once; type what the console prints, **Check my answer**, then press ▶ to watch it run;
- ✍️ **write the code**: the function bodies are removed, you write them until **Check solution** passes;
- 🧩 **build it**: a challenge, written from a task description;
- 🎨 **HTML & CSS** (the CSS lab): the code renders in a live preview, you predict a value (a width, a colour, which box is on top, how many elements can be reached with Tab), and **Check** compares it with what the browser really computed. Then "Under the hood" shows the **cascade** for that element (every matching rule, its specificity, which one wins and why) and its **box model**. The code is editable and the preview follows. Topics: cascade and specificity, inheritance and units, the box model, positioning and stacking contexts, flexbox, grid, responsive, HTML and accessibility;
- 🌐 **network, security and performance** (the Web lab): a request and the server's headers (CORS, HTTP caching, cookies and SameSite / CSRF, script loading); you pick what the browser does, and "Under the hood" lists every check it makes (✓ / ✗), with a loading waterfall for `async` / `defer`. The XSS, Content-Security-Policy and layout-shift (CLS) tasks really run in a sandboxed frame, so their answer is what actually happened. The **Git & tools** tasks use it too: a list of git commands (merge, rebase, reset, revert, cherry-pick, detached HEAD) and you predict `git log`, then see the commit graph; and npm version ranges (`^`, `~`, the 0.x rule);
- 🔷 **TypeScript** (the TS lab): 22 tasks on inference, narrowing, interfaces, generics, utility types and typing React. You predict whether it compiles, which line errors, or what type something gets; the answer comes from the real TypeScript compiler (`vendor/typescript.js`, 5.4.5) running in the page. "Under the hood" lists the errors, the type of every name, and the JavaScript that is left after the types are erased. The code is editable;
- 🧪 **Testing** (the Test lab): you write tests (`test`, `expect`, `render`, `screen.getByRole`, `user.click`, a fake clock) for some code. They run on the correct code and on several hidden buggy versions; the matrix shows which bugs your tests caught (mutation testing);
- 🚀 **Real projects**: 7 briefs to build on your own machine (a ship-ready setup with TypeScript, ESLint, Vitest, CI and deploy; a data dashboard; a real-time chat; an accessible component library; a checkout flow; a performance audit; an online shop with Next.js: SSG, SSR, ISR, hydration, SEO and offline), each with milestones, commands, a "done when" checklist, DevTools exercises and stretch goals.

**Everything is tied to real projects.** Tasks show a "📍 In a real project" line (the moment you meet this at work, for example "Checkout form: the cart should survive a refresh…") and "🚀 You will use this in" links to the project briefs; each brief lists "Practise these first" tasks. The newer groups: **modern CSS** (container queries, `:has()`, cascade layers, `clamp()`, `transform` vs layout), **accessibility** (focus in a `<dialog>`, `aria-hidden` vs `inert`), **rendering strategies** (CSR / SSR / SSG / ISR with a load timeline, "visible but not clickable" hydration, hydration mismatches, choosing a strategy), **offline** (service-worker cache-first, network-first, stale-while-revalidate) and **browser APIs** (IntersectionObserver, localStorage and the storage event, pushState / popstate; these really run).

**🗺️ Map** (next to Practice in the top bar): everything a frontend developer should at least know exists, in 15 areas (the language, the browser, HTML and CSS, accessibility, React and frameworks, TypeScript, network, security, performance, architecture, tools, testing, production, Node.js, interviews), one line each on what it is and when you meet it. Items with practice have a **▶ practise** link (to the topic, the task or the project brief); the rest say **good to know**. The newest task groups: **Auth & login** (JWT, tokens and XSS, refresh and retry, the refresh race, OAuth with PKCE), **Internationalisation** (Intl prices, date formats, time zones, right-to-left with logical properties) and **Live updates** (polling vs WebSocket vs SSE, messages lost while reconnecting).

**🖥️ Code → Pixels** (top bar → 📚 Topics): watch the browser turn a page into pixels, slowly, one stage at a time: 1 bytes → 2 tokens and the DOM tree (it grows token by token; the parser pauses at a script) → 3 CSS rules and computed styles → 4 the render tree (display: none dropped, ::before added) → 5 layout (every box measured and drawn as a wireframe) → 6 paint (drawing commands in stacking order, painted one by one) → 7 layers (pulled apart in 3D) → 8 the real page → 9 click things in the page and see which stages your JavaScript makes the browser re-run (colour → paint, width → layout, transform → composite only), with the 16.7ms frame. The DOM, CSS rules, computed styles, render tree, box sizes and your changes are measured from the page really rendering; the tokenizer, paint list and layers are labelled as models. Pick one of six examples (including **layout thrashing**, where step 9 counts the forced layouts your loop causes, 299 vs 0, and **a React component**, which adds a step: JSX → createElement calls → the element tree → the DOM React creates, and shows in step 9 which DOM change a setState made) or edit the code. Play speed: slow, normal or fast.

**📊 Performance** (top bar → 📚 Topics): how performance is measured in real projects, in 5 short steps: 1 a test shop page is measured live (FCP, LCP, CLS, TBT, INP with PerformanceObserver); 2 how the **score %** is made: each metric's 0–100 score on Lighthouse's curve (90 at the good line, 50 at the median), times its weight (TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10%); 3 **real users**: 1,000 simulated visits on phones and slow networks, the **75th percentile**, % good / needs improvement / poor, and whether the page passes Core Web Vitals; 4 switch fixes on (optimised image, width/height, split the long task, update before heavy work) and compare runs, scored as **a mid-range phone** (estimated like Lighthouse mobile: CPU ×4, slow 4G) or **this computer** (as measured), so you see why mobile scores are lower; 5 web-vitals in production and a Lighthouse CI budget. Curves, weights and the user mix are models and are labelled as such.

**🗄️ Databases** (top bar → 📚 Topics): 1 the ten kinds (relational, document, key-value, search, wide-column, graph, time-series, vector, analytics warehouse, in the browser), each with a tiny example of its data, what it is for and real products; 2 "which one?": 11 real situations to pick for, with the reason (also in the 🏋️ Practice list under "Databases", linked to the projects); 3 one online shop using several databases, and one order step by step; plus SQL in eight queries (results computed from sample tables), designing the shop's tables, the path from a React component to the database (ORM, SQL injection, N+1, pagination, row-level security), running it in production, and each kind's name on AWS, Google Cloud, Azure and hosted services; and words you will hear.

**🚢 Deployment** (top bar → 📚 Topics): 1 the ways to deploy (static hosting + CDN, full-stack platforms, serverless / edge functions, containers, your own server), each with what it is for and real services; 2 what happens when you push (CI checks → build → preview URL → production → CDN → monitoring and rollback), with the CI workflow; 3 what every deploy needs (environment variables and what is public, the SPA "404 on refresh" fix, cache headers, DNS and HTTPS, security headers, monitoring); 4 step-by-step walkthroughs with every command (Vercel / Netlify; AWS S3 + CloudFront + ACM + Route 53 + GitHub Actions with OIDC; Docker → Cloud Run / AWS); 5 the AWS services a frontend developer meets, with their Google Cloud and Azure names; 6 releasing safely (environments, blue-green, canary, feature flags, infrastructure as code, secrets, zero-downtime migrations, monitoring, cost); 7 "which one? / fix it": 16 real situations, also in the 🏋️ Practice list under "Deployment" and "Cloud (AWS)". Brief by default; "+ Show details" shows the commands.

**🏢 Teamwork** (top bar → 📚 Topics): how real projects run in a team: who is who (PM, designer, frontend, backend, QA, DevOps, tech lead, EM); each phase (requirements → design → planning → technical design → build → code review → testing / QA → release → after release) with what you do and, in details, a real example document (user story with acceptance criteria, design checklist, tickets and definition of done, tech spec and ADR, commits and a stand-up update, PR description and review comments, bug report, release note, blameless postmortem); the team rhythm (stand-up, refinement, planning, demo, retro; Scrum vs Kanban); one "Wishlist" feature followed day by day; and 10 "what would you do?" situations, also in the 🏋️ Practice list under "Working in a team".

**🧰 DevTools & debugging** (📚 Topics): a seven-step method for finding any bug (reproduce, read the error, isolate with git bisect, check a hypothesis, fix the cause, add a test, write it down), then every DevTools panel (Elements, Console, Sources, Network, Performance, Memory, Application, Lighthouse / Rendering, React DevTools) with the tricks pros use, and the shortcuts. Each 🚀 project brief now has a **🔍 While building** routine linked to it.

**🎯 Interview prep** (📚 Topics): the rounds of a frontend interview and how to prepare for each; 40 common questions with short answers to practise out loud (each linked to its practice topic); a method and 12 common tasks for machine coding (with a full autocomplete solution in details); the RADIO framework for frontend system design; STAR behavioural answers with an example; and before / after (CV, portfolio, questions to ask, offers, rejections).

**🏙️ Companies** (top bar, next to Map): about 2,200 company names hiring frontend developers, in about 145 categories, with a search box, a 📍 Bengaluru list (about 250: headquartered there + big offices there) and a 📊 How many? view (India and Bengaluru company, startup, GCC and tech-job counts with source and date), to look up their careers pages (extra names live in js/companies-data.js and are merged in, skipping duplicates): 🇮🇳 India (1,000+: big tech, B2C e-commerce, food and travel, media, gaming, edtech, health, D2C brands, fintech, B2B SaaS, HR tech, insurtech, agritech, developer tools, AI and data, cybersecurity, logistics, auto and real estate, conglomerates, public digital infrastructure, GCCs by industry, IT services, digital engineering, consulting), ✈️ abroad (1,000+, by country and, for the US, by industry), and 🏠 remote-only (about 190, only companies known to be remote: fully remote companies by area, crypto, remote-first, non-profits, contract platforms, job boards), each with one practical note (cities, visa sponsorship, checking a remote role is open to India).

**🏆 Get hired** (top bar): strategies to get interviews and pass them: getting interviews (referrals with a message template, applying early, where to apply, LinkedIn, proof through projects), a resume that passes ATS and people (with bad vs good bullets), a six-week preparation plan, online assessments, tactics for each technical round, HR and behavioural rounds (a 60-second introduction, why this company, salary expectations, notice period), winning the people over (what the recruiter, technical interviewer, hiring manager, HR and panels each want and worry about, with phrases to use), answering the doubts that cost offers (not enough experience, fresher, gaps, notice period, salary, missing stack, job changes) with scripts, rapport, storytelling and a strong close ("is there anything that makes you hesitate?"), presence and remote setup, the day before and the day of, after the interview (follow-up, rejections, offers and negotiation), common mistakes, and 12 interview situations, also in the 🏋️ Practice list under "Interview strategy".

**💼 Corporate life** (📚 Topics): how working at a company works around the code: 11 types of companies (consumer and B2B product, big tech, GCCs, large IT services, consultancies and agencies, early and growth-stage startups, fintech and banks, remote and foreign employers, freelancing) with examples, the frontend work, interviews, pros and cons, a comparison table, how to choose and research, and red flags; levels and the career ladder; your first 90 days; communication (chat messages, status updates, asking for help, saying "not yet", email, meetings, clients) with real examples; appraisals (cycle, OKRs and KPIs, 1:1s, a brag document, ratings, hikes and promotions, feedback); salary and offers in Indian terms with international notes (CTC, fixed vs variable, in-hand, PF, gratuity, joining bonus clawbacks, ESOPs / RSUs, notice period, BGV, bonds, negotiating) with a worked 12 LPA → in-hand example; policies (NDA, AI tools and company code, security, moonlighting, leave and timesheets, code of conduct and POSH); growing and switching (visibility, a difficult manager, burnout, when to switch, resigning well, with a resignation email); and 10 workplace situations, also in the 🏋️ Practice list under "Corporate life".

**⌨️ Terminal & Git** (📚 Topics): about 75 commands professionals use every day, grouped by task: files and folders, search and text (grep, ripgrep, pipes, redirects, jq), processes and ports, network and servers (curl, ssh, scp / rsync, dig, SSH keys), environment and permissions (chmod, PATH, env vars, nvm, aliases, history), and Git (the daily flow, investigating history with blame / log -S / bisect, fixing mistakes with restore / reset / revert / reflog / stash, and branches, conflicts and force-with-lease). Risky commands are marked ⚠️; details add an example for each; a start page explains Git Bash and WSL on Windows and the shortcuts that save time; and 10 "which command?" situations are also in the 🏋️ Practice list under "Terminal & Git".

**💰 Roles & pay** (📚 Topics): 17 frontend job titles (frontend, SDE, UI developer, full-stack, mobile, design engineer, design systems, frontend platform, performance, accessibility, SDET, CMS, creative developer, DevRel, solutions engineer, architect, EM) with what each does and who hires it; the 11 people around you and what to give / ask each; responsibilities at each level from intern to director; title mapping between Google, Amazon, Microsoft, Meta, Indian product companies and IT services; rough 2025–26 pay ranges in India by level and company type, plus pay abroad; the extra pay on top of salary (variable bonus, joining bonus and clawbacks, notice buyout, relocation, ESOPs, RSUs, retention, referral, allowances, benefits); raises, switching and comparing offers; career paths; and 10 situations, also in the 🏋️ Practice list under "Roles & pay".

**🌳 Expression tree** (📚 Topics): type any JavaScript expression and see it as a tree (how precedence and associativity group it), the order the engine evaluates each part, which parts short-circuit and never run (greyed out), and the result, checked against the real JavaScript engine. A small Pratt parser handles literals, variables, arrays, property access and optional chaining, unary operators, `**`, arithmetic, comparisons, `&&` / `||` / `??` and the ternary, including the SyntaxErrors for `-2 ** 2` and mixing `??` with `||`. Its 12 tasks are in the 🏋️ Practice list under "Expressions & precedence"; their answers come from running the real expression.

**More JavaScript practice:** 📅 "Dates: Temporal" (8 tasks that really run Temporal in the browser: month overflow, immutability, 1-based months, until(), a daylight-saving jump, invalid dates, equals vs ===, sorting) and 🟩 "Node.js: streams & crypto" (Web Streams and Web Crypto really run: backpressure, transform streams, randomUUID, SHA-256; plus 6 Node situations: file streams, pipeline(), drain, password hashing, timingSafeEqual, randomBytes).

**🤖 AI at work** (📚 Topics): the kinds of AI tools developers use, a professional workflow, weak vs good prompts, a checklist for reviewing AI-written code, company rules, the skills that still matter, and building AI features (streaming answers with a Stop button, keeping keys on the server, safe rendering, prompt injection); 8 situations, also in Practice.

**🧾 Tax & money** (📚 Topics, India, tax year 2026-27): the words (tax year under the Income-tax Act 2025, TDS, Form 16, AIS, ITR), an old vs new regime calculator, how each salary part is taxed, filing your ITR step by step, tax on RSUs / ESOPs / shares and the Schedule FA rule for foreign shares, freelancing for foreign clients (presumptive scheme, advance tax, GST with LUT), and money basics; 8 situations, also in Practice. General information, not tax advice.

**🌱 Open source** (📚 Topics): why it helps your career, your first pull request with every Git command, finding issues, etiquette, programmes (GSoC, Outreachy, LFX, Hacktoberfest, MLH, GirlScript, C4GT), building in public, and licences (MIT, Apache, GPL, AGPL, none); 8 situations, also in Practice.

**💸 Earn more** (top bar): every way a developer can earn more, with how soon and how much effort (your job, switching well, remote for foreign companies, freelancing, digital products, content and teaching, paid side work); 9 real public stories with their lessons and sources (Tailwind UI and its 2026 AI-driven drop, ShipFast, Photo AI, a $15,000 Facebook bug bounty from Bengaluru, Wipro vs Swiggy on moonlighting, the SEBI F&O study, Indian developer-educators, Josh W. Comeau, Excalidraw); 6 worked examples with the maths (switching, weekend freelancing, a template, mock interviews, remote contract, referrals); a freelance hourly-rate calculator; strategies inside your job; freelancing safely (check your contract for moonlighting, niches, finding clients, pricing, upfront payments, maintenance plans); 9 product ideas and how to take payments; content and side work; 14 small tips; 8 traps and scams; a 90-day plan for freshers, 1–3 and 3+ years; and 8 situations, also in the 🏋️ Practice list under "Earning more".

**🧑‍💻 Freelancing** (📚 Topics, also linked from 💸 Earn more): from scratch to pro in 12 steps: five levels (prepare → first clients → repeat work → specialist → pro), what to set up (skills clients pay for, tools, paperwork, the moonlighting check), a portfolio that wins clients, nine client channels with tips (people you know, local businesses, cold outreach, agencies, marketplaces, communities, content, partners, past clients), six ready-to-use scripts (cold email, marketplace proposal, follow-up, agency message, weekly update, testimonial request), discovery-call questions and what a proposal contains, pricing models with rough Indian price ranges, contract clauses and getting paid (India and foreign clients), delivering (kickoff to handover and a launch checklist), keeping clients and growing (maintenance tiers, niche, productising), eight hard situations (scope creep, late payment incl. MSME Samadhaan, silent clients…), admin and tax; and 10 situations, also in the 🏋️ Practice list under "Freelancing".

**🎨 Design basics** (📚 Topics): six principles (hierarchy, spacing, alignment, consistency, contrast, simplicity); spacing with a cramped-vs-balanced example and a spacing scale in CSS; typography rules with a live type-scale generator; colour rules (palettes, tokens, dark mode, oklch / color-mix) with a real WCAG contrast checker; layout and hierarchy (grids, one primary action, touch targets); components and every state (focus, loading, empty, error); reading Figma (auto layout → flexbox, variants → props, variables → tokens) and working with designers; a 20-point polish checklist; where to learn more; and 8 situations, also in Practice.

**📰 Staying current** (📚 Topics): the mindset, good sources (newsletters, blogs, docs, podcasts, YouTube, talks, communities), official sources (release notes, upgrade guides, Baseline, TC39 stages, RFCs, State of JS, Interop), seven questions for judging a new library plus a team tech radar, a weekly routine of about 2 hours, learning deeply, and what to ignore; 6 situations, also in Practice.

**🧘 Health & career** (📚 Topics): why it matters, desk setup, eyes (20-20-20), body and movement (WHO activity guideline, RSI warning signs), sleep and energy, stress and burnout (WHO description, impostor syndrome, EAP and India's Tele-MANAS helpline 14416), work habits for a sustainable pace, and a long career; 6 situations, also in Practice. General information, not medical advice.

**🏦 How companies work** (📚 Topics): money basics (revenue, gross / operating / net profit, margin, cash vs profit, burn and runway with a worked example, valuation), 12 business models with real examples and the number each watches (incl. why UPI apps earn elsewhere), unit economics (CAC, churn, LTV, payback, contribution margin) with a live calculator and a worked food-delivery order, how IT services companies and GCCs make money (utilisation, bench, margins, cost centres), startup funding stages and terms, how companies are organised and planned (budgets, headcount, quarters, OKRs, P&L), listed companies and shares, 7 real stories (Zoho, Zomato's first profit, Paytm's IPO, Byju's, Freshworks, Netflix, Tailwind Labs), checking a company before you join, and what it means for your work; 8 situations, also in Practice.

The topic tabs (Code → Pixels, Performance, Databases, Deployment, Teamwork, DevTools, Interview prep, Corporate life, Terminal & Git) open from the **📚 Topics** menu in the top bar, and from the quick bar at the top of the Practice list.

**Frontend system design** tasks are ✍️ write-it exercises for the building blocks of design rounds: a type-ahead search (debounce, cache, stale answers), cursor pagination for an infinite feed, normalised client state, an optimistic like button with rollback, and stale-while-revalidate.

A pill next to the title (◀ Task n / 311 ▶) goes to the previous or next task, and **💡 need a hint?** opens the lesson about that topic without leaving the task. Theory is not a separate item any more: the lessons only open as hints, the theory flashcards are hidden, and so are the Lessons, Interview, Challenges and Progress menus and the difficulty labels (they are still in the code and can come back).

**Under the hood**: stepping through the code also shows
- the **prototype chain**: when a property is not on the object, a step shows the engine walking `[[Prototype]]`, and the Heap numbers each object it checks (✗) up to where it is found (✓);
- the **rendering step**: `requestAnimationFrame` callbacks wait for the browser's rendering step (after the task and all microtasks), run there with their own microtasks, then style → layout → paint;
- **inline caches**: a step when a property read starts seeing objects of a second shape (polymorphic, deoptimisation) or a fifth (megamorphic, slow).

The under-the-hood topics also have ✍️ write-it tasks: your own `Object.create` and prototype lookup, a mark-and-sweep garbage collector, a `requestAnimationFrame` animation loop, a deep tree walk with your own stack, money in cents and real character counts, and objects with one stable shape. Tasks that are clearer with an engine view (garbage collection, engine internals) switch it on by themselves.

The parts below are what the practice list is built from:

1. **Lessons**: 52 lessons in three parts.
   - **Part 1, how code runs:** hoisting, the call stack, scope, the TDZ, closures, `this`, recursion, errors, strict mode
   - **Part 2, asynchronous JavaScript:** the event loop, microtasks, promises, async/await, `fetch` (pretend and real), DOM events, your own web page, dialogs and storage, `Promise.allSettled`/`any`, `URL`/`AbortController`, Web Workers, shared memory and `Atomics`, the Node.js event loop, `EventEmitter`, files (`fs`/`path`) and an HTTP server
   - **Part 3, objects, iteration and the platform:** classes, private fields, generators, iterators, async streams, Map/Set, RegExp, Proxy, property descriptors, binary data, modules, top-level await, lazy `import()`, `Intl`/`WeakRef`/`eval`, and engine internals (hidden classes, inline caches, JIT)

   Each lesson opens with an explanation and a **predict-the-output** question.
2. **Step through** the real execution. The explanation bar describes every step.
3. **Click any line** for a plain-English explanation and to jump to when it runs.
4. **Challenges**: 33 exercises you solve yourself, checked against tests, with hints and a sample solution. **Run ▶** steps through your own solution.
5. **Interview questions** (🎤 Interview in the top bar): 245 items in 27 topics (196 runnable code questions and 49 theory flashcards): scope, closures, `this`, coercion, tricky output, strings and arrays, objects, ES6+ syntax, classes, errors, the event loop, async patterns (debounce, throttle, retry, promise pools), the browser and DOM, Node.js, modules, dates/regex/JSON, memory, polyfills and "implement it" tasks, data structures (linked list, tree, graph), sorting, coding problems, design patterns, how frameworks work (useState, useEffect, virtual DOM, reactivity, Redux, routers), functional programming, testing (a mini test framework, spies, fake timers) and advanced algorithms (trie, Dijkstra, topological sort, rate limiter, N-Queens). You can search them, pick a topic, filter by Easy / Medium / Hard, or open a random one you have not tried. Each question loads into the visualizer. Predict the answer, then open **Answer** for the output and the explanation, or press ▶ to watch it run. Link to one with `?interview=<id>`, or to the list with `?interview=list`.
   - **Predict mode:** type the output you expect, then check it line by line against the real output (XP for exact answers). **Flashcards:** answer, reveal the model answer, then mark "I knew it" or "Review again".
   - **Mock interview:** 5 random questions (Easy, Medium, Medium, Hard and a flashcard) in 15 minutes, with a timer bar and a scorecard at the end.
   - **Progress:** solved counts per topic, bookmarks (★), a "to review" list and private notes per question. Filter the list by Not solved, Bookmarked or To review; search also looks in your notes.
   - **✍️ Write it yourself:** 98 implement-style questions (debounce, Promise.all, LRU cache, deep clone, Trie, Dijkstra, useState, Redux…) become exercises: the function bodies are removed, the test code stays, and **Check solution** compares your output with the reference. When a check fails, **common-mistake hints** point at typical bugs (async in forEach, a missing return in map, off-by-one loops, sort without a compare function, missing base cases…).
6. **Progress**: XP, ranks and achievements, saved in your browser.

## The workspace

| Panel | Shows |
|---|---|
| Code | The current line, the exact expression being evaluated, breakpoints (click a line number), the line explainer, and code run by `eval` / `new Function` |
| Call Stack | Execution contexts: phase, `this`, local memory, block scopes, closures and the scope chain. Paused async functions, generators and modules are listed below the stack, and module memory stays visible |
| Heap | Objects, arrays, functions, classes, promises, Map/Set, Proxy, WeakRef, Intl and DOM objects. In the View menu, **Reference arrows** draw references from variables, **Garbage collection** shows which root keeps each object alive, and **Heap as a graph** shows a diagram |
| Web APIs | Timers (TMR), intervals (INT), network requests (NET), DOM events (EVT), animation frames (RAF), finalizer cleanup (GC) |
| Queues | The microtask queue (always drained first), the callback queue and the event loop |
| Console / Page | Program output, and a simulated web page when the code uses `document` |

**Controls:**
- <kbd>→</kbd> / <kbd>←</kbd> step, <kbd>Space</kbd> play/pause
- <kbd>↓</kbd> step over, <kbd>↑</kbd> step out, <kbd>B</kbd> next breakpoint
- <kbd>Home</kbd> / <kbd>End</kbd> jump to the start or end
- <kbd>Ctrl</kbd>+<kbd>Enter</kbd> run, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd> check a challenge
- **Share** copies a link that contains your code. Light/dark theme and sound are in the top bar
- Animations follow your system's reduced-motion setting

**Link options:**
- `?level=5&step=20` opens lesson 5 at step 20
- `?challenge=3` opens challenge 3
- `?code=…` opens shared code
- `&lesson=quiz` opens the lesson's quiz
- `&theme=light` uses the light theme
- `&arrows=1` turns on the arrows

## The browser environment

Execution is recorded first and then replayed, which is what makes stepping backward and breakpoints possible. Anything that comes from outside the program is collected between runs, and the program is then re-run with it, so the recording stays exact:

- **Real network:** `fetch("https://…")` and `XMLHttpRequest` reach the real internet.
  - Each request is made once, and the program is replayed with the real response and the real response time.
  - The server must allow cross-site requests (CORS headers), as public test APIs like `jsonplaceholder.typicode.com` do.
  - Failed requests reject with `TypeError: Failed to fetch`, like in a real browser.
- **Real page:**
  - Add a `// @file index.html` section to write your own HTML, and a `// @file script.js` section for the code.
  - The page is a real DOM: every CSS selector, `classList`, `style`, attributes, `createElement`/`append`, `onclick`, and events that bubble (delegation, `stopPropagation`, `currentTarget`), plus `Event`/`CustomEvent` with `dispatchEvent`.
  - **Click or type in the Page preview** and the program re-runs with your event at that moment.
- **Dialogs:** `alert`, `confirm` and `prompt` show real dialogs the first time. Your answers are then replayed.
- **Storage:** `localStorage` persists between runs (a "clear" link is shown under the page), while `sessionStorage` starts empty each run.
- **Also available:** `navigator` (real language and user agent) and `location` (a pretend address).
- **Step limit:** 5,000, 20,000 or 50,000 steps, chosen in Reference.

The pretend server and helpers are still there for predictable lessons:

- **`fetch`** answers these routes:
  - `/api/users` and `/api/users/1`, `2`, `3`
  - `/api/todos`
  - `/api/slow` (2 s)
  - `/api/error` (500)
  - any other route returns 404, and `POST` returns 201

  Add your own routes with `mockFetch("/api/x", data, { status, delay })`.
- **DOM:**
  - the page has `#title`, `#btn`, `#name` and `#output`
  - supported: `getElementById`, `querySelector(All)`, `createElement`, `appendChild`, `textContent`, `value`, `addEventListener`, `.click()`
  - `simulateClick(sel, ms)` and `simulateTyping(sel, text, ms)` pretend a user acts at a given time
- **Modules:** start each file with a line like `// @file math.js`. The entry is `main.js`, or the last file. Top-level `await` is supported.
- **Garbage collection** is a predictable mark-and-sweep, so `WeakRef` and `FinalizationRegistry` behave the same on every run. Real engines collect whenever they choose.

## Other environments and views

- **Node.js mode:** start the code with `// @env node`. You get:
  - `process.nextTick` (its own queue, drained before promises)
  - `setImmediate` and Node's event-loop phases (timers → poll → check), shown in the status bar
  - `require("events")` (a real `EventEmitter`, stepped through like your own code), `require("util")` (`promisify`, `inspect`) and `require("timers/promises")`
  - `require("path")`: `join`, `resolve`, `basename`, `dirname`, `extname`, `relative`, `parse`, `format`
  - `require("fs")` and `require("fs/promises")` on a virtual disk at `/home/user/app`: sync calls block the thread, while callback and promise calls finish in the poll phase. Supported: `readFile`, `writeFile`, `appendFile`, `unlink`, `readdir`, `mkdir`, `stat` and `existsSync`. Missing files give `ENOENT` errors, and reads without an encoding return a `Buffer`. The **Disk** view shows the files and marks the ones your code wrote.
  - `require("http")`: `createServer`, `listen`, `close`, `req.on("data"/"end")` and `res.writeHead`/`setHeader`/`write`/`end`. `fetch("http://localhost:PORT/...")` reaches your server, so a client and a server run in one program.
  - browser-only globals are removed
- **Web Workers:** a `// @file worker.js` section (the file name must contain "worker") runs on its own "thread", started with `new Worker("worker.js")`.
  - It has its own global memory, shown separately.
  - `postMessage` sends structured-clone **copies**.
  - Every worker has **its own call stack**, shown as a lane under the main Call Stack. Several workers with work at the same time take turns **one statement at a time**, so you can see how parallel threads interleave.
  - `SharedArrayBuffer` is shared (not copied) between threads, so data races can happen. `Atomics` (`add`, `sub`, `and`, `or`, `xor`, `load`, `store`, `exchange`, `compareExchange`, `wait`, `waitAsync`, `notify`) fixes them. `Atomics.wait` puts a worker to sleep until another thread calls `notify`.
  - Two workers made from the same file get distinct names (`worker.js`, `worker.js #2`).
- **Data files:** any `// @file name.txt` or `// @file data.json` section that isn't JavaScript becomes a file. It goes on the disk in Node mode, and the pretend server serves it to `fetch("data.json")` in browser mode.
- **TypeScript:** start the code with `// @lang ts` (or name a section `// @file main.ts`). Types, interfaces, type aliases, generics, `as`, `!`, `?`, access modifiers and `implements` are blanked out with spaces before running, so every highlight still lines up with your TypeScript. Enums, namespaces and constructor parameter properties give a clear error instead.
- **Temporal:** `Temporal.PlainDate`, `PlainDateTime`, `ZonedDateTime`, `Instant`, `Duration` and `Temporal.Now`, using the browser's own implementation (when the browser has one).
- **More Node modules:** `crypto` (`createHash` with SHA-256/SHA-1, `randomUUID`, `randomInt`, `randomBytes`), a global `Buffer` (`from`, `alloc`, `concat`, `toString("hex" | "base64")`), and `stream` (`Readable`, `Writable`, `Transform`, `PassThrough`, `pipeline`, `for await`, `fs.createReadStream` / `createWriteStream`; written in JavaScript so you can step through them).
- **Engine internals** (View menu), all clearly simulated:
  - **hidden classes**: objects with the same properties added in the same order share a shape
  - **inline caches**: each property read shows how many shapes it has seen (monomorphic, polymorphic or megamorphic)
  - **hot functions**: call counts, with a note when a real engine would compile the function (JIT)
- **Predictable randomness:** `Math.random` and `crypto` use a seed, so every re-run of the same code (for example while fetching real data) is identical. Editing the code picks a new seed.

## Visual tools

- **🧭 Guided tour:** on the first visit, a 10-step tour highlights each part of the screen (code, controls, timeline, narrator, stack, heap, queues, View menu, Lessons/Interview) with a short tip. Use ← → or the buttons, and Esc to skip. Replay it from the **?** window, or open the app with `?tour`.
- **👁 View menu** (next to the lesson title): every display option in one place, with presets: **Minimal** (just the panels), **Beginner** (values and flow arrows, the default), **Standard** (+ reference arrows) and **Full detail** (+ garbage collection and engine internals). Keys: `1`–`4` for the presets; `V`, `F`, `X`, `R`, `T`, `A`, `G`, `C`, `N` toggle single options.
- **Expression evaluation** (under the code): the current line broken into its parts, inner parts first, each with its value; the parts computed in this step are highlighted. Example: `"10" + 1 - 1` → `"101"` → `100`.
- **Array view** (in the heap): arrays of up to 30 numbers or strings become bars or cells, with index pointers (`i`, `j`, `lo`, `hi`, `mid`, `left`, `right`…) above them, and the cells read or written in this step highlighted. Made for sorting, two pointers, binary search and sliding windows.
- **Call tree** (top of the Call Stack): every function call as a tree with its arguments; finished calls show their return value, the running call is highlighted and the waiting ones are dashed. Shows exactly why naive recursion such as `fib` repeats work.
- **✓ true / ✗ false** next to every `if`, loop and ternary condition, with "truthy" / "falsy" for non-boolean values.
- **Timeline strip** (above the controls): one coloured tick per step (calls, returns, loops, the event loop, errors; breakpoints are red dots). Hover for details, click to jump.
- **Inline values** (View menu): each line shows the latest value it produced at its end, like `s = 16` or `⟶ printed text`.
- **Flow arrows** (View menu): animated arrows for where each step jumps in the code and how it moves through the engine (stack, heap, Web APIs, queues, console), including scope-chain lookups.
- **Event loop ring**: a token moves between the stations (script → microtasks → task → render; in Node: ticks, timers, poll, check).
- **Heap as a graph** (View menu): the heap as a graph of references, from the variables on the stack; unreachable objects fade.
- **Compare** (footer): run two versions of the code side by side and see where the output differs.
- **📈 Big-O lab** (footer): runs code for growing input sizes, counts the engine steps, plots them and estimates the complexity (O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)). Presets compare linear vs binary search, bubble vs merge sort, naive vs memoized Fibonacci and nested loops vs a Set; **Use my code** measures your own function. Setup code is not counted (`startMeasure()` marks where counting starts).
- **⏺ Record**: records a WebM video of the run (the browser asks which tab to share). **⬇ Steps**: downloads every step as a Markdown table.
- **?**: keyboard shortcuts.
- Changed values slide in, and promises change colour as they settle.

## Install and back up

- **Install as an app:** when the folder is served over http(s) (for example `npx serve` or GitHub Pages), an **📲 Install** button appears; the service worker (`sw.js`) keeps every file cached so it works offline.
- **Progress → Export / Import:** downloads or restores a JSON file with your XP, badges, solved questions, spaced-repetition schedule, bookmarks, notes and drafts.

## Project structure

- `index.html`, `css/styles.css`, `css/fonts.css`: the interface (dark and light themes, phone layout, keyboard focus rings, screen-reader announcements for each step)
- `js/app-config.js`: badges, step kinds, lesson groups, view options, tour steps and lab presets (pure data)
- `js/write-it.js`: builds the write-it-yourself exercises
- `js/app.js`: rendering, playback, breakpoints, lessons, quizzes, challenges, progress and sharing
- `js/examples.js`, `js/lessons.js`, `js/challenges.js`, `js/interview.js`, `js/interview-more.js`, `js/interview-extra.js`: course content
- `js/explain.js`: the line explainer
- `js/engine/`: the interpreter, which records a snapshot of the whole engine state at every step:
  - `core.js`: data types, snapshots and garbage collection
  - `builtins.js`: globals, the simulated browser, Proxy and Reflect
  - `classes.js`: classes and generators
  - `promises.js`: promises and microtasks
  - `methods.js`: methods of built-in types
  - `members.js`: property access, scopes and hoisting
  - `program.js`: scripts, modules, top-level await, the event loop, calls and async/await
  - `statements.js` and `expressions.js`
  - `extras.js`: `eval`, `new Function`, `WeakRef`, `FinalizationRegistry`, `Intl` and `mockFetch`
  - `threads.js`: worker threads with their own stacks, the statement-by-statement scheduler, `SharedArrayBuffer` and `Atomics`
  - `node.js`: Node's `path`, `fs`, `fs/promises` and `http`, plus data files
  - `evalviz.js`: records sub-expression values, array reads/writes and return values for the evaluation tree, array view and call tree; also the step counter for the Big-O lab
  - `nodeplus.js`: Temporal, Buffer, crypto and stream
  - `typescript.js`: the TypeScript type stripper
  - `observers.js`: `MutationObserver` (real records, delivered as microtasks), simulated `ResizeObserver` / `IntersectionObserver`, and CommonJS `require("./file.js")` in Node mode
  - `protos.js`: `Array.prototype`, `Function.prototype`, `String.prototype` and `Number.prototype` you can extend (polyfills), `reduceRight`, `Object.is` and the spec order of object keys
  - `platform.js`: `Promise.allSettled`/`any`, property descriptors, newer array/object helpers, `structuredClone`, typed arrays and binary data, `URL`, `AbortController`, `crypto`, `Symbol.hasInstance`/`toStringTag`, dynamic `import()`, Web Workers, Node.js mode, and engine internals, real network replay, dialogs, storage, `navigator`/`location` and `XMLHttpRequest`
- `sw.js`, `manifest.webmanifest`, `icon.svg`: offline cache and app install
- `vendor/`: the Acorn parser, CodeMirror and the fonts (for offline use)
- `tests.html`: the engine test suite (lessons, features, challenges, interview questions, the snapshot cache, write-it-yourself exercises)
- `ui-tests.html`: interface tests that click through the real app (menus, practice modes, tools). Open it over a local web server.

## Language coverage

Essentially the complete language:

- scope, hoisting, the TDZ, closures, strict mode
- every function form, `this`, `call`/`apply`/`bind`, `arguments`, `new.target`
- objects, getters and setters, destructuring, spread, tagged templates
- classes (fields, `#private`, static blocks, extending `Error`/`Array`/`Map`/`Set`), prototypes
- `Symbol` (`iterator`, `asyncIterator`, `toPrimitive`)
- generators, iterators, async generators, `for await`
- promises and thenables, async/await
- timers, `requestAnimationFrame`, modules with top-level await
- Map/Set/WeakMap/WeakSet, WeakRef/FinalizationRegistry
- RegExp, Date, `Intl`, BigInt, Proxy/Reflect, JSON, Math
- `eval`, `new Function`, and the main `console` methods
- `Promise.allSettled`/`any`/`withResolvers`, `AggregateError`, `Error` `cause`
- property descriptors, `seal`/`preventExtensions`, `Object.groupBy`/`hasOwn`, `toSorted`/`toReversed`/`toSpliced`/`with`, `structuredClone`
- `ArrayBuffer`, typed arrays, `DataView`, `TextEncoder`/`TextDecoder`, `URL`/`URLSearchParams`, `AbortController`/`AbortSignal.timeout`, `crypto`
- dynamic `import()`, Web Workers with shared memory and `Atomics`, and Node.js mode with `path`, `fs` and `http`

**Limits:**
- Real network requests only work with servers that allow cross-site requests (CORS).
- Responses are capped at 200 KB.
- Navigating away (`location.assign`, `reload`) is not simulated.
- Programs stop at the chosen step limit.
- Thread interleaving is deterministic (one statement per turn). Real threads are unpredictable, so a race can lose a different number of updates on each run. A worker only takes turns inside its top-level code and its message handlers; `Atomics.wait` blocks only when it is called directly in that code.
- Node's `fs` works on a virtual disk that resets on every run, and `http` servers can only be reached from the same program.

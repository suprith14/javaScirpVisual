/*
 * JS Engine Lab — 📰 Staying current: how professionals keep up with frontend without drowning —
 * how much time, where to read and watch, official sources (release notes, Baseline, TC39),
 * judging a new library, a weekly routine, learning deeply, and what to ignore.
 * Built with makeTopicTab (topic-tab.js); situations are also 🏋️ Practice tasks (topic "Staying current").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  const MINDSET = [
    ['A little, every week', '2–3 hours a week of focused reading and trying things beats binge-learning before interviews.'],
    ['Fundamentals first', 'JavaScript, the browser, HTTP, CSS, accessibility and React\'s model change slowly. Learn them deeply; frameworks on top come and go.'],
    ['Know that it exists', 'You do not need to learn every new tool. Know roughly what it does, so you can learn it properly when you need it (the 🗺️ Map tab is built on this idea).'],
    ['Try, do not just read', 'Ten minutes in a sandbox (StackBlitz, CodeSandbox) teaches more than an hour of reading about something.'],
    ['Filter hard', 'Most "X is dead" and "you must learn Y now" posts are noise. Follow a few trustworthy sources instead of many loud ones.'],
  ];
  // [source, what, type]
  const SOURCES = [
    ['JavaScript Weekly, Frontend Focus, React Status, Node Weekly', 'Weekly email round-ups of the most important news, articles and releases.', 'Newsletters'],
    ['This Week In React', 'React, React Native and Next.js news every week.', 'Newsletter'],
    ['Bytes (ui.dev)', 'A short, funny weekly JavaScript newsletter.', 'Newsletter'],
    ['web.dev and the Chrome for Developers blog', 'What is new in browsers, Core Web Vitals, Baseline features, performance guides.', 'Blogs'],
    ['MDN Web Docs (and its blog)', 'The reference for HTML, CSS and JavaScript, with browser support for every feature.', 'Docs'],
    ['react.dev blog, nextjs.org blog, vite.dev', 'Official announcements and upgrade guides for the tools you use.', 'Official blogs'],
    ['Josh W. Comeau, Kent C. Dodds, Ahmad Shadeed, Smashing Magazine', 'Deep, well-explained articles on CSS, React, testing and layout.', 'Blogs'],
    ['Syntax (podcast)', 'Web development news and deep dives, good for commutes.', 'Podcast'],
    ['Fireship, Kevin Powell, Web Dev Simplified, Jack Herrington', 'Quick news, CSS in depth, clear tutorials, advanced React and TypeScript.', 'YouTube'],
    ['Akshay Saini, Hitesh Choudhary (Chai aur Code)', 'JavaScript and web development from Indian educators, in English and Hindi.', 'YouTube'],
    ['Conference talks (React Conf, JSConf, CSS Day, React India)', 'Recorded talks on YouTube: where new ideas are explained by their authors.', 'Talks'],
    ['Reactiflux (Discord), r/reactjs, r/webdev, dev.to, Hacker News', 'Questions, discussions and what other developers are using.', 'Communities'],
  ];
  // [what, why, where]
  const OFFICIAL = [
    ['Release notes and changelogs', 'Exactly what changed in a version you use, and what might break.', 'GitHub Releases, CHANGELOG.md, the tool\'s blog'],
    ['Upgrade guides', 'Step-by-step instructions and codemods for major versions (React 19, Next.js, ESLint flat config…).', 'The official docs'],
    ['Baseline', 'Shows whether a web feature works in all major browsers: "Newly available" or "Widely available" (about 2.5 years later). The quickest answer to "can I use this yet?".', 'web.dev/baseline, MDN pages, caniuse.com'],
    ['TC39 proposals', 'New JavaScript features go through stages 0–4; stage 3 means browsers are implementing it, stage 4 means it is in the next edition of the language.', 'github.com/tc39/proposals'],
    ['RFCs', 'How frameworks discuss big changes before building them.', 'React and other projects\' RFC repositories'],
    ['State of JS / State of CSS / State of HTML', 'Yearly surveys of what developers use, like and want to learn.', 'stateofjs.com and its sister sites'],
    ['Interop project', 'Which features all the browser makers have agreed to fix together this year.', 'web.dev, wpt.fyi/interop'],
  ];
  const EVALUATE = [
    ['What problem does it solve for us?', 'If you cannot name a real problem in your project, it is not needed now.'],
    ['How mature is it?', 'Version 1.0+, a real track record, production users you recognise.'],
    ['Who maintains it, and how?', 'One volunteer or a funded team? Recent commits, releases, and how issues are answered.'],
    ['Is usage growing?', 'Download trends (npm trends), GitHub activity, State of JS satisfaction.'],
    ['What does it cost to use?', 'Bundle size (bundlephobia), performance, learning time for the team, licence.'],
    ['Can we leave later?', 'How hard it would be to remove or replace. Prefer tools close to web standards.'],
    ['Try it small first', 'A spike (a time-boxed experiment) or one non-critical feature before a big rewrite.'],
  ];
  const RADAR = [
    ['Adopt', 'Proven and right for us: use it for new work.'],
    ['Trial', 'Promising: use it in one real but low-risk place.'],
    ['Assess', 'Interesting: read about it, try it in a sandbox.'],
    ['Hold', 'Do not start new work with it (outdated, risky, or not needed).'],
  ];
  const ROUTINE = [
    ['Monday · 15 min', 'Skim one or two newsletters; save the few links worth reading.'],
    ['Wednesday · 30 min', 'Read one saved article properly, with the code open.'],
    ['Friday · 45–60 min', 'Try one thing hands-on in a sandbox or a small branch.'],
    ['Monthly', 'Upgrade a dependency in a side project, read one release note fully, or watch one conference talk.'],
    ['Every 3 months', 'Compare your skills with 10 job posts you would like; pick one gap to close.'],
    ['Yearly', 'Fill in the State of JS / CSS survey and read the results; write down what you learned this year.'],
  ];
  const DEEP = [
    ['Read the official docs fully', 'Not just the page you needed: the guides explain the "why" that tutorials skip.'],
    ['Build it yourself', 'A small version of the tool (a mini React, a tiny router, a debounce) teaches how it works; this whole lab is built on that idea.'],
    ['Read source code', 'Small, popular libraries are readable. Start from one function you use every day.'],
    ['Teach it', 'Explaining to a colleague or writing a short post shows you what you do not understand yet.'],
    ['Spaced repetition', 'Come back to a topic after a day, a week and a month. The 🏋️ Practice list is good for this.'],
    ['Learn by fixing', 'Bugs and incidents at work teach more than tutorials. Write down what you learned from each one.'],
  ];
  const IGNORE = [
    'Tutorial hell: watching course after course without building anything yourself.',
    'Framework hopping: rewriting side projects in every new framework instead of finishing one.',
    'Hype and outrage posts ("X is dead", "Y kills React"): wait a few months; real changes are still there.',
    'Learning everything at once: pick one new thing per month.',
    'Comparing yourself with people who post all day: they show the highlights, not the work.',
    'Rewriting working code at your job just to use something new, without a clear benefit.',
  ];

  window.makeTopicTab({
    id: 'sc', title: '📰 Staying current', sub: 'keep up with frontend without drowning in it',
    button: 'btnCurrent', map: 'current', api: 'CurrentLab', cat: 'Staying current', icon: '📰', solver: 'current',
    scene: 'Keeping your skills current through a long career.', hint: 'What gives the most real learning for the least time and risk?',
    stages: [
      { key: 'mindset', name: 'Mindset', title: 'How professionals keep up', say: 'Nobody knows everything in frontend. Professionals have a calm system, not a long reading list.',
        view: (d, H) => H.cards(MINDSET) },
      { key: 'sources', name: 'Where to look', title: 'Good sources', say: 'Pick 2–3 of these, not all of them. Newsletters are the most efficient start.',
        view: (d, H) => H.table(['Source', 'What you get', 'Type'], SOURCES) },
      { key: 'official', name: 'Official sources', title: 'Official sources: the ones professionals trust', say: 'When something matters at work, go to the source, not a summary.',
        view: (d, H) => H.table(['What', 'Why it helps', 'Where'], OFFICIAL) },
      { key: 'evaluate', name: 'Judge a new tool', title: 'Should we use this new library?', say: 'Questions to ask before adding anything new to a real project.',
        view: (d, H) => H.cards(EVALUATE) + `<p><b>A simple "tech radar" for your team</b></p>${H.table(['Ring', 'Meaning'], RADAR)}` },
      { key: 'routine', name: 'Weekly routine', title: 'A weekly routine (about 2 hours)', say: 'Put it in your calendar like a meeting; small and regular beats big and rare.',
        view: (d, H) => H.cards(ROUTINE) },
      { key: 'deep', name: 'Learn deeply', title: 'Learning deeply, not just widely', say: 'Deep knowledge is what interviewers and senior engineers notice.',
        view: (d, H) => H.cards(DEEP) },
      { key: 'ignore', name: 'What to ignore', title: 'Traps that waste learning time', say: 'Saying no to most new things is a skill.',
        view: (d, H) => H.list(IGNORE) },
    ],
    situations: [
      { id: 'sc-new-framework', title: 'A hyped new framework', q: 'A new framework is trending everywhere. Your team\'s React app works well.', a: 'assess', choices: [['assess', 'Read about it and try it in a sandbox; no rewrite without a clear benefit'], ['rewrite', 'Propose rewriting the app in it'], ['ignore', 'Never look at new things']], why: 'Knowing what it does keeps you informed; rewriting a working product is expensive and risky. Assess first, adopt only for a real problem.' },
      { id: 'sc-can-i-use', title: 'Can I use this CSS feature?', q: 'You want to use a new CSS feature in production. How do you check?', a: 'baseline', choices: [['baseline', 'Check Baseline status on MDN / caniuse, and your users\' browsers'], ['chrome', 'It works in my Chrome, so yes'], ['twitter', 'Ask on social media']], why: 'Baseline says whether all major browsers support it. "Widely available" is safe; "Newly available" may need a fallback depending on your users.' },
      { id: 'sc-upgrade', title: 'A major version is out', q: 'A major version of a library your app uses was just released.', a: 'notes', choices: [['notes', 'Read the release notes and upgrade guide, then upgrade on a branch with tests'], ['now', 'Upgrade in production right away'], ['never', 'Never upgrade: it works now']], why: 'Major versions can break things. The upgrade guide lists what changed (often with codemods); a branch with tests makes it safe. Never upgrading leads to security problems and painful jumps later.' },
      { id: 'sc-tutorial-hell', title: 'Course after course', q: 'You have finished five React courses but still feel unable to build an app alone.', a: 'build', choices: [['build', 'Stop starting courses; build one real project and look things up as you go'], ['more', 'Take a more advanced course'], ['switch', 'Switch to a different framework']], why: 'Watching is not the same as building. A real project shows you exactly what you are missing, and that is what you then learn.' },
      { id: 'sc-pick-library', title: 'Choosing between two libraries', q: 'Two libraries solve your problem. One has 40,000 stars but no release in two years; the other is smaller but actively maintained.', a: 'maintained', choices: [['maintained', 'Prefer the actively maintained one, after checking its docs, issues and size'], ['stars', 'The one with more stars'], ['newest', 'Whichever is newest']], why: 'Stars show past popularity, not current health. An unmaintained library will not get security fixes or support new React versions.' },
      { id: 'sc-time', title: 'No time to learn', q: 'Work is busy and you have not learned anything new for months.', a: 'small', choices: [['small', 'Block 2 short sessions a week in your calendar and learn from your current work'], ['weekend', 'Plan one 10-hour weekend binge'], ['later', 'Wait until work is calmer']], why: 'Small, regular sessions fit a busy life and actually happen. Work itself is a great teacher if you note what you learn from each bug and feature.' },
    ],
  });
})();

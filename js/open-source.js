/*
 * JS Engine Lab — 🌱 Open source & building in public: why it helps your career, a first pull request
 * step by step (with the Git commands), finding issues, etiquette, programmes (GSoC, Outreachy, LFX…),
 * showing your work, and licences.
 * Built with makeTopicTab (topic-tab.js); situations are also 🏋️ Practice tasks (topic "Open source").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  const WHY = [
    ['Learn from real codebases', 'Large, well-run projects show you tests, CI, code review and architecture you rarely see in tutorials.'],
    ['Proof anyone can check', 'A merged pull request in a known project shows that experienced maintainers reviewed and accepted your code.'],
    ['People and referrals', 'Maintainers and contributors work at companies that hire. Good contributors get noticed.'],
    ['Paid programmes', 'Google Summer of Code, Outreachy and LFX Mentorship pay you to contribute, with a mentor.'],
    ['Fix what you use', 'Found a bug in a library you use at work? Fixing it upstream helps everyone and teaches you the library deeply.'],
  ];
  const FIRST_PR = `# 1. Fork the project on GitHub (the Fork button), then:
git clone https://github.com/<you>/<project>.git
cd <project>
git remote add upstream https://github.com/<owner>/<project>.git

# 2. Read README.md and CONTRIBUTING.md; install and run the tests
npm install
npm test

# 3. A branch for your change
git switch -c fix/button-focus-ring

# 4. Make the change, then commit (some projects need a sign-off: git commit -s)
git add -p
git commit -m "fix(button): show the focus ring for keyboard users"
git push -u origin fix/button-focus-ring

# 5. Open the pull request on GitHub: say what and why, add screenshots
#    for UI changes, and link the issue: "Fixes #123"

# 6. If main moved on, update your branch
git fetch upstream
git rebase upstream/main
git push --force-with-lease`;
  const FIND = [
    'Search GitHub issues by the labels "good first issue" and "help wanted", in a language you know (JavaScript / TypeScript).',
    'goodfirstissue.dev and up-for-grabs.net collect beginner-friendly issues.',
    'Start small: documentation, typos, broken examples, missing tests, reproducing a reported bug.',
    'Best of all: projects you already use. You know the problems, and the fix may help your own work.',
  ];
  const PROJECTS = 'freeCodeCamp, MDN content, Excalidraw, Docusaurus, Storybook, Astro, Vite, TanStack, Material UI, Chakra UI, Playwright, ESLint, Prettier, Hoppscotch, Appsmith, Cal.com, Supabase, Zulip, Mattermost, Jitsi';
  const ETIQUETTE = [
    'Read CONTRIBUTING.md and the code of conduct before anything else.',
    'Comment on the issue before you start, and wait to be assigned if the project assigns issues.',
    'One change per pull request, kept small. Follow the project\'s style; run its lint and tests.',
    'Explain what you changed and why; add screenshots or a short video for UI changes.',
    'Reply to review comments politely; push fixes to the same branch.',
    'Be patient: most maintainers are volunteers. One polite reminder after a week or two is fine.',
    'Do not spam: no "assign me" on ten issues, no tiny PRs just for a T-shirt, no comments that only say "+1".',
    'Do not send AI-generated pull requests you do not understand. Many projects now reject them, and some ban the accounts.',
    'Sign the CLA (contributor licence agreement) or add a DCO sign-off when the project asks.',
  ];
  const PROGRAMMES = [
    ['Google Summer of Code', 'Paid, with a mentor; projects of about 90, 175 or 350 hours over 8–22 weeks; for students and people new to open source (18+)', 'Proposals around March–April'],
    ['Outreachy', 'Paid internships for people underrepresented in tech', 'Two rounds a year'],
    ['LFX Mentorship (Linux Foundation)', 'Paid mentorships on Linux Foundation and CNCF projects', 'Three terms a year'],
    ['Hacktoberfest', 'Contribute in October; quality rules against spam', 'Every October'],
    ['MLH Fellowship', 'A 12-week remote programme with a stipend', 'Several batches a year'],
    ['GirlScript Summer of Code (India)', 'Beginner-friendly, mentor-led programme', 'Summer'],
    ['C4GT: Code for GovTech (India)', 'Contribute to Indian public digital infrastructure projects', 'Yearly'],
  ];
  const PUBLIC = [
    ['Your GitHub profile', 'A short profile README, and 4–6 pinned repositories with clear READMEs, screenshots and live demo links. The green squares matter much less than good projects.'],
    ['Write what you learn', '"How I fixed X", "What I learned building Y": a blog, dev.to, Hashnode or LinkedIn posts. Writing shows you can communicate, which interviewers notice.'],
    ['Show, do not tell', 'A 30-second video or GIF of your project working beats a long description.'],
    ['Meetups and conferences', 'Local JavaScript and React meetups, and conferences like JSConf India and React India. Speaking at a meetup is easier than you think.'],
    ['Consistency over volume', 'One good post or project a month beats a burst of activity before job hunting.'],
    ['Never share company code', 'Your employer\'s code and data are confidential (NDA). Show your own projects instead.'],
  ];
  const LICENCES = [
    ['MIT, BSD', 'Use it anywhere, even in closed-source products', 'Keep the copyright and licence notice'],
    ['Apache-2.0', 'The same, plus an explicit patent grant', 'Keep the notice and NOTICE file; state your changes'],
    ['GPL-3.0', 'Use and change it', 'If you distribute software that includes it, release that code under GPL too (copyleft)'],
    ['AGPL-3.0', 'Like GPL', 'Also applies when people use it over a network (SaaS); many companies forbid it'],
    ['No licence', 'Nothing: all rights reserved by default', 'Ask the author to add a licence before you reuse it'],
    ['CC BY (docs, images)', 'Reuse content', 'Credit the author'],
  ];

  window.makeTopicTab({
    id: 'os', title: '🌱 Open source', sub: 'contributing, showing your work, and licences',
    button: 'btnOss', map: 'oss', api: 'OssLab', cat: 'Open source', icon: '🌱', solver: 'oss',
    scene: 'Contributing to open source and showing your work.', hint: 'What would a busy maintainer, or your company\'s lawyer, want?',
    stages: [
      { key: 'why', name: 'Why', title: 'Why open source helps your career', say: 'Public, reviewed work is the strongest proof of skill a resume can link to.',
        view: (d, H) => H.cards(WHY) },
      { key: 'first', name: 'Your first PR', title: 'Your first pull request, step by step', say: 'The same flow works for almost every project on GitHub.',
        view: (d, H) => H.code(FIRST_PR) + H.note('The ⌨️ Terminal & Git tab explains each Git command.') },
      { key: 'find', name: 'Finding issues', title: 'Finding something to work on', say: 'Pick small, clear issues first; bigger ones come after a few merged PRs.',
        view: (d, H) => H.list(FIND) + `<p><b>Popular projects with good first issues</b> (frontend-friendly)</p><div class="co-names">${PROJECTS.split(', ').map(n => `<span>${H.esc(n)}</span>`).join('')}</div>` },
      { key: 'etiquette', name: 'Etiquette', title: 'How to be a contributor maintainers love', say: 'Maintainers remember people who make their job easier.',
        view: (d, H) => H.list(ETIQUETTE) },
      { key: 'programmes', name: 'Programmes', title: 'Programmes that pay or mentor you', say: 'Dates change every year: check each programme\'s site.',
        view: (d, H) => H.table(['Programme', 'What', 'When'], PROGRAMMES) },
      { key: 'public', name: 'Build in public', title: 'Showing your work', say: 'Recruiters look you up. Make sure what they find shows what you can do.',
        view: (d, H) => H.cards(PUBLIC) },
      { key: 'licences', name: 'Licences', title: 'Open-source licences', say: 'Every dependency you install comes with a licence. At a company, it decides what you may ship.',
        view: (d, H) => H.table(['Licence', 'You can', 'You must'], LICENCES) + H.note('Tools like license-checker list the licences in your node_modules. Companies often block GPL / AGPL in their products.') },
    ],
    situations: [
      { id: 'os-start', title: 'Your very first contribution', q: 'You want to start contributing to a popular UI library.', a: 'small', choices: [['small', 'Pick a "good first issue": docs, a test, or a small bug'], ['rewrite', 'Rewrite its slowest component and open a big PR'], ['feature', 'Add a feature you want without asking']], why: 'Small, clear changes get reviewed and merged, and teach you the project\'s process. Big unrequested changes are usually closed, however good they are.' },
      { id: 'os-assigned', title: 'The issue is taken', q: 'The issue you want is assigned to someone who has not updated it for a month.', a: 'ask', choices: [['ask', 'Ask politely whether they are still working on it, or pick another issue'], ['pr', 'Open your own PR anyway'], ['complain', 'Complain to the maintainers']], why: 'Respecting assignments avoids duplicate work. Maintainers often reassign stale issues if you ask kindly.' },
      { id: 'os-review', title: 'You disagree with a review', q: 'A maintainer asks for a change you think makes the code worse.', a: 'discuss', choices: [['discuss', 'Explain your reasoning politely, then follow their decision'], ['ignore', 'Ignore the comment'], ['close', 'Close the PR']], why: 'Maintainers know the project\'s history and future plans. A short, polite explanation is welcome; in the end it is their project.' },
      { id: 'os-agpl', title: 'An AGPL library at work', q: 'You find a great AGPL-licensed library for your company\'s SaaS product.', a: 'check', choices: [['check', 'Check with your tech lead or legal before using it'], ['use', 'Use it: open source is free'], ['copy', 'Copy the code in without the licence']], why: 'AGPL can require releasing your own code when users use it over a network. Many companies forbid it. Removing the licence is a licence violation.' },
      { id: 'os-nolicence', title: 'A repository with no licence', q: 'A GitHub repository with a component you like has no LICENSE file.', a: 'ask', choices: [['ask', 'Do not reuse it; ask the author to add a licence'], ['free', 'Public on GitHub means free to use'], ['credit', 'Use it and credit the author']], why: 'Without a licence, all rights are reserved: being public is not permission. Credit alone does not make it legal.' },
      { id: 'os-silent', title: 'No reply on your PR', q: 'Your pull request has had no response for two weeks.', a: 'ping', choices: [['ping', 'Leave one polite comment asking if anything is needed'], ['spam', 'Tag every maintainer every day'], ['delete', 'Delete your fork']], why: 'Maintainers are busy, often volunteers. One friendly reminder is fine; in the meantime, keep your branch up to date.' },
      { id: 'os-ai-prs', title: 'Mass AI pull requests', q: 'A friend suggests using AI to open small PRs in 50 repositories to "boost your GitHub".', a: 'dont', choices: [['dont', 'Do not: it wastes maintainers\' time and can get you banned'], ['do', 'Do it: more PRs look good'], ['some', 'Do it, but only 10']], why: 'Maintainers recognise low-effort PRs, and they hurt your reputation more than they help. A few real contributions you understand are worth far more.' },
      { id: 'os-company-code', title: 'Showing work code', q: 'You built a great component at work and want to put it on your GitHub to show recruiters.', a: 'no', choices: [['no', 'Do not post it; build your own version from scratch in your own time'], ['post', 'Post it: you wrote it'], ['rename', 'Post it with the company name removed']], why: 'Code you write for your employer belongs to them and is usually covered by your NDA. Posting it can get you fired. Rebuilding the idea independently, without their code, is the safe way.' },
    ],
  });
})();

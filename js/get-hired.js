/*
 * JS Engine Lab — 🏆 Get hired: strategies to get interviews and pass them.
 * The job hunt, a resume that passes ATS and people, a preparation plan, online tests, tactics for every round,
 * HR and salary questions, presence and remote setup, the day itself, after the interview, and common mistakes.
 * (🎯 Interview prep has the questions themselves.) Situations are also 🏋️ Practice tasks ("Interview strategy").
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const L = (...lines) => lines.join('\n');

  // each stage: cards { t, b (brief), d (details), ex (example, details only) }
  const STAGES = [
    { key: 'hunt', name: 'Getting interviews', title: 'Getting interviews', say: 'Most rejections happen before any interview. Treat the job search like a funnel and work every channel.', cards: [
      { t: 'Referrals first', b: 'A referral from someone inside gets far more replies than a cold application. Ask former classmates, colleagues and people you meet in communities.', d: 'Find people on LinkedIn who work there (your college, your city, the frontend team). Send a short, specific message with the job link and your resume; make it easy to say yes.',
        ex: L('Hi Ananya, I saw the Frontend Engineer (React) opening at Razorpay: <link>.', 'I have 2 years of React + TypeScript experience and built a dashboard that cut load time 40% (resume attached).', 'Would you be open to referring me? Happy to answer anything. Thanks!') },
      { t: 'Apply early and often', b: 'Apply within the first few days of a posting; aim for a steady number each week (10–20) and track every application.', d: 'Keep a simple sheet: company, role, date, channel (referral / site / recruiter), status, next step. It shows what works and stops you losing track.' },
      { t: 'Where to apply', b: 'Company careers pages, LinkedIn Jobs, Naukri, Instahyre, Cutshort, Hirist, Wellfound (startups), Unstop and hiring challenges.', d: 'The 🏙️ Companies tab lists hundreds of companies to check one by one. Careers pages often have roles before job boards do.' },
      { t: 'Be findable', b: 'A complete LinkedIn profile with the right title ("Frontend Developer · React · TypeScript") makes recruiters come to you.', d: 'Turn on "Open to work" (recruiters only, if employed), add your projects with links, list skills that match job posts, and pin your best GitHub repositories.' },
      { t: 'Build proof', b: 'Two or three finished projects with live links and a README beat a long list of skills.', d: 'The 🚀 project briefs are made for this. Add the numbers you measured (Lighthouse, bundle size). Writing about what you built (a blog post, a LinkedIn post) gets noticed too.' },
    ] },
    { key: 'resume', name: 'Resume', title: 'A resume that passes ATS and people', say: 'Software (an ATS) filters resumes first, then a person skims each one for about ten seconds.', cards: [
      { t: 'One page, simple layout', b: 'One page (two only with many years), a single column, standard headings, no photos, tables or graphics; send it as a PDF.', d: 'Applicant tracking systems read plain text: fancy templates with columns and icons can scramble your content. Name the file like "Ravi-Kumar-Frontend-Resume.pdf".' },
      { t: 'Use the job post\'s words', b: 'Mirror the keywords from the job description (React, TypeScript, Next.js, testing, accessibility) where they are true for you.', d: 'Keep one base resume and adjust the summary and skills for each application. Never add skills you cannot discuss in an interview.' },
      { t: 'Bullets that show impact', b: 'Action + what you did + the result with a number. Not duties: achievements.', d: 'If you have no numbers from work, use your projects: load time, Lighthouse score, users, bundle size, test coverage, time saved.',
        ex: L('❌ Worked on the frontend of the dashboard using React.', '❌ Responsible for performance improvements.', '', '✅ Rebuilt the analytics dashboard in React + TypeScript, cutting load time from 4.2s to 1.6s (LCP).', '✅ Built a reusable component library (24 components, Storybook, 90% test coverage) used by 3 teams.', '✅ Added an optimistic cart with rollback; checkout errors dropped 30%.') },
      { t: 'The order', b: 'Name and links (GitHub, portfolio, LinkedIn) → short summary → skills → experience → projects → education.', d: 'Freshers: put projects before experience. Link every project to its live site and code. A short summary: "Frontend developer, 2 years, React and TypeScript, focused on performance and accessibility."' },
      { t: 'Check before sending', b: 'No spelling mistakes, consistent dates and formatting, links that work, and a phone number and email you check.', d: 'Paste it into a plain text editor: if it reads well there, an ATS can read it. Ask a friend to skim it for ten seconds and tell you what they remember.' },
    ] },
    { key: 'plan', name: 'Prep plan', title: 'A six-week preparation plan', say: 'One to two focused hours a day beats occasional long sessions. This lab already has the material for every week.', cards: [
      { t: 'Weeks 1–2: JavaScript and the web', b: 'The Practice list from the start: scope, closures, this, the event loop, promises, the DOM, CSS layout.', d: 'Also two or three easy DSA problems a day (arrays, strings, hash maps). Say every answer out loud.' },
      { t: 'Weeks 3–4: React and machine coding', b: 'ReactVisual practice and challenges; build one small UI a day with a 60-minute timer.', d: 'Autocomplete, modal, tabs, todo, infinite scroll, star rating (see 🎯 Interview prep → Machine coding). Medium DSA problems continue.' },
      { t: 'Week 5: system design and projects', b: 'Frontend system design (RADIO, ReactVisual\'s six designs), performance, security; polish one project.', d: 'Practise drawing a component tree and explaining where each piece of state lives, in 30 minutes, out loud.' },
      { t: 'Week 6: mocks and stories', b: 'Mock interviews with friends or online, five STAR stories, your 60-second introduction, and questions to ask.', d: 'Record yourself once: you will notice filler words and rambling immediately. Fix one thing per mock.' },
      { t: 'Every day', b: 'Apply to a few jobs, review yesterday\'s mistakes, and keep a log of questions you could not answer.', d: 'The log becomes your revision list for the night before an interview.' },
    ] },
    { key: 'oa', name: 'Online tests', title: 'Online assessments', say: 'Often the first filter: timed coding on HackerRank, HackerEarth, CodeSignal, Mettl or similar.', cards: [
      { t: 'Read everything first', b: 'Read all questions, start with the one you can solve fastest, and keep an eye on the clock.', d: 'Points usually count per passing test case: a correct simple solution beats an unfinished clever one.' },
      { t: 'Edge cases decide the score', b: 'Empty input, one element, duplicates, negative numbers, very large input.', d: 'Hidden test cases check these and performance. If a brute-force solution passes some cases, submit it, then improve it.' },
      { t: 'Frontend-specific tests', b: 'Some tests ask you to build a small UI or fix a React component in an online editor.', d: 'Get it working first, then handle states and edge cases; make sure it runs in their environment (no missing imports).' },
      { t: 'Follow the rules', b: 'Tests are often proctored (camera, tab switching tracked): one device, a quiet room, no other windows.', d: 'Do a practice test on the same platform beforehand so the editor and shortcuts are familiar.' },
    ] },
    { key: 'rounds', name: 'Technical rounds', title: 'Tactics for the technical rounds', say: 'Interviewers judge how you think and communicate, not only whether the final code runs.', cards: [
      { t: 'The universal method', b: 'Listen → ask clarifying questions → walk through an example → explain your plan → code → test it yourself → improve.', d: 'Never start coding in silence. Saying the plan first lets the interviewer correct you early, which saves the round.' },
      { t: 'Coding problems (DSA)', b: 'Start with a simple working idea, say its time and space cost, then optimise. Test with your own examples, including edge cases.', d: 'Common patterns: hash map lookups, two pointers, sliding window, sorting first, BFS / DFS, recursion with memoisation. Name the pattern when you see it.' },
      { t: 'JavaScript and React questions', b: 'Answer in five parts: definition → why it exists → how it works inside → a tiny example → a pitfall.', d: 'This is where knowing the internals (the event loop, reconciliation, fibers) makes you stand out. 🎯 Interview prep has 40 questions to practise.' },
      { t: 'Machine coding', b: 'Clarify (5 min), plan components and state (5 min), core flow first, then states, accessibility, polish. Talk throughout.', d: 'Keep a working version at all times. At the end, list what you would add with more time: tests, caching, error handling.' },
      { t: 'System design', b: 'You drive: requirements, then architecture, data, API, optimisations (RADIO). Draw and keep it simple first.', d: 'Check in with the interviewer: "Should I go deeper into the data layer or into performance?" They often have a direction in mind.' },
      { t: 'When you are stuck', b: 'Say what you are thinking, try a smaller example, or solve a simpler version first; it is fine to ask for a hint.', d: 'Taking a hint well and moving forward scores far better than silence. Interviewers want to see how you work through difficulty.' },
    ] },
    { key: 'hr', name: 'HR & behavioural', title: 'HR and behavioural rounds', say: 'These rounds reject strong engineers more often than people expect. Prepare them like technical rounds.', cards: [
      { t: '"Tell me about yourself"', b: 'About 60 seconds: present (role, skills) → past (one or two achievements) → future (why this job).', d: 'Do not recite your resume. End by connecting to the role: "…so a team building a fast, accessible checkout is exactly what I want next."',
        ex: L('I am a frontend developer with two years of React and TypeScript experience.', 'At my current company I rebuilt our analytics dashboard and cut its load time from 4 to under 2 seconds,', 'and I built a small component library that three teams now use.', 'I am looking for a product team where performance and user experience matter, which is why this role caught my eye.') },
      { t: 'Why this company? Why are you leaving?', b: 'Be specific about the company (product, engineering blog, mission); talk about growth, never complain about your current employer.', d: '"I want to work on a product used by millions and grow in performance engineering, which my current project does not offer" works; "my manager is bad" does not.' },
      { t: 'Salary expectations', b: 'Research the range first; share a researched range, or politely ask for their budget first.', d: '"Based on the role and market data, I am looking at ₹X–Y LPA, but I am flexible for the right role. What range have you budgeted?" In India you may be asked your current CTC; answer honestly and steer to expected pay.' },
      { t: 'Behavioural stories (STAR)', b: 'Situation, Task, Action, Result: five prepared stories cover most questions (a hard bug, a conflict, a mistake, a deadline, something you are proud of).', d: 'Say "I", not only "we"; include numbers; end with what you learned. See 🎯 Interview prep → Behavioural for an example.' },
      { t: 'Notice period and availability', b: 'Know your notice period and whether a buyout is possible; say it clearly.', d: 'Shorter availability can be an advantage; if yours is 90 days, say whether you can negotiate an earlier release.' },
      { t: 'Your questions for them', b: 'Always ask two or three thoughtful questions at the end.', d: '"What would success look like in my first three months?" "How do you review code and release?" "What is the hardest problem the team is working on?"' },
    ] },
    { key: 'people', name: 'Win the people', title: 'Win the people over: recruiter, interviewer, hiring manager, HR', say: 'Each person in the process wants something different and is worried about something different. Give each one what they need to say "yes".', cards: [
      { t: '📞 The recruiter', b: 'Wants: candidates who match the role, are genuinely interested, and will not drop out late. Worries: wasting the hiring manager\'s time.', d: 'Be clear and quick: role, years, main stack, notice period, expected range, why this company. Treat them as your ally: they want you to succeed, because a hire is their goal too. Ask what the team values and what the rounds focus on: they often tell you.',
        ex: L('Recruiter: "Tell me a bit about yourself."', 'You: "I am a frontend developer with 2 years in React and TypeScript, mostly on dashboards and performance.', '     I saw this role is about the checkout experience, which is exactly the kind of work I want to do next.', '     My notice period is 60 days, and I can discuss an early release. What does the team care about most in this hire?"') },
      { t: '🧑‍💻 The technical interviewer', b: 'Wants: someone they would enjoy working next to, who thinks clearly and writes code they would approve in review. Worries: someone who needs constant help.', d: 'Make their job easy: think aloud, ask good clarifying questions, react well to hints, test your own code. Show you are pleasant to work with: say "good point", build on their ideas, stay calm. Many interviewers decide by asking themselves "would I want this person on my team?"',
        ex: L('"Before I code, let me confirm: the list can be empty, and items can repeat, right?"', '"My first idea is a nested loop, O(n²). I think a hash map gets this to O(n). Shall I go with that?"', '"Good catch, thank you: that breaks for an empty array. Let me add a guard and a test."') },
      { t: '👩‍💼 The hiring manager', b: 'Wants: someone who solves their team\'s problems, grows, and is reliable. Worries: a bad hire that slows the whole team down.', d: 'Research what the team builds and connect your stories to it. Talk about outcomes ("cut load time 60%"), ownership ("I took it from design to release"), and how you work with people. Ask about their problems, then show how you have solved similar ones.',
        ex: L('"You mentioned the dashboard is slow for large accounts. In my last project we had the same issue:', ' we virtualised the table and moved filtering to the server, and load time dropped from 6 to 1.5 seconds.', ' Is that the kind of problem this team is working on?"') },
      { t: '🤝 HR', b: 'Wants: someone who fits the culture, will accept the offer and will stay. Worries: salary mismatch, a long notice period, someone who leaves within a year.', d: 'Be warm, positive and consistent with what you told the recruiter. Show long-term interest ("I want to grow into a senior role here"). Discuss salary as a conversation, not a fight. Never badmouth a previous employer.',
        ex: L('"I am looking for a place to grow for the next few years, and what I heard about your mentoring culture matters a lot to me."', '"On salary, I am at ₹X LPA now and looking for ₹Y–Z for this role, based on market data. I am open to discussing the full package."') },
      { t: '🧑‍🤝‍🧑 Panels and bar raisers', b: 'Several interviewers or a senior "bar raiser" from another team: each one needs to be convinced on their own.', d: 'Look at and answer the person who asked, but include everyone. A bar raiser looks for long-term potential: show curiosity, learning and high standards.' },
    ] },
    { key: 'objections', name: 'Objections', title: 'Answering the doubts that cost offers', say: 'A doubt that stays unspoken becomes a "no". Answer it calmly with a fact, then turn it into a strength.', cards: [
      { t: '"You do not have enough experience."', b: 'Agree with the fact, then show evidence of the skill: projects, results, speed of learning.', ex: 'True, I have 1 year of professional experience. In that year I shipped two production features end to end, and I built three projects with tests and CI. I learn fast: I picked up TypeScript in two weeks for my last project. I would like to show you in the technical round.' },
      { t: '"You are a fresher."', b: 'Show proof of work (projects, internship, open source) and eagerness to learn.', ex: 'I do not have work experience yet, but I built a full dashboard with React, TypeScript and tests, deployed it with CI, and measured its performance with Lighthouse. Can I walk you through it?' },
      { t: '"There is a gap in your resume."', b: 'One honest sentence about why, then what you did to stay sharp; do not over-explain.', ex: 'I took 8 months off for a family situation. During that time I kept building: I finished a React course and two projects, which are on my GitHub. I am fully ready to start now.' },
      { t: '"Your notice period is too long."', b: 'Say what is possible: an early release, a buyout, or starting part-time on onboarding.', ex: 'My notice is 90 days, but I have already discussed an early release with my manager, and I expect to join within 45–60 days. If needed, I can also discuss a buyout.' },
      { t: '"Your expected salary is above our budget."', b: 'Do not drop your number immediately: ask about the full package and your value, then decide.', ex: 'I understand. Could you share the range for the role? I am flexible on structure: a joining bonus, an earlier review, or a higher level could close the gap. What matters most to me is the role and growth.' },
      { t: '"You have not used our stack (e.g. Vue / Angular)."', b: 'Show the transferable concepts and a quick learning plan.', ex: 'I have not used Vue in production, but I know the concepts it is built on: components, reactivity, state and routing. I have read the Vue docs and built a small app to compare it with React. I would be productive within the first weeks.' },
      { t: '"You changed jobs often."', b: 'Give a short, positive reason for each move and show you want stability now.', ex: 'My first company shut down its India team, and my second role changed into support work. I am now looking for a place to stay and grow for several years, which is why your mentoring and promotion path interests me.' },
    ] },
    { key: 'rapport', name: 'Rapport & closing', title: 'Rapport, storytelling and a strong close', say: 'People remember how a conversation felt, its strongest moment and how it ended. Use that.', cards: [
      { t: 'The first five minutes', b: 'Smile, use their name, a little genuine small talk, and a confident 60-second introduction.', d: 'First impressions colour how interviewers judge everything after. Be on time (5 minutes early online), camera on, ready to go.' },
      { t: 'Listen more than you think', b: 'Let them finish, repeat back the important part, and answer exactly what was asked.', d: '"So the main concern is performance on slow phones, right?" Checking shows care, and avoids answering the wrong question.' },
      { t: 'Show genuine interest', b: 'Ask about their work, their team and their challenges; refer back to what they said.', d: 'People like people who are interested in them. Curiosity about the product and the problem is one of the strongest positive signals.' },
      { t: 'Tell stories, not lists', b: 'Problem → what you did → the result with a number → what you learned. Stories are remembered; adjectives ("hard-working, passionate") are not.', d: 'Prepare 5 stories you can adapt to many questions. Practise them out loud until they are about 2 minutes each.' },
      { t: 'Confident, not arrogant', b: 'Own your achievements ("I built…"), credit others ("with the backend team…"), admit what you do not know.', d: 'Confidence is calm clarity; arrogance is dismissing questions or interviewers. Being easy to work with is part of the evaluation.' },
      { t: 'Close strongly', b: 'Near the end, ask: "Is there anything in my background that makes you hesitate?" Then answer it calmly.', d: 'This brings hidden doubts into the open while you can still address them. Then say clearly that you want the job and why. Interviews are often remembered by their ending.',
        ex: L('"Thank you, I really enjoyed this, especially the discussion about the checkout redesign.', ' Before we finish: is there anything about my experience that makes you hesitate?"', '(answer it)', '"This is exactly the kind of work I want to do, and I would love to join the team. What are the next steps?"') },
      { t: 'Follow up personally', b: 'A short thank-you that mentions something specific from the conversation.', d: 'Generic thank-you notes are forgotten; "I kept thinking about your question on caching, and here is one more idea…" is remembered.' },
    ] },
    { key: 'presence', name: 'Presence & setup', title: 'Communication, presence and remote setup', say: 'Clear, calm communication is part of what is being assessed in every round.', cards: [
      { t: 'Think out loud', b: 'Narrate your reasoning in short sentences; pause to let the interviewer react.', d: 'Structure long answers: "Three things: first…, second…, third…". It sounds confident and is easy to follow.' },
      { t: 'Honesty beats bluffing', b: '"I have not used that, but here is how I would approach it" is a strong answer. Bluffing is easy to spot.', d: 'Connect to what you do know: "I have not used Vue, but I know reactivity from React and from how Proxy works…"' },
      { t: 'Remote interview setup', b: 'Stable internet, charged laptop, good microphone, camera at eye level, quiet room, light in front of you.', d: 'Test the meeting link and screen sharing beforehand; have an editor and a browser ready; close notifications and other apps; keep a phone hotspot as a backup.' },
      { t: 'Body language', b: 'Look at the camera when speaking, sit upright, smile at the start, do not read from notes.', d: 'Nervousness is normal and interviewers expect it. A slow breath before answering helps more than anything else.' },
    ] },
    { key: 'day', name: 'The day', title: 'The day before and the day of', say: 'Make the day predictable so all your attention goes to the problems.', cards: [
      { t: 'The day before', b: 'Light revision only (your question log, your stories); research the company; plan the route or test the setup; sleep well.', d: 'Re-read the job description and match each requirement to a story or project of yours.' },
      { t: 'One hour before', b: 'Eat, water nearby, setup tested, a warm-up problem to get your brain moving.', d: 'Have your resume, the job description and your questions in front of you (not to read from, just as reminders).' },
      { t: 'During', b: 'Arrive or join 5 minutes early; listen fully before answering; write down the problem statement.', d: 'If you make a mistake, say so and fix it calmly: recovering well is a positive signal.' },
      { t: 'Between rounds', b: 'Do not replay the last round; reset with water and a few deep breaths.', d: 'You often cannot tell how a round went. Many people who think they failed a round still get the offer.' },
    ] },
    { key: 'after', name: 'After', title: 'After the interview', say: 'Follow up, learn from every round, and handle offers well.', cards: [
      { t: 'Follow up', b: 'A short thank-you message the same day; if there is no update in about a week, a polite follow-up to the recruiter.', d: '"Thank you for the conversation today. I enjoyed discussing the dashboard performance work and am excited about the role."' },
      { t: 'Learn from every interview', b: 'Write down every question within an hour, and how you would answer better.', d: 'Patterns appear quickly: the same topics come up again and again. Fix those first.' },
      { t: 'Rejections', b: 'Normal, even for strong candidates. Ask politely for feedback, update your log, keep applying.', d: 'Many companies allow you to re-apply after 6–12 months. Rejection is often about fit or timing, not only your skill.' },
      { t: 'Offers and negotiation', b: 'Get the offer in writing, compare fixed pay and in-hand, and negotiate politely, using competing offers if you have them.', d: 'Timing helps: try to have several processes finish around the same time. See 💼 Corporate life → Salary & offers for CTC and in-hand.' },
      { t: 'Accepting and declining', b: 'Accept in writing; decline other offers promptly and politely. Do not accept and then not join.', d: 'The industry is small: recruiters and managers remember how you handled it.' },
    ] },
    { key: 'mistakes', name: 'Common mistakes', title: 'Common mistakes that cost offers', say: 'Avoiding these is often the difference between "almost" and "hired".', cards: [
      { t: 'Coding in silence', b: 'The interviewer cannot give credit for thinking they cannot hear.' },
      { t: 'Jumping in without clarifying', b: 'Solving the wrong problem perfectly still fails the round.' },
      { t: 'Not testing your own code', b: 'Walk through an example and the edge cases before saying "done".' },
      { t: 'Memorised answers', b: 'Reciting definitions without understanding falls apart at the first follow-up question.' },
      { t: 'Ignoring the hints', b: 'A hint is the interviewer helping you: use it.' },
      { t: 'Arguing with the interviewer', b: 'Disagree with reasons, politely; stay open.' },
      { t: 'No questions at the end', b: 'It looks like a lack of interest.' },
      { t: 'Badmouthing employers', b: 'It worries every interviewer about how you would talk about them.' },
      { t: 'Skipping the HR round preparation', b: 'Many offers are lost on salary, notice period or "why are you leaving?" answers.' },
      { t: 'Applying to too few places', b: 'Interviews are partly luck and timing: apply widely and keep going.' },
    ] },
  ];

  const SITUATIONS = [
    { id: 'iv-unknown', title: 'You do not know the answer', q: 'The interviewer asks about a library you have never used.', a: 'honest', choices: [['honest', 'Say so honestly, then explain how you would approach it using what you do know'], ['bluff', 'Bluff confidently'], ['skip', 'Say "I don\'t know" and wait']], why: 'Honesty plus reasoning shows how you learn and think. Bluffing is easy to spot and damages trust for the rest of the interview.' },
    { id: 'iv-stuck', title: 'Stuck on a coding problem', q: 'Ten minutes into a coding problem, you are stuck.', a: 'talk', choices: [['talk', 'Say what you have tried, try a smaller example or a simpler version, and ask for a hint if needed'], ['silent', 'Keep thinking silently until you get it'], ['quit', 'Ask to skip the question']], why: 'Interviewers grade the process. Thinking aloud lets them help you; a hint used well still scores well. Silence gives them nothing to grade.' },
    { id: 'iv-clarify', title: 'An ambiguous problem', q: 'The interviewer says: "Build an autocomplete component."', a: 'ask', choices: [['ask', 'Ask about the data source, debounce, keyboard use, how many results, and loading or error states, then plan'], ['code', 'Start coding right away to save time'], ['generic', 'Build the most generic version possible']], why: 'Clarifying is part of the test: it shows you would build the right thing at work. Five minutes of questions usually saves the round.' },
    { id: 'iv-salary', title: '"What are your salary expectations?"', q: 'In the first HR call you are asked your expected salary.', a: 'range', choices: [['range', 'Give a researched range, or politely ask for their budget for the role first'], ['low', 'Give a low number so they like you'], ['refuse', 'Refuse to answer']], why: 'A researched range anchors the conversation fairly. A low number is hard to raise later; refusing outright can stall the process.' },
    { id: 'iv-leaving', title: '"Why are you leaving?"', q: 'You are leaving because of a difficult manager.', a: 'growth', choices: [['growth', 'Talk about what you want next (growth, product, technology) without blaming anyone'], ['truth', 'Explain in detail how bad the manager is'], ['money', 'Say it is only about money']], why: 'Focus on what you are moving towards. Complaining about a past employer makes interviewers wonder how you would talk about them.' },
    { id: 'iv-early', title: 'You finish early', q: 'You solved the coding problem with 15 minutes left.', a: 'improve', choices: [['improve', 'Test more edge cases, discuss complexity and improvements, and ask if they want an extension'], ['done', 'Say you are done and wait'], ['rewrite', 'Rewrite it in a fancier way']], why: 'Extra time is a chance to show depth: testing, trade-offs and extensions are exactly what strong candidates add.' },
    { id: 'iv-mistake', title: 'You spot a bug in your own code', q: 'While explaining your solution, you notice a bug.', a: 'fix', choices: [['fix', 'Point it out yourself and fix it calmly'], ['hide', 'Hope the interviewer does not notice'], ['panic', 'Start over from scratch']], why: 'Finding and fixing your own bugs is a strong signal: it is what good engineers do every day.' },
    { id: 'iv-objection', title: '"You lack experience in X"', q: 'The hiring manager says: "You have not worked with large-scale apps before."', a: 'evidence', choices: [['evidence', 'Agree with the fact, then give concrete evidence of related work and how fast you learn'], ['argue', 'Argue that scale does not matter'], ['accept', 'Agree and move on']], why: 'Turning an objection into evidence is the core skill of convincing people. Arguing makes you look defensive; staying silent leaves the doubt in place.' },
    { id: 'iv-close', title: 'The end of the interview', q: 'The interviewer asks: "Do you have any questions for us?"', a: 'close', choices: [['close', 'Ask one or two thoughtful questions, then ask if anything makes them hesitate, and say you want the job'], ['none', 'Say "No, I think you covered everything"'], ['salary', 'Ask only about salary and leave policy']], why: 'The end of an interview is remembered most. Good questions show interest; asking about hesitations lets you answer hidden doubts; saying you want the job removes any doubt about your interest.' },
    { id: 'iv-recruiter', title: 'A recruiter cold call', q: 'A recruiter calls about a role you are interested in, but you are in the middle of work.', a: 'schedule', choices: [['schedule', 'Thank them, show interest, and book a time to talk properly today or tomorrow'], ['now', 'Talk now while distracted'], ['ignore', 'Ignore the call and hope they email']], why: 'Recruiters are your allies: a short, warm reply and a fixed time keeps you in the process and lets you give a focused, convincing answer.' },
    { id: 'iv-rude', title: 'A cold or rushed interviewer', q: 'Your interviewer seems bored and keeps checking their phone.', a: 'engage', choices: [['engage', 'Stay friendly and focused, keep answers crisp, and ask a question that involves them'], ['mirror', 'Become cold too'], ['complain', 'Ask them to pay attention']], why: 'You cannot control their mood, only your behaviour. Crisp answers and a question about their view often re-engage people; staying professional is still noted.' },
    { id: 'iv-offers', title: 'Two offers, different deadlines', q: 'Company A gives you an offer with a 3-day deadline; you are in the final round at company B, which you prefer.', a: 'ask', choices: [['ask', 'Tell A you need a little more time, and ask B whether they can speed up their decision'], ['accept', 'Accept A, then leave if B makes an offer'], ['ignore', 'Ignore A\'s deadline']], why: 'Companies are used to this. Asking politely for a short extension, and telling B you have a deadline, is professional; accepting and later backing out damages your reputation.' },
  ];

  if (window.WebLab) window.WebLab.extend('ivs', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }] }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...SITUATIONS.map(x => ({
    id: x.id, cat: 'Interview strategy', kind: 'rule', solver: 'ivs', icon: '🏆', kindLabel: 'what would you do in the interview?',
    title: x.title, ask: 'What would you do?', scene: 'In an interview.',
    choices: x.choices.map(c => c[0]), labels: Object.fromEntries(x.choices),
    hint: 'What would show the interviewer how you think and work?', why: `${esc(x.why)} See the 🏆 Get hired tab.`, scenario: { q: x.q, a: x.a, why: x.why },
  })));

  const ALL = [...STAGES, { key: 'quiz', name: 'What would you do?', title: 'What would you do?', say: 'Interview situations. Pick an answer to see why.' }];
  const UI = { stage: 0, detail: false, answers: {} };
  const cardsView = cards => `<div class="db-grid dp-must">${cards.map(x => `<div class="db-card"><div class="db-h"><b>${esc(x.t)}</b></div><p>${esc(x.b)}</p>${UI.detail && x.d ? `<p class="db-how">${esc(x.d)}</p>` : ''}${UI.detail && x.ex ? `<pre>${esc(x.ex)}</pre>` : ''}</div>`).join('')}</div>`;
  const quizView = () => SITUATIONS.map((x, i) => {
    const got = UI.answers[i], done = got != null, ok = got === x.a, label = k => x.choices.find(c => c[0] === k)[1];
    return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
      <div class="cl-choices">${x.choices.map(([k, l]) => `<button class="btn small cl-choice${got === k ? ' on' : ''}${done && k === x.a ? ' right' : ''}" data-ghq="${i}" data-gha="${k}">${esc(l)}</button>`).join('')}</div>
      ${done ? `<p class="db-ans">${ok ? '✅ Good call' : `❌ Better: <b>${esc(label(x.a))}</b>`}. ${esc(x.why)}</p>` : ''}</div>`;
  }).join('');

  function ensure() {
    let m = $('ghLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'ghLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Get hired');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-ghclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🏆 Get hired</h2><span class="cl-note">strategies to get interviews and pass them · the questions themselves are in 🎯 Interview prep</span></div>
      <div class="px-rail" id="ghRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="ghTitle"></h3><p class="px-say" id="ghSay"></p><button class="btn small dp-detail" id="ghDetail" data-ghdetail></button><div id="ghBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="ghPrev">◀ Back</button><button class="btn small primary" id="ghNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = ALL[UI.stage];
    $('ghRail').innerHTML = ALL.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-ghstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('ghTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('ghSay').textContent = s.say;
    const hasMore = s.cards && s.cards.some(c => c.d || c.ex);
    $('ghBody').innerHTML = s.cards ? cardsView(s.cards) + (UI.detail || !hasMore ? '' : '<p class="cl-note">"+ Show details" adds how to do each one, with examples and phrases you can use.</p>') : quizView();
    $('ghDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('ghDetail').classList.toggle('hidden', !hasMore);
    $('ghPrev').disabled = UI.stage === 0;
    $('ghNext').disabled = UI.stage === ALL.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap', 'companiesLab'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('ghLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnGetHired') || t.closest('[data-fmgethired]')) { open(); return; }
    if (!$('ghLab') || $('ghLab').classList.contains('hidden')) return;
    const st = t.closest('[data-ghstage]');
    if (st) { UI.stage = +st.dataset.ghstage; draw(); return; }
    const a = t.closest('[data-ghq]');
    if (a) { UI.answers[+a.dataset.ghq] = a.dataset.gha; const box = $('ghBody').closest('.px-main'), y = box.scrollTop; draw(); box.scrollTop = y; return; }
    if (t.closest('[data-ghdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#ghPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#ghNext')) { UI.stage = Math.min(ALL.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-ghclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('ghLab') && !$('ghLab').classList.contains('hidden')) close(); });

  window.GetHiredLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = ALL.findIndex(s => s.key === k); draw(); }, stages: ALL, situations: SITUATIONS };
})();

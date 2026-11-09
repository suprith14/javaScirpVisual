/*
 * JS Engine Lab — 🧘 Health & a sustainable career: desk setup, eyes, body and movement, sleep and
 * energy, stress and burnout, work habits, and a long career. General information, not medical advice.
 * Built with makeTopicTab (topic-tab.js); situations are also 🏋️ Practice tasks (topic "Health & career").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;

  const WHY = [
    ['A career is 30–40 years', 'Your body and mind are the tools you use every day. Small habits now prevent back, neck, wrist and eye problems later.'],
    ['Health is productivity', 'Tired, stressed or in pain, you write worse code and make more mistakes. Rest is part of the work.'],
    ['Desk jobs have risks', 'Hours of sitting, screens and deadlines add up quietly: weight, posture, eyes, sleep and stress.'],
    ['You can start small', 'None of this needs a gym membership or a perfect routine: one change a week is enough.'],
  ];
  const DESK = [
    ['Screen', 'An arm\'s length away, with the top of the screen at or slightly below eye level. A laptop stand plus an external keyboard and mouse fixes most laptop posture problems.'],
    ['Chair', 'Back supported (a small cushion for the lower back helps), feet flat on the floor or a footrest, knees about level with hips.'],
    ['Arms and wrists', 'Elbows close to your body at about 90°, wrists straight (not bent up or down), keyboard and mouse close so you do not reach.'],
    ['Light', 'Light from the side, not behind the screen or glaring on it. Match screen brightness to the room.'],
    ['Avoid', 'Working from the bed or sofa for long hours, a laptop flat on a table all day, and a phone held low for long calls (use earphones).'],
    ['Work from home', 'A dedicated corner if possible: it helps both posture and switching off at the end of the day.'],
  ];
  const EYES = [
    ['The 20-20-20 rule', 'Every 20 minutes, look at something about 20 feet (6 m) away for 20 seconds.'],
    ['Blink', 'People blink much less while staring at screens, which dries the eyes. Blink fully, and consider a humidifier in air-conditioned rooms.'],
    ['Make text bigger', 'Zoom your editor and browser instead of leaning in. A comfortable font size reduces strain.'],
    ['Check-ups', 'Get your eyes checked every year or two, and tell the optometrist you work on screens; ask whether you need glasses for computer distance.'],
    ['See a doctor if…', 'You have persistent headaches, blurred vision, or eye pain.'],
  ];
  const BODY = [
    ['Move every 30–60 minutes', 'Stand, walk to get water, take calls standing or walking. Set a reminder if you forget.'],
    ['Simple stretches', 'Neck turns and tilts, shoulder rolls, wrist and finger stretches, a standing back bend: two minutes, a few times a day.'],
    ['Exercise every week', 'The WHO recommends at least 150 minutes of moderate activity a week (e.g. brisk walking) plus strength exercise on 2 days.'],
    ['Strength matters', 'Strong back, core and shoulders protect you from desk-related pain. Bodyweight exercises at home are enough to start.'],
    ['Repetitive strain (RSI)', 'Tingling, numbness, weakness or pain in hands, wrists or forearms that keeps coming back: do not ignore it; see a doctor early.'],
    ['Food and water', 'Keep water at your desk, eat proper meals rather than snacking all day, and go easy on sugary drinks and late-night junk food.'],
  ];
  const SLEEP = [
    ['7–9 hours', 'Most adults need 7–9 hours. Lack of sleep hurts focus, memory and mood, which is exactly what programming needs.'],
    ['A regular schedule', 'Similar sleep and wake times, even on weekends, make sleep better.'],
    ['Caffeine', 'Caffeine lasts for hours in the body: avoid it in the late afternoon and evening if you sleep badly.'],
    ['Screens at night', 'Stop work and bright screens a while before bed; keep the phone away from the bed.'],
    ['Late nights at work', 'Night deploys and incidents happen; take time off afterwards to recover, and say so to your manager.'],
    ['Energy in the day', 'Daylight in the morning, a short walk after lunch, and short breaks keep energy steadier than more coffee.'],
  ];
  const MIND = [
    ['What burnout looks like', 'The WHO describes it as feeling exhausted, distant or cynical about your job, and less effective at it, from long-term work stress that was not managed.'],
    ['Early signs', 'Dreading every workday, irritability, trouble sleeping, no energy on weekends, mistakes you would not normally make.'],
    ['What helps', 'Clear working hours, real time off (use your leave), talking to your manager about workload, exercise, sleep, and people outside work.'],
    ['Impostor syndrome', 'Feeling you are not good enough, even when you are doing fine, is very common among developers, including senior ones. Keep a list of your wins and remind yourself of it.'],
    ['Comparison', 'Social media shows other people\'s highlights. Compare yourself with yourself a year ago.'],
    ['Get support', 'Many companies offer a free, confidential Employee Assistance Programme (EAP) with counsellors. In India, Tele-MANAS (dial 14416) is the government\'s free mental-health helpline, 24 hours a day.'],
  ];
  const HABITS = [
    ['Deep-work blocks', '1–2 hour blocks with notifications off for hard problems; meetings and messages in batches around them.'],
    ['Realistic estimates', 'Add buffer for unknowns and say early when something will take longer. Most crunch comes from optimistic estimates.'],
    ['Say no politely', '"I can take that, but then X moves to next week. Which is more important?" Your manager decides priorities; you make the trade-off visible.'],
    ['Switch off', 'A fixed end time, notifications muted after hours (unless you are on call), and no work apps on your phone if you can avoid it.'],
    ['On-call recovery', 'If you were woken at night for an incident, start later the next day or take time back, as your team\'s policy allows.'],
    ['Use your leave', 'Plan real breaks through the year, not only when you are already exhausted.'],
  ];
  const LONG = [
    ['Keep learning, calmly', 'Steady learning (see 📰 Staying current) keeps you employable at any age; there is no need to chase everything.'],
    ['Money buffer', 'An emergency fund and insurance reduce stress hugely and let you leave a bad job (see 🧾 Tax & money).'],
    ['People', 'Friends and a network outside your company: for support, for perspective, and for your next job.'],
    ['Health check-ups', 'A yearly health check-up; ask your doctor which tests suit your age and family history.'],
    ['Find your pace', 'Some years you will push hard (a new job, a promotion). Balance them with calmer ones.'],
    ['Meaning', 'Notice which work energises you (users, teaching, hard problems, building products) and move your career towards it.'],
  ];

  window.makeTopicTab({
    id: 'hc', title: '🧘 Health & career', sub: 'stay healthy and productive for a long career',
    button: 'btnHealth', map: 'health', api: 'HealthLab', cat: 'Health & career', icon: '🧘', solver: 'health',
    scene: 'Looking after yourself through a long developer career.', hint: 'What protects your health over years, not just today?',
    stages: [
      { key: 'why', name: 'Why it matters', title: 'Why health is a career skill', say: 'General information, not medical advice. See a doctor for anything that worries you or does not go away.',
        view: (d, H) => H.cards(WHY) },
      { key: 'desk', name: 'Desk setup', title: 'Your desk setup', say: 'Most neck, back and wrist pain at a desk comes from a few fixable things.',
        view: (d, H) => H.cards(DESK) },
      { key: 'eyes', name: 'Eyes', title: 'Looking after your eyes', say: 'You look at screens most of your waking hours.',
        view: (d, H) => H.cards(EYES) },
      { key: 'body', name: 'Body & movement', title: 'Body and movement', say: 'Sitting still for hours is the problem; movement through the day is the fix.',
        view: (d, H) => H.cards(BODY) },
      { key: 'sleep', name: 'Sleep & energy', title: 'Sleep and energy', say: 'Sleep is when your brain stores what you learned that day.',
        view: (d, H) => H.cards(SLEEP) },
      { key: 'mind', name: 'Stress & burnout', title: 'Stress, burnout and your mind', say: 'Mental health is health. Asking for help early is a strength.',
        view: (d, H) => H.cards(MIND) },
      { key: 'habits', name: 'Work habits', title: 'Work habits that prevent overload', say: 'Sustainable pace is a professional skill, not a lack of commitment.',
        view: (d, H) => H.cards(HABITS) },
      { key: 'long', name: 'A long career', title: 'Thinking about a long career', say: 'What keeps developers happy and employable for decades.',
        view: (d, H) => H.cards(LONG) },
    ],
    situations: [
      { id: 'hc-wrist', title: 'Tingling fingers', q: 'For two weeks, your fingers tingle and your wrist aches after long coding days.', a: 'doctor', choices: [['doctor', 'Fix your setup and take breaks, and see a doctor early'], ['painkiller', 'Take painkillers and keep going'], ['wait', 'Wait until it gets worse']], why: 'Repeated tingling, numbness or pain can be repetitive strain or a nerve problem. Caught early it is much easier to treat; setup changes and breaks help too.' },
      { id: 'hc-laptop', title: 'Working on a laptop all day', q: 'You work from home all day on a laptop on the dining table, and your neck hurts.', a: 'raise', choices: [['raise', 'Raise the screen to eye level (a stand or books) and use an external keyboard and mouse'], ['bed', 'Work from the bed instead'], ['ignore', 'Ignore it: everyone has neck pain']], why: 'A laptop on a table makes you look down for hours. Raising the screen and typing on a separate keyboard is the single most effective fix.' },
      { id: 'hc-burnout', title: 'Dreading every day', q: 'For weeks you have dreaded work, slept badly and felt nothing you do matters.', a: 'talk', choices: [['talk', 'Talk to your manager about workload, take some leave, and consider counselling (EAP or Tele-MANAS 14416)'], ['harder', 'Work harder to catch up'], ['quit', 'Quit immediately without a plan']], why: 'These are signs of burnout. Workload changes, real rest and support help; pushing harder usually makes it worse, and quitting in a rush can add money stress.' },
      { id: 'hc-overload', title: 'One more task', q: 'You are already full this sprint, and your manager asks you to also take an urgent feature.', a: 'tradeoff', choices: [['tradeoff', 'Say yes to the priority, and ask which current task should move'], ['nights', 'Say yes and work nights to do everything'], ['refuse', 'Refuse flatly']], why: 'Making the trade-off visible lets your manager decide priorities. Silently working nights hides the problem and is not sustainable.' },
      { id: 'hc-incident', title: 'After a 3 AM incident', q: 'You were up until 3 AM fixing a production incident. You have a 10 AM meeting.', a: 'recover', choices: [['recover', 'Tell your manager and start later or take time back, as team policy allows'], ['coffee', 'Drink extra coffee and push through the whole day'], ['hide', 'Say nothing']], why: 'Tired people make more mistakes, sometimes causing the next incident. Good teams expect recovery time after night work.' },
      { id: 'hc-impostor', title: 'Feeling like a fraud', q: 'In a team of senior engineers, you feel you do not belong and will be "found out".', a: 'normal', choices: [['normal', 'Recognise impostor feelings as common, keep a list of wins, and ask questions anyway'], ['hide', 'Avoid asking questions so nobody notices'], ['quit', 'Look for an easier job']], why: 'Impostor feelings are very common, even among seniors. Asking questions is how everyone learns; a record of your wins gives you evidence against the feeling.' },
    ],
  });
})();

/*
 * JS Engine Lab — 🎨 Design basics for developers: the principles, spacing (with a before/after),
 * typography (with a type-scale generator), colour (with a real WCAG contrast checker), layout and
 * hierarchy, components and their states, reading Figma and the hand-off, a polish checklist and
 * where to learn more. Built with makeTopicTab (topic-tab.js); situations are also 🏋️ Practice tasks
 * (topic "Design basics").
 */
(function () {
  'use strict';
  if (!window.makeTopicTab) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ------------------------------------------------------------ WCAG contrast (the real formula from WCAG 2.x)
  function luminance(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) return null;
    const ch = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255)
      .map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }
  function contrast(a, b) {
    const la = luminance(a), lb = luminance(b);
    if (la == null || lb == null) return null;
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  }
  // ------------------------------------------------------------ type scale: base × ratio^step
  const typeScale = (base, ratio) => [-1, 0, 1, 2, 3, 4, 5].map(step => ({ step, px: Math.round(base * ratio ** step * 100) / 100 }));

  const UI = { fg: '#767676', bg: '#ffffff', base: 16, ratio: 1.25 };
  function contrastHTML() {
    const r = contrast(UI.fg, UI.bg);
    if (r == null) return '<p class="cl-note">Type colours as #rrggbb.</p>';
    const row = (what, need) => `<tr><td>${what}</td><td>${need}:1</td><td class="${r >= need ? 'tx-better' : 'ex-bad'}">${r >= need ? '✓ passes' : '✗ fails'}</td></tr>`;
    return `<div class="ds-contrast" style="color:${esc(UI.fg)};background:${esc(UI.bg)}"><b style="font-size:22px">Large heading text</b><br>Normal body text, the kind people read for a long time.</div>
      <p>Contrast ratio: <b id="dsRatio">${r.toFixed(2)}:1</b></p>
      <table class="iv-diff db-words"><thead><tr><th>Use</th><th>Needs</th><th>Result</th></tr></thead><tbody>
        ${row('Normal text (WCAG AA)', 4.5)}${row('Large text, 24px+ or 18.66px+ bold (AA)', 3)}${row('Icons, input borders, focus rings (AA)', 3)}${row('Normal text (AAA, stricter)', 7)}</tbody></table>`;
  }
  function scaleHTML() {
    const names = { '-1': 'small / caption', 0: 'body (base)', 1: 'h4 / lead', 2: 'h3', 3: 'h2', 4: 'h1', 5: 'display' };
    return `<div class="ds-scale">${typeScale(UI.base, UI.ratio).slice().reverse().map(s => `<div class="ds-step"><code>${s.px}px · ${(s.px / 16).toFixed(3).replace(/\.?0+$/, '')}rem</code><span style="font-size:${s.px}px;line-height:1.2">${names[s.step]}</span></div>`).join('')}</div>`;
  }
  document.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.dsin;
    if (!k) return;
    UI[k] = k === 'fg' || k === 'bg' ? e.target.value : Number(e.target.value) || UI[k];
    if (k === 'fg' || k === 'bg') {
      const pair = document.querySelector(`[data-dsin="${k}"]:not([type="${e.target.type}"])`);
      if (pair) pair.value = e.target.value;
      const out = document.getElementById('dsContrastOut');
      if (out) out.innerHTML = contrastHTML();
    } else {
      const out = document.getElementById('dsScaleOut');
      if (out) out.innerHTML = scaleHTML();
    }
  });

  const PRINCIPLES = [
    ['Hierarchy', 'The most important thing should be noticed first. Use size, weight, colour and position to rank things: one main heading, one main action.'],
    ['Spacing', 'White space groups things. Related items sit close together; unrelated groups get more space between them (the law of proximity).'],
    ['Alignment', 'Everything lines up with something. Use a few clear left edges instead of many slightly different ones.'],
    ['Consistency', 'The same thing looks and behaves the same everywhere: one button style for primary actions, one spacing scale, one set of colours.'],
    ['Contrast', 'Text must be readable (WCAG 4.5:1), and important things should stand out from less important ones.'],
    ['Simplicity', 'Remove before you add. Fewer colours, fewer font sizes, fewer borders and boxes. Every element should earn its place.'],
  ];
  const SPACING_RULES = [
    'Use a spacing scale based on 4 or 8: 4, 8, 12, 16, 24, 32, 48, 64. Never "13px because it looked right".',
    'Space inside a group is smaller than the space between groups (e.g. 8px between a label and its input, 24px between fields).',
    'Start with too much white space, then remove some. Cramped is the most common developer design mistake.',
    'Give text room: padding around text in buttons and cards is usually at least 12–16px.',
    'Keep spacing as tokens (--space-2: 8px …) so the whole team uses the same values.',
    'Prefer gap in flex and grid over margins on children: one place, no margin collapsing surprises.',
  ];
  const SPACING_CSS = `:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
}
.card        { padding: var(--space-5); display: grid; gap: var(--space-2); }
.card .actions { margin-top: var(--space-4); }`;
  const TYPE_RULES = [
    ['Fonts', 'One family is enough; two at most (one for headings). A system font stack or a well-made free font (Inter, Roboto, Source Sans 3, Noto Sans for Indian scripts) works well.'],
    ['A type scale', 'Pick sizes from a scale (base × ratio, e.g. 16px × 1.25) instead of random sizes. 5–7 sizes cover a whole app.'],
    ['Body size', '16px is the usual minimum for body text on the web; smaller text is for captions and labels.'],
    ['Line height', '1.4–1.6 for body text; 1.1–1.3 for large headings (big text needs less).'],
    ['Line length', '45–75 characters per line for comfortable reading: max-width: 65ch on paragraphs.'],
    ['Weights', 'Usually just regular (400) and semibold or bold (600 / 700). Use weight and colour for hierarchy before adding more sizes.'],
    ['Units', 'rem for font sizes so they follow the user\'s browser setting; clamp() for headings that grow with the screen.'],
    ['Details', 'Left-align body text (centred only for short headings), avoid ALL CAPS for long text, and do not use light grey text that fails contrast.'],
  ];
  const TYPE_CSS = `html { font-family: Inter, system-ui, sans-serif; }
body { font-size: 1rem; line-height: 1.5; }
p    { max-width: 65ch; }
h1   { font-size: clamp(1.9rem, 1.2rem + 3vw, 3rem); line-height: 1.15; }
h2   { font-size: 1.95rem; line-height: 1.2; }`;
  const COLOUR_RULES = [
    ['Build a palette, not a few colours', 'Neutrals (greys) in 9–10 shades from 50 to 900, one brand colour in several shades, and semantic colours: success (green), warning (amber), danger (red), info (blue).'],
    ['Mostly neutral', 'Most of a good interface is greys and white (or dark greys in dark mode). Use the brand colour for actions and highlights, not everywhere.'],
    ['Contrast', 'Body text at least 4.5:1 against its background, large text and UI parts (icons, borders, focus rings) at least 3:1. Check with the tool below.'],
    ['Never colour alone', 'Errors need an icon or text too, not just red: about 1 in 12 men has some colour-vision deficiency.'],
    ['Dark mode is not "invert"', 'Use dark greys instead of pure black, slightly less saturated colours, and lighter shades for text. Raise surfaces with lighter greys rather than shadows.'],
    ['Use tokens', 'Name colours by purpose (--color-text, --color-surface, --color-primary, --color-danger), not by value (--blue-500), so themes are easy to change.'],
    ['Modern colour spaces', 'oklch() makes even, predictable shades across hues; color-mix() makes hover and disabled shades in CSS.'],
  ];
  const COLOUR_CSS = `:root {
  --color-surface: #ffffff;   --color-text: #1f2328;   --color-muted: #59636e;
  --color-primary: oklch(55% 0.18 255);
  --color-primary-hover: color-mix(in oklch, var(--color-primary), black 12%);
  --color-danger: #c62828;
}
@media (prefers-color-scheme: dark) {
  :root { --color-surface: #161b22; --color-text: #e6edf3; --color-muted: #8b949e; }
}`;
  const LAYOUT = [
    ['A grid', 'A 12-column grid (or simple CSS grid areas) with consistent gutters keeps pages aligned. Content usually has a max width (e.g. 1200px) and side padding.'],
    ['Reading patterns', 'People scan in F-shapes on text pages and Z-shapes on simple landing pages: put key information and actions where eyes go.'],
    ['One primary action', 'Each screen has one main button (filled, brand colour). Secondary actions are outlined or plain text buttons.'],
    ['Group, then separate', 'Use spacing first, then a subtle background or a divider, and only then borders and shadows. Too many boxes look busy.'],
    ['Mobile first', 'Design for a narrow phone first, then add columns as space grows. Test at 360px wide.'],
    ['Touch targets', 'Make buttons and links easy to tap: WCAG 2.2 asks for at least 24×24px; Apple and Google recommend about 44–48px.'],
    ['Images', 'Fixed aspect ratios (aspect-ratio, object-fit: cover) so the layout does not jump, and alt text on every meaningful image.'],
  ];
  const COMPONENTS = [
    ['Buttons', 'Variants: primary, secondary, ghost / text, destructive. Sizes from the spacing scale. A clear label that says what happens ("Save changes", not "OK").'],
    ['Every state', 'Default, hover, focus-visible (a clear ring for keyboard users), active (pressed), disabled, loading. Developers often forget focus and loading.'],
    ['Forms', 'Labels above inputs (not placeholder-only), helper text, specific error messages next to the field ("Enter a 10-digit mobile number"), validate on blur, keep what the user typed.'],
    ['Empty states', 'An empty list should explain what goes there and offer the first action ("No orders yet. Browse products →").'],
    ['Loading', 'Skeletons that match the final layout for content; spinners only for short actions; never a blank screen.'],
    ['Errors', 'Say what happened and what to do next, in plain words, with a retry button where it helps.'],
    ['Icons', 'One icon set, consistent size and stroke; icons next to text labels for anything important (icon-only buttons need an aria-label).'],
    ['Motion', 'Short (150–250ms), with ease-out; motion explains change (opening, moving) rather than decorating. Respect prefers-reduced-motion.'],
  ];
  const FIGMA = [
    ['Auto layout', 'display: flex (direction, gap, padding, alignment)'],
    ['Hug contents / Fill container / Fixed', 'width: fit-content / flex: 1 (or width: 100%) / a fixed width'],
    ['Constraints and min / max width', 'position, min-width, max-width'],
    ['Components and variants', 'React components and their props (variant="primary", size="sm")'],
    ['Variables and styles', 'CSS custom properties (design tokens): colours, spacing, radius, type'],
    ['Layout grid', 'CSS grid with the same columns and gutters'],
    ['Effects (drop shadow, blur)', 'box-shadow, filter / backdrop-filter'],
    ['Export (SVG / PNG / WebP)', 'Icons as SVG; photos as WebP / AVIF at 1× and 2×'],
  ];
  const HANDOFF = [
    'Use Dev Mode (or Inspect) to read exact sizes, spacing and variables, but match them to your tokens instead of copying odd values like 17px.',
    'Check every screen at mobile, tablet and desktop sizes. If one is missing, ask before guessing.',
    'Ask for the states that are not drawn: hover, focus, loading, empty, error, long text, very small screens.',
    'Ask what happens with real data: long names, 0 items, 1,000 items, missing images, slow network.',
    'Flag things that are hard or slow to build early, with an easier alternative.',
    'Show work in progress often (a preview link); fixing design gaps early is cheap.',
  ];
  const POLISH = [
    'Everything aligns to a few clear edges.', 'Spacing only from the scale.', 'At most 5–7 font sizes, 2–3 weights.',
    'One border radius family (e.g. 6px for inputs and buttons, 12px for cards).', 'Shadows soft and consistent (or none).',
    'Text contrast passes 4.5:1.', 'A visible focus ring on every interactive element.', 'Hover and pressed states on buttons and links.',
    'Loading, empty and error states exist.', 'Long text truncates or wraps gracefully.', 'Images keep their aspect ratio.',
    'Works at 360px wide with no sideways scroll.', 'Buttons say what they do.', 'Icons are the same size and style.',
    'Transitions 150–250ms, and none when reduced motion is on.', 'Favicon, page titles and social preview images are set.',
    'Forms remember input after an error.', 'Dark mode (if any) checked screen by screen.', 'No layout jump when fonts or images load.',
    'You looked at it on a real phone.',
  ];
  const RESOURCES = [
    ['Refactoring UI (book)', 'By the creators of Tailwind CSS: design tactics written for developers. The best single resource for this topic.'],
    ['Laws of UX (website)', 'Short explanations of the psychology behind good interfaces (Fitts\'s law, Hick\'s law, proximity…).'],
    ['Material Design and Apple Human Interface Guidelines', 'How Google and Apple design components, spacing and states; good to learn from even on the web.'],
    ['Component libraries as references', 'Radix, shadcn/ui and good design systems show well-thought-out states and accessibility.'],
    ['Real app screenshots', 'Libraries of real app screens (like Mobbin) show how good products solve the same screen you are building.'],
    ['Practise', 'Rebuild a well-designed page as an exercise (for learning, not to publish as yours), then design one screen of your own with only greys, then add one colour.'],
  ];

  const spacingDemo = `<div class="ds-demo">
    <div class="ds-card bad"><small>❌ Cramped and uneven</small><div style="padding:6px 13px 4px"><b style="font-size:19px;display:block;margin-bottom:11px">Pro plan</b><span style="display:block;margin-bottom:3px">₹499 / month</span><span style="display:block;margin-bottom:9px">Unlimited projects, priority support and custom domains for every site.</span><button style="padding:3px 7px">Choose plan</button></div></div>
    <div class="ds-card good"><small>✅ An 8-point scale: 24 padding, 8 inside the group, 24 before the action</small><div style="padding:24px;display:grid;gap:8px"><b style="font-size:20px">Pro plan</b><span style="font-size:24px;font-weight:700">₹499 <span style="font-size:14px;font-weight:400;color:#59636e">/ month</span></span><span style="color:#59636e;max-width:40ch">Unlimited projects, priority support and custom domains for every site.</span><button style="margin-top:16px;padding:10px 16px;border-radius:8px;border:0;background:#0969da;color:#fff;font-weight:600;justify-self:start">Choose plan</button></div></div></div>`;

  window.makeTopicTab({
    id: 'ds', title: '🎨 Design basics', sub: 'make interfaces look good without a designer',
    button: 'btnDesign', map: 'design', api: 'DesignLab', cat: 'Design basics', icon: '🎨', solver: 'design',
    scene: 'Building screens that look professional, with or without a designer.', hint: 'Which choice makes it easier to read, scan and use, for everyone?',
    stages: [
      { key: 'principles', name: 'Principles', title: 'Six principles behind every good interface', say: 'Good design is mostly a few rules applied consistently, not talent.',
        view: (d, H) => H.cards(PRINCIPLES) + H.note('Developers who apply these well can build a professional-looking product without a designer, which matters a lot in startups and freelancing.') },
      { key: 'spacing', name: 'Spacing', title: 'Spacing and white space', say: 'The fastest way to make a UI look professional: consistent spacing from a scale.', detail: true,
        view: (d, H) => spacingDemo + H.list(SPACING_RULES) + (d ? H.code(SPACING_CSS) : H.more('the CSS for a spacing scale')) },
      { key: 'type', name: 'Typography', title: 'Typography', say: 'Most of an interface is text. Readable text with a clear hierarchy is half of good design.', detail: true,
        view: (d, H) => H.table(null, TYPE_RULES) + `<p><b>Type-scale generator</b></p><div class="tx-calc"><label>Base size (px) <input type="number" class="cl-search" data-dsin="base" value="${UI.base}" min="10" max="24"></label>
          <label>Ratio <select class="cl-search" data-dsin="ratio">${[[1.125, 'Major second 1.125'], [1.2, 'Minor third 1.2'], [1.25, 'Major third 1.25'], [1.333, 'Perfect fourth 1.333'], [1.5, 'Perfect fifth 1.5']].map(([v, l]) => `<option value="${v}"${v === UI.ratio ? ' selected' : ''}>${l}</option>`).join('')}</select></label></div>
          <div id="dsScaleOut">${scaleHTML()}</div>${H.note('Smaller ratios (1.125–1.2) suit dense apps and dashboards; larger ones (1.333–1.5) suit marketing pages with big headlines.')}` + (d ? H.code(TYPE_CSS) : H.more('example CSS')) },
      { key: 'colour', name: 'Colour', title: 'Colour and contrast', say: 'A calm, mostly neutral palette with one brand colour, and text everyone can read.', detail: true,
        view: (d, H) => H.table(null, COLOUR_RULES) + `<p><b>Contrast checker</b> (the WCAG 2 formula)</p><div class="tx-calc">
          <label>Text colour <span class="ds-pick"><input type="color" data-dsin="fg" value="${UI.fg}"><input class="cl-search" data-dsin="fg" value="${UI.fg}" aria-label="Text colour hex"></span></label>
          <label>Background <span class="ds-pick"><input type="color" data-dsin="bg" value="${UI.bg}"><input class="cl-search" data-dsin="bg" value="${UI.bg}" aria-label="Background hex"></span></label></div>
          <div id="dsContrastOut">${contrastHTML()}</div>${H.note('Try #777777 on white: it looks fine to many people but fails for normal text (4.48:1). #767676 just passes (4.54:1).')}` + (d ? H.code(COLOUR_CSS) : H.more('colour tokens with dark mode in CSS')) },
      { key: 'layout', name: 'Layout', title: 'Layout and visual hierarchy', say: 'Where things go, and how the eye moves through the page.',
        view: (d, H) => H.cards(LAYOUT) },
      { key: 'components', name: 'Components', title: 'Components and their states', say: 'A design is not finished until every state is designed.',
        view: (d, H) => H.cards(COMPONENTS) },
      { key: 'figma', name: 'Figma & hand-off', title: 'Reading Figma, and working with designers', say: 'Figma maps closely to CSS. Knowing the mapping makes you fast and accurate.',
        view: (d, H) => H.table(['In Figma', 'In code'], FIGMA) + `<p><b>Working with a designer</b></p>${H.list(HANDOFF)}` },
      { key: 'polish', name: 'Polish checklist', title: 'A 20-point polish checklist', say: 'Run through this before you show a screen to anyone.',
        view: (d, H) => H.list(POLISH, true) },
      { key: 'learn', name: 'Learn more', title: 'Where to learn more', say: 'A little design study pays back for your whole career.',
        view: (d, H) => H.cards(RESOURCES) },
    ],
    situations: [
      { id: 'ds-grey-text', title: 'Light grey text', q: 'A designer\'s mockup uses #999999 body text on white. It looks elegant.', a: 'contrast', choices: [['contrast', 'Check contrast: it is about 2.8:1, below 4.5:1, so suggest a darker grey'], ['ship', 'Ship it exactly as designed'], ['bold', 'Make it bold instead']], why: '#999 on white is about 2.85:1, which fails WCAG AA for normal text. A darker grey like #59636e keeps the soft look and passes.' },
      { id: 'ds-spacing', title: 'It looks "off"', q: 'Your card looks amateur, but you cannot say why. Padding is 7px, 13px and 10px in different places.', a: 'scale', choices: [['scale', 'Use one spacing scale (8, 16, 24…) and more space between groups than inside them'], ['border', 'Add a thicker border and a shadow'], ['colour', 'Add more colours']], why: 'Random spacing is the most common reason UIs look amateur. A consistent scale, with tighter spacing inside groups and more between them, fixes most of it.' },
      { id: 'ds-error-red', title: 'Showing an error', q: 'A form field with an error turns its border red. Nothing else changes.', a: 'text', choices: [['text', 'Add an error message (and an icon) next to the field, linked with aria-describedby'], ['redder', 'Make the red brighter'], ['shake', 'Shake the field']], why: 'Colour alone does not reach people with colour-vision deficiency or screen-reader users, and does not say what is wrong. A specific message fixes both.' },
      { id: 'ds-primary', title: 'Too many main buttons', q: 'A settings page has four bright blue filled buttons: Save, Cancel, Reset and Export.', a: 'one', choices: [['one', 'One primary (Save), the rest secondary or text buttons'], ['colours', 'Give each button a different colour'], ['same', 'Keep them all the same: it is consistent']], why: 'Hierarchy: one main action stands out; others are quieter. Users find the important action instantly.' },
      { id: 'ds-line-length', title: 'A wide article', q: 'On a big monitor, your blog paragraphs stretch to 1,600px wide.', a: 'measure', choices: [['measure', 'Limit paragraphs to about 65ch'], ['smaller', 'Make the font smaller'], ['columns', 'Justify the text']], why: 'Comfortable reading is about 45–75 characters per line. Long lines make the eye lose its place when jumping to the next line.' },
      { id: 'ds-states', title: 'A missing state', q: 'The design shows a list of orders, but nothing for when there are none or while loading.', a: 'ask', choices: [['ask', 'Ask the designer, or propose a skeleton for loading and an empty state with a first action'], ['blank', 'Show nothing'], ['spinner', 'Show a full-page spinner forever']], why: 'Empty and loading states are part of the design. Asking early, or proposing sensible ones, avoids blank screens in production.' },
      { id: 'ds-figma-17', title: 'Odd values in Figma', q: 'Figma Dev Mode shows a gap of 17px and a font size of 15.5px.', a: 'tokens', choices: [['tokens', 'Use the nearest tokens (16px gap, 16px text) and mention it to the designer'], ['exact', 'Copy 17px and 15.5px exactly'], ['ignore', 'Pick any value']], why: 'Odd values are usually accidental. Matching the design system\'s tokens keeps the product consistent; a quick note lets the designer fix the file.' },
      { id: 'ds-dark', title: 'Adding dark mode', q: 'You are asked to add a dark theme quickly.', a: 'tokens', choices: [['tokens', 'Switch semantic colour tokens (surface, text, muted) under prefers-color-scheme or a data-theme'], ['invert', 'filter: invert(1) on the whole page'], ['black', 'Make every background pure black']], why: 'Semantic tokens make dark mode a set of new values, not a rewrite. Inverting breaks images and brand colours; pure black with bright text causes glare.' },
    ],
  });
  window.DesignLab.contrast = contrast;
  window.DesignLab.typeScale = typeScale;
})();

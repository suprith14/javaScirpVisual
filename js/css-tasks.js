/*
 * JS Engine Lab — HTML & CSS practice tasks (opened by js/css-lab.js).
 * Every answer is MEASURED from the real browser rendering the task, so it is always right.
 *   answer: 'px' (a size, ±1px), 'color', 'number', 'choice' (choices: [...]), 'text'
 *   target: the element the "under the hood" panel explains (cascade for `prop`, box model)
 *   measure(doc, win, $): returns the right answer from the rendered page
 */
(function () {
  'use strict';
  const px = el => el.getBoundingClientRect();
  const style = (el, p) => el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue(p);
  window.CSS_TASKS = [
    // ------------------------------------------------------------ the cascade
    {
      id: 'css-specificity', cat: 'CSS: cascade & specificity', title: 'Type vs class vs id', ask: 'What colour is the text?',
      answer: 'color', target: '#intro', prop: 'color',
      hint: 'Compare the specificity of the three selectors: ids beat classes, classes beat element names.',
      why: 'When several rules set the same property, the one with the highest <b>specificity</b> wins: (ids, classes/attributes/pseudo-classes, elements). <code>#intro</code> is (1,0,0), <code>.lead</code> is (0,1,0), <code>p</code> is (0,0,1). Source order only matters between equal specificities.',
      html: `<style>
  #intro { color: red; }
  .lead { color: blue; }
  p { color: green; }
</style>
<p id="intro" class="lead">Hello</p>`,
      measure: (d, w, $) => style($('#intro'), 'color'),
    },
    {
      id: 'css-order', cat: 'CSS: cascade & specificity', title: 'Same specificity: the last rule wins', ask: 'What colour is the button?',
      answer: 'color', target: 'button', prop: 'color',
      hint: 'Both selectors have the same specificity. Which one comes later?',
      why: 'Both selectors are one class (0,1,0), so specificity is a tie and <b>source order</b> decides: the rule that comes later wins. The order of the class names in the HTML attribute does not matter at all.',
      html: `<style>
  .primary { color: white; background: navy; }
  .danger { color: yellow; background: crimson; }
</style>
<button class="danger primary">Delete</button>`,
      measure: (d, w, $) => style($('button'), 'color'),
    },
    {
      id: 'css-important', cat: 'CSS: cascade & specificity', title: '!important and inline styles', ask: 'What colour is the text?',
      answer: 'color', target: '#msg', prop: 'color',
      hint: 'An inline style beats every selector… unless a stylesheet rule is !important.',
      why: 'The cascade checks, in order: <b>importance</b> (<code>!important</code> wins), then <b>inline style</b> (the <code>style</code> attribute beats any selector), then specificity, then order. So the <code>!important</code> class rule beats both the inline style and the id rule. Use <code>!important</code> rarely: it is hard to override later.',
      html: `<style>
  #msg { color: red; }
  .note { color: green !important; }
</style>
<p id="msg" class="note" style="color: blue">Saved</p>`,
      measure: (d, w, $) => style($('#msg'), 'color'),
    },
    {
      id: 'css-descendant', cat: 'CSS: cascade & specificity', title: 'Counting a longer selector', ask: 'What colour is the link?',
      answer: 'color', target: 'a', prop: 'color',
      hint: 'Count ids, then classes, then element names for each selector. Length does not matter by itself.',
      why: '<code>ul li a</code> is three element names: (0,0,3). <code>.menu a</code> is one class and one element: (0,1,1). One class beats any number of element names, so <code>.menu a</code> wins even though the other selector is longer.',
      html: `<style>
  .menu a { color: orange; }
  ul li a { color: purple; }
</style>
<ul class="menu"><li><a href="#">Home</a></li></ul>`,
      measure: (d, w, $) => style($('a'), 'color'),
    },
    // ------------------------------------------------------------ inheritance and units
    {
      id: 'css-inherit', cat: 'CSS: inheritance & units', title: 'What is inherited?', ask: 'How wide is the span\'s top border (in px)?',
      answer: 'px', target: 'span', prop: 'border-top-width',
      hint: 'Text properties (color, font) are inherited. Box properties (border, margin, padding) are not.',
      why: 'Some properties are <b>inherited</b> by children (color, font, line-height, visibility), others are not (border, margin, padding, background, width). The span gets the purple colour from its parent, but no border: its border width is 0.',
      html: `<div style="color: purple; border: 4px solid">
  Parent with a border, <span>and a child span</span>
</div>`,
      measure: (d, w, $) => parseFloat(style($('span'), 'border-top-width')),
    },
    {
      id: 'css-em', cat: 'CSS: inheritance & units', title: 'em compounds, rem does not', ask: 'What is the font size of .inner (in px)?',
      answer: 'px', target: '.inner', prop: 'font-size',
      hint: '1.5em means 1.5 × the parent\'s font size, and the parent is 1.5em of ITS parent.',
      why: '<code>em</code> is relative to the <b>parent\'s</b> font size, so nested <code>em</code> values multiply: 20 × 1.5 = 30, then 30 × 1.5 = 45. <code>rem</code> is always relative to the root (<code>html</code>) font size, so it does not compound; that is why rem is usually used for font sizes.',
      html: `<style>
  .outer { font-size: 20px; }
  .middle, .inner { font-size: 1.5em; }
</style>
<div class="outer"><div class="middle">middle <div class="inner">inner</div></div></div>`,
      measure: (d, w, $) => parseFloat(style($('.inner'), 'font-size')),
    },
    {
      id: 'css-rem', cat: 'CSS: inheritance & units', title: 'em vs rem for spacing', ask: 'What is the left padding of .a (in px)?',
      answer: 'px', target: '.a', prop: 'padding-left',
      hint: 'For padding, em uses the element\'s own font size.',
      why: 'On properties other than font-size, <code>em</code> uses the element\'s <b>own</b> computed font size (24px here), so <code>1em</code> = 24px. <code>.b</code> uses <code>1rem</code> = the root font size (16px by default).',
      html: `<style>
  .a, .b { font-size: 24px; background: #eef; margin: 4px 0; }
  .a { padding-left: 1em; }
  .b { padding-left: 1rem; }
</style>
<div class="a">padding 1em</div>
<div class="b">padding 1rem</div>`,
      measure: (d, w, $) => parseFloat(style($('.a'), 'padding-left')),
    },
    // ------------------------------------------------------------ the box model
    {
      id: 'css-contentbox', cat: 'CSS: box model', title: 'width does not include padding', ask: 'How wide is the box on screen (in px)?',
      answer: 'px', target: '.box', box: true,
      hint: 'The default box-sizing is content-box: width is the content only.',
      why: 'With the default <code>box-sizing: content-box</code>, <code>width</code> is only the <b>content</b>. Padding and border are added outside it: 100 + 2×10 + 2×2 = 124px. Margin is outside that again and is not part of the box\'s width.',
      html: `<style>
  .box { width: 100px; padding: 10px; border: 2px solid; margin: 20px; }
</style>
<div class="box">box</div>`,
      measure: (d, w, $) => px($('.box')).width,
    },
    {
      id: 'css-borderbox', cat: 'CSS: box model', title: 'box-sizing: border-box', ask: 'How wide is the box now (in px)?',
      answer: 'px', target: '.box', box: true,
      hint: 'border-box makes width include padding and border.',
      why: 'With <code>box-sizing: border-box</code>, <code>width</code> includes padding and border, so the box is exactly 100px wide and the content shrinks to 100 − 20 − 4 = 76px. Most projects set <code>*, *::before, *::after { box-sizing: border-box }</code> because sizes become predictable.',
      html: `<style>
  .box { box-sizing: border-box; width: 100px; padding: 10px; border: 2px solid; }
</style>
<div class="box">box</div>`,
      measure: (d, w, $) => px($('.box')).width,
    },
    {
      id: 'css-collapse', cat: 'CSS: box model', title: 'Margin collapsing', ask: 'How big is the gap between the two boxes (in px)?',
      answer: 'px', target: '.b', box: true,
      hint: 'Vertical margins of blocks that touch do not add up.',
      why: 'The vertical margins of adjacent blocks <b>collapse</b>: instead of 30 + 20 = 50, the gap is the larger of the two, 30px. This does not happen for horizontal margins, or inside flex and grid containers.',
      html: `<style>
  div { height: 40px; background: #cde; }
  .a { margin-bottom: 30px; }
  .b { margin-top: 20px; }
</style>
<div class="a">a</div>
<div class="b">b</div>`,
      measure: (d, w, $) => px($('.b')).top - px($('.a')).bottom,
    },
    {
      id: 'css-percent-padding', cat: 'CSS: box model', title: 'Percentage padding', ask: 'What is the top padding of .child (in px)?',
      answer: 'px', target: '.child', box: true,
      hint: 'Vertical padding in % is still a % of the container\'s WIDTH.',
      why: 'Percentages in padding (and margin) are always relative to the <b>width</b> of the containing block, even for top and bottom: 10% of 300px = 30px. That is the old trick for fixed aspect-ratio boxes (today: <code>aspect-ratio</code>).',
      html: `<style>
  .parent { width: 300px; height: 80px; background: #eee; }
  .child { padding-top: 10%; background: #9cf; }
</style>
<div class="parent"><div class="child">child</div></div>`,
      measure: (d, w, $) => parseFloat(style($('.child'), 'padding-top')),
    },
    // ------------------------------------------------------------ positioning and stacking
    {
      id: 'css-inline-width', cat: 'CSS: positioning & stacking', title: 'width on an inline element', ask: 'Is the span 200px wide?',
      answer: 'choice', choices: ['yes, 200px', 'no, only as wide as its text'], target: 'span', box: true,
      hint: 'Inline elements ignore width and height.',
      why: '<code>width</code> and <code>height</code> do not apply to <b>inline</b> boxes like <code>&lt;span&gt;</code>: they are as wide as their content and flow with the text. Use <code>display: inline-block</code> (or block, flex, grid) to give them a size.',
      html: `<style>
  span { width: 200px; background: gold; }
</style>
<p>Text with a <span>short span</span> inside.</p>`,
      measure: (d, w, $) => (Math.round(px($('span')).width) === 200 ? 'yes, 200px' : 'no, only as wide as its text'),
    },
    {
      id: 'css-absolute', cat: 'CSS: positioning & stacking', title: 'absolute is relative to…', ask: 'How far is the badge from the left edge of .card (in px)?',
      answer: 'px', target: '.badge', prop: 'left',
      hint: 'An absolute element is placed relative to its nearest positioned ancestor.',
      why: '<code>position: absolute</code> takes the element out of the flow and places it relative to the nearest ancestor that is <b>positioned</b> (any position except static), here <code>.card</code>. <code>left: 30px</code> means 30px from the card\'s padding edge. Without a positioned ancestor it would be placed relative to the page.',
      html: `<style>
  .card { position: relative; margin-left: 50px; width: 200px; height: 80px; border: 1px solid; }
  .badge { position: absolute; left: 30px; top: 10px; background: tomato; color: white; }
</style>
<div class="card"><span class="badge">new</span></div>`,
      measure: (d, w, $) => px($('.badge')).left - px($('.card')).left - parseFloat(style($('.card'), 'border-left-width')),
    },
    {
      id: 'css-zindex-static', cat: 'CSS: positioning & stacking', title: 'z-index needs position', ask: 'Which box is on top where they overlap?',
      answer: 'choice', choices: ['A', 'B'], target: '#a', prop: 'z-index',
      hint: 'z-index does nothing on a non-positioned block.',
      why: '<code>z-index</code> only works on positioned elements (and flex/grid items). A is <code>position: static</code>, so its z-index of 100 is ignored, and B (positioned, later in the page) is painted on top.',
      html: `<style>
  div { width: 120px; height: 60px; color: white; }
  #a { background: navy; z-index: 100; }
  #b { background: crimson; position: relative; top: -30px; left: 40px; }
</style>
<div id="a">A</div>
<div id="b">B</div>`,
      measure: (d, w, $) => { const r = px($('#a')); const el = d.elementFromPoint(r.left + 60, r.bottom - 5); return el && el.id === 'a' ? 'A' : 'B'; },
    },
    {
      id: 'css-stacking-context', cat: 'CSS: positioning & stacking', title: 'A stacking context traps z-index', ask: 'Which box is on top: the popup (z-index 999) or the header (z-index 2)?',
      answer: 'choice', choices: ['the popup', 'the header'], target: '.popup', prop: 'z-index',
      hint: 'opacity < 1 creates a new stacking context.',
      why: '<code>.panel</code> has <code>opacity: 0.99</code>, which creates a <b>stacking context</b> (so do <code>transform</code>, <code>filter</code>, <code>position</code> + <code>z-index</code>, …). Everything inside is stacked as one layer with the panel\'s own level (z-index auto/0). The popup\'s 999 only competes inside the panel, so the header (z-index 2) is above the whole panel.',
      html: `<style>
  .header { position: relative; z-index: 2; height: 40px; background: navy; color: white; }
  .panel { opacity: 0.99; position: relative; }
  .popup { position: absolute; z-index: 999; top: -30px; left: 20px; width: 150px; height: 50px; background: crimson; color: white; }
</style>
<div class="header">header</div>
<div class="panel"><div class="popup">popup</div></div>`,
      measure: (d, w, $) => { const r = px($('.popup')); const el = d.elementFromPoint(r.left + 10, r.top + 5); return el && el.classList.contains('popup') ? 'the popup' : 'the header'; },
    },
    // ------------------------------------------------------------ flexbox
    {
      id: 'css-flex-grow', cat: 'CSS: flexbox', title: 'Sharing free space with flex-grow', ask: 'How wide is .b (in px)?',
      answer: 'px', target: '.b', box: true,
      hint: 'First give each item its basis, then share the leftover space by the grow ratio.',
      why: 'Flexbox starts from each item\'s <code>flex-basis</code> (100px + 100px), then shares the <b>free space</b> (400 − 200 = 200px) in the ratio of <code>flex-grow</code> (1 : 3). So <code>.a</code> gets 50px more and <code>.b</code> 150px more: 100 + 150 = 250px.',
      html: `<style>
  .row { display: flex; width: 400px; }
  .a { flex: 1 1 100px; background: #9cf; }
  .b { flex: 3 1 100px; background: #fc9; }
</style>
<div class="row"><div class="a">a</div><div class="b">b</div></div>`,
      measure: (d, w, $) => px($('.b')).width,
    },
    {
      id: 'css-flex-shrink', cat: 'CSS: flexbox', title: 'Shrinking is weighted by size', ask: 'How wide is .a (in px)?',
      answer: 'px', target: '.a', box: true,
      hint: 'The 100px overflow is taken away in proportion to flex-shrink × basis.',
      why: 'The items want 300 + 100 = 400px but there are only 300px: 100px too much. With equal <code>flex-shrink</code>, the shortfall is shared in proportion to each item\'s <b>basis</b> (300 : 100 = 3 : 1), so <code>.a</code> gives up 75px: 300 − 75 = 225px. Bigger items shrink more.',
      html: `<style>
  .row { display: flex; width: 300px; }
  .a { flex: 0 1 300px; background: #9cf; }
  .b { flex: 0 1 100px; background: #fc9; }
</style>
<div class="row"><div class="a">a</div><div class="b">b</div></div>`,
      measure: (d, w, $) => px($('.a')).width,
    },
    {
      id: 'css-justify', cat: 'CSS: flexbox', title: 'justify-content: space-between', ask: 'How far from the left of the row does item 2 start (in px)?',
      answer: 'px', target: '.i2',
      hint: 'Three 50px items in 350px leave 200px, split into the gaps BETWEEN items.',
      why: '<code>space-between</code> puts the first item at the start, the last at the end, and splits the free space (350 − 150 = 200px) equally into the <b>gaps between</b> items: 2 gaps of 100px. Item 2 starts at 50 + 100 = 150px. (<code>space-around</code> and <code>space-evenly</code> also put space at the edges.)',
      html: `<style>
  .row { display: flex; justify-content: space-between; width: 350px; background: #eee; }
  .row div { width: 50px; height: 30px; background: #9cf; }
</style>
<div class="row"><div class="i1">1</div><div class="i2">2</div><div class="i3">3</div></div>`,
      measure: (d, w, $) => px($('.i2')).left - px($('.row')).left,
    },
    {
      id: 'css-stretch', cat: 'CSS: flexbox', title: 'align-items: stretch', ask: 'How tall is .item (in px)?',
      answer: 'px', target: '.item', box: true,
      hint: 'What is the default value of align-items?',
      why: 'The default <code>align-items</code> is <code>stretch</code>: an item with no height of its own is stretched to fill the cross axis (here the row\'s 100px height). Setting <code>align-items: flex-start</code> (or a height on the item) stops that.',
      html: `<style>
  .row { display: flex; height: 100px; background: #eee; }
  .item { width: 80px; background: #9cf; }
</style>
<div class="row"><div class="item">item</div></div>`,
      measure: (d, w, $) => px($('.item')).height,
    },
    // ------------------------------------------------------------ grid
    {
      id: 'css-grid-fr', cat: 'CSS: grid', title: 'fr units', ask: 'How wide is the third column (in px)?',
      answer: 'px', target: '.c3',
      hint: 'Fixed tracks first; the fr units share what is left.',
      why: 'Grid first gives fixed tracks their size (100px), then divides the <b>remaining</b> space (400 − 100 = 300px) by the total fr (1 + 2 = 3): 1fr = 100px, so the third column (2fr) is 200px.',
      html: `<style>
  .grid { display: grid; grid-template-columns: 100px 1fr 2fr; width: 400px; }
  .grid div { background: #9cf; border-right: 1px solid white; box-sizing: border-box; }
</style>
<div class="grid"><div class="c1">1</div><div class="c2">2</div><div class="c3">3</div></div>`,
      measure: (d, w, $) => px($('.c3')).width,
    },
    {
      id: 'css-grid-span', cat: 'CSS: grid', title: 'Spanning columns with a gap', ask: 'How wide is .wide (in px)?',
      answer: 'px', target: '.wide',
      hint: 'A span of 2 includes the gap between the two columns.',
      why: 'An item that spans 2 columns covers both tracks <b>and the gap between them</b>: 100 + 10 + 100 = 210px.',
      html: `<style>
  .grid { display: grid; grid-template-columns: repeat(3, 100px); gap: 10px; }
  .grid div { background: #9cf; height: 30px; }
  .wide { grid-column: span 2; background: #fc9 !important; }
</style>
<div class="grid"><div class="wide">wide</div><div>b</div><div>c</div></div>`,
      measure: (d, w, $) => px($('.wide')).width,
    },
    {
      id: 'css-autofill', cat: 'CSS: grid', title: 'auto-fill with minmax', ask: 'How many cards fit in one row?',
      answer: 'number', target: '.grid',
      hint: 'How many 100px columns fit into 350px?',
      why: '<code>repeat(auto-fill, minmax(100px, 1fr))</code> makes as many columns as fit at their <b>minimum</b> size (floor(350 / 100) = 3), then stretches them with <code>1fr</code> to fill the row (about 116px each). The layout becomes responsive without a media query.',
      html: `<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); width: 350px; gap: 0; }
  .grid div { background: #9cf; height: 30px; border: 1px solid white; }
</style>
<div class="grid"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div></div>`,
      measure: (d, w, $) => { const items = [...d.querySelectorAll('.grid div')]; const top = px(items[0]).top; return items.filter(x => Math.abs(px(x).top - top) < 1).length; },
    },
    // ------------------------------------------------------------ responsive
    {
      id: 'css-media', cat: 'CSS: responsive', title: 'Media queries use the viewport', ask: 'The preview is 360px wide. What colour is the title?',
      answer: 'color', target: 'h1', prop: 'color',
      hint: 'Is 360px at least 600px?',
      why: 'A media query applies its rules only when the condition matches the <b>viewport</b>. At 360px, <code>(min-width: 600px)</code> is false, so the title stays red; on a wide screen it would be blue. Writing the small-screen styles first and adding <code>min-width</code> queries is "mobile first".',
      width: 360,
      html: `<style>
  h1 { color: red; font-size: 20px; }
  @media (min-width: 600px) {
    h1 { color: blue; }
  }
</style>
<h1>Title</h1>`,
      measure: (d, w, $) => style($('h1'), 'color'),
    },
    {
      id: 'css-vw', cat: 'CSS: responsive', title: 'vw and %', ask: 'The preview is 400px wide. How wide is .half (in px)?',
      answer: 'px', target: '.half', box: true,
      hint: 'vw is a percentage of the viewport, not of the parent.',
      why: '<code>50vw</code> is half of the <b>viewport</b> width (400px → 200px), whatever the parent is. <code>%</code> would be relative to the parent (here 100px wide → 50px). That is why <code>100vw</code> can be wider than the page when there is a vertical scrollbar.',
      width: 400,
      html: `<style>
  .parent { width: 100px; }
  .half { width: 50vw; background: #9cf; }
</style>
<div class="parent"><div class="half">50vw</div></div>`,
      measure: (d, w, $) => px($('.half')).width,
    },
    // ------------------------------------------------------------ HTML and accessibility
    {
      id: 'html-tab', cat: 'HTML & accessibility', title: 'What can you Tab to?', ask: 'How many of these elements can a keyboard user reach with Tab?',
      answer: 'number', target: 'button',
      hint: 'Buttons and enabled inputs are focusable; a div is not, unless it has tabindex="0".',
      why: 'Only <b>interactive</b> elements are in the Tab order: <code>&lt;button&gt;</code>, enabled <code>&lt;input&gt;</code>, links with <code>href</code>, and anything with <code>tabindex="0"</code>. A <code>&lt;div onclick&gt;</code> is invisible to keyboard and screen-reader users, a <code>disabled</code> input is skipped, and <code>tabindex="-1"</code> means "focusable from code only". Prefer real buttons over clickable divs.',
      html: `<button>Save</button>
<div onclick="alert(1)">Clickable div</div>
<input placeholder="name">
<input placeholder="disabled" disabled>
<div tabindex="0">Focusable div</div>
<div tabindex="-1">Script-focusable div</div>`,
      measure: d => [...d.body.querySelectorAll('*')].filter(e => e.tabIndex >= 0 && !e.disabled).length,
    },
    {
      id: 'html-label', cat: 'HTML & accessibility', title: 'Labels and their inputs', ask: 'Which input does a click on the text "Email" focus?',
      answer: 'choice', choices: ['the email input', 'the name input', 'none'], target: 'label',
      hint: 'A label is connected through for="…" matching the input\'s id (or by wrapping the input).',
      why: 'A <code>&lt;label for="email"&gt;</code> is connected to the element with <code>id="email"</code>: clicking the label focuses it, and screen readers read "Email" as the input\'s name. Without a connection (the "Name" text here) the input has no accessible name; a <code>placeholder</code> is not a label.',
      html: `<label for="email">Email</label> <input id="email" type="email"><br>
<span>Name</span> <input id="name" placeholder="your name">`,
      measure: d => { const l = d.querySelector('label'); return l.control && l.control.id === 'email' ? 'the email input' : l.control && l.control.id === 'name' ? 'the name input' : 'none'; },
    },
  ];
})();

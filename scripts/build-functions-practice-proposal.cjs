const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = require('../reviews/functions-parallel-practice-data.cjs');
const katex = require('../shared/katex/katex.min.js');
const mathCss = fs.readFileSync(path.join(root, 'shared', 'katex', 'katex.min.css'), 'utf8')
  .replace(/url\(fonts\/([^)]+\.woff2)\)/g, (_, filename) =>
    `url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'shared', 'katex', 'fonts', filename)).toString('base64')})`)
  .replaceAll('url(fonts/', 'url(../shared/katex/fonts/');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function text(value) {
  return value.split(/(\\\([\s\S]*?\\\))/g).map(part => part.startsWith('\\(')
    ? katex.renderToString(part.slice(2, -2), { throwOnError: true })
    : escape(part)).join('');
}

function grid(range, name = 'Blank coordinate grid', curves = [], points = [], arrows = []) {
  const size = 432, pad = 24, scale = (size - 2 * pad) / (2 * range);
  const px = x => pad + (x + range) * scale;
  const py = y => pad + (range - y) * scale;
  let svg = '';
  for (let n = -range; n <= range; n++) {
    const stroke = n === 0 ? '#111' : '#c9ced5';
    svg += `<path d="M${px(n)},${py(-range)}V${py(range)} M${px(-range)},${py(n)}H${px(range)}" stroke="${stroke}" stroke-width="${n === 0 ? 1.4 : 0.5}" fill="none"/>`;
    if (n !== 0 && n % 2 === 0) svg += `<text x="${px(n)}" y="${py(0) + 12}" text-anchor="middle">${n}</text><text x="${px(0) - 5}" y="${py(n) + 3}" text-anchor="end">${n}</text>`;
  }
  svg += `<text x="${size - 12}" y="${py(0) - 5}">x</text><text x="${px(0) + 6}" y="13">y</text>`;
  for (const curve of curves) svg += `<polyline points="${curve.map(([x, y]) => `${px(x)},${py(y)}`).join(' ')}" stroke="#111" stroke-width="2" fill="none"/>`;
  for (const [x, y, open, label] of points) {
    svg += `<circle cx="${px(x)}" cy="${py(y)}" r="3.5" fill="${open ? 'white' : '#111'}" stroke="#111" stroke-width="1.5"/>`;
    if (label) svg += `<text x="${px(x) + 7}" y="${py(y) - 8}" class="point-label">${escape(label)}</text>`;
  }
  for (const [x, y, dx, dy] of arrows) {
    const angle = Math.atan2(-dy, dx), cx = px(x), cy = py(y);
    const wing = sign => `${cx - 9 * Math.cos(angle + sign * 0.45)},${cy - 9 * Math.sin(angle + sign * 0.45)}`;
    svg += `<polyline points="${wing(-1)} ${cx},${cy} ${wing(1)}" stroke="#111" stroke-width="2" fill="none"/>`;
  }
  return `<svg class="grid" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escape(name)}; x and y both -${range} to ${range}, one unit per square"><title>${escape(name)}</title><g font-family="Arial" font-size="10">${svg}</g></svg>`;
}
function sample(fn, start, end, range) {
  const points = [];
  for (let i = 0; i <= 800; i++) {
    const x = start + (end - start) * i / 800, y = fn(x);
    if (Math.abs(y) <= range) points.push([x, y]);
  }
  return points;
}
function given(q) {
  const r = q.range;
  switch (q.given) {
    case 'quadratic': {
      const curve = sample(x => -0.5 * (x + 3) * (x - 2), -r, r, r);
      return grid(r, 'Given quadratic graph; marked points (-3,0), (2,0), (0,3)',
        [curve], [[-3, 0, false, '(-3,0)'], [2, 0, false, '(2,0)'], [0, 3, false, '(0,3)']],
        [[...curve[0], -1, -1], [...curve.at(-1), 1, -1]]);
    }
    case 'characteristics': {
      const curve = sample(x => -(x ** 3) + 3 * x ** 2, -r, r, r);
      return grid(r, 'Given cubic graph; turning points (0,0) and (2,4)',
        [curve], [[0, 0, false, '(0,0)'], [2, 4, false, '(2,4)']],
        [[...curve[0], -1, 1], [...curve.at(-1), 1, -1]]);
    }
    case 'polynomial': {
      const curve = sample(x => -((x + 1) ** 2) * (x - 2), -r, r, r);
      return grid(r, 'Given polynomial graph; touch at (-1,0), crossing (2,0), marked (0,2)',
        [curve], [[-1, 0, false, '(-1,0)'], [2, 0, false, '(2,0)'], [0, 2, false, '(0,2)']],
        [[...curve[0], -1, 1], [...curve.at(-1), 1, -1]]);
    }
    case 'operations':
      return grid(r, 'Given graph of g on [-4,8]',
        [[[-4, 1], [0, 1]], sample(x => (x - 2) ** 2, 0, 3, r), [[3, 1], [8, 6]]],
        [[-4, 1, false], [0, 1, true], [0, 4, false], [8, 6, false]]);
    case 'skills-operations':
      return grid(r, 'Given graph of g on [-4,6]',
        [[[-4, 2], [0, 2]], sample(x => (x - 2) ** 2 - 1, 0, 3, r), [[3, 0], [6, 3]]],
        [[-4, 2, false], [0, 2, true], [0, 3, false], [6, 3, false]]);
    default: throw new Error(`Unknown given graph: ${q.given}`);
  }
}
function table(t) {
  return `<table><caption>${escape(t.heading)}</caption>${t.rows.map((row, i) =>
    `<tr>${row.map((cell, j) => `<${i === 0 || j === 0 ? 'th' : 'td'}${i === 0 ? ' scope="col"' : j === 0 ? ' scope="row"' : ''}>${escape(cell)}</${i === 0 || j === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</table>`;
}
const css = `
* { box-sizing:border-box; }
body { margin:0; background:#f0f2f6; color:#16243a; font:16px/1.6 Arial,sans-serif; }
main { max-width:940px; margin:auto; padding:28px 20px 70px; }
header,.set-intro,article { background:white; border:1px solid #d5dce6; border-radius:10px; padding:24px 28px; margin-bottom:18px; }
h1 { margin:6px 0 12px; font-size:30px; line-height:1.2; } h2 { font-size:24px; margin:0; } h3 { font-size:19px; margin:0; }
p { margin:10px 0; } .eyebrow { font-size:12px; font-weight:700; color:#1d42ba; letter-spacing:1px; }
.notice { padding:12px 16px; border-left:4px solid #c8102e; background:#fff6f7; }
.question-heading { display:flex; justify-content:space-between; gap:16px; align-items:baseline; border-bottom:1px solid #d5dce6; padding-bottom:10px; margin-bottom:16px; }
.points { color:#49596e; white-space:nowrap; font-size:14px; } .source { font-size:13px; color:#49596e; margin-top:16px; }
.grid { width:432px; max-width:100%; height:auto; display:block; margin:14px auto; background:white; }
.point-label { font-size:10px; paint-order:stroke; stroke:white; stroke-width:3px; stroke-linejoin:round; }
figure { margin:16px 0; } figcaption { text-align:center; font-size:13px; color:#49596e; }
.table-wrap { overflow-x:auto; } table { border-collapse:collapse; width:100%; margin:16px 0; font-size:14px; }
th,td { border:1px solid #8b97a7; padding:8px; text-align:center; } caption { font-weight:700; margin-bottom:5px; }
nav { display:flex; flex-wrap:wrap; gap:10px; margin:20px 0; }
nav a { background:#002d62; color:white; border-radius:6px; padding:9px 15px; text-decoration:none; }
a:focus-visible { outline:3px solid #c8102e; outline-offset:3px; }
.katex { font-size:1.08em; } .set { scroll-margin-top:18px; }
@media(max-width:540px) { main { padding:14px 10px 40px; } header,.set-intro,article { padding:18px; } h1 { font-size:25px; } table { font-size:11px; } th,td { padding:6px 3px; } .question-heading { gap:8px; } }
@media print { body { background:white; } main { padding:0; } nav { display:none; } article { break-inside:avoid; } }
`;
let html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Functions: Two Problem Sets for Approval</title><style>${mathCss}</style><style>${css}</style></head><body><main>`;
html += `<header><div class="eyebrow">MOTOR CITY MATH | PARENT REVIEW</div><h1>Two problem sets for approval</h1><p class="notice"><strong>Draft questions only.</strong> No student tests, answer-key documents, or PDFs have been built. FA builds the two tests and separate keys only after Marcus approves these problems.</p><p>The full set follows the teacher's test in order, with changed values. The shorter set targets applied piecewise pricing, decomposition, graph/table operations, and piecewise graphing, using different values again.</p><p>The teacher's two questions labeled 8 become Questions 8 and 9 here. Later questions are renumbered consecutively; the original labels appear below each problem for comparison.</p><nav aria-label="Problem sets"><a href="#full-set">75-minute parallel test</a><a href="#skills-set">25-minute skills check</a></nav></header>`;
data.exams.forEach((exam, index) => {
  html += `<section class="set" id="${index === 0 ? 'full-set' : 'skills-set'}" data-exam="${exam.slug}"><div class="set-intro"><div class="eyebrow">${index === 0 ? 'SET A' : 'SET B'}</div><h2>${escape(exam.title)}</h2><p>${exam.minutes} minutes | ${exam.points} proposed points | ${exam.questions.length} questions</p><p>${index === 0 ? 'Same problem families as the teacher assessment. Points emphasize the main practice priorities without removing stronger-skill checks.' : 'Use separately, not as an extension of the full test. These four tasks revisit the verified lower-scoring areas. The unclear multiple-choice mark is not treated as evidence of a weakness.'}</p></div>`;
  for (const q of exam.questions) {
    html += `<article id="${index === 0 ? 'full' : 'skills'}-q${q.id}" data-question="${q.id}" data-points="${q.points}"><div class="question-heading"><h3>Question ${q.id}</h3><span class="points">${q.points} points</span></div>`;
    html += q.prompt.map(p => `<p>${text(p)}</p>`).join('');
    if (q.table) html += `<div class="table-wrap">${table(q.table)}</div>`;
    if (q.given) html += `<figure>${given(q)}<figcaption>Given graph for this question. One unit per square.</figcaption></figure>`;
    if (q.layout) html += '<p class="source">The final student copy will include blank coordinate grids for the requested graphs.</p>';
    html += `<p class="source">Matches: ${escape(q.source)}</p></article>`;
  }
  html += '</section>';
});
html += '</main></body></html>';
fs.writeFileSync(path.join(root, 'reviews', 'functions-practice-proposal.html'), html);
console.log('Built parent problem proposal only: 12 full-test questions and 4 skills-check questions. No tests, keys, or PDFs generated.');

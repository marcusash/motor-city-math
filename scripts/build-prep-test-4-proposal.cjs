const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = require('../reviews/prep-test-4-proposal-data.cjs');
const katex = require('../shared/katex/katex.min.js');
const mathCss = fs.readFileSync(path.join(root, 'shared/katex/katex.min.css'), 'utf8')
  .replace(/url\(fonts\/([^)]+\.woff2)\)/g, (_, filename) =>
    `url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'shared/katex/fonts', filename)).toString('base64')})`)
  .replaceAll('url(fonts/', 'url(../shared/katex/fonts/');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function text(value) {
  return value.split(/(\\\([\s\S]*?\\\))/g).map(part => part.startsWith('\\(')
    ? katex.renderToString(part.slice(2, -2), { throwOnError: true })
    : escape(part)).join('');
}
function graph({ x = [-8, 8], y = [-8, 8], lines = [], points = [], aria = 'Blank coordinate grid' } = {}) {
  const limit = Math.max(...x.map(Math.abs), ...y.map(Math.abs));
  x = [-limit, limit];
  y = [-limit, limit];
  const size = 460, pad = 26;
  const unit = Math.min((size - 2 * pad) / (x[1] - x[0]), (size - 2 * pad) / (y[1] - y[0]));
  const left = (size - unit * (x[1] - x[0])) / 2, top = (size - unit * (y[1] - y[0])) / 2;
  const px = n => left + (n - x[0]) * unit, py = n => top + (y[1] - n) * unit;
  let body = '';
  for (let n = Math.ceil(x[0]); n <= x[1]; n++) {
    body += `<path d="M${px(n)},${py(y[0])}V${py(y[1])}" stroke="${n === 0 ? '#111' : '#cbd1d8'}" stroke-width="${n === 0 ? 1.4 : 0.55}"/>`;
    if (n !== 0 && n % (limit > 12 ? 4 : 2) === 0) body += `<text x="${px(n)}" y="${py(0) + 14}" text-anchor="middle">${n}</text>`;
  }
  for (let n = Math.ceil(y[0]); n <= y[1]; n++) {
    body += `<path d="M${px(x[0])},${py(n)}H${px(x[1])}" stroke="${n === 0 ? '#111' : '#cbd1d8'}" stroke-width="${n === 0 ? 1.4 : 0.55}"/>`;
    if (n !== 0 && n % (limit > 12 ? 4 : 2) === 0) body += `<text x="${px(0) - 6}" y="${py(n) + 3}" text-anchor="end">${n}</text>`;
  }
  body += `<text x="${px(x[1]) - 2}" y="${py(0) - 6}">x</text><text x="${px(0) + 7}" y="${top + 11}">y</text>`;
  for (const line of lines) {
    const coords = line.points.map(([a, b]) => `${px(a)},${py(b)}`).join(' ');
    body += `<polyline clip-path="url(#plot-clip-${limit})" points="${coords}" fill="none" stroke="#111" stroke-width="2.2"${line.dashed ? ' stroke-dasharray="7 5"' : ''}/>`;
    for (const [a, b, open, label] of line.markers || []) {
      body += `<circle cx="${px(a)}" cy="${py(b)}" r="4" fill="${open ? '#fff' : '#111'}" stroke="#111" stroke-width="1.4"/>`;
      if (label) body += `<text x="${px(a) + 7}" y="${py(b) - 7}" class="label">${escape(label)}</text>`;
    }
  }
  for (const [a, b, label] of points) {
    body += `<circle cx="${px(a)}" cy="${py(b)}" r="4" fill="#111"/>`;
    if (label) body += `<text x="${px(a) + 7}" y="${py(b) - 7}" class="label">${escape(label)}</text>`;
  }
  return `<svg class="grid" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escape(aria)}"><title>${escape(aria)}</title><defs><clipPath id="plot-clip-${limit}"><rect x="26" y="26" width="408" height="408"/></clipPath></defs><g font-family="Arial" font-size="10" fill="#111">${body}</g></svg>`;
}
function sample(fn, start, end, count = 400) {
  return Array.from({ length: count + 1 }, (_, i) => {
    const x = start + (end - start) * i / count;
    return [x, fn(x)];
  });
}
function given(id) {
  if (id === 'quadratic') return graph({
    x: [-6, 6], y: [-8, 10], aria: 'Given quadratic; x-intercepts at minus 3 and 1, y-intercept 6, vertex minus 1 comma 8',
    lines: [{ points: sample(x => -2 * (x + 3) * (x - 1), -4.9, 2.9) }],
    points: [[-3, 0, '(-3, 0)'], [1, 0, '(1, 0)'], [0, 6, '(0, 6)']]
  });
  if (id === 'composition') return graph({
    x: [-6, 6], y: [-6, 6], aria: 'Given graph f through minus 3 minus 1, minus 1 comma 3, 2 comma 0, 4 comma 2',
    lines: [{ points: [[-3, -1], [-1, 3], [2, 0], [4, 2]], markers: [[-3, -1], [-1, 3], [2, 0], [4, 2]] }]
  });
  if (id === 'polynomial') return graph({
    x: [-20, 20], y: [-20, 20], aria: 'Given cubic graph; tangent zero at minus 1, crossing zero at 3, and y-intercept 6; both turning points visible; curve continues beyond the grid',
    lines: [{ points: sample(x => -2 * (x + 1) ** 2 * (x - 3), -5, 5) }],
    points: [[-1, 0, '(-1, 0)'], [3, 0, '(3, 0)'], [0, 6, '(0, 6)']]
  });
  if (id === 'operations') return graph({
    x: [-8, 8], y: [-8, 8], aria: 'Graph g: descending line from included (-6,3) to excluded (-2,-1); parabola from included (-2,2) through (0,-2) to excluded (2,2); horizontal segment from included (2,-3) to included (6,-3)',
    lines: [
      { points: [[-6, 3], [-2, -1]], markers: [[-6, 3], [-2, -1, true]] },
      { points: sample(x => x ** 2 - 2, -2, 2, 160), markers: [[-2, 2], [2, 2, true]] },
      { points: [[2, -3], [6, -3]], markers: [[2, -3], [6, -3]] }
    ]
  });
  throw new Error(`Unknown graph ${id}`);
}
const blank = (x = [-6, 6], y = x) => graph({
  x, y, aria: `Blank coordinate grid, x from ${x[0]} to ${x[1]}, y from ${y[0]} to ${y[1]}, one unit per square`
});
const styles = `
*{box-sizing:border-box}body{margin:0;background:#edf0f5;color:#152238;font:16px/1.55 Arial,sans-serif}
main{max-width:920px;margin:auto;padding:24px 18px 60px}header,.question{background:#fff;border:1px solid #d8dee8;border-radius:10px;padding:22px 26px;margin-bottom:16px}
.eyebrow{font-size:12px;color:#1d42ba;font-weight:bold;letter-spacing:1px}h1{font-size:28px;line-height:1.2;margin:5px 0 8px}h2{font-size:22px;margin:0}
.headrow{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid #d8dee8;padding-bottom:9px;margin-bottom:12px}.points{white-space:nowrap;font-size:14px;color:#42536b}
.meta{font-size:13px;color:#42536b;margin-top:14px}figure{margin:12px 0}.grid{display:block;width:440px;max-width:100%;height:auto;margin:12px auto;background:#fff}
.label{font-size:10px;paint-order:stroke;stroke:#fff;stroke-width:3px}figcaption{text-align:center;font-size:13px;color:#42536b}
table{border-collapse:collapse;width:100%;margin:10px 0;font-size:14px}th,td{border:1px solid #78869a;text-align:center;padding:8px}caption{font-weight:bold;margin:5px}
.math .katex{font-size:1.08em}.note{background:#fff6e5;border-left:4px solid #c47b00;padding:12px 14px}
@media(max-width:560px){main{padding:12px 8px}.question,header{padding:16px}h1{font-size:24px}table{font-size:11px}th,td{padding:5px 2px}}
@media print{body{background:#fff}main{padding:0}.question,header{break-inside:avoid}}
`;
let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prep Test 4 Questions for Review</title><style>${mathCss}</style><style>${styles}</style></head><body><main>`;
html += `<header><div class="eyebrow">PARENT REVIEW | QUESTION PROPOSAL</div><h1>${escape(data.title)}</h1><p>${data.minutes} minutes | ${data.points} proposed points | ${data.questions.length} questions</p><p class="note">${escape(data.status)} Questions 3, 8, 9, and 10 retain the selected Prep Test 2 problem formats and values. The other eight are fresh questions parallel to the last 12-question test. Question 3 includes a given graph and a blank graph workspace.</p></header>`;
for (const q of data.questions) {
  html += `<article class="question" id="q${q.id}" data-question="${q.id}" data-points="${q.points}"><div class="headrow"><h2>Question ${q.id}</h2><span class="points">${q.points} points</span></div>`;
  html += q.prompt.map(p => `<p class="math">${text(p)}</p>`).join('');
  if (q.table) html += `<table><caption>${escape(q.table.caption)}</caption>${q.table.rows.map((row, i) => `<tr>${row.map(cell => `${i === 0 ? '<th>' : '<td>'}${escape(cell)}${i === 0 ? '</th>' : '</td>'}`).join('')}</tr>`).join('')}</table>`;
  if (q.given) html += `<figure>${given(q.given)}<figcaption>Given graph</figcaption></figure>`;
  if (q.graph === 'blank') {
    const range = q.graphRange || (q.id === 3 ? { x: [-8, 8], y: [-8, 8] } : undefined);
    html += `<figure>${range ? blank(range.x, range.y) : blank()}<figcaption>Blank graph workspace (shown here to indicate the planned response space)</figcaption></figure>`;
  }
  if (q.graph === 'two-blank') html += `<figure>${blank([-8, 8])}<figcaption>Planned blank graph for part (a)</figcaption></figure><figure>${blank([-8, 8])}<figcaption>Planned blank graph for part (b)</figcaption></figure>`;
  html += `<p class="meta">Source: ${escape(q.source)}</p></article>`;
}
html += '</main></body></html>';
if (require.main === module) {
  fs.writeFileSync(path.join(root, 'reviews/prep-test-4-proposal.html'), html);
  console.log('Generated question preview.');
}
module.exports = { graph, given, text, mathCss, escape };

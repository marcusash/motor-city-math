const fs = require('node:fs');
const path = require('node:path');
const data = require('../reviews/prep-test-4-proposal-data.cjs');
const { graph, given, text, mathCss, escape } = require('./build-prep-test-4-proposal.cjs');
const css = `
@page{size:Letter;margin:.45in .5in}*{box-sizing:border-box}
body{margin:0;color:#111;background:white;font:11pt/1.4 Arial,sans-serif}
.page{height:10in;display:flow-root;position:relative;break-after:page}.page:last-child{break-after:auto}
h1{font-size:22pt}h2{font-size:16pt;margin:0}.heading{display:flex;justify-content:space-between;border-bottom:1px solid #111;padding-bottom:8px;margin-bottom:14px}
p{margin:10px 0}.grid{display:block;width:5.65in;height:5.65in;margin:12px auto}
.given .grid{width:5.1in;height:5.1in}.small .grid{width:3.3in;height:3.3in}
.label{paint-order:stroke;stroke:white;stroke-width:3px}figure{margin:8px 0}figcaption{text-align:center;font-size:9pt}
table{border-collapse:collapse;width:100%;margin:10px 0;font-size:10pt}td,th{border:1px solid #777;padding:7px;text-align:center}
.work{min-height:1.5in}.large-work{min-height:5in}footer{position:absolute;bottom:0;font-size:8pt}
@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}`;
let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Prep Test 4: Functions</title><style>${mathCss}</style><style>${css}</style></head><body>`;
function page(q, prompts, content, continued = false) {
  return `<section class="page" data-question="${q.id}" data-continued="${continued}"><div class="heading"><h2>Question ${q.id}${continued ? ' (continued)' : ''}</h2><span>${continued ? '' : q.points + ' points'}</span></div>${prompts.map(p => `<p>${text(p)}</p>`).join('')}${content}<footer>Prep Test 4 | Question ${q.id}${continued ? ' (continued)' : ''} | Student copy</footer></section>`;
}
html += `<section class="page"><p>Motor City Math | Pre-Calculus</p><h1>Prep Test 4: Functions</h1><p>75 minutes | 90 points | 11 questions</p><p>Name: __________________________________ Date: __________________</p><p>Show your work. Label axes, intercepts, and requested points. Use interval notation where requested.</p><p>A four-function calculator and one single-sided notesheet (no example problems) are allowed. No graphing calculator.</p><p>Use the provided blank space for answers. Both axes on each grid have matching negative and positive ranges. Each square represents one unit. Curves may continue beyond the grid.</p><footer>Prep Test 4 | Student copy</footer></section>`;
for (const q of data.questions) {
  let content = '';
  if (q.table) content += `<table><caption>${escape(q.table.caption)}</caption>${q.table.rows.map((row, i) => `<tr>${row.map(cell => `<${i ? 'td' : 'th'}>${escape(cell)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</table>`;
  if (q.given) content += `<figure class="given${q.id === 11 ? ' small' : ''}">${given(q.given)}<figcaption>Given graph${q.given === 'polynomial' ? '; curve continues beyond the grid' : ''}</figcaption></figure>`;
  if (q.id === 2) {
    html += page(q, q.prompt, content);
    html += page(q, ['Graph both compositions here. Show coordinate work, give both domains, and describe the transformations.'], graph({x:[-8,8],y:[-8,8]}) + '<div class="work"></div>', true);
    continue;
  }
  if (q.graph === 'blank') {
    const range = q.graphRange || { x: [-8, 8], y: [-8, 8] };
    content += graph(range);
  }
  if (q.id === 5) {
    html += page(q, q.prompt.slice(0,1), q.prompt.slice(1).map(p => `<p>${text(p)}</p><div class="work"></div>`).join(''));
    continue;
  }
  content += `<div class="${q.graph === 'blank' || q.given ? 'work' : 'large-work'}"></div>`;
  html += page(q, q.prompt, content);
}
html += '</body></html>';
fs.writeFileSync(path.join(__dirname, '..', 'tests', 'assessment-4-functions-75min.html'), html);
console.log('Built approved 11-question student HTML, 90 points.');

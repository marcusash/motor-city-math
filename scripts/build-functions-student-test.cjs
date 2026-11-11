const fs = require('node:fs');
const path = require('node:path');
const { exams } = require('../reviews/functions-parallel-practice-data.cjs');
const { grid, given, table, text, mathCss, escape } = require('./build-functions-practice-proposal.cjs');
const exam = exams[0];
const css = `
@page { size:Letter; margin:0.45in 0.5in; }
* { box-sizing:border-box; }
body { margin:0; font:11pt/1.4 Arial,sans-serif; color:#111; background:#edf0f4; }
main { max-width:8.5in; margin:auto; }
.page { position:relative; padding:0.4in; margin:18px 0; background:white; }
h1 { margin:4px 0; font-size:20pt; } h2 { font-size:15pt; margin:0; }
p { margin:9px 0; } .heading { display:flex; justify-content:space-between; border-bottom:1.5px solid #111; padding-bottom:8px; margin-bottom:14px; }
.points { font-size:10pt; } .topline { font-size:9pt; margin-bottom:8px; }
.grid { display:block; width:5.55in; height:5.55in; max-width:100%; margin:12px auto; background:white; }
.given .grid { width:3.7in; height:3.7in; } .compact .given .grid { width:3.4in; height:3.4in; }
.point-label { font-size:10px; paint-order:stroke; stroke:white; stroke-width:3px; stroke-linejoin:round; }
figure { margin:10px 0; } figcaption { font-size:9pt; text-align:center; }
.work { min-height:2.1in; } .large-work { min-height:5in; } .small-work { min-height:0.65in; }
.field { min-height:0.48in; } .responses p { margin-bottom:0; }
table { width:100%; border-collapse:collapse; font-size:10pt; margin:12px 0; }
th,td { border:1px solid #777; text-align:center; padding:7px 4px; }
caption { font-weight:bold; margin-bottom:5px; }
.katex { font-size:1.08em; }
footer { font-size:8pt; margin-top:12px; color:#333; }
.screen-only { margin:12px 0; } button { padding:8px 14px; }
@media(max-width:600px) { .page { padding:18px; } .grid,.given .grid,.compact .given .grid { height:auto; } }
@media print {
 body { background:white; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
 main { max-width:none; } .page { padding:0; margin:0; height:10.05in; break-after:page; }
 .page:last-child { break-after:auto; } footer { position:absolute; bottom:0; left:0; right:0; }
 .screen-only { display:none; } .grid,table { break-inside:avoid; }
 .grid { width:5.55in; height:5.55in; } .given .grid { width:3.7in; height:3.7in; }
 .compact .given .grid { width:3.4in; height:3.4in; }
}
`;
let html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="duration-minutes" content="75"><meta name="total-points" content="100"><title>Prep Test 3: Functions</title><style>${mathCss}</style><style>${css}</style></head><body><main data-copy="student"><section class="page"><div class="topline">Motor City Math | Pre-Calculus</div><h1>Prep Test 3: Functions</h1><p>75 minutes | 100 points | 12 questions</p><p>Name: __________________________________ Date: __________________</p><p>Show your work. Clearly label axes and requested points. Use interval notation where requested.</p><p>A four-function calculator and one single-sided notesheet (no example problems) are allowed. No graphing calculator.</p><p>Use the blank space provided for answers and calculations. Graphs use one unit per square.</p><p class="screen-only"><a href="../index.html">Back to Dashboard</a> &nbsp; <a href="assessment-3-functions-75min.pdf">Download student PDF</a> &nbsp; <button onclick="window.print()">Print</button></p><footer>Prep Test 3 | Student copy</footer></section>`;
function page(q, prompts, content, continued = false) {
  return `<section class="page${q.id === 12 ? ' compact' : ''}" ${continued ? 'data-continuation' : 'data-question'}="${q.id}"${continued ? '' : ` data-points="${q.points}"`}><div class="heading"><h2>Question ${q.id}${continued ? ', continued' : ''}</h2><span class="points">${continued ? '' : `${q.points} points`}</span></div>${prompts.map(p => `<p>${text(p)}</p>`).join('')}${content}<footer>Prep Test 3 | Question ${q.id}${continued ? ' (continued)' : ''}</footer></section>`;
}
for (const q of exam.questions) {
  if (q.layout === 'two-grids') {
    html += page(q, q.prompt.slice(0, 2), grid(q.range) + '<div class="small-work"></div>');
    html += page(q, q.prompt.slice(2), grid(q.range) + '<div class="work"></div>', true);
    continue;
  }
  if (q.id === 6) {
    html += page(q, q.prompt.slice(0, 1), q.prompt.slice(1).map(p =>
      `<p>${text(p)}</p><div class="work"></div>`).join(''));
    continue;
  }
  let content = '';
  if (q.table) content += table(q.table);
  if (q.given) content += `<figure class="given">${given(q)}<figcaption>Given graph</figcaption></figure>`;
  if (q.layout === 'graph') content += grid(q.range) + '<div class="small-work"></div>';
  else if (q.id === 3) content += `<div class="responses">${['Domain', 'Range', 'End behavior', 'Increasing intervals', 'Decreasing intervals', 'Relative extrema'].map(label => `<p>${label}:</p><div class="field"></div>`).join('')}</div>`;
  else if (q.id === 12) content += '<div class="work"></div>';
  else content += `<div class="${q.given ? 'work' : 'large-work'}"></div>`;
  html += page(q, q.prompt, content);
}
html += '</main></body></html>';
fs.writeFileSync(path.join(__dirname, '..', 'tests', `${exam.slug}.html`), html);
console.log('Built only full student HTML: 12 questions, 100 points, 75 minutes; shorter skills check remains on hold.');

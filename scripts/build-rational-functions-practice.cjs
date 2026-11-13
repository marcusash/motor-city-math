const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const katex = require('../shared/katex/katex.min.js');

const root = path.resolve(__dirname, '..');
const sourceFlag = process.argv.indexOf('--source-dir');
if (sourceFlag !== -1 && (!process.argv[sourceFlag + 1] || process.argv[sourceFlag + 1].startsWith('--'))) {
  throw new Error('--source-dir requires a directory.');
}
const sourceDir = sourceFlag === -1
  ? path.join(root, 'print', 'assessment-2-practice-2026-11-11')
  : path.resolve(process.argv[sourceFlag + 1]);
const data = JSON.parse(fs.readFileSync(path.join(sourceDir, 'exam.json'), 'utf8'));
const outputFlag = process.argv.indexOf('--output-dir');
if (outputFlag !== -1 && (!process.argv[outputFlag + 1] || process.argv[outputFlag + 1].startsWith('--'))) {
  throw new Error('--output-dir requires a directory.');
}
const outputDir = outputFlag === -1 ? sourceDir : path.resolve(process.argv[outputFlag + 1]);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function text(value) {
  return String(value).split(/(\\\([\s\S]*?\\\))/).map(part => part.startsWith('\\(')
    ? katex.renderToString(part.slice(2, -2), { throwOnError: true, strict: 'error', trust: false })
    : escape(part)).join('');
}
const polynomial = (coefficients, x) => coefficients.reduce((value, coefficient) => value * x + coefficient, 0);
function number(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^-?\d+\/[1-9]\d*$/.test(value)) {
    const [a, b] = value.split('/').map(Number);
    return a / b;
  }
  throw new Error('Invalid graph coordinate: ' + value);
}

function graph(question, blank = false, size = question.graph.plot) {
  const spec = question.graph;
  const limit = spec.range, pad = 24, extent = size + pad * 2;
  const px = x => pad + (x + limit) * size / (2 * limit);
  const py = y => pad + (limit - y) * size / (2 * limit);
  const clip = `clip-${question.id}-${blank ? 'blank' : 'given'}`;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${extent} ${extent}" width="${extent}pt" height="${extent}pt" role="img" aria-label="${blank ? 'Blank coordinate grid' : 'Supplied graph'} for question ${question.id}; both axes from negative ${limit} to ${limit}; equal unit spacing" data-plot-size="${size}" data-range="${limit}">`;
  svg += `<defs><clipPath id="${clip}"><rect x="${pad}" y="${pad}" width="${size}" height="${size}"/></clipPath></defs>`;
  for (let n = -limit; n <= limit; n++) {
    svg += `<line x1="${px(n)}" y1="${pad}" x2="${px(n)}" y2="${pad + size}" stroke="${n ? '#ccc' : '#111'}" stroke-width="${n ? 0.4 : 1}"/>`;
    svg += `<line x1="${pad}" y1="${py(n)}" x2="${pad + size}" y2="${py(n)}" stroke="${n ? '#ccc' : '#111'}" stroke-width="${n ? 0.4 : 1}"/>`;
  }
  if (!blank) {
    svg += `<g clip-path="url(#${clip})">`;
    for (const pole of spec.poles) {
      svg += `<line x1="${px(pole)}" y1="${pad}" x2="${px(pole)}" y2="${pad + size}" stroke="#555" stroke-dasharray="4 4" stroke-width="0.8"/>`;
    }
    if (spec.horizontal !== undefined && spec.horizontal !== 0) {
      svg += `<line x1="${pad}" y1="${py(spec.horizontal)}" x2="${pad + size}" y2="${py(spec.horizontal)}" stroke="#555" stroke-dasharray="4 4" stroke-width="0.8"/>`;
    }
    if (spec.slant) {
      const [m, b] = spec.slant;
      svg += `<line x1="${px(-limit)}" y1="${py(-limit * m + b)}" x2="${px(limit)}" y2="${py(limit * m + b)}" stroke="#555" stroke-dasharray="4 4" stroke-width="0.8"/>`;
    }
    const boundaries = [-limit, ...spec.poles.filter(x => x > -limit && x < limit).sort((a, b) => a - b), limit];
    for (let interval = 0; interval < boundaries.length - 1; interval++) {
      const a = boundaries[interval] + (interval ? 0.0001 : 0);
      const b = boundaries[interval + 1] - (interval < boundaries.length - 2 ? 0.0001 : 0);
      let d = '';
      for (let i = 0; i <= 800; i++) {
        const x = a + (b - a) * i / 800;
        const y = polynomial(spec.numerator, x) / polynomial(spec.denominator, x);
        if (!Number.isFinite(y)) throw new Error(`Nonfinite graph sample for Q${question.id}`);
        d += `${i ? 'L' : 'M'}${px(x).toFixed(3)},${py(Math.max(-limit - 2, Math.min(limit + 2, y))).toFixed(3)} `;
      }
      svg += `<path d="${d}" fill="none" stroke="#111" stroke-width="1.6"/>`;
    }
    for (const [x, y] of spec.holes || []) {
      svg += `<circle cx="${px(number(x))}" cy="${py(number(y))}" r="3.5" fill="white" stroke="#111" stroke-width="1.3"/>`;
    }
    svg += '</g>';
  }
  svg += '<g font-family="Arial,sans-serif" font-size="8" fill="#111" style="paint-order:stroke;stroke:white;stroke-width:2px">';
  const every = limit > 6 ? 2 : 1;
  for (let n = -limit; n <= limit; n++) {
    if (n && n % every === 0) {
      svg += `<text x="${px(n)}" y="${py(0) + 12}" text-anchor="middle">${n}</text>`;
      svg += `<text x="${px(0) - 6}" y="${py(n) + 3}" text-anchor="end">${n}</text>`;
    }
  }
  svg += `<text x="${pad + size + 8}" y="${py(0) + 3}">x</text><text x="${px(0) + 6}" y="${pad - 8}">y</text></g></svg>`;
  return `<figure class="graph">${svg}</figure>`;
}

function space(part) {
  const areas = (part.areas || []).map(area => `<div class="answer-area" style="flex:${area.weight ?? 1}">${area.labels.map((label, index) => `<div class="answer-field" style="flex:${area.weights ? area.weights[index] : 1}">${escape(label)}</div>`).join('')}</div>`).join('');
  return `<div class="response"><p>${part.label ? `<b>(${escape(part.label)})</b> ` : ''}${text(part.prompt)}</p>${part.space ? `<div class="answer-space" style="height:${part.space}pt">${areas}</div>` : ''}</div>`;
}
function tables(question) {
  return (question.tables || []).map(table => `<table class="values"><tbody><tr><th scope="row">x</th>${table.inputs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th scope="row">H(x)</th>${table.outputs.map(y => `<td>${y === null ? 'undefined' : y}</td>`).join('')}</tr></tbody></table>`).join('');
}
function questionBlock(question, part = 'all') {
  let content = `<article data-question="${question.id}"${part === 'graph' ? ' data-continued="true"' : ''}><h2><span>${question.id}.${part === 'graph' ? ' (continued)' : ''}</span><span>${part === 'graph' ? '' : question.points + ' points'}</span></h2>`;
  if (part === 'graph') {
    return content + space(question.parts[1]) + graph(question, true) + '</article>';
  }
  content += `<p class="stem">${text(question.stem)}</p>`;
  if (question.type === 'graph-and-end-behavior') {
    return content + space(question.parts[0]) + graph(question, true) + space(question.parts[1]) + '</article>';
  }
  if (question.type === 'read-graph') {
    return content + `<div class="graph-analysis">${graph(question)}<div>${question.parts.map(space).join('')}</div></div></article>`;
  }
  if (question.type === 'features-and-sketch') {
    return content + space(question.parts[0]) + '<p class="continuation">Continue with part (b) on the next page.</p></article>';
  }
  if (question.choices) {
    const choices = `<ol class="choices" type="A">${question.choices.map(choice => `<li>${text(choice)}</li>`).join('')}</ol>`;
    content += question.graph ? `<div class="choice-graph${question.graph.plot > 220 ? ' wide' : ''}">${graph(question)}${choices}</div>` : choices;
  }
  return content + tables(question) + question.parts.map(space).join('') + '</article>';
}
function keyBlock(question) {
  return `<article data-question="${question.id}"><h2><span>${question.id}.</span><span>${question.points} points</span></h2>
    ${[1, 4, 5].includes(question.id) ? graph(question, false, 230) : ''}
    <ol class="solutions">${question.steps.map(step => `<li>${text(step)}</li>`).join('')}</ol>
    <p><b>Practice rubric (${question.points} points)</b></p><ul class="rubric">${question.rubric.map(item => `<li>${item.points}: ${text(item.text)}</li>`).join('')}</ul></article>`;
}

const css = `
*{box-sizing:border-box}body{margin:0;background:#ddd;color:#111;font:10pt/1.35 Arial,sans-serif}
.sheet{width:540pt;height:720pt;position:relative;margin:20pt auto;padding:0;background:white;outline:20pt solid white;break-after:page}
.sheet:last-child{break-after:auto}header{border-bottom:1pt solid #222;padding-bottom:8pt;margin-bottom:10pt}
.brand{font-size:8pt;font-weight:bold;letter-spacing:.3pt}h1{font-size:17pt;margin:5pt 0}
.identity,.details{font-size:9pt;margin:4pt 0}main{padding-bottom:8pt}h2{display:flex;justify-content:space-between;font-size:12pt;background:#eee;padding:5pt 8pt;margin:0 0 8pt}
article+article{margin-top:16pt}.stem{margin:7pt 0 10pt}.response p{margin:6pt 0}.answer-space{border:1px solid #bbb;margin:5pt 0 10pt}
.answer-space{display:flex;flex-direction:column}.answer-area{display:flex;min-height:0}.answer-area+.answer-area{border-top:1px solid #ddd}
.answer-field{padding:3pt 5pt;font-size:8.5pt}.answer-field+.answer-field{border-left:1px solid #ddd}
.graph{margin:6pt auto;text-align:center}.graph svg{display:block;max-width:100%;height:auto;margin:auto}
.graph-analysis{display:grid;grid-template-columns:320pt 1fr;gap:12pt;align-items:start}
.graph-analysis .response p{font-size:9pt}.graph-analysis .answer-space{margin-bottom:8pt}
.choice-graph{display:grid;grid-template-columns:230pt 1fr;gap:14pt;align-items:center}
.choice-graph.wide{grid-template-columns:320pt 1fr}
.choices{padding-left:22pt;margin:8pt 0}.choices li{padding-left:4pt;margin:8pt 0;break-inside:avoid}
.values{border-collapse:collapse;width:100%;font-size:9pt;margin:10pt 0}.values th,.values td{border:1px solid #777;padding:5pt 3pt;text-align:center}
.continuation{font-size:9pt}.solutions{padding-left:18pt}.solutions li{margin:7pt 0}.rubric{padding-left:18pt;font-size:9pt}.rubric li{margin:4pt 0}
.key .graph{float:right;width:265pt;margin:0 0 8pt 12pt}.key article::after{content:"";display:block;clear:both}.key .solutions{font-size:10pt}
footer{position:absolute;bottom:0;left:0;right:0;border-top:1px solid #777;padding-top:5pt;font-size:8pt;display:flex;justify-content:space-between}
.katex{font-size:1.08em}.screen-only{text-align:center;margin:15pt}
@page{size:Letter;margin:.5in}@media print{body{background:white}.sheet{margin:0;outline:0}.screen-only{display:none}*{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
`;
function documentHtml(pages, key) {
  const katexCss = path.relative(outputDir, path.join(root, 'shared', 'katex', 'katex.min.css')).split(path.sep).join('/');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="duration-minutes" content="${data.durationMinutes}"><meta name="total-points" content="${data.totalPoints}"><title>${escape(data.title)}${key ? ': Parent Key' : ''}</title><link rel="stylesheet" href="${katexCss}"><style>${css}</style></head><body>
    <div class="screen-only"><button onclick="window.print()">Print ${key ? 'parent key' : 'student exam'}</button></div>
    ${pages.map((content, index) => `<section class="sheet${key ? ' key' : ''}" data-page="${index + 1}"><header><div class="brand">MOTOR CITY MATH | PRECALCULUS</div><h1>${escape(data.title)}${key ? ': Parent Key' : ''}</h1>
    ${key ? '<p class="details">Worked solutions and proposed practice rubric. Keep separate from the student copy.</p>' : index === 0 ? '<p class="identity">Name: ____________________________________ &nbsp; Date: __________________</p>' : ''}
    ${index === 0 ? `<p class="details">13 questions | ${data.totalPoints} points | ${data.durationMinutes} minutes${key ? ' (user-selected allowance)' : ''}</p><p class="details">${key ? 'Award follow-through credit; do not repeatedly deduct an originating error. Accept equivalent valid functions and their own correct hole heights. This is not an official school key.' : escape(data.directions)}</p>` : ''}
    </header><main>${content}</main><footer><span>Rational Functions | ${key ? 'Parent key' : 'Student copy'} | Revision ${data.revision}</span><span>Page ${index + 1} of ${pages.length}</span></footer></section>`).join('')}</body></html>`;
}
async function build() {
  if (data.questions.length !== 13 || data.questions.reduce((sum, q) => sum + q.points, 0) !== 58) {
    throw new Error('Exam must retain 13 questions and 58 points.');
  }
  const q = id => data.questions.find(question => question.id === id);
  const studentGroups = data.printing?.studentGroups || [[1], [2, 3], [4], [5], ['5-graph'], [6, 7], [8], [9], [10], [11], [12, 13]];
  const keyGroups = data.printing?.keyGroups || [[1], [2, 3], [4], [5], [6, 7], [8, 9], [10, 11], [12, 13]];
  fs.mkdirSync(outputDir, { recursive: true });
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.MCM_PDF_BROWSER_CHANNEL ? { channel: process.env.MCM_PDF_BROWSER_CHANNEL } : {}) });
  try {
    for (const [name, groups, key] of [['student', studentGroups, false], ['parent-key', keyGroups, true]]) {
      const pages = groups.map(group => group.map(id => id === '5-graph' ? questionBlock(q(5), 'graph') : key ? keyBlock(q(id)) : questionBlock(q(id))).join(''));
      const htmlPath = path.join(outputDir, name + '.html');
      fs.writeFileSync(htmlPath, documentHtml(pages, key).replace(/[ \t]+$/gm, ''));
      const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
      await page.goto(pathToFileURL(htmlPath).href);
      await page.evaluate(() => document.fonts.ready);
      const problems = await page.evaluate(() => Array.from(document.querySelectorAll('.sheet')).flatMap(sheet => {
        const footer = sheet.querySelector('footer').getBoundingClientRect();
        const main = sheet.querySelector('main').getBoundingClientRect();
        const errors = [];
        if (main.bottom > footer.top - 4) errors.push('content overlaps footer');
        if (sheet.scrollWidth > sheet.clientWidth + 1) errors.push('horizontal overflow');
        return errors.map(error => `page ${sheet.dataset.page}: ${error}`);
      }));
      if (problems.length) throw new Error(name + ': ' + problems.join('; '));
      await page.pdf({ path: path.join(outputDir, name + '.pdf'), preferCSSPageSize: true, printBackground: true });
      if (process.argv.includes('--screenshots')) {
        for (let i = 0; i < groups.length; i++) {
          await page.locator('.sheet').nth(i).screenshot({ path: path.join(outputDir, `${name}-page-${i + 1}.png`) });
        }
      }
      console.log(`${name}: ${groups.length} planned pages, fonts loaded, no content overflow.`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
build().catch(error => { console.error(error); process.exitCode = 1; });

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const repository = path.resolve(__dirname, '..');
const outputFlag = process.argv.indexOf('--output-dir');
if (outputFlag !== -1 && (!process.argv[outputFlag + 1] || process.argv[outputFlag + 1].startsWith('--'))) {
  throw new Error('--output-dir requires a directory.');
}
const root = outputFlag === -1
  ? path.join(repository, 'print', 'kai-practice-2026-11')
  : path.resolve(process.argv[outputFlag + 1]);
const katex = require('../shared/katex/katex.min.js');
const katexCss = path.relative(root, path.join(repository, 'shared', 'katex', 'katex.min.css'))
  .split(path.sep).map(segment => encodeURIComponent(segment)).join('/');
const studentName = 'Kai_Mixed_Refresher_Quiz_2026-11-04_Easier_Factoring';
const keyName = `${studentName}_PARENT_KEY`;
const math = (tex) => katex.renderToString(tex, {
  throwOnError: true, strict: 'error', trust: false, output: 'htmlAndMathml',
});
const display = (tex, id = '') => `<div class="equation"${id ? ` id="${id}"` : ''}>${math(`\\displaystyle ${tex}`)}</div>`;
const prompt = (text) => `<p class="prompt">${text}</p>`;
const room = (height, label = 'Work', grow = false) => `<div class="workspace${grow ? ' grow' : ''}"><div class="space-label">${label}</div><div class="answer-box" style="min-height:${height}pt"></div></div>`;
const inverse = (name, value) => math(`${name}^{-1}${value === undefined ? '' : `(${value})`}`);

function header(question, first, key, continued) {
  return `<header><div class="brand">MOTOR CITY MATH | ALGEBRA 2 / PRECALCULUS</div>
    <h1>Mixed-Unit Refresher${key ? ': Parent Key' : ''}</h1>
    ${key ? '<p class="details">November 4, 2026 | Worked solutions and scoring | Keep separate from quiz</p>' :
      '<p class="identity">Name: __________________________________ &nbsp; Date: ______________</p>'}
    ${first && !key ? '<p class="details">5 questions | 100 points | About 40 minutes | Four-function calculator</p><p class="details">Show your work and explain your reasoning. Give exact answers.</p>' : ''}
    <div class="question"><b>${question}.${continued ? ' (continued)' : ''}</b>${continued ? '' : '<b>20 points</b>'}</div>
    </header>`;
}

function sheet(question, content, index, total, key = false, continued = false) {
  return `<section class="sheet${key ? ' key' : ''}${continued ? ' continued' : ''}" data-question="${question}" data-page="${index}">
    ${header(question, index === 1, key, continued)}
    <main>${content}</main><footer><span>Mixed-Unit Refresher | ${key ? 'Parent key' : 'Student copy'}</span><span>Page ${index} of ${total}</span></footer>
    </section>`;
}

function grid({ blank = false } = {}) {
  const xmin = -6, xmax = 6, ymin = blank ? -6 : -8, ymax = blank ? 6 : 8;
  const w = blank ? 408 : 300, h = blank ? 408 : 216;
  const left = 25, top = 14, vw = w + 48, vh = h + (blank ? 20 : 40);
  const x = n => left + (n - xmin) * w / (xmax - xmin);
  const y = n => top + (ymax - n) * h / (ymax - ymin);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${blank ? 'Blank coordinate grid from negative six to six' : 'Rational function with a hole at one, negative two'}" viewBox="0 0 ${vw} ${vh}" style="width:${vw}pt;height:${vh}pt">`;
  out += `<defs><clipPath id="${blank ? 'blank' : 'curve'}-clip"><rect x="${left}" y="${top}" width="${w}" height="${h}"/></clipPath></defs>`;
  for (let n = xmin; n <= xmax; n++) out += `<line x1="${x(n)}" y1="${top}" x2="${x(n)}" y2="${top+h}" stroke="#ccc" stroke-width=".45"/>`;
  for (let n = ymin; n <= ymax; n++) out += `<line x1="${left}" y1="${y(n)}" x2="${left+w}" y2="${y(n)}" stroke="#ccc" stroke-width=".45"/>`;
  out += `<g stroke="#111" stroke-width=".9"><line x1="${left}" y1="${y(0)}" x2="${left+w}" y2="${y(0)}"/><line x1="${x(0)}" y1="${top}" x2="${x(0)}" y2="${top+h}"/>`;
  out += `<path d="M${left+4},${y(0)-2} L${left},${y(0)} L${left+4},${y(0)+2} M${left+w-4},${y(0)-2} L${left+w},${y(0)} L${left+w-4},${y(0)+2} M${x(0)-2},${top+4} L${x(0)},${top} L${x(0)+2},${top+4} M${x(0)-2},${top+h-4} L${x(0)},${top+h} L${x(0)+2},${top+h-4}" fill="none"/></g>`;
  const every = blank ? 1 : 2;
  out += '<g font-family="Arial,sans-serif" font-size="8" fill="#111" style="paint-order:stroke;stroke:white;stroke-width:2px;stroke-linejoin:round">';
  for (let n = xmin; n <= xmax; n++) if (n && n % every === 0) out += `<text x="${x(n)}" y="${y(0)+13}" text-anchor="middle">${n}</text>`;
  for (let n = ymin; n <= ymax; n++) if (n && n % every === 0) out += `<text x="${x(0)-5}" y="${y(n)+3}" text-anchor="end">${n}</text>`;
  out += `<text x="${left+w+8}" y="${y(0)+3}">x</text><text x="${x(0)+6}" y="${top-4}">y</text><text x="${x(0)+4}" y="${y(0)-4}">0</text></g>`;
  if (!blank) {
    out += `<g stroke="#666" stroke-width=".8" stroke-dasharray="4 4"><line x1="${x(-1)}" y1="${top}" x2="${x(-1)}" y2="${top+h}"/><line x1="${left}" y1="${y(2)}" x2="${left+w}" y2="${y(2)}"/></g>`;
    out += '<g clip-path="url(#curve-clip)" stroke="black" stroke-width="1.7" fill="none">';
    for (const [a, b] of [[-6, -1.001], [-0.999, 6]]) {
      let d = '';
      for (let i = 0; i <= 1600; i++) {
        const n = a + (b-a)*i/1600;
        const value = Math.max(ymin-5, Math.min(ymax+5, 2-8/(n+1)));
        d += `${i ? 'L' : 'M'}${x(n).toFixed(3)},${y(value).toFixed(3)} `;
      }
      out += `<path d="${d}"/>`;
    }
    out += `</g><circle cx="${x(1)}" cy="${y(-2)}" r="3.5" fill="white" stroke="black" stroke-width="1.3"/>`;
    out += `<g font-family="Arial,sans-serif" font-size="9"><text x="${x(1)+10}" y="${y(-2)+3}">(1, -2)</text><text x="${x(3)+7}" y="${y(0)-10}">(3, 0)</text><text x="${x(0)+10}" y="${y(-6)+3}">(0, -6)</text></g>`;
  }
  return out + '</svg>';
}

function quiz() {
  const table = `<table><tr><th>${math('p')} (pages)</th>${[2,4,6,8,10,12].map(n => `<td>${n}</td>`).join('')}</tr>
    <tr><th>${math('T(p)')} (sec)</th>${[8,13,18,23,28,33].map(n => `<td>${n}</td>`).join('')}</tr></table>`;
  return [
    sheet(1, `<p>Let ${math('R')} be the function below.</p>
      ${display('R(x)=\\frac{4x^2+6x+2}{6x^2+15x+6}')}
      ${prompt('(a) Simplify and state the original domain in interval notation.')}
      ${room(81)}
      ${prompt('(b) Find all intercepts, any holes (coordinates), and all vertical and horizontal asymptotes. Show your calculations.')}
      ${room(186, 'Work', true)}`, 1, 6),
    sheet(1, `${prompt(`(c) Sketch ${math('R')} on the grid. Label the features you found in part (b).`)}
      <p class="small">Each square represents 1 unit on both axes.</p>
      <figure class="large-grid">${grid({blank:true})}</figure>
      ${prompt(`Explain what happens as ${math('x')} approaches the vertical asymptote from each side.`)}
      ${room(44, 'Answer')}`, 2, 6, false, true),
    sheet(2, `<p>Let ${math('S')} be the function below.</p>
      ${display('S(x)=\\frac{6x^3-7x^2-2x+2}{3x^2+x-2}')}
      ${prompt('(a) Find the slant asymptote using polynomial long division. Show all work.')}
      ${room(197, 'Work', true)}
      ${prompt('(b) Describe the far-left and far-right end behavior. Explain algebraically why your line describes that behavior.')}
      ${room(90, 'Answer')}`, 3, 6),
    sheet(3, `<p class="small">The graph continues beyond the window. Dashed lines are asymptotes.<br>The open circle is its only missing point away from the vertical asymptote.</p>
      <figure>${grid()}</figure>
      ${prompt('(a) State the domain in interval notation.')}<div class="answer-line"></div>
      ${prompt('(b) Write one possible rational function that matches the graph, including its hole. Explain how it matches the intercepts, asymptotes, and hole.')}
      ${room(71, 'Work', true)}
      ${prompt('(c) Describe the far-left and far-right end behavior.')}
      ${room(28, 'Answer')}`, 4, 6),
    sheet(4, `<p>A printer takes a fixed setup time plus a constant time per page. ${math('T(p)')} is the total job time in seconds for ${math('p')} pages. Selected values are shown.</p>
      ${table}
      ${prompt(`(a) Find ${math('T(8)')} and ${inverse('T','8')}. Explain what each means, including units.`)}
      ${room(78, 'Answer')}
      ${prompt(`(b) Write formulas for ${math('T')} and ${inverse('T')}. Show your algebra.`)}
      ${room(95, 'Work', true)}
      ${prompt('(c) Use your inverse to determine the number of pages in a 53-second job.')}
      ${room(47)}`, 5, 6),
    sheet(5, `<p>Let ${math('U')} be the function below.</p>
      ${display('U(x)=2+\\sqrt{5x+10}', 'q5-function')}
      ${prompt(`(a) Find ${inverse('U')}. State the domains of ${math('U')} and ${inverse('U')}. Show your algebra.`)}
      ${room(120, 'Work', true)}
      ${prompt(`(b) What should each expression below equal if the functions are inverses? Write your answers first. Then verify each with algebra and state the allowed ${math('x')}-values.`)}
      ${room(62, `${math('U(U^{-1}(x))')} = __________________`)}
      ${room(64, `${math('U^{-1}(U(x))')} = __________________`)}`, 6, 6),
  ].join('');
}

const kp = text => `<p>${text}</p>`;
const kd = tex => `<div class="key-equation">${math(`\\displaystyle ${tex}`)}</div>`;
const score = text => `<p class="scoring"><b>Scoring (20):</b> ${text}</p>`;

function key() {
  return [
    sheet(1,
      kp('<b>(a)</b> Factor and simplify:') +
      kd('4x^2+6x+2=2(2x^2+3x+1)=2(2x+1)(x+1)') +
      kd('6x^2+15x+6=3(2x+1)(x+2)') +
      kd('R(x)=\\frac{2(x+1)}{3(x+2)},\\qquad x\\ne-2,-\\frac12') +
      kp(`Domain: ${math('(-\\infty,-2)\\cup(-2,-\\tfrac12)\\cup(-\\tfrac12,\\infty)')}. Canceling does not restore an excluded input.`) +
      kp(`<b>(b)</b> ${math('x')}-intercept: ${math('(-1,0)')}. The canceled zero is not an intercept.<br>
        ${math('y')}-intercept: ${math('R(0)=\\tfrac26=\\tfrac13')}, so ${math('(0,\\tfrac13)')}.<br>
        Vertical asymptote: ${math('x=-2')}. Horizontal asymptote: ${math('y=\\tfrac46=\\tfrac23')}.`) +
      kp('For the hole, substitute the canceled zero into the simplified expression:') +
      kd('\\frac{2(-\\frac12+1)}{3(-\\frac12+2)}=\\frac29\\quad\\Longrightarrow\\quad\\left(-\\frac12,\\frac29\\right)') +
      kp(`<b>(c)</b> ${math('R(x)=\\tfrac23-\\tfrac{2}{3(x+2)}')}. Draw dashed lines at ${math('x=-2')} and ${math('y=\\tfrac23')}, the open circle, and both intercepts. Left of ${math('-2')}, the branch is above ${math('y=\\tfrac23')} and tends to ${math('+\\infty')} near ${math('-2')}. Right of ${math('-2')}, it is below ${math('y=\\tfrac23')} and tends to ${math('-\\infty')} near ${math('-2')}.`) +
      score('domain and simplification 4; intercepts 4; hole 3; asymptotes 3; sketch 4; one-sided explanation 2.') +
      `<p class="note"><b>Use of this key:</b> This is standard Precalculus practice based on Kai's November 1 review sheets, not an honors-level assessment. The goal is accurate algebra, clear explanations, and understanding the concepts. Scoring is a practice guide, not Kai's school rubric or a prediction of his grade.</p>`,
      1, 5, true),
    sheet(2,
      kp('<b>(a)</b> Divide leading terms, multiply, and subtract:') +
      kd('\\frac{6x^3}{3x^2}=2x') +
      kd('2x(3x^2+x-2)=6x^3+2x^2-4x') +
      kd('(6x^3-7x^2-2x+2)-(6x^3+2x^2-4x)=-9x^2+2x+2') +
      kp('The next term is:') +
      kd('\\frac{-9x^2}{3x^2}=-3') +
      kd('-3(3x^2+x-2)=-9x^2-3x+6') +
      kd('(-9x^2+2x+2)-(-9x^2-3x+6)=5x-4') +
      kd('S(x)=2x-3+\\frac{5x-4}{3x^2+x-2}') +
      kp(`The slant asymptote is ${math('\\boxed{y=2x-3}')}, not the remainder.`) +
      kp(`<b>(b)</b> As ${math('x\\to-\\infty')}, ${math('S(x)\\to-\\infty')}. As ${math('x\\to+\\infty')}, ${math('S(x)\\to+\\infty')}. The difference ${math('S(x)-(2x-3)')} tends to zero because its numerator degree is smaller than its denominator degree. Thus the ends approach that line. For sufficiently negative inputs the graph is below the line; for sufficiently positive inputs it is above the line.`) +
      score('long division 10; asymptote 4; end directions 2; explanation that the remainder fraction tends to zero 4. Above/below detail is useful but not required for full credit.'),
      2, 5, true),
    sheet(3,
      kp(`<b>(a)</b> Domain: ${math('(-\\infty,-1)\\cup(-1,1)\\cup(1,\\infty)')}. Exclude the vertical asymptote and the hole.`) +
      kp('<b>(b)</b> One possible equation is:') +
      kd('K(x)=\\frac{2(x-3)(x-1)}{(x+1)(x-1)}') +
      kp(`The factor ${math('x-3')} gives the ${math('x')}-intercept ${math('3')}; ${math('x+1')} gives vertical asymptote ${math('x=-1')}; equal degrees and leading ratio ${math('2')} give ${math('y=2')}. The canceled ${math('x-1')} factor preserves a hole rather than an intercept.`) +
      kp(`To see the scale, start with ${math('A(x-3)/(x+1)')}. Its horizontal asymptote is ${math('y=A')}, so ${math('A=2')}. The original function must still be undefined at ${math('x=1')}.`) +
      kd('\\text{Hole height: }\\ \\frac{2(1-3)}{1+1}=-2') +
      kd('\\text{y-intercept: }\\ \\frac{2(0-3)}{0+1}=-6') +
      kp(`Accept algebraically equivalent expressions with the same graph and domain. In particular, ${math('2-\\tfrac8{x+1}')} is acceptable only if the student explicitly excludes ${math('x=1')} as well as ${math('x=-1')}. No unique written form is required.`) +
      kp(`<b>(c)</b> ${math('K(x)=2-\\tfrac8{x+1}')}. As ${math('x\\to-\\infty')}, the graph approaches ${math('2')} from above. As ${math('x\\to+\\infty')}, it approaches ${math('2')} from below.`) +
      score('domain 4; valid equation including excluded point 8; explanation of features 4; end behavior 4. Do not penalize a different equivalent equation.'),
      3, 5, true),
    sheet(4,
      kp(`<b>(a)</b> ${math('T(8)=23')}: an 8-page job takes 23 seconds.<br>
        ${math('T^{-1}(8)=2')}: an 8-second job contains 2 pages.<br>Both rows contain 8, but the lookups have different directions.`) +
      kp('<b>(b)</b> Find the rate and setup time:') +
      kd('\\frac{13-8}{4-2}=\\frac52\\text{ seconds per page}') +
      kd('8=\\frac52(2)+b\\quad\\Longrightarrow\\quad b=3') +
      kd('T(p)=\\frac52p+3') +
      kp('To invert, solve for pages:') +
      kd('t=\\frac52p+3\\quad\\Longrightarrow\\quad t-3=\\frac52p') +
      kd('T^{-1}(t)=\\frac25(t-3)') +
      kp('The inverse takes total seconds as input and returns pages.') +
      kd('\\text{(c)}\\quad T^{-1}(53)=\\frac25(53-3)=20') +
      kp(`A 53-second job contains <b>20 pages</b>. Check: ${math('\\tfrac52(20)+3=53')} seconds.`) +
      score('two correct lookups and meanings 6; forward model 4; inverse model and algebra 4; new inverse evaluation, work, and units 6. Do not give full interpretation credit for a number without units.'),
      4, 5, true),
    sheet(5,
      kp('<b>(a)</b> Solve for the original input:') +
      kd('y=2+\\sqrt{5x+10}\\quad\\Longrightarrow\\quad y-2=\\sqrt{5x+10}') +
      kd('(y-2)^2=5x+10\\quad\\Longrightarrow\\quad x=\\frac{(y-2)^2-10}{5}') +
      kd('U^{-1}(x)=\\frac{(x-2)^2-10}{5}') +
      kp(`Domain of ${math('U')}: ${math('[-2,\\infty)')}, since ${math('5x+10\\ge0')}. Range of ${math('U')}: ${math('[2,\\infty)')}, so the inverse domain is ${math('[2,\\infty)')}.`) +
      kp(`<b>(b)</b> Both expected results are ${math('x')}, on the appropriate domains.`) +
      kd('\\begin{aligned}U(U^{-1}(x))&=2+\\sqrt{5\\left(\\frac{(x-2)^2-10}{5}\\right)+10}\\\\&=2+\\sqrt{(x-2)^2}\\\\&=2+|x-2|=x,\\qquad x\\ge2.\\end{aligned}') +
      kd('\\begin{aligned}U^{-1}(U(x))&=\\frac{\\left[(2+\\sqrt{5x+10})-2\\right]^2-10}{5}\\\\&=\\frac{(5x+10)-10}{5}=x,\\qquad x\\ge-2.\\end{aligned}') +
      kp(`The first restriction matters: ${math('\\sqrt{z^2}=|z|')}. Also, the first composition cannot take ${math('x<2')} because that input is outside the inverse function's domain.`) +
      score('inverse formula and algebra 6; both domains 4; expected composition results 2; algebra for each order 3 + 3; allowed inputs for each order 1 + 1.'),
      5, 5, true),
  ].join('');
}

const css = `
  @page { size: letter; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 612pt; background: white; color: black; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.4; }
  .sheet { width:612pt; height:792pt; padding:40pt 44pt 22pt; display:flex; flex-direction:column; break-after:page; }
  .sheet:last-child { break-after:auto; }
  header { border-top:2pt solid black; padding-top:8pt; flex:none; }
  .brand { font-size:9pt; font-weight:bold; }
  h1 { font-size:18pt; line-height:1.2; margin:8pt 0 15pt; }
  .identity { font-size:10pt; margin:0 0 12pt; }
  .details { font-size:10pt; margin:0 0 4pt; }
  .question { display:flex; justify-content:space-between; background:#efefef; padding:7pt 10pt; margin:15pt 0 12pt; font-size:12pt; }
  .question b:last-child:not(:first-child) { font-size:10pt; align-self:center; }
  main { flex:1; min-height:0; display:flex; flex-direction:column; }
  p { margin:0 0 8pt; }
  .prompt { font-weight:bold; margin:9pt 0 8pt; }
  .small { font-size:10pt; }
  .katex { font-size:1.1em; }
  .equation { font-size:18pt; text-align:center; margin:10pt 0 18pt; padding:7pt 0; flex:none; }
  .workspace { display:flex; flex-direction:column; flex:none; margin:0 0 7pt; }
  .workspace.grow { flex:1; }
  .space-label { font-weight:bold; font-size:10pt; margin-bottom:6pt; }
  .answer-box { border:.5pt solid #999; flex:1; }
  .answer-line { height:18pt; border-bottom:.6pt solid #555; margin-bottom:7pt; }
  figure { text-align:center; margin:0 auto 6pt; flex:none; line-height:0; }
  figure svg { max-width:100%; overflow:visible; }
  .large-grid { margin-bottom:2pt; }
  .continued h1 { margin-bottom:10pt; }
  .continued .identity { margin-bottom:6pt; }
  .continued .question { margin-top:10pt; margin-bottom:6pt; }
  footer { margin-top:10pt; padding-top:7pt; border-top:.5pt solid black; display:flex; justify-content:space-between; font-size:8pt; flex:none; }
  table { width:100%; border-collapse:collapse; margin:10pt 0 12pt; font-size:11pt; }
  th, td { border:.6pt solid #666; text-align:center; padding:7pt 4pt; }
  th { background:#eee; }
  .key { font-size:10.5pt; line-height:1.35; }
  .key main { display:block; }
  .key p { margin-bottom:10pt; }
  .key .key-equation { font-size:12pt; text-align:center; margin:6pt 0 10pt; break-inside:avoid; }
  .key .key-equation .katex { font-size:1.08em; }
  .scoring { font-size:9.5pt; padding-top:7pt; }
  .note { font-size:9pt; }
  @media screen { .sheet { outline:1px solid #ccc; } }
`;

function documentHtml(content, title) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><link rel="stylesheet" href="${katexCss}"><style>${css}</style></head><body>${content}</body></html>`
    .replace(/[ \t]+$/gm, '');
}

async function build() {
  const { chromium } = require('playwright');
  fs.mkdirSync(root, { recursive: true });
  const browser = await chromium.launch({
    ...(process.env.MCM_PDF_BROWSER_CHANNEL ? { channel: process.env.MCM_PDF_BROWSER_CHANNEL } : {}),
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1.5 });
    const problems = [];
    page.on('pageerror', e => problems.push(e.message));
    page.on('requestfailed', r => problems.push(`${r.url()}: ${r.failure().errorText}`));
    for (const [name, content, title] of [
      [studentName, quiz(), 'Kai - Mixed-Unit Refresher'],
      [keyName, key(), 'Kai - Mixed-Unit Refresher - Parent Key'],
    ]) {
      const htmlPath = path.join(root, `${name}.html`);
      fs.writeFileSync(htmlPath, documentHtml(content, title), 'utf8');
      await page.goto(pathToFileURL(htmlPath).href);
      await page.emulateMedia({ media: 'print' });
      await page.evaluate(() => document.fonts.ready);
      const checks = await page.evaluate(() => {
        const sheets = [...document.querySelectorAll('.sheet')];
        const failures = [];
        for (const sheet of sheets) {
          const bounds = sheet.getBoundingClientRect();
          const footer = sheet.querySelector('footer').getBoundingClientRect();
          const main = sheet.querySelector('main').getBoundingClientRect();
          for (const child of sheet.querySelector('main').children) {
            const r = child.getBoundingClientRect();
            if (r.bottom > footer.top - 4 || r.left < bounds.left + 40 || r.right > bounds.right - 40) {
              failures.push(`page ${sheet.dataset.page}: ${child.tagName}.${child.className} overflows`);
            }
          }
          if (main.bottom > footer.top) failures.push(`page ${sheet.dataset.page}: content overlaps footer`);
        }
        return {
          pages: sheets.length,
          mathCount: document.querySelectorAll('.katex').length,
          errors: document.querySelectorAll('.katex-error').length,
          fontsReady: document.fonts.check('16px KaTeX_Main'),
          failures,
        };
      });
      if (checks.failures.length || checks.errors || !checks.fontsReady || problems.length) {
        throw new Error(JSON.stringify({name, checks, problems}, null, 2));
      }
      if (name === studentName) {
        const spacing = await page.locator('#q5-function').evaluate(eq => {
          const plus = [...eq.querySelectorAll('.mbin')].find(el => el.textContent === '+');
          const radical = eq.querySelector('.sqrt');
          return radical.getBoundingClientRect().left - plus.getBoundingClientRect().right;
        });
        if (!(spacing >= 0 && spacing <= 20)) throw new Error(`Unexpected plus-to-radical gap: ${spacing}px`);
        console.log(`KaTeX plus-to-radical gap: ${spacing.toFixed(2)}px`);
      }
      await page.pdf({ path: path.join(root, `${name}.pdf`), printBackground: true, preferCSSPageSize: true });
      if (process.argv.includes('--screenshots')) {
        for (let i = 0; i < checks.pages; i++) {
          await page.locator('.sheet').nth(i).screenshot({path: path.join(root, `${name}_page_${i+1}.png`)});
        }
      }
      console.log(`${name}: ${checks.pages} pages, ${checks.mathCount} KaTeX expressions, loaded fonts, no overflow.`);
    }
  } finally {
    await browser.close();
  }
}

module.exports = { quiz, key, documentHtml, build };
if (require.main === module) {
  build().catch(error => { console.error(error); process.exitCode = 1; });
}

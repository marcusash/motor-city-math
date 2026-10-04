const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const katex = require(path.join(root,'shared','katex','katex.min.js'));
const mathCss = fs.readFileSync(path.join(root,'shared','katex','katex.min.css'),'utf8').replaceAll('url(fonts/','url(../shared/katex/fonts/');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root,'reviews','prep-test-2-proposal-data.js'),'utf8'),context);
const data = context.window.prepTest2Proposal;
const previous = fs.readFileSync(path.join(root,'tests','assessment-1-functions-75min.html'),'utf8');
const css = previous.match(/<style>([\s\S]*?)<\/style>/)[1].split('\n').map(line=>line.trimEnd()).join('\n');
const escape = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const formulas = [
  ['2<=w<=6','2\\le w\\le6'],
  ['0<=a<=30','0\\le a\\le30'],
  ['a>30','a>30'],
  ['A(w)=w(12-w)','A(w)=w(12-w)'],
  ['C(a)=8a','C(a)=8a'],
  ['C(a)=240+5(a-30)','C(a)=240+5(a-30)'],
  ['R(x)=(x^2-x-2)/(x^2+x-6)','R(x)=\\frac{x^2-x-2}{x^2+x-6}'],
  ['S(x)=(x+1)/(x+3)','S(x)=\\frac{x+1}{x+3}'],
  ['R(x)=1/2','R(x)=\\frac12'],
  ['g(x)=1-(3/5)x','g(x)=1-\\frac35x'],
  ['h(x)=-f(x-2)+1','h(x)=-f(x-2)+1'],
  ['r(x)=a sqrt(x-h)+k','r(x)=a\\sqrt{x-h}+k'],
  ['q(x)=a|x-h|+k','q(x)=a|x-h|+k'],
  ['P(x)>0','P(x)>0'],['P(x)<0','P(x)<0'],
  ['R(x)>0','R(x)>0'],['R(x)<0','R(x)<0'],
  ['R(x)=-(x+2)(x-1)^2(x-3)','R(x)=-(x+2)(x-1)^2(x-3)'],
  ['f(t)=sqrt(t)','f(t)=\\sqrt{t}'],
  ['g(x)=9-x^2','g(x)=9-x^2'],
  ['H(x)=f(g(x))/(g(x)-5)','H(x)=\\frac{f(g(x))}{g(x)-5}']
];
function text(value) {
  let result=escape(value);
  for (const [plain,latex] of formulas) result=result.replaceAll(escape(plain),katex.renderToString(latex,{throwOnError:true}));
  return result;
}
function grid(xRange,yRange,lines=[]) {
  const unit=24, pad=23, w=(xRange[1]-xRange[0])*unit+2*pad, h=(yRange[1]-yRange[0])*unit+2*pad;
  const px=x=>pad+(x-xRange[0])*unit, py=y=>pad+(yRange[1]-y)*unit;
  let items='';
  for(let x=xRange[0];x<=xRange[1];x++) {
    items+=`<line x1="${px(x)}" x2="${px(x)}" y1="${py(yRange[0])}" y2="${py(yRange[1])}" stroke="${x===0?'#111':'#ccd1d8'}" stroke-width="${x===0?1.6:0.6}"/>`;
    if(x%2===0) items+=`<text x="${px(x)}" y="${py(0)+13}" text-anchor="middle">${x}</text>`;
  }
  for(let y=yRange[0];y<=yRange[1];y++) {
    items+=`<line x1="${px(xRange[0])}" x2="${px(xRange[1])}" y1="${py(y)}" y2="${py(y)}" stroke="${y===0?'#111':'#ccd1d8'}" stroke-width="${y===0?1.6:0.6}"/>`;
    if(y!==0 && y%2===0) items+=`<text x="${px(0)-5}" y="${py(y)+3}" text-anchor="end">${y}</text>`;
  }
  for(const line of lines) {
    items+=`<polyline points="${line.vertices.map(([x,y])=>`${px(x)},${py(y)}`).join(' ')}" fill="none" stroke="#111" stroke-width="2"${line.dashed?' stroke-dasharray="6 4"':''}/>`;
    for(const [x,y] of line.vertices) items+=`<circle cx="${px(x)}" cy="${py(y)}" r="2.5"/>`;
  }
  items+=`<text x="${w-12}" y="${py(0)-5}">x</text><text x="${px(0)+7}" y="13">y</text>`;
  return `<svg class="print-grid" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lines.length?'Given graph':'Blank coordinate grid'}; x ${xRange.join(' to ')}, y ${yRange.join(' to ')}"><g font-family="Arial" font-size="9">${items}</g></svg>`;
}
const ranges={1:[[-6,6],[-6,6]],2:[[-8,8],[-8,8]],3:[[-8,8],[-8,8]],10:[[-12,12],[-12,12]]};
const studentTitles = Object.fromEntries(data.questions.map(q=>[q.id,`Problem ${q.id}`]));
function studentStem(q) {
  if (q.id===6) return [
    q.stem[0],
    '(a) Write an equation for P in factored form. Show your work.',
    '(b) Sketch P on the provided axes. Label its intercepts.',
    '(c) State where P(x)>0 and P(x)<0. Explain your answer.'
  ];
  return q.stem.map(part=>part
    .replace('Write the intermediate value for each before evaluating the outside function.','Show your work.')
    .replace('and clearly show the touch at one zero and flattened crossing at the other.','and show the graph\'s behavior at each zero.')
    .replace('Use signs between the zeros to keep the curve on the correct side of the axis. ','')
    .replace('Explain why its ends point the same way, unlike the odd-degree polynomial in Question 6.','Compare its end behavior with the polynomial in Question 6.')
    .replace('Find every real restriction before writing the domain in interval notation.','Find the domain in interval notation.')
  );
}
function workspace(q) {
  let prompt='';
  let dedicated='';
  if(q.graphs && q.graphs.length>0) {
    prompt+='<div class="given-row">';
    for(const graph of q.graphs) prompt+=`<figure class="given"><figcaption>Given graph${q.id===4?': f solid; g dashed':': f'}</figcaption>${grid(graph.x,graph.y,graph.lines)}</figure>`;
    prompt+='<div class="mapping-work"><strong>Work space</strong><div class="work-lines tall"></div></div></div>';
  }
  if(ranges[q.id]) {
    const [x,y]=ranges[q.id];
    dedicated=`<div class="graph-work"><h3>Question ${q.id}: your graph</h3><p>One unit per square.</p>${grid(x,y)}</div>`;
  } else if(q.polynomialDegree) {
    dedicated=`<div class="polynomial-work"><h3>Question ${q.id}: your qualitative sketch</h3><div class="sketch-space"><svg viewBox="0 0 600 600" role="img" aria-label="Large centered axes for qualitative sketch"><line x1="20" x2="580" y1="300" y2="300" stroke="#111" stroke-width="1.5"/><line x1="300" x2="300" y1="20" y2="580" stroke="#111" stroke-width="1.5"/><text x="585" y="290">x</text><text x="310" y="20">y</text></svg></div></div>`;
  }
  const workSpace=`<strong>Answers and work</strong><div class="work-lines ${[5,7,9].includes(q.id)?'xtall':'medium'}"></div>`;
  if(dedicated) dedicated+=workSpace;
  else prompt+=workSpace;
  return {prompt,dedicated};
}
const extra=`
.test-page { margin-bottom:20px; }
.given-row { display:flex; align-items:start; gap:18px; margin:10px 0; }
.given { margin:0; width:40%; }
.mapping-work { flex:1; }
.print-grid { width:100%; display:block; background:white; }
.graph-work { width:100%; margin:10px 0; }
.polynomial-work svg { width:100%; height:100%; }
.sketch-space { height:270px; border:1px solid #777; padding:8px; margin:12px 0; }
.question-text p { margin:7px 0; }
.work-lines { background-image:none; display:flex; flex-direction:column; justify-content:space-evenly; }
.work-lines hr { width:100%; margin:0; border:0; border-top:1px solid #b7bdc7; }
.key-block { break-inside:avoid; }
button { padding:8px 16px; cursor:pointer; }
@media print {
 .test-page { break-before:page; margin:0; border:0; padding:0; }
 .question { break-inside:auto; }
 .question-text { font-size:10pt; }
 .given { width:2.2in; }
 .graph-work,.polynomial-work { break-before:page; width:5.8in; }
 .graph-work .print-grid { width:5.8in; height:5.8in; }
 .sketch-space { width:5.8in; height:5.8in; padding:0; }
 .work-lines.medium { height:0.65in; }
 .work-lines.xtall { height:3.8in; }
 .work-lines.tall { height:1.2in; }
 .footer { margin:8px 0 0; }
}
`;
const studentExtra=`
.dedicated-work { margin:10px auto; }
.work-lines { background:none; border:0; display:block; }
@media print {
 .test-page { break-before:auto; page-break-before:auto; margin:0; border:0; padding:0; }
 .test-page[data-question="2"],
 .test-page[data-question="3"],
 .test-page[data-question="4"],
 .test-page[data-question="6"],
 .test-page[data-question="7"],
 .test-page[data-question="9"],
 .test-page[data-question="10"] { break-before:page; page-break-before:always; }
 .test-page[data-question="4"],
 .test-page[data-question="5"],
 .test-page[data-question="7"],
 .test-page[data-question="9"] { break-inside:avoid; page-break-inside:avoid; }
 .dedicated-work { break-before:page; page-break-before:always; }
 .graph-work,.polynomial-work { break-before:auto; page-break-before:auto; width:6.8in; }
 .graph-work .print-grid { width:6.8in; height:6.8in; }
 .sketch-space { width:6.8in; height:6.8in; padding:0; }
}
`;
function head(title, styles=extra) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="duration-minutes" content="75"><meta name="total-points" content="100"><title>${title}</title><style>${mathCss}</style><style>${css}${styles}</style></head><body><main>`;
}
const render='';
let student=head('Pre-Calculus: Prep Test 2',`${extra}${studentExtra}`);
student+=`<header class="exam-header"><div class="eyebrow">Motor City Math | Pre-Calculus</div><div class="screen-only"><a href="../index.html" class="back-link">&larr; Back to Dashboard</a></div><h1>Prep Test 2: Functions and Polynomial Graphs</h1><p class="subtitle">75 minutes | 100 points | ${data.questions.length} questions</p><div class="student-fields"><span>Name: <span class="field-line" style="width:65%"></span></span><span>Date: <span class="field-line"></span></span></div><p class="screen-only"><button onclick="window.print()">Print student test</button></p></header><aside class="directions"><strong>Directions</strong><ul><li>Show your work.</li><li>Use interval notation where requested.</li><li>Questions 6 and 8 require qualitative polynomial sketches. Exact extrema and a uniform vertical scale are not required.</li><li>Suggested question times total 70 minutes, with a final 5 minutes for review.</li></ul><p>Use the space provided; additional work may go on the back.</p></aside><section class="exam-section"><h2>Suggested timing</h2><table class="value-table"><thead><tr><th>Question</th><th>Points</th><th>Minutes</th></tr></thead><tbody>${data.questions.map(q=>`<tr><td>${q.id}. ${escape(studentTitles[q.id])}</td><td>${q.points}</td><td>${q.minutes}</td></tr>`).join('')}</tbody></table><p>Final review: 5 minutes. Total: 75 minutes.</p></section>`;
for(const q of data.questions) {
  const spaces=workspace(q);
  student+=`<section class="exam-section test-page" data-question="${q.id}" data-points="${q.points}" data-minutes="${q.minutes}"><div class="section-heading"><h2>Question ${q.id}</h2><span class="section-meta">${q.minutes} minutes | ${q.points} points</span></div><article class="question" id="q${q.id}"><div class="question-header"><span class="question-number">${q.id}</span><span class="question-title">${escape(studentTitles[q.id])}</span><span class="points">${q.points} points</span></div><div class="question-body question-text">${studentStem(q).map(part=>`<p>${text(part)}</p>`).join('')}${spaces.prompt}</div></article>${spaces.dedicated?`<div class="dedicated-work">${spaces.dedicated}</div>`:''}<p class="footer">Prep Test 2 | Question ${q.id} of ${data.questions.length}</p></section>`;
}
student=student
  .replace(/<li>Suggested question times total 70 minutes, with a final 5 minutes for review\.<\/li>/,'')
  .replace(/<section class="exam-section"><h2>Suggested timing<\/h2>[\s\S]*?<\/section>/,'')
  .replace(/<span class="section-meta">\d+ minutes \| /g,'<span class="section-meta">');
student+='</main>'+render+'</body></html>';
let key=head('Parent Key: Pre-Calculus Prep Test 2');
key+='<header class="exam-header"><div class="eyebrow">Motor City Math | Parent Copy</div><h1>Prep Test 2: Answer Key and Rubric</h1><p>75 minutes | 100 points | Keep separate from the student test.</p><p>Give follow-through credit: deduct an originating error once, not again for consistent later execution. Score missing parts separately. Do not require unrequested explanations or exact polynomial extrema.</p></header>';
for(const q of data.questions) key+=`<section class="exam-section key-block"><h2>${q.id}. ${escape(q.title)} (${q.points} points)</h2><ol>${q.steps.map(step=>`<li>${text(step)}</li>`).join('')}</ol><p><strong>Scoring</strong></p><ul>${q.rubric.map(part=>`<li>${part.points} points: ${text(part.text)}</li>`).join('')}</ul></section>`;
key+='</main>'+render+'</body></html>';
fs.writeFileSync(path.join(root,'tests','assessment-2-functions-75min.html'),student);
fs.writeFileSync(path.join(root,'tests','assessment-2-functions-75min-KEY.html'),key);
console.log('Built Prep Test 2 student HTML and separate parent key.');

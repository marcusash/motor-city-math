const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../reviews/functions-parallel-practice-data.cjs');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'reviews', 'functions-practice-proposal.html'), 'utf8');
const builder = fs.readFileSync(path.join(root, 'scripts', 'build-functions-practice-proposal.cjs'), 'utf8');
const [full, skills] = data.exams;
assert.equal(full.questions.length, 12);
assert.equal(skills.questions.length, 4);
for (const exam of data.exams) {
  assert.equal(exam.questions.reduce((sum, q) => sum + q.points, 0), exam.points);
  const workingMinutes = exam.questions.reduce((sum, q) => sum + q.minutes, 0);
  assert.equal(workingMinutes, exam.minutes === 75 ? 70 : 25);
  exam.questions.forEach((q, i) => {
    assert.equal(q.id, i + 1);
    assert.ok([1, 2, 3].includes(q.difficulty));
    assert.equal(q.rubric.reduce((sum, [points]) => sum + points, 0), q.points);
    assert.ok(q.steps.length >= 2 && q.source && q.prompt.length);
    assert.ok(!q.prompt.some(p => /teacher|scored|struggled|reciprocal hint/i.test(p)));
  });
}
const fullSource = full.questions.map(q => q.source);
assert.match(fullSource[7], /Q8.*kayak.*page 4/);
assert.match(fullSource[8], /Q8.*graph properties.*page 5/);
assert.match(fullSource[11], /Q11/);
assert.deepEqual(skills.questions.map(q => q.source),
  ['Teacher Q7', 'Teacher Q8, kayak, page 4', 'Teacher Q9, composition decomposition', 'Teacher Q11(a-c)']);
assert.match(data.grading, /originating error once/);
assert.match(skills.rationale, /faint attempts/);
assert.match(skills.rationale, /ambiguous multiple-choice/);
assert.equal((html.match(/<article /g) || []).length, 16);
assert.equal((html.match(/<svg class="grid"/g) || []).length, 5);
assert.equal((html.match(/<table>/g) || []).length, 3);
assert.match(html, /Draft questions only/);
assert.match(html, /No student tests/);
assert.match(html, /only after Marcus approves/);
assert.doesNotMatch(html, /<ol>|<h3>Scoring|Suggested timing|Worked answer/);
assert.doesNotMatch(html, /\\\(|\\\)/);
assert.match(html, /\.katex \.katex-mathml\{/);
assert.match(html, /url\(data:font\/woff2;base64,/);
assert.match(html, /url\(\.\.\/shared\/katex\/fonts\//);
assert.equal((builder.match(/fs\.writeFileSync/g) || []).length, 1);
assert.match(builder, /'reviews', 'functions-practice-proposal\.html'/);
assert.doesNotMatch(builder, /printToPDF|print-to-pdf|writeFileSync\(path\.join\(root,\s*'tests'/);
for (const exam of data.exams) for (const suffix of ['.html', '-KEY.html', '.pdf', '-KEY.pdf']) {
  assert.equal(fs.existsSync(path.join(root, 'tests', exam.slug + suffix)), false,
    'Approval gate: final test artifacts must not exist yet');
}
// Independent calculations check every problem family and the stored worked answers.
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const q = id => full.questions.find(item => item.id === id);
const sq = id => skills.questions.find(item => item.id === id);
const line = x => 1.5 * x - 2;
near(line(0), -2); near(line(4 / 3), 0); near(line(2), 1);
const radical = x => -Math.sqrt(x + 2) + 3;
near(radical(-2), 3); near(radical(-1), 2); near(radical(2), 1); near(radical(7), 0);
assert.ok(q(1).steps.some(s => s.includes('3-\\sqrt2')));
for (let x = -5; x <= 5; x += 0.25) {
  near(-0.5 * (x + 3) * (x - 2), -0.5 * x * x - 0.5 * x + 3);
  near(-x * (x - 3) * (x + 2), -(x ** 3) + x * x + 6 * x);
}
assert.ok(q(2).steps.some(s => s.includes('-\\frac12x^2-\\frac12x+3')));
const cubic = x => -(x ** 3) + 3 * x * x;
near(cubic(0), 0); near(cubic(2), 4);
for (const [a, b, direction] of [[-3, -1, -1], [0.25, 1.75, 1], [3, 5, -1]]) {
  assert.equal(Math.sign(cubic(b) - cubic(a)), direction);
}
assert.ok(q(3).steps.some(s => s.includes('(0,2)') && s.includes('(2,\\infty)')));
const poly = x => -((x + 1) ** 2) * (x - 2);
near(poly(-1), 0); near(poly(2), 0); near(poly(0), 2);
assert.ok(poly(-1.1) > 0 && poly(-0.9) > 0);
assert.ok(poly(1.9) > 0 && poly(2.1) < 0);
const f = x => Math.sqrt(8 - 2 * x), g = x => x + 1;
for (const x of [-3, -1, 0, 4, 5]) {
  assert.equal(8 - 2 * x >= 0 && g(x) !== 0, x <= 4 && x !== -1);
  if (x <= 4) near(g(f(x)), Math.sqrt(8 - 2 * x) + 1);
}
near(f(3 - 2), Math.sqrt(8 - 2 * 3 + 2 * 2));
const piecewise = x => x < -1 ? x * x - 3 : -2 * x + 1;
assert.deepEqual([-2, -1, 2].map(piecewise), [1, 3, -3]);
assert.ok(q(7).steps.some(s => s.includes('h(-1)=3')));
const cost = t => t > 0 && t <= 5 ? (t <= 1.5 ? 14 : 14 + 8 * (t - 1.5)) : undefined;
assert.deepEqual([1.5, 3.25, 5].map(cost), [14, 28, 42]);
assert.equal(cost(0), undefined); assert.equal(cost(5.01), undefined);
near(14 + 8 * (1.5 - 1.5), cost(1.5));
assert.ok(q(8).steps.some(s => s.includes('C(3.25)') && s.includes('28')));
const properties = x => (x * x - 4) ** 2 / 4 - 2;
near(properties(0), 2); near(properties(2), -2);
assert.ok(properties(1.99) > -2 && properties(2.01) > -2);
for (let i = 0; i < 40; i++) {
  const x = -6 + i / 10;
  assert.ok(properties(x + 0.01) < properties(x));
}
for (const x of [-2, 0, 2]) near((2 - 3 * x) ** 5, Math.pow(2 - 3 * x, 5));
assert.ok(q(10).steps.some(s => s.includes('g(x)=2-3x') && s.includes('f(x)=x^5')));
const behavior = x => x <= 0 ? -2 - 1.6 * x : x <= 4 ? -2 + 1.25 * x : 3 + (5 / 3) * (x - 4);
near(behavior(-5), 6); near(behavior(0), -2); near(behavior(4), 3); near(behavior(7), 8);
assert.ok(behavior(-0.01) > behavior(0) && behavior(0.01) > behavior(0));
assert.ok(behavior(20) > 8, 'Range option not guaranteed outside given intervals');
assert.match(q(11).steps[0], /Answer D/);
const graphG = x => x < 0 ? 1 : x <= 3 ? (x - 2) ** 2 : x - 2;
const valueF = new Map(full.questions.at(-1).table.rows[0].slice(1)
  .map((x, i) => [Number(x), Number(full.questions.at(-1).table.rows[1][i + 1])]));
near(valueF.get(graphG(-2)), -3);
near(graphG(5) - (3 * 5 + 2), -14);
near(3 * (-2 / 3) + 2, 0);
const skillsPiece = x => x < 1 ? x * x - 1 : -x + 4;
assert.deepEqual([0, 1, 3].map(skillsPiece), [-1, 3, 1]);
const bikeCost = t => t > 0 && t <= 6 ? (t <= 2 ? 18 : 18 + 5 * (t - 2)) : undefined;
assert.deepEqual([0.75, 3.5, 6].map(bikeCost), [18, 25.5, 38]);
assert.equal(bikeCost(7), undefined);
for (const x of [-1, 0, 2]) near(Math.pow(5 - 2 * x, 3), (5 - 2 * x) ** 3);
for (const x of [-1, 0, 2.5]) assert.ok(Number.isFinite(Math.sqrt(5 - 2 * x)));
assert.ok(Number.isNaN(Math.sqrt(5 - 2 * 3)));
assert.ok(sq(3).steps[1].includes('f(x)=\\sqrt{x}'));
const skillsG = x => x < 0 ? 2 : x <= 3 ? (x - 2) ** 2 - 1 : x - 3;
const skillsF = new Map(sq(4).table.rows[0].slice(1)
  .map((x, i) => [Number(x), Number(sq(4).table.rows[1][i + 1])]));
near(skillsF.get(skillsG(-1)), -4);
near(skillsG(5) - (2 * 5 - 1), -7);
near(2 * 0.5 - 1, 0);
console.log('PASS: 16 proposed problems, score/time totals, original-task mapping, independent answer checks, rendered math, and no final-test artifacts.');

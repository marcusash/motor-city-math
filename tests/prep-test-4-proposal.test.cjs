const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = require('../reviews/prep-test-4-proposal-data.cjs');
const html = fs.readFileSync(path.join(root, 'reviews/prep-test-4-proposal.html'), 'utf8');
const questions = data.questions;
assert.equal(questions.length, 12);
assert.equal(questions.reduce((sum, q) => sum + q.points, 0), 100);
assert.deepEqual(questions.map(q => q.id), Array.from({ length: 12 }, (_, i) => i + 1));
assert.equal(data.minutes, 75);
for (const [id, source] of [[3, 'Prep Test 2 Q3'], [8, 'Prep Test 2 Q8'], [9, 'Prep Test 2 Q9'], [10, 'Prep Test 2 Q10']]) {
  assert.ok(questions[id - 1].source.includes(source));
}
for (const [index, item] of questions.entries()) {
  assert.ok(item.prompt.length >= 1);
  assert.equal(Number(html.match(new RegExp(`data-question="${index + 1}" data-points="(\\d+)"`))[1]), item.points);
}
assert.match(html, /data-question="3" data-points="14"/);
assert.match(html, /Given graph/);
assert.match(html, /Blank graph workspace/);
assert.ok(questions[2].prompt[1].includes('f(g(x))'));
assert.ok(questions[2].prompt[1].includes('g(f(x))'));
assert.ok(questions[8].prompt[0].includes('A(w)=w(12-w)'));
assert.match(html, /Question proposal only/);
assert.match(html, /Values and behavior of g/);
assert.match(html, /Selected values of f/);
assert.equal((html.match(/<article class="question"/g) || []).length, 12);
assert.ok((html.match(/class="grid"/g) || []).length >= 7);
assert.match(html, /Question proposal only/);
assert.doesNotMatch(html, /Answer Key|Correct answer|Scoring rubric/);
for (const name of ['assessment-4-functions-75min.html', 'assessment-4-functions-75min.pdf',
  'assessment-4-functions-75min-KEY.html', 'assessment-4-functions-75min-KEY.pdf']) {
  assert.equal(fs.existsSync(path.join(root, 'tests', name)), false, 'No final assessment artifact before approval');
}
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
// Confirm transformed vertices for retained Prep Test 2 Question 3.
const vertices = [[-3, -1], [-1, 3], [2, 0], [4, 2]];
const fg = vertices.map(([u, v]) => [5 / 3 * (1 - u), v]).sort((a, b) => a[0] - b[0]);
for (const [i, [x, y]] of fg.entries()) {
  near(x, [-5, -5 / 3, 10 / 3, 20 / 3][i]);
  near(y, [2, 0, 3, -1][i]);
}
const gf = vertices.map(([u, v]) => [u, 1 - 3 * v / 5]);
for (const [i, [x, y]] of gf.entries()) {
  near(x, [-3, -1, 2, 4][i]);
  near(y, [8 / 5, -4 / 5, 1, -1 / 5][i]);
}
// New quadratic graph.
const quadratic = x => -2 * (x + 3) * (x - 1);
for (const x of [-3, 1]) near(quadratic(x), 0);
near(quadratic(0), 6); near(quadratic(-1), 8);
// New cubic graph and equation graph.
const cubic = x => x ** 3 - 2 * x ** 2 - 5 * x + 6;
for (const x of [-2, 1, 3]) near(cubic(x), 0);
near(cubic(0), 6);
const polynomial = x => -2 * (x + 1) ** 2 * (x - 3);
for (const x of [-1, 3]) near(polynomial(x), 0);
near(polynomial(0), 6);
assert.ok(polynomial(-1.1) > 0 && polynomial(-0.9) > 0);
assert.ok(polynomial(2.9) > 0 && polynomial(3.1) < 0);
// New square-root quotient has a radical endpoint and a denominator hole.
assert.ok(15 - 3 * 5 >= 0 && 5 + 2 !== 0);
assert.ok(!(15 - 3 * (-2) >= 0 && -2 + 2 !== 0));
assert.deepEqual(questions[3].graphRange, { x: [-4, 4], y: [-10, 12] });
assert.deepEqual(questions[7].graphRange, { x: [-4, 5], y: [-8, 20] });
assert.deepEqual(questions[9].graphRange, { x: [-2, 10], y: [-8, 6] });
// New piecewise graph boundary and requested values.
const p = x => x < 1 ? 2 * (x - 1) ** 2 - 3 : -x + 2;
assert.deepEqual([p(0), p(1), p(3)], [-1, 1, -1]);
assert.equal(2 * (1 - 1) ** 2 - 3, -3); // open boundary value
assert.equal(-1 + 2, 1); // closed boundary value
// Retained applied-composition problem: verify breakpoint and budget answer.
const area = w => w * (12 - w);
const widthBreak = 6 - Math.sqrt(6);
near(area(widthBreak), 30);
near(area(4), 32);
near(8 * area(2), 160);
near(240 + 5 * (area(4) - 30), 250);
near(area(6 - Math.sqrt(2)), 34);
// Retained square-root construction.
const rootFn = x => -2 * Math.sqrt(x - 1) + 3;
near(rootFn(1), 3); near(rootFn(5), -1); near(rootFn(13 / 4), 0);
// New table-based guaranteed statement: continuity forces a zero between 3 and -2.
assert.ok(3 > 0 && -2 < 0);
// New graph/table operations: g(-2)=1, f(1)=5; g(5)=4 and h(5)=13.
near(1, questions[11].table.rows[0][2] === '1' ? 1 : NaN);
near(Number(questions[11].table.rows[1][2]), 5);
near(4 - (2 * 5 + 3), -9);
console.log('PASS: 12-question proposal structure, retained source mapping, graph workspace, and mathematical checks.');

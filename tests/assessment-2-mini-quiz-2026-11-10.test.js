const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const filename = 'assessment-2-mini-quiz-2026-11-10';
const source = fs.readFileSync(path.join(root, 'reviews', filename + '-data.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'reviews', filename + '.html'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const data = context.window.assessment2MiniQuizPracticeGrade;
const questions = Array.from(data.questions);
const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
const plain = value => JSON.parse(JSON.stringify(value));

assert.equal(data.status, 'practice-scored');
assert.equal(data.assessedOn, null);
assert.equal(data.scannedOn, null);
assert.equal(data.elapsedMinutes, null);
assert.equal(data.reviewedOn, '2026-11-10');
assert.equal(data.source.version, '2.0.3');
assert.equal(data.source.generatedOn, '2026-11-09');
assert.equal(data.source.submittedPages, 6);
assert.equal(data.source.submittedFiles, 3);
assert.match(data.source.bundleSha256, /^[a-f0-9]{64}$/);
assert.equal(data.source.bundleSha256, '7754a2d676813c2f69bc0277b4a23276d33613b5a17eaeba2c91f92544841dd2');
for (const key of ['release', 'key', 'bundle', 'issue']) {
  assert.ok(data.source[key].startsWith('https://github.com/marcusash/motor-city-math/'));
}
assert.deepEqual(questions.map(q => [q.id, q.earned, q.points]), [
  ['1', 10, 20], ['2', 14, 20], ['3', 13, 20], ['4', 15.5, 20], ['5', 13, 20]
]);
assert.deepEqual(plain(data.questions.flatMap(q => q.pages)), [1, 2, 3, 4, 5, 6]);
// Exact original component weights, in the order printed in the v2.0.3 key.
assert.deepEqual(questions.map(q => plain(q.components.map(c => c.points))), [
  [12, 3, 3, 2], [2, 2, 2, 2, 4, 2, 3, 3],
  [3, 3, 6, 2, 2, 4], [4, 2, 2, 2, 2, 2, 4, 2], [6, 3, 3, 2, 2, 2, 2]
]);
for (const question of questions) {
  assert.equal(sum(question.components, 'points'), question.points);
  assert.equal(sum(question.components, 'earned'), question.earned);
  assert.ok(question.answer.length > 100 && question.solution.length >= 2 && question.coaching.length > 50);
  for (const component of question.components) {
    assert.ok(Number.isFinite(component.earned) && component.earned >= 0 && component.earned <= component.points);
    assert.ok(component.reason.trim().length > 10);
  }
}
assert.equal(sum(questions, 'earned'), 65.5);
assert.equal(sum(questions, 'points'), 100);
const sectionIds = plain(data.sections.flatMap(section => section.questionIds));
assert.deepEqual(sectionIds.slice().sort(), ['1', '2', '3', '4', '5']);
assert.equal(new Set(sectionIds).size, 5);
assert.deepEqual(Array.from(data.sections, section => {
  const rows = questions.filter(q => section.questionIds.includes(q.id));
  return [sum(rows, 'earned'), sum(rows, 'points')];
}), [[23, 40], [14, 20], [13, 20], [15.5, 20]]);
assert.match(data.notes.join(' '), /not teacher-awarded marks/);
assert.match(data.notes.join(' '), /partial-credit schedule/);
assert.match(data.notes.join(' '), /missing-page concern is resolved/);
assert.match(data.notes.join(' '), /not an observed duration/);
assert.match(data.notes.join(' '), /not.*measured learning gain/);
assert.match(questions[2].components[2].reason, /full construction credit/);
assert.equal(questions[4].components[1].earned + questions[4].components[2].earned, 6);
assert.doesNotMatch(html + source, /<img|<iframe|<embed|data:image|attachments\\|private-submission|TO_BE_REPLACED/);
assert.match(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), new RegExp(filename + '\\.html'));

const nodes = {};
const handlers = {};
function node(text = '') {
  return {
    textContent: text, children: [], attributes: {},
    append(...items) { this.children.push(...items); },
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(name, callback) { this.attributes[name] = callback; }
  };
}
context.document = {
  createElement: tag => Object.assign(node(), { tag }),
  createTextNode: text => node(text),
  getElementById: id => nodes[id] || (nodes[id] = node()),
  querySelectorAll: () => []
};
context.window.addEventListener = (name, callback) => {
  handlers[name] = callback;
  if (name === 'DOMContentLoaded') callback();
};
context.renderMathInElement = (target, options) => {
  assert.equal(target, nodes.report);
  assert.equal(options.throwOnError, true);
  assert.equal(options.trust, false);
};
const renderer = Array.from(html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))
  .map(match => match[1]).filter(script => script.trim()).join('\n');
vm.runInNewContext(renderer, context);
const descend = item => [item, ...item.children.flatMap(descend)];
assert.equal(nodes.score.children[0].textContent, '65.5');
assert.equal(nodes.score.children[1].textContent, '/100 (65.5%)');
assert.equal(nodes.questionSummary.children.length, 5);
assert.equal(nodes.sectionsSummary.children.length, 4);
assert.equal(nodes.questions.children.length, 5);
assert.equal(descend(nodes.questions).filter(item => item.tag === 'details' && item.open).length, 5);
assert.equal(descend(nodes.questions).filter(item => item.tag === 'tbody').reduce((n, item) => n + item.children.length, 0), 33);
assert.ok(handlers.beforeprint && handlers.afterprint);
const missing = { ...context, window: { addEventListener: (_, callback) => callback() } };
assert.throws(() => vm.runInNewContext(renderer, missing), /Practice report data missing/);
assert.equal(nodes.score.textContent, 'Report data unavailable');
const original = data.questions[0].earned;
data.questions[0].earned = original + 1;
assert.throws(() => vm.runInNewContext(renderer, context), /subtotal mismatch/);
data.questions[0].earned = original;

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const a = x => (-2 * x * x + 7 * x + 1) / (x - 4);
const p = x => (3 * x * x - 12) / (2 * x * x - 2 * x);
const g = x => -3 * (x + 2) * (x - 4) / (2 * (x - 1) * (x - 4));
const r = x => (x * x + x - 6) / (x * x - 4);
const u = x => -2 * x * x / (x * x - 16);
const v = x => -2 * x * x * x / (x * x - 16);
for (const x of [-10, -5, -3, 0.5, 2.5, 5, 10]) {
  close(a(x), -2 * x - 1 - 3 / (x - 4));
  close(p(x), 3 * (x - 2) * (x + 2) / (2 * x * (x - 1)));
  close(g(x), -3 * (x + 2) / (2 * (x - 1)));
  close(r(x), 1 + 1 / (x + 2));
  close(v(x), -2 * x - 32 * x / (x * x - 16));
  close(u(x), u(-x));
  close(v(x), -v(-x));
}
close(-3 * (4 + 2) / (2 * (4 - 1)), -3);
close(r(0), 1.5);
close((2 + 3) / (2 + 2), 1.25);
close(r(-3), 0);
assert.ok(r(0) > r(1) && r(3) > r(4) && r(4) > 1);
for (const x of [-5, -3]) assert.ok(2 / (x + 2) ** 3 < 0);
for (const x of [-1, 0, 1, 3, 5]) assert.ok(2 / (x + 2) ** 3 > 0);
assert.ok(u(-0.1) > 0 && u(0.1) > 0 && v(-0.1) < 0 && v(0.1) > 0);
for (const fn of [a, v]) assert.ok(fn(-1e6) > 0 && fn(1e6) < 0);
for (const [x, rounded] of [[0.9, -0.9048], [0.99, -0.9900], [1.01, -1.0101], [1.1, -1.1053],
  [2.9, -39], [2.99, -399], [2.999, -3999], [3.001, 4001], [3.01, 401], [3.1, 41]]) {
  assert.ok(Math.abs((x + 1) / (x - 3) - rounded) <= 0.00005);
}
console.log('assessment-2-mini-quiz: PASS (5 questions, 33 original rubric components, 65.5/100, provenance, renderer, failure states and reference math)');

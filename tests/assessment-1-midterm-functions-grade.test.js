const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'reviews', 'assessment-1-midterm-functions-grade.html'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', 'assessment-1-midterm-functions-grade-data.js'), 'utf8'), context);
const data = context.window.assessment1TeacherGrade;
const rows = data.sections.flatMap(section => Array.from(section.questions));
const expected = [
  ['1 linear', 3.75, 4], ['1 radical', 3, 4], ['2', 3, 4], ['3', 9.75, 10],
  ['4', 3.75, 4], ['5', 3.5, 4], ['7', 3, 4], ['9', 3.5, 4],
  ['6(a)', 3.5, 4], ['6(b)', 4, 4], ['6(c)', 4, 4], ['8', 0, 4],
  ['10 composition', 0, 4], ['11(a-c)', 1, 3], ['10 multiple choice', 4, 4]
];
assert.deepEqual(Array.from(rows, q => [q.id, q.earned, q.points]), expected);
assert.equal(rows.reduce((sum, q) => sum + q.earned, 0), 49.75);
assert.equal(rows.reduce((sum, q) => sum + q.points, 0), 65);
assert.deepEqual(Array.from(data.sections, s => [
  s.questions.reduce((sum, q) => sum + q.earned, 0),
  s.questions.reduce((sum, q) => sum + q.points, 0)
]), [[33.25, 38], [12.5, 23], [4, 4]]);
assert.equal(data.scannedOn, null);
assert.match(html, /not an overall score written by the teacher/);
assert.match(html, /No matching answer key was provided/);
assert.match(html, /Assessment date and elapsed time not shown/);
assert.match(html, /class="back-link".*Back to Dashboard/);
assert.match(html, /\.back-link \{ display:none; \}/);
assert.doesNotMatch(html, /<img|<iframe|<embed|kai-midtri-test\.pdf|href="[^"]*\.pdf"/);
assert.equal((dashboard.match(/href="reviews\/assessment-1-midterm-functions-grade.html"/g) || []).length, 1);
assert.match(dashboard, /src="reviews\/assessment-1-midterm-functions-grade-data.js"/);
const nodes = {};
function node(text = '') {
  return { textContent: text, children: [], append(...items) { this.children.push(...items); } };
}
context.document = {
  createElement: () => node(),
  createTextNode: text => node(text),
  getElementById: id => nodes[id] || (nodes[id] = node())
};
context.window.addEventListener = (_, callback) => callback();
for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) vm.runInNewContext(match[1], context);
}
assert.equal(nodes.score.children[0].textContent, '49.75');
assert.equal(nodes.score.children[1].textContent, '/65 (76.5%)');
assert.equal(nodes.sections.children.length, 3);
assert.equal(nodes.sectionsSummary.children.length, 3);
const text = n => n.textContent + n.children.map(text).join(' ');
assert.equal((text(nodes.sections).match(/Teacher annotation:/g) || []).length, 15);
assert.match(text(nodes.sections), /Zero awarded/);
assert.doesNotMatch(text(nodes.sections), /Not shown/);
assert.match(text(nodes.sections), /reading is uncertain/);
console.log('teacher-scored-functions: PASS (all 15 teacher marks, totals, source caveats, rendered report and dashboard link)');

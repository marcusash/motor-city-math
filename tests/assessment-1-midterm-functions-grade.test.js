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
  ['4', 3.75, 4], ['5', 3.5, 4], ['7', 3, 4], ['8 graph (page 5)', 3.5, 4],
  ['6(a)', 3.5, 4], ['6(b)', 4, 4], ['6(c)', 4, 4], ['8 kayak (page 4)', 0, 4],
  ['9 composition', 0, 4], ['11(a-c)', 1, 3], ['10 multiple choice', null, null]
];
assert.deepEqual(Array.from(rows, q => [q.id, q.earned, q.points]), expected);
assert.equal(rows.reduce((sum, q) => sum + q.earned, 0), 45.75);
assert.equal(rows.reduce((sum, q) => sum + q.points, 0), 61);
assert.deepEqual(Array.from(data.sections, s => [
  s.questions.reduce((sum, q) => sum + q.earned, 0),
  s.questions.reduce((sum, q) => sum + q.points, 0)
]), [[33.25, 38], [12.5, 23], [0, 0]]);
assert.equal(data.scannedOn, null);
assert.match(html, /not an overall score written by the teacher/);
assert.match(html, /No matching answer key was provided/);
assert.match(html, /Overall score unconfirmed/);
assert.match(rows.find(q => q.id === '11(a-c)').answer, /not blank/);
assert.equal(rows.filter(q => q.earned === null).length, 1);
assert.match(html, /Assessment date and elapsed time not shown/);
assert.match(html, /class="back-link".*Back to Dashboard/);
assert.match(html, /\.back-link \{ display:none; \}/);
assert.doesNotMatch(html, /<iframe|<embed|kai-midtri-test\.pdf|href="[^"]*\.pdf"/);
const mapping = [
  ['1 linear', 'q1-graphs.png', 1], ['1 radical', 'q1-graphs.png', 1],
  ['2', 'q2-quadratic.png', 1], ['3', 'q3-graph-analysis.png', 2], ['4', 'q4-cubic.png', 2],
  ['5', 'q5-polynomial.png', 3], ['7', 'q7-piecewise.png', 4], ['8 graph (page 5)', 'q8-graph-page5.png', 5],
  ['6(a)', 'q6-operations.png', 3], ['6(b)', 'q6-operations.png', 3], ['6(c)', 'q6-operations.png', 3],
  ['8 kayak (page 4)', 'q8-kayak-page4.png', 4], ['9 composition', 'q9-composition.png', 5],
  ['11(a-c)', 'q11-operations.png', 6], ['10 multiple choice', 'q10-table.png', 6]
];
assert.deepEqual(Array.from(rows, q => [q.id, data.evidence[q.id].file, data.evidence[q.id].page]), mapping);
for (const item of Object.values(data.evidence)) {
  const image = fs.readFileSync(path.join(root, 'reviews', 'assets', 'assessment-1-midterm-functions', item.file));
  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.ok(image.readUInt32BE(16) >= 1400, 'Keep readable full-resolution source crops');
  assert.ok(item.label.length > 30);
}
assert.match(html, /\.source-image \{[^}]*max-width:100%; height:auto/);
assert.equal((dashboard.match(/href="reviews\/assessment-1-midterm-functions-grade.html"/g) || []).length, 1);
assert.match(dashboard, /src="reviews\/assessment-1-midterm-functions-grade-data.js"/);
const nodes = {};
function node(text = '') {
  return { textContent: text, children: [], append(...items) { this.children.push(...items); } };
}
context.document = {
  createElement: tag => Object.assign(node(), { tag }),
  createTextNode: text => node(text),
  getElementById: id => nodes[id] || (nodes[id] = node())
};
context.window.addEventListener = (_, callback) => callback();
for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) vm.runInNewContext(match[1], context);
}
assert.equal(nodes.score.children[0].textContent, '45.75');
assert.equal(nodes.score.children[1].textContent, '/61 (subtotal; one mark excluded)');
assert.equal(nodes.sections.children.length, 3);
assert.equal(nodes.sectionsSummary.children.length, 3);
const text = n => n.textContent + n.children.map(text).join(' ');
assert.equal((text(nodes.sections).match(/Teacher annotation:/g) || []).length, 14);
assert.match(text(nodes.sections), /Unconfirmed mark/);
assert.doesNotMatch(text(nodes.sections), /null\/null/);
assert.match(text(nodes.sections), /Zero awarded/);
assert.doesNotMatch(text(nodes.sections), /Not shown/);
assert.match(text(nodes.sections), /reading is uncertain/);
const descendants = n => [n, ...n.children.flatMap(descendants)];
const rendered = descendants(nodes.sections);
const images = rendered.filter(n => n.tag === 'img');
assert.equal(images.length, 15, 'Every scored row has matching original-work evidence');
images.forEach((image, index) => {
  assert.equal(image.src, 'assets/assessment-1-midterm-functions/' + mapping[index][1]);
  assert.match(image.alt, /source page \d/);
  assert.equal(image.loading, 'lazy');
});
const links = rendered.filter(n => n.tag === 'a');
assert.equal(links.length, 15);
links.forEach((link, index) => {
  assert.equal(link.href, images[index].src);
  assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener');
});
console.log('teacher-scored-functions: PASS (14 legible marks, 1 ambiguous mark excluded, subtotal, source caveats, rendered report and dashboard link)');

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
const html = fs.readFileSync(path.join(root, 'reviews', 'assessment-2-rational-functions-grade.html'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const filename of ['assessment-1-midterm-functions-grade-data.js', 'assessment-2-rational-functions-grade-data.js',
  'test-1-study-guide-data.js', 'assessment-1-functions-75min-grade-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', filename), 'utf8'), context);
}
const data = context.window.assessment2TeacherGrade;
const rows = data.sections.flatMap(section => Array.from(section.questions));
assert.deepEqual(Array.from(rows, row => [row.id, row.earned, row.points]), [
  ['2', 4, 4], ['3', 3.75, 4],
  ['1 graph', 0, 4], ['1 end behavior', 0, 4], ['4', 5, 8], ['5', 8, 10],
  ['9', 0, 2], ['10', 0, 2], ['11', 2, 2], ['13', 0, 4],
  ['6', 0, 4], ['7', 4, 4], ['8', 0, 4], ['12', 0, 2]
]);
assert.equal(rows.length, 14);
assert.equal(new Set(rows.map(row => row.id)).size, 14);
assert.equal(rows.reduce((total, row) => total + row.earned, 0), 26.75);
assert.equal(rows.reduce((total, row) => total + row.points, 0), 58);
assert.deepEqual(Array.from(data.sections, section => [
  section.questions.reduce((total, row) => total + row.earned, 0),
  section.questions.reduce((total, row) => total + row.points, 0)
]), [[7.75, 8], [15, 36], [4, 14]]);
assert.equal(data.assessedOn, null);
assert.equal(data.scannedOn, null);
assert.equal(data.reviewedOn, '2026-11-09');
assert.match(data.notes.join(' '), /corrected after scoring/);
assert.match(html, /original pre-correction answers cannot be reconstructed/);
assert.match(html, /not an official course grade/);
assert.match(html, /No matching answer key was provided/);
assert.doesNotMatch(html, /<iframe|<embed|href="[^"]*\.pdf"/);
for (const row of rows) {
  assert.ok(row.earned >= 0 && row.earned <= row.points);
  const evidence = data.evidence[row.id];
  assert.equal(evidence.page, row.page);
  const image = fs.readFileSync(path.join(root, 'reviews', 'assets', 'assessment-2-rational-functions', evidence.file));
  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.ok(image.readUInt32BE(16) >= 1400);
  assert.ok(evidence.label.length > 30);
}
assert.equal(new Set(Object.values(data.evidence).map(item => item.file)).size, 13);
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
assert.equal(nodes.score.children[0].textContent, '26.75');
assert.equal(nodes.score.children[1].textContent, '/58 (46.1%)');
const text = item => item.textContent + item.children.map(text).join(' ');
const descend = item => [item, ...item.children.flatMap(descend)];
assert.equal((text(nodes.sections).match(/Teacher annotation:/g) || []).length, 14);
assert.equal((text(nodes.sections).match(/This page includes later corrections/g) || []).length, 6);
const rendered = descend(nodes.sections);
const images = rendered.filter(item => item.tag === 'img');
assert.equal(images.length, 14);
images.forEach((image, i) => {
  assert.equal(image.src, 'assets/assessment-2-rational-functions/' + data.evidence[rows[i].id].file);
  assert.equal(image.loading, 'lazy');
});
assert.equal((dashboard.match(/href="reviews\/assessment-2-rational-functions-grade.html"/g) || []).length, 1);
assert.match(dashboard, /src="reviews\/assessment-2-rational-functions-grade-data.js"/);
const chartContext = { window: context.window, document: context.document };
let plotted;
chartContext.renderTrendChart = (_, points) => { plotted = points; };
vm.runInNewContext(dashboard.slice(dashboard.indexOf('    function formatScanDate('),
  dashboard.indexOf('    function buildStandards()')), chartContext);
chartContext.buildPrecalculusHistory();
assert.equal(plotted.length, 4);
assert.equal(plotted[2].label, 'A1 subtotal');
assert.equal(plotted[2].fa, 75);
assert.equal(plotted[3].label, 'Assessment 2');
assert.equal(plotted[3].fa, 46.1);
assert.equal(plotted[3].sublabel, 'Review Nov 9');
assert.equal(nodes.teacherAssessment2Score.textContent, '26.75/58 (46.1%)');
// Prove the report's source data, not a copied percentage, drives the chart.
rows.find(row => row.id === '1 graph').earned = 1;
chartContext.buildPrecalculusHistory();
assert.equal(plotted[3].fa, 47.8);
assert.equal(nodes.teacherAssessment2Score.textContent, '27.75/58 (47.8%)');

const q = x => (3 * x * x - 2 * x + 5) / (x + 1);
for (const x of [-3, 0, 2]) assert.ok(Math.abs(q(x) - (3 * x - 5 + 10 / (x + 1))) < 1e-12);
assert.equal((-2 - 3) / (-2 - 1), 5 / 3);
assert.equal(-3 * (-1 - 2) / (4 * (-1 + 5)), 9 / 16);
const choice11 = x => (x + 2) * (x - 3) / (2 * (x - 2));
assert.equal(choice11(1), 3);
for (const x of [-4, 0, 3]) assert.ok(Math.abs(choice11(x) - ((x + 1) / 2 - 2 / (x - 2))) < 1e-12);
for (const m of [1, 3, 5, 6]) {
  const degree = Math.max(m, 5) - 1;
  const coefficient = m > 5 ? -2 : m === 5 ? 5 : 7;
  assert.equal(degree % 2 === 0 && coefficient > 0, m !== 6);
}
console.log('assessment-2-teacher-grade: PASS (14 teacher marks, 26.75/58, correction policy, evidence, reference math, and source-driven chart)');

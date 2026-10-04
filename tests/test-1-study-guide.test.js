const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', 'test-1-study-guide-data.js'), 'utf8'), context);
const data = context.window.test1StudyGuide;
const rows = data.sections.flatMap(section => section.rows);
assert.equal(rows.length, 25);
assert.equal(new Set(rows.map(row => row.id)).size, 25);
assert.equal(rows.reduce((sum, row) => sum + row.points, 0), 100);
assert.equal(rows.reduce((sum, row) => sum + row.earned, 0), 84);
assert.equal(data.provisional, true);
rows.forEach(row => {
  assert.ok(row.earned >= 0 && row.earned <= row.points);
  ['problem', 'answer', 'solution', 'rubric'].forEach(key => assert.ok(row[key], row.id + ': ' + key));
});
data.sections.forEach(section => assert.ok(fs.existsSync(path.join(root, 'reviews', 'assets', 'test1-study-guide', 'page-' + section.page + '.jpg'))));
const html = fs.readFileSync(path.join(root, 'reviews', 'test-1-study-guide.html'), 'utf8');
assert.match(html, /Overall score: provisional/);
assert.match(html, /not a teacher-issued test grade/);
assert.match(html, /Kai's Answer/);
assert.match(html, /href="\.\.\/index.html" class="back-link">&larr; Back to Dashboard<\/a>/);
assert.match(html, /Original problems and Kai/);
assert.ok(!html.includes('Additional handwritten graph evidence'));
const dashboard = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(dashboard, /href="reviews\/test-1-study-guide.html"/);
assert.equal((dashboard.match(/<span>Test 1 Study Guide<\/span>/g) || []).length, 1, 'Only one authoritative study-guide card');
assert.ok(!dashboard.includes('reviews/kai-test1-study-guide.html'), 'No competing provisional grade on the dashboard');
assert.match(dashboard, /84\/100/);
assert.match(dashboard, /src="reviews\/test-1-study-guide-data.js"/);
assert.match(dashboard, /label: 'Study Guide 1', sublabel: 'Provisional', fa: pct/);
assert.ok(!dashboard.includes('Awaiting first score'));
for (const match of html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) new Function(match[1]);
}
console.log('test-1-study-guide: PASS (25 problems, 100 points, 84 earned, source images, dashboard link)');

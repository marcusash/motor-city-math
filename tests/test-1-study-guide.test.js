const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', 'test-1-study-guide-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root, 'reviews', 'assessment-1-functions-75min-grade-data.js'), 'utf8'), context);
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
const practiceGrade = context.window.assessment1PracticeGrade;
const practiceQuestions = practiceGrade.sections.flatMap(section => section.questions);
assert.deepEqual(Array.from(practiceGrade.sections, section => section.questions.reduce((sum, question) => sum + question.points, 0)), [23, 28, 27, 22]);
assert.deepEqual(Array.from(practiceGrade.sections, section => section.questions.reduce((sum, question) => sum + question.earned, 0)), [23, 19, 25.5, 22]);
assert.equal(practiceQuestions.reduce((sum, question) => sum + question.points, 0), 100);
assert.equal(practiceQuestions.reduce((sum, question) => sum + question.earned, 0), 89.5);
assert.equal(practiceGrade.provisional, true);
assert.match(practiceQuestions.find(question => question.id === '9').solution, /-4\.5/);
assert.match(practiceQuestions.find(question => question.id === '9').rubric, /8\.5\/10/);
const evidenceMapping = Array.from(practiceGrade.sections, section =>
  Array.from(section.evidence, item => ({ page: item.page, questions: Array.from(item.questions) }))
);
assert.deepEqual(evidenceMapping, [
  [{ page: 1, questions: ['1', '2'] }, { page: 2, questions: ['3'] }],
  [{ page: 6, questions: ['4'] }, { page: 8, questions: ['5'] }, { page: 3, questions: ['6'] }],
  [{ page: 4, questions: ['7'] }, { page: 7, questions: ['8'] }, { page: 5, questions: ['9'] }],
  [{ page: 9, questions: ['10', '11'] }]
]);
for (const item of evidenceMapping.flat()) {
  assert.ok(fs.existsSync(path.join(root, 'reviews', 'assets', 'assessment-1-functions-75min', `page-${String(item.page).padStart(2, '0')}.png`)));
}
const practiceReportPath = path.join(root, 'reviews', 'assessment-1-functions-75min-grade.html');
assert.ok(fs.existsSync(practiceReportPath));
const practiceReportHtml = fs.readFileSync(practiceReportPath, 'utf8');
assert.match(practiceReportHtml, /Score based on visible work in the submitted scan/);
assert.match(practiceReportHtml, /href="\.\.\/index.html" class="back-link">&larr; Back to Dashboard<\/a>/);
assert.match(practiceReportHtml, /element\('img', undefined, 'source-image'\)/, 'Evidence images use the existing report image styling');
assert.match(practiceReportHtml, /Kai's original work/);
assert.match(practiceReportHtml, /assets\/assessment-1-functions-75min\/page-/);
assert.ok(!practiceReportHtml.includes('Other Test 1 materials'));
assert.equal([...practiceReportHtml.matchAll(/href="([^"]+)"/g)].length, 1, 'Only the dashboard navigation link remains');
for (const [, href] of practiceReportHtml.matchAll(/href="([^"]+)"/g)) {
  if (/^(?:https?:|#|mailto:)/.test(href)) continue;
  assert.ok(fs.existsSync(path.resolve(path.dirname(practiceReportPath), href.split('#')[0])), 'Missing report link: ' + href);
}
for (const match of practiceReportHtml.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) new Function(match[1]);
}
const html = fs.readFileSync(path.join(root, 'reviews', 'test-1-study-guide.html'), 'utf8');
assert.match(html, /Score based on visible work in the submitted pages/);
assert.match(html, /not a teacher-issued test grade/);
assert.match(html, /Kai's Answer/);
assert.ok(!html.includes('provisional'), 'Explain uncertain photo-based scoring without jargon');
assert.match(html, /href="\.\.\/index.html" class="back-link">&larr; Back to Dashboard<\/a>/);
assert.match(html, /Original problems and Kai/);
assert.ok(!html.includes('Additional handwritten graph evidence'));
const dashboard = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const precalculusGridStart = dashboard.indexOf('<div class="test-grid" id="precalculusGrid">');
const precalculusGrid = dashboard.slice(precalculusGridStart, dashboard.indexOf('</details>', precalculusGridStart));
assert.match(precalculusGrid, /<a class="test-link" href="reviews\/assessment-1-functions-75min-grade.html"/, 'Prep Test 1 review is the first card');
assert.equal((dashboard.match(/href="reviews\/assessment-1-functions-75min-grade.html"/g) || []).length, 1, 'Only one corrected Prep Test 1 report card');
assert.equal((dashboard.match(/<span>Test 1 Study Guide<\/span>/g) || []).length, 1, 'Only one authoritative study-guide card');
assert.ok(!dashboard.includes('reviews/kai-test1-study-guide.html'), 'No competing provisional grade on the dashboard');
assert.match(dashboard, /84\/100/);
assert.match(dashboard, /89\.5\/100/);
assert.match(dashboard, /src="reviews\/test-1-study-guide-data.js"/);
assert.match(dashboard, /src="reviews\/assessment-1-functions-75min-grade-data.js"/);
assert.match(dashboard, /label: 'Study Guide 1', sublabel: formatCompletionDate\(window.test1StudyGuide.completedOn\), fa: studyGuidePct/);
assert.match(dashboard, /label: 'Prep Test 1', sublabel: formatCompletionDate\(window.assessment1PracticeGrade.completedOn\), fa: practiceTestPct/);
assert.match(dashboard, /pointSpacing = 100/);
assert.match(dashboard, /xL = 50;\s*xR = xL \+ pointSpan/);
assert.match(dashboard, /Scores from visible work, not teacher grades/);
assert.ok(!dashboard.includes('provisional'), 'Dashboard should explain score status without jargon');
assert.ok(!dashboard.includes('91/100'), 'The superseded 91-point report must not appear');
assert.ok(!dashboard.includes('Awaiting first score'));
const precalculusSection = dashboard.slice(dashboard.indexOf('<details class="dash-section" id="precalculusSection"'), dashboard.indexOf('<details class="dash-section" id="springSection"'));
assert.ok(!precalculusSection.includes('hero-link'), 'Remove the obsolete ungraded Prep Test hero');
assert.ok(!dashboard.includes("Kai's score will be added"), 'Do not claim the published graded test is awaiting a score');
assert.match(precalculusGrid, /href="tests\/assessment-1-functions-75min.pdf"/, 'Keep the printable test available in its existing compact card');
const chartContext = { window: context.window };
const elements = {};
chartContext.document = { getElementById: id => elements[id] || (elements[id] = {}) };
vm.runInNewContext(dashboard.slice(dashboard.indexOf('    function renderTrendChart('), dashboard.indexOf('    function buildChart()')), chartContext);
vm.runInNewContext(dashboard.slice(dashboard.indexOf('    function formatCompletionDate('), dashboard.indexOf('    function buildStandards()')), chartContext);
assert.equal(chartContext.formatCompletionDate(null), 'Date unknown');
assert.equal(chartContext.formatCompletionDate('2026-10-04'), 'Oct 4');
assert.equal(chartContext.formatCompletionDate('2026-03-01'), 'Mar 1', 'Date-only values must not shift across time zones');
assert.throws(() => chartContext.formatCompletionDate('2026-02-30'), /Invalid completion date/);
assert.throws(() => chartContext.formatCompletionDate('October 4, 2026'), /YYYY-MM-DD/);
chartContext.buildPrecalculusHistory();
assert.match(elements.precalculusChartContainer.innerHTML, /FOUL TROUBLE/);
assert.match(elements.precalculusChartContainer.innerHTML, /#8b3e1a/, 'Reuse the existing court palette');
assert.equal((elements.precalculusChartContainer.innerHTML.match(/Date unknown/g) || []).length, 2, 'Do not invent completion dates from review dates');
chartContext.window.test1StudyGuide.completedOn = '2026-10-03';
chartContext.window.assessment1PracticeGrade.completedOn = '2026-10-04';
chartContext.buildPrecalculusHistory();
assert.match(elements.precalculusChartContainer.innerHTML, /Oct 3/);
assert.match(elements.precalculusChartContainer.innerHTML, /Oct 4/);
assert.match(elements.precalculusChartContainer.innerHTML, /cx="50"/);
assert.match(elements.precalculusChartContainer.innerHTML, /cx="150"/);
const legacyChart = {};
chartContext.renderTrendChart(legacyChart, [{ label: 'Old', fa: 84 }]);
assert.ok(!legacyChart.innerHTML.includes('FOUL TROUBLE'), 'Unchanged legacy charts still hide the court when all scores are above 80%');
chartContext.renderTrendChart(legacyChart, [{ label: 'Low', fa: 63 }]);
assert.match(legacyChart.innerHTML, /FOUL TROUBLE/);
assert.match(legacyChart.innerHTML, /#d29922/, 'Use the same warning color below B');
for (const match of html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)) {
  if (match[1].trim()) new Function(match[1]);
}
console.log('precalculus-grade-reports: PASS (study guide, corrected 89.5/100 report, dashboard chart and links)');

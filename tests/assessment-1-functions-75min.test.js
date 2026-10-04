const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const testHtml = fs.readFileSync(path.join(__dirname, 'assessment-1-functions-75min.html'), 'utf8');
const keyHtml = fs.readFileSync(path.join(__dirname, 'assessment-1-functions-75min-KEY.html'), 'utf8');
const questionIds = Array.from({ length: 11 }, (_, index) => `q${index + 1}`);

function getAttributeTags(source, tag, attribute) {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return Array.from(source.matchAll(new RegExp(`<${tag}\\b[^>]*\\b${escapedAttribute}="([^"]+)"[^>]*>`, 'g')))
    .map((match) => match[1]);
}

assert.equal(getAttributeTags(testHtml, 'meta', 'name').length, 3, 'exam declares viewport, duration, and total points');
assert.match(testHtml, /<meta name="duration-minutes" content="75">/, 'student exam is 75 minutes');
assert.match(testHtml, /<meta name="total-points" content="100">/, 'student exam is worth 100 points');

const sectionMinutes = Array.from(testHtml.matchAll(/data-section-minutes="(\d+)"/g))
  .map((match) => Number(match[1]));
assert.equal(sectionMinutes.length, 4, 'exam has four timed sections');
assert.deepEqual(sectionMinutes, [18, 22, 20, 15], 'section times match the revised question workload');
assert.equal(sectionMinutes.reduce((total, minutes) => total + minutes, 0), 75, 'section timing adds to 75 minutes');
const sectionPoints = Array.from(testHtml.matchAll(/<span class="section-meta">\d+ minutes \| (\d+) points<\/span>/g))
  .map((match) => Number(match[1]));
assert.deepEqual(sectionPoints, [23, 28, 27, 22], 'section points are shown and add to 100');

const questionPoints = Array.from(testHtml.matchAll(/<article class="question[^"]*" id="q\d+" data-points="(\d+)"/g))
  .map((match) => Number(match[1]));
assert.equal(questionPoints.length, 11, 'exam has eleven questions');
assert.deepEqual(questionPoints, [5, 8, 10, 10, 8, 10, 7, 10, 10, 12, 10], 'each question has its planned point value');
assert.equal(questionPoints.reduce((total, points) => total + points, 0), 100, 'question points add to 100');
assert.match(testHtml, /Check that you answered all 11 questions/, 'exam footer has the updated question count');
assert.doesNotMatch(testHtml, /id="q12"/, 'exam does not introduce the reverse-transformation question');

for (const id of questionIds) {
  assert.match(testHtml, new RegExp(`<article class="question[^"]*" id="${id}"(?:\\s|>)`), `${id} exists in student exam`);
  assert.match(keyHtml, new RegExp(`<article class="question-solution" data-question="${id}"(?:\\s|>)`), `${id} has an answer-key solution`);
}

const studentMarkup = testHtml.split('<script>')[0];
assert.equal((studentMarkup.match(/<div class="coordinate-grid-wrap"[^>]*data-coordinate-grid/g) || []).length, 6, 'student exam includes six graph grids');
assert.match(testHtml, /@media print/, 'student exam has print styles');
assert.match(testHtml, /@media print/, 'answer key has print styles');
assert.match(testHtml, /print-color-adjust:\s*exact/, 'student graph grids retain print colors');
assert.match(testHtml, /table\.className = 'coordinate-grid'/, 'coordinate grids use HTML table borders for reliable printing');
assert.match(testHtml, /addLine\('axis', 0, origin, gridSize, origin\)/, 'graph axes align to the grid coordinate centers');
assert.match(testHtml, /addLabel\('x-tick-label', String\(value\), x, origin \+ 0\.4\)/, 'x labels are anchored to their coordinate ticks');
assert.match(testHtml, /renderMathInElement\(document\.body/, 'student equations are typeset locally with KaTeX');
assert.match(keyHtml, /renderMathInElement\(document\.body/, 'answer-key equations are typeset locally with KaTeX');
assert.match(testHtml, /Let \\\(f\(x\) = \\sqrt\{x \+ 1\}\\\) and \\?\\\(g\(x\) = x\^2 - 1\\\)/, 'square-root composition prompt uses KaTeX for a full-length radical bar');
assert.match(testHtml, /data-polyline="-4,-2;-2,2;1,0;4,3"/, 'composition question provides a reference graph with multiple segment slopes');
assert.match(testHtml, /g<\/var>\(<var>x<\/var>\) = 2<var>x<\/var> - 2/, 'composition question combines a horizontal scale and shift with a vertical scale and shift');
assert.match(testHtml, /On the grid below, graph both <var>f<\/var>/, 'composition question asks students to graph the first order');
assert.match(testHtml, /and <var>g<\/var>\(<var>f<\/var>/, 'composition question asks students to graph the reverse order');
assert.match(keyHtml, /\(-1, -2\)/, 'composition key gives the transformed first vertex');
assert.match(testHtml, /data-coordinate-grid aria-label="Blank coordinate grid for graphing question 6"/, 'square-root shift question includes a graph grid');
assert.match(keyHtml, /data-question="q6"[\s\S]*?\\sqrt\{x \+ 4\} - 3/, 'square-root shift key uses a typeset radical');
assert.match(testHtml, /data-polynomial="0\.5,0,-1\.5,-1"/, 'polynomial graph is plotted from its function coefficients');
assert.match(testHtml, /Keep the original domain when composing/, 'composition practice targets original-domain retention');
assert.match(testHtml, /simplifying the square root does not make the original domain larger/, 'composition prompt requires domain reasoning after simplification');
assert.match(testHtml, /repeated <var>x<\/var>-value/, 'function concept is tested from a repeated x-value in a table');
assert.match(testHtml, /student says the domain/, 'domain restrictions are assessed through error analysis');
assert.match(testHtml, /Find and compare two compositions/, 'composition is tested in the same notation as the study material');
assert.match(testHtml, /Which rule could represent it/, 'polynomial behavior is tested through model selection');
assert.match(testHtml, /Check each part of the report and correct any errors/, 'graph analysis checks and corrects a classmate report');
assert.match(keyHtml, /\\\(p\(x\) = \\frac\{1\}\{2\}\(x - 2\)\(x \+ 1\)\^2\\\)/, 'graph-to-equation answer includes a typeset recovered equation');
assert.match(keyHtml, /g\(f\(x\)\) = x/, 'composition answer retains the restricted original domain');
assert.match(keyHtml, /f\(g\(x\)\).*\\sqrt\{x\^2\} = \|x\|/, 'reverse composition simplifies to the absolute-value function');
assert.match(keyHtml, /\(-3, -3\)/, 'graph analysis answer key gives the relative minimum as a point');
assert.match(keyHtml, /T\(D\(d\)\)/, 'composition answer key preserves the meaningful function order');
assert.match(testHtml, /assessment-1-functions-75min-KEY\.html/, 'student exam links to its separate key');
assert.match(keyHtml, /assessment-1-functions-75min\.html/, 'answer key links back to the student exam');

console.log('assessment-1-functions-75min: PASS (duration, timing, points, questions, key, and print grids)');

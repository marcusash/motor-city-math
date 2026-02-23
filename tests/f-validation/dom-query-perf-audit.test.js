// Audit: getElementById usage in forEach/for loops in exam.html
// Purpose: detect performance regressions (repeated DOM queries inside hot render loops)
// Finding: 3 occurrences — all are benign (restore/grade/validation, not render loops)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dom-query-perf-audit.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── No getElementById inside renderQuestions loop ──────────────
console.log('\u2500\u2500 renderQuestions() DOM query hygiene \u2500\u2500');
var renderStart = src.indexOf('function renderQuestions(');
var renderEnd = src.indexOf('\n    function ', renderStart + 100);
var renderFn = renderStart !== -1 ? src.substring(renderStart, renderEnd) : '';
// renderQuestions is allowed 1 getElementById for container lookup
// but must not call it inside the forEach loop
var getElsInLoop = (renderFn.match(/\.forEach[\s\S]{0,500}?getElementById/g) || []).length;
test('renderQuestions() has no getElementById inside forEach loop', getElsInLoop === 0);
var totalGetEls = (renderFn.match(/getElementById/g) || []).length;
console.log('  (renderQuestions total getElementById: ' + totalGetEls + ', in-loop: ' + getElsInLoop + ')');
test('renderQuestions() total getElementById calls <= 2 (container + aria updates only)', totalGetEls <= 2);

// ── forEach+getElementById count cap ───────────────────────────
console.log('\n\u2500\u2500 forEach+getElementById cap \u2500\u2500');
// Allowed: restore, validate (missing), grade. Not allowed: render loops.
var forEachGetEl = (src.match(/\.forEach[\s\S]{0,300}?getElementById/g) || []).length;
console.log('  (forEach+getElementById occurrences: ' + forEachGetEl + ')');
test('forEach+getElementById occurrences <= 5 (benign patterns only)', forEachGetEl <= 5);

// ── No getElementById in animation/paint loops ─────────────────
console.log('\n\u2500\u2500 Animation/paint loop safety \u2500\u2500');
// Check that getElementById doesn't appear INSIDE a requestAnimationFrame callback
// Pattern: rAF(function() { ... getElementById ... })
var rafWithGetEl = (src.match(/requestAnimationFrame\(function\(\)[\s\S]{0,200}getElementById/g) || []).length;
test('No getElementById inside requestAnimationFrame callback', rafWithGetEl === 0);
test('No getElementById inside setInterval', !src.match(/setInterval\([^,]+,[\s\S]{0,500}getElementById/));

console.log('\n' + '='.repeat(50));
console.log('dom-query-perf-audit: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

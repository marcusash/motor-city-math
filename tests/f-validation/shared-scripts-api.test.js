// shared/scripts.js public API test
// Verifies all expected public functions are defined and key contracts hold

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-api.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Public API function presence \u2500\u2500');

var publicFns = [
    'parseStudentAnswer',
    'showAnswerKey',
    'closeAnswerKey',
    'saveResults',
    'loadResults',
    'printTest',
    'initTextareaResize',
    'checkAnswer',
    'gradeTest',
    'initTimer'
];

publicFns.forEach(function(fn) {
    test('function ' + fn + '() defined', src.includes('function ' + fn + '('));
});

console.log('\n\u2500\u2500 Key contracts \u2500\u2500');

// parseStudentAnswer: strips $ , % and trims
var psa = src.substring(src.indexOf('function parseStudentAnswer('), src.indexOf('function showAnswerKey('));
test('parseStudentAnswer strips $ sign', psa.includes("'$'") || psa.includes('"$"') || psa.match(/replace.*\$/));
test('parseStudentAnswer strips commas', psa.includes("','") || psa.match(/replace.*,/));

// showAnswerKey: prompts for password before revealing
var ska = src.substring(src.indexOf('function showAnswerKey('), src.indexOf('function closeAnswerKey('));
test('showAnswerKey calls prompt()', ska.includes('prompt('));
test('showAnswerKey guards with password check', ska.includes('121274') || ska.includes('password'));

// initTimer: returns null if no minutes provided
var timer = src.substring(src.indexOf('function initTimer('), src.length);
test('initTimer has null/return guard for missing minutes', timer.match(/if\s*\(.*\)\s*return\s+null/));

// checkAnswer: handles tolerance
var ca = src.substring(src.indexOf('function checkAnswer('), src.indexOf('function gradeTest('));
test('checkAnswer accepts tolerance parameter', ca.includes('tolerance'));

// gradeTest: reads DOM + scores
var gt = src.substring(src.indexOf('function gradeTest('), src.length);
test('gradeTest updates DOM with score', gt.includes('innerHTML') || gt.includes('textContent'));

// No ES6 import/export (pure global JS, no bundler)
test('No ES6 import/export (browser globals)', !src.includes('export ') && !src.includes('import '));

// File not empty (sanity)
test('File is substantial (>1000 chars)', src.length > 1000);
console.log('  (scripts.js size: ' + src.length + ' chars)');

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-api: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

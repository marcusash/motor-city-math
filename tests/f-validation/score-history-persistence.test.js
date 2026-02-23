// Score history persistence contract test
// Verifies saveResults() uses correct localStorage schema: mcm_scores key, attempts array

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} score-history-persistence.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract saveResults function region
var fnStart = src.indexOf('function saveResults(');
var fnSrc = src.substring(fnStart, fnStart + 2500);

console.log('\u2500\u2500 localStorage schema contract \u2500\u2500');

// 1. localStorage key is 'mcm_scores'
test("Uses localStorage key 'mcm_scores'", fnSrc.includes("'mcm_scores'"));

// 2. Storage key format: 'mcm-{examId}'
test("Storage sub-key uses 'mcm-' prefix", fnSrc.includes("'mcm-'") || fnSrc.includes('"mcm-"') || fnSrc.match(/mcm-.*examId/));

// 3. Attempt object has required fields (score, total, pct, grade, timestamp)
var attemptRequired = ['score', 'total', 'pct', 'grade', 'timestamp'];
attemptRequired.forEach(function(field) {
    test('Attempt object has ' + field + ' field', fnSrc.includes(field));
});

// 4. Attempts is an array (push pattern)
test('Attempts stored as array (attempts.push)', fnSrc.includes('attempts.push') || fnSrc.includes('attempts: []'));

// 5. Best score tracking
test('Best score tracked (best object)', fnSrc.includes('best'));

// 6. JSON.parse + JSON.stringify round-trip (safe reading)
test('Uses JSON.parse to read existing scores', fnSrc.includes('JSON.parse'));
test('Uses JSON.stringify to write scores', fnSrc.includes('JSON.stringify'));

// 7. try/catch around localStorage (graceful degradation)
test('try/catch wraps localStorage operations', fnSrc.includes('try') && fnSrc.includes('catch'));

// 8. Storage key referenced in index.html (dashboard reads same key)
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
test('index.html reads same mcm_scores key', indexSrc.includes("'mcm_scores'") || indexSrc.includes('"mcm_scores"'));

// 9. saveResults called from gradeExam
var gStart = src.indexOf('function gradeExam()');
var gSrc = src.substring(gStart, gStart + 15000);
test('saveResults() called from gradeExam()', gSrc.includes('saveResults('));

console.log('\n' + '='.repeat(50));
console.log('score-history-persistence: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

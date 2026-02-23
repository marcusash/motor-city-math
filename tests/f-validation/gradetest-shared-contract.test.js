// gradeTest() config contract test (shared/scripts.js)
// Verifies the legacy gradeTest() API shape: config.questions, config.feedbacks, etc.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} gradetest-shared-contract.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var fnStart = src.indexOf('function gradeTest(');
var fnSrc = src.substring(fnStart, fnStart + 3000);

console.log('\u2500\u2500 gradeTest() config shape \u2500\u2500');

// 1. function defined
test('gradeTest() function defined', fnStart >= 0);

// 2. config.questions consumed
test('gradeTest reads config.questions', fnSrc.includes('config.questions'));

// 3. config.feedbacks consumed
test('gradeTest reads config.feedbacks', fnSrc.includes('config.feedbacks'));

// 4. config.resultId with fallback
test('gradeTest reads config.resultId with fallback', fnSrc.includes('config.resultId') && fnSrc.includes("|| '"));

// 5. config.standards with fallback
test('gradeTest reads config.standards with fallback', fnSrc.includes('config.standards') && fnSrc.includes('|| []'));

// 6. score and total tracked
test('gradeTest tracks score and total', (fnSrc.includes('var score') || fnSrc.includes('score =')) && 
    (fnSrc.includes('total') && fnSrc.includes('score')));

// 7. calls checkAnswer() for each part
test('gradeTest delegates to checkAnswer()', fnSrc.includes('checkAnswer('));

// 8. DOM feedback written per question
test('gradeTest writes feedback to DOM (getElementById)', fnSrc.includes('getElementById'));

// 9. streak tracking
test('gradeTest tracks streak', fnSrc.includes('streak'));

// 10. stdScores per-standard breakdown
test('gradeTest builds per-standard scores (stdScores)', fnSrc.includes('stdScores'));

// 11. Function returns result object or updates DOM (not void)
var returnStatement = fnSrc.includes('return {') || fnSrc.includes('return{') ||
    fnSrc.includes('score:') || fnSrc.includes('maxStreak');
test('gradeTest computes final score summary', returnStatement);

console.log('\n' + '='.repeat(50));
console.log('gradetest-shared-contract: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

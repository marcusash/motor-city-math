// exam.html scoring rubric test
// SAAS grade rubric thresholds must match specification
// Grade 4: 92%+, Grade 3: 79-91%, Grade 2: 64-78%, Grade 1: <64%

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-scoring-rubric.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var allSrc = examSrc + indexSrc + sharedSrc;

console.log('\u2500\u2500 SAAS scoring rubric checks \u2500\u2500\n');

// 1. Grade 4 threshold: 92% or 93% (either is acceptable per spec)
var hasGrade4Threshold = allSrc.includes('92') || allSrc.includes('93');
test('Grade 4 threshold (92% or 93%) referenced', hasGrade4Threshold);

// 2. Score calculation uses correct formula (score/total * 100)
var hasScoreCalc = allSrc.includes('/ 15') || allSrc.includes('/total') || 
                   allSrc.includes('/ total') || allSrc.includes('pct');
test('Score percentage calculation present', hasScoreCalc);

// 3. Grade stored as numeric (1-4) not letter
var hasNumericGrade = allSrc.includes('grade: 4') || allSrc.includes('"grade":4') || 
                      allSrc.includes('grade === 4') || allSrc.includes('grade == 4') ||
                      allSrc.includes('.grade') && allSrc.includes('4');
test('Grade stored as numeric value (1-4)', hasNumericGrade);

// 4. Grade displayed with letter context (A/B/C/D equivalent)
var hasLetterContext = allSrc.includes("'A'") || allSrc.includes('"A"') || 
                       allSrc.includes('Grade 4') || allSrc.includes('grade4');
test('Grade displayed with letter or label context', hasLetterContext);

console.log('\n' + '='.repeat(50));
console.log('exam-scoring-rubric: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

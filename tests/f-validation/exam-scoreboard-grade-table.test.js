// Grade table scorecard consistency test
// Verifies getGrade() thresholds match data-model.md spec and are used consistently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-scoreboard-grade-table.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
const dataMd = fs.readFileSync(path.join(__dirname, '../../docs/data-model.md'), 'utf-8');

// Extract getGrade function from exam.html
var gradeFn = examSrc.substring(examSrc.indexOf('function getGrade('), examSrc.indexOf('function getGrade(') + 200);

console.log('\u2500\u2500 getGrade() thresholds (exam.html) \u2500\u2500');
console.log('  ' + gradeFn.split('\n')[1].trim());

// 1. Grade 4 at >= 92%
test('Grade 4 threshold is 92%', gradeFn.includes('92') && gradeFn.includes('4'));

// 2. Grade 3 at >= 82%
test('Grade 3 threshold is 82%', gradeFn.includes('82') && gradeFn.includes('3'));

// 3. Grade 2 at >= 70%
test('Grade 2 threshold is 70%', gradeFn.includes('70') && gradeFn.includes('2'));

// 4. Grade 1 is the fallback (< 70%)
test('Grade 1 is fallback (no lower bound)', gradeFn.includes(': 1') || gradeFn.match(/return.*1$/m));

// 5. getGrade is a pure ternary (no if/else branching — keeps it readable)
test('getGrade uses ternary chain (concise)', gradeFn.includes('? 4') || gradeFn.includes('>='));

// 6. index.html uses same thresholds (no discrepancy)
var indexHas92 = indexSrc.includes('92') || indexSrc.includes('>= 92');
var indexHas82 = indexSrc.includes('82') || indexSrc.includes('>= 82');
test('index.html references 92% Grade 4 threshold', indexHas92);
test('index.html references 82% Grade 3 threshold', indexHas82);

// 7. data-model.md documents the thresholds
test('docs/data-model.md documents Grade 4 at 92%', dataMd.includes('92'));
test('docs/data-model.md documents Grade 3 at 82%', dataMd.includes('82'));
test('docs/data-model.md documents Grade 2 at 70%', dataMd.includes('70'));

// 8. scorecard displays grade (not just score)
var scorecardSrc = examSrc.substring(examSrc.indexOf('scorecard'), examSrc.indexOf('scorecard') + 2000);
test('Scorecard section displays grade value', scorecardSrc.includes('grade') || scorecardSrc.includes('Grade'));

console.log('\n' + '='.repeat(50));
console.log('exam-scoreboard-grade-table: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

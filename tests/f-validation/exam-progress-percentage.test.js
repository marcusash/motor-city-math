// exam-progress-percentage test
// exam.html must calculate and display progress as percentage (not just N/15)
// Percentages are more meaningful than fractions for Kai to track pace

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-progress-percentage.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Progress percentage checks \u2500\u2500\n');

// 1. Percentage calculation (division then multiply by 100)
var hasPctCalc = examSrc.includes('/ 15') && examSrc.includes('* 100') || 
                 examSrc.includes('/15') && examSrc.includes('100') ||
                 examSrc.includes('pct') || examSrc.includes('percent');
test('Progress percentage calculated', hasPctCalc);

// 2. Progress bar width updated as percentage
var hasProgressWidth = examSrc.includes('width') && examSrc.includes('%') && 
                       (examSrc.includes('progress') || examSrc.includes('pct'));
test('Progress bar width set as percentage', hasProgressWidth);

// 3. updateProgress function exists
var hasUpdateProgress = examSrc.includes('updateProgress');
test('updateProgress() function defined', hasUpdateProgress);

console.log('\n' + '='.repeat(50));
console.log('exam-progress-percentage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

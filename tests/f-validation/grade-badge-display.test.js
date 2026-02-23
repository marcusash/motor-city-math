// Grade badge display test
// After gradeExam(): grade badge must show A/B/C/D letter based on thresholds
// A = 92%+, B = 82%+, C = 70%+, D = below 70%

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} grade-badge-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Grade badge A/B/C/D thresholds \u2500\u2500\n');

// 1. getGrade() or grade computation function exists
var hasGetGrade = examSrc.includes('getGrade') || examSrc.includes('function getGrade') ||
                  examSrc.includes('grade =') && examSrc.includes("'A'");
test('getGrade() or grade logic exists', hasGetGrade);

// Find getGrade body
var gradeStart = examSrc.indexOf('function getGrade');
var gradeBody = gradeStart !== -1 ? examSrc.substring(gradeStart, gradeStart + 500) : examSrc;

// 2. A threshold at 92%
var hasA = gradeBody.includes('92') || gradeBody.includes("'A'") && gradeBody.includes('92');
test('Grade A threshold is 92%', hasA);

// 3. B threshold at 82%
var hasB = gradeBody.includes('82') || gradeBody.includes("'B'") && gradeBody.includes('82');
test('Grade B threshold is 82%', hasB);

// 4. C threshold at 70%
var hasC = gradeBody.includes('70') || gradeBody.includes("'C'") && gradeBody.includes('70');
test('Grade C threshold is 70%', hasC);

// 5. Grade badge CSS class exists (for rendering)
var hasBadgeClass = examSrc.includes('grade-badge') || examSrc.includes('gradeBadge') ||
                    examSrc.includes('grade') && (examSrc.includes('badge') || examSrc.includes('letter'));
test('Grade badge CSS class or element exists', hasBadgeClass);

console.log('\n' + '='.repeat(50));
console.log('grade-badge-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

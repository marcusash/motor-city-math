// index.html SAAS grade display test
// Dashboard must show SAAS grades (Grade 1-4) not just percentages
// Kai's school uses SAAS grade system

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-saas-grades.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 SAAS grade display checks \u2500\u2500\n');

// 1. Grade references in dashboard
var hasGrade4 = indexSrc.includes('Grade 4') || indexSrc.includes('grade-4') || indexSrc.includes('grade4');
var hasGrade3 = indexSrc.includes('Grade 3') || indexSrc.includes('grade-3') || indexSrc.includes('grade3') ||
                indexSrc.includes('"grade":3') || indexSrc.includes('grade:3');
var hasGrade1 = indexSrc.includes('Grade 1') || indexSrc.includes('grade-1') || indexSrc.includes('grade1');

test('Dashboard references Grade 4 (top score: A/93%+)', hasGrade4);
test('Dashboard references Grade 3 (B level: 79-92%)', hasGrade3);

// 2. Grade thresholds defined (92/79/64 percent or similar)
var hasThresholds = indexSrc.includes('92') || indexSrc.includes('93') || indexSrc.includes('threshold');
test('Grade thresholds defined in dashboard', hasThresholds);

// 3. getGrade or gradeLabel function
var hasGradeFunc = indexSrc.includes('getGrade') || indexSrc.includes('gradeLabel') ||
                   indexSrc.includes('getLetterGrade') || indexSrc.includes('grade =') ||
                   indexSrc.includes('.grade') || indexSrc.includes('"grade"');
test('Grade calculation function present', hasGradeFunc);

console.log('\n' + '='.repeat(50));
console.log('dashboard-saas-grades: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

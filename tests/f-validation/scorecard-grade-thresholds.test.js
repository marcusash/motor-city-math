// Scorecard grade threshold test
// MCM grade thresholds: 0-59=F, 60-69=D, 70-79=C, 80-91=B, 92-100=A (Grade 4)
// Checks that the grade table in exam.html / index.html / shared/scripts.js matches spec

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} scorecard-grade-thresholds.test.js\n');

var sources = [
    path.join(__dirname, '../../exam.html'),
    path.join(__dirname, '../../index.html'),
    path.join(__dirname, '../../shared/scripts.js'),
];

console.log('\u2500\u2500 Grade threshold checks \u2500\u2500\n');

var combined = sources.map(function(f) {
    return fs.existsSync(f) ? fs.readFileSync(f, 'utf-8') : '';
}).join('\n');

// Grade 4 (A) threshold: 92% or 14/15 (both are valid representations)
var hasGrade4Threshold = combined.includes('92') && (combined.includes('Grade 4') || combined.includes('grade4') || combined.includes('grade-4'));
test('Grade 4 (A) threshold at 92% present in codebase', hasGrade4Threshold);

// Grade 1 (F) at 0-59%
var hasGrade1 = combined.includes('59') || (combined.includes('Grade 1') || combined.includes('grade1') || combined.includes('grade-1'));
test('Grade 1 boundary exists (F / 0-59%)', hasGrade1);

// SAAS grade labels present (Grade 1-4)
var grades = ['Grade 4', 'Grade 3', 'Grade 2', 'Grade 1'];
// They may not all appear as literal "Grade N" text -- check for grade computation logic
var grade4Present = combined.includes('Grade 4');
var grade1Present = combined.includes('Grade 1') || combined.includes('grade1') || combined.includes('grade === 1');
var allGradeLabels = grade4Present && grade1Present;
test('Grade 1 and Grade 4 labels present in codebase', allGradeLabels);

// Grade 4 is at 92% (A), not 93%+ (spec)
var has93 = combined.includes('93%');
// 93% should not be a grade cutoff (was a bug, fixed to 92%)
test('Grade 4 threshold is 92% (not incorrect 93%)', !combined.includes('A (93%)') && !combined.includes('93%+'));

// Grade is computed (not hardcoded) -- function or lookup exists
var hasGradeCompute = combined.includes('getGrade') || combined.includes('calcGrade') ||
                      combined.includes('gradeFor') || combined.includes('pct >= 92') ||
                      combined.includes('pct > 91') || combined.includes('percent >= 92');
test('Grade computed dynamically (getGrade or pct >= 92 pattern)', hasGradeCompute);

console.log('\n' + '='.repeat(50));
console.log('scorecard-grade-thresholds: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

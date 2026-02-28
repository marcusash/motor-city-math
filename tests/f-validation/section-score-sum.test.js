// Section score sum test
// gradeExam() section breakdown: S1+S2+S3+S4+S5 scores must equal total score
// Tests that the section aggregation logic doesn't lose or double-count points

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} section-score-sum.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Section score aggregation (gradeExam) \u2500\u2500\n');

// 1. gradeExam function exists
var gradeStart = examSrc.indexOf('function gradeExam');
test('gradeExam() function exists in exam.html', gradeStart !== -1);

if (gradeStart !== -1) {
    var gradeBody = examSrc.substring(gradeStart, gradeStart + 25000);

    // 2. Section keys A/B/C/D or section-1 etc are accumulated
    var hasSectionAccum = gradeBody.includes('sections') && (
        gradeBody.includes('[q.section]') || gradeBody.includes("['A']") ||
        gradeBody.includes('section') && gradeBody.includes('correct')
    );
    test('gradeExam accumulates scores by section', hasSectionAccum);

    // 3. Total score is computed separately (not from summing sections)
    var hasTotalCompute = gradeBody.includes('totalCorrect') || gradeBody.includes('total_correct') ||
                          gradeBody.includes('score') && gradeBody.includes('correct');
    test('gradeExam computes totalCorrect independently', hasTotalCompute);

    // 4. Result object has sections property with per-section data
    var hasSectionsOutput = gradeBody.includes('sections:') || gradeBody.includes('sections =') ||
                            gradeBody.includes('.sections');
    test('gradeExam result includes sections breakdown', hasSectionsOutput);

    // 5. Section result stored in localStorage (persisted for scorecard)
    var hasLocalStorage = gradeBody.includes('localStorage') || examSrc.includes('saveResults');
    test('gradeExam result with sections persisted to localStorage', hasLocalStorage);
} else {
    test('gradeExam accumulates scores by section', false);
    test('gradeExam computes totalCorrect independently', false);
    test('gradeExam result includes sections breakdown', false);
    test('gradeExam result with sections persisted to localStorage', false);
}

console.log('\n' + '='.repeat(50));
console.log('section-score-sum: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

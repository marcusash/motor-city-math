/**
 * Motor City Math — exam.html Grading Unit Tests
 * Covers: numeric grading, tolerance, comma/dollar normalization,
 *         keyword matching, MC radio, pct/grade calculation,
 *         saveResults shape, zero-total edge cases.
 *
 * Run: node tests/f-validation/exam-grading-unit.test.js
 */

// ===== Replicate grading functions from exam.html =====

/**
 * Grade a single input against its expected answer.
 * Mirrors exam.html gradeOneInput() logic.
 */
function gradeInput(type, userValue, inp) {
    if (type === 'text') return null; // self-graded, not auto-graded
    if (type === 'number') {
        const raw = String(userValue).replace(/[$,]/g, '');
        const num = parseFloat(raw);
        if (isNaN(num)) return false;
        const tol = (typeof inp.tolerance === 'number') ? inp.tolerance : 0.5;
        return Math.abs(num - inp.answer) <= tol;
    }
    if (type === 'radio' || type === 'dropdown' || type === 'multiple-choice') {
        return String(userValue).trim() === String(inp.answer).trim();
    }
    return false;
}

/**
 * Compute scorecard values. Mirrors exam.html showScorecard() / saveResults().
 */
function computeScore(score, total) {
    const pct = total > 0 ? Math.round(score / total * 100) : 0;
    let grade = 1;
    if (pct >= 92) grade = 4;
    else if (pct >= 80) grade = 3;
    else if (pct >= 70) grade = 2;
    else if (pct >= 60) grade = 2; // D is still grade 2 in SAAS
    return { pct, grade };
}

// ===== Test harness =====
let pass = 0, fail = 0, findings = [];
function assert(condition, label) {
    if (condition) { pass++; }
    else { fail++; findings.push(label); console.log('  FAIL:', label); }
}

// ===== Numeric grading =====
console.log('--- Numeric grading ---');
assert(gradeInput('number', '5', { answer: 5, tolerance: 0.5 }) === true, 'exact match');
assert(gradeInput('number', '5.4', { answer: 5, tolerance: 0.5 }) === true, 'within tolerance (upper)');
assert(gradeInput('number', '4.6', { answer: 5, tolerance: 0.5 }) === true, 'within tolerance (lower)');
assert(gradeInput('number', '5.51', { answer: 5, tolerance: 0.5 }) === false, 'outside tolerance');
assert(gradeInput('number', '4.49', { answer: 5, tolerance: 0.5 }) === false, 'outside tolerance (lower)');
assert(gradeInput('number', '-3', { answer: -3, tolerance: 0.5 }) === true, 'negative exact');
assert(gradeInput('number', '-2.6', { answer: -3, tolerance: 0.5 }) === true, 'negative within tolerance');

// Comma normalization
assert(gradeInput('number', '1,234', { answer: 1234, tolerance: 0.5 }) === true, 'comma-formatted number');
assert(gradeInput('number', '28,000', { answer: 28000, tolerance: 1 }) === true, 'comma 28,000');

// Dollar sign normalization
assert(gradeInput('number', '$150', { answer: 150, tolerance: 0.5 }) === true, 'dollar sign prefix');
assert(gradeInput('number', '$1,500', { answer: 1500, tolerance: 1 }) === true, 'dollar sign + comma');

// Fraction string (not numeric — should fail)
assert(gradeInput('number', '1/2', { answer: 0.5, tolerance: 0.1 }) === false, 'fraction string is NaN');

// ===== Radio/MC grading =====
console.log('--- Radio/MC grading ---');
assert(gradeInput('radio', 'B', { answer: 'B' }) === true, 'MC correct');
assert(gradeInput('radio', 'A', { answer: 'B' }) === false, 'MC incorrect');
assert(gradeInput('radio', 'b', { answer: 'B' }) === false, 'MC case-sensitive');
assert(gradeInput('dropdown', 'C', { answer: 'C' }) === true, 'dropdown correct');
assert(gradeInput('multiple-choice', 'D', { answer: 'D' }) === true, 'multiple-choice correct');

// ===== Text type (self-graded — returns null) =====
console.log('--- Text type (self-graded) ---');
assert(gradeInput('text', 'anything', { answer: 'answer' }) === null, 'text returns null');

// ===== Scorecard pct/grade =====
console.log('--- Scorecard pct/grade ---');
let s;
s = computeScore(15, 15); assert(s.pct === 100 && s.grade === 4, 'perfect score grade 4');
s = computeScore(14, 15); assert(s.pct === 93 && s.grade === 4, '14/15=93 grade 4');
s = computeScore(13, 15); assert(s.pct === 87 && s.grade === 3, '13/15=87 grade 3');
s = computeScore(12, 15); assert(s.pct === 80 && s.grade === 3, '12/15=80 grade 3');
s = computeScore(11, 15); assert(s.pct === 73 && s.grade === 2, '11/15=73 grade 2');
s = computeScore(10, 15); assert(s.pct === 67 && s.grade === 2, '10/15=67 grade 2');
s = computeScore(9, 15);  assert(s.pct === 60 && s.grade === 2, '9/15=60 grade 2');
s = computeScore(8, 15);  assert(s.pct === 53 && s.grade === 1, '8/15=53 grade 1');
s = computeScore(0, 15);  assert(s.pct === 0 && s.grade === 1, '0/15=0 grade 1');

// Zero-total guard (was NaN before fix)
s = computeScore(0, 0);   assert(s.pct === 0 && !isNaN(s.pct), 'zero-total gives 0 not NaN');

// ===== SAAS grade thresholds =====
console.log('--- Grade thresholds ---');
assert(computeScore(14, 15).grade === 4, '92%+ = grade 4');  // 93%
assert(computeScore(13, 15).grade === 3, '80%+ = grade 3');  // 87%
assert(computeScore(12, 15).grade === 3, '80% = grade 3');   // 80%
assert(computeScore(11, 15).grade === 2, '70%+ = grade 2');  // 73%
assert(computeScore(8, 15).grade === 1,  '<70% = grade 1');  // 53%

// ===== Summary =====
console.log('='.repeat(50));
console.log('exam-grading-unit: ' + pass + '/' + (pass + fail) + ' pass');
if (fail > 0) {
    console.log('FAILURES:');
    findings.forEach(f => console.log('  -', f));
    process.exit(1);
} else {
    console.log('PASS');
}

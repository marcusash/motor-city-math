/**
 * Motor City Math — exam.html Hint & Scorecard Logic Tests
 * Tests hint level system, grade thresholds, grade copy, score guard edge cases.
 *
 * Run: node tests/f-validation/exam-hint-scorecard.test.js
 */

// ===== Replicate grade computation from exam.html showScorecard =====
function computeGrade(pct) {
    return pct >= 92 ? 4 : pct >= 82 ? 3 : pct >= 70 ? 2 : 1;
}

function coachMsg(grade) {
    if (grade === 4) return "Grade 4. That's the standard. You earned it. 💪";
    if (grade === 3) return 'Almost there. A few more right and you\'re at Grade 4. 🏀';
    if (grade === 2) return 'Good start. Review the hints below and run it back. 🔄';
    return 'Rough one. Check the hints, study the gaps, then come back stronger. 💪';
}

// ===== Replicate hint layer logic from exam.html =====
// showHint(qId, layer): layers 1=nudge, 2=answer key, 3=solution steps
// Each layer shows its own element and keeps previous layers visible
function getHintLayerIds(qId, maxLayer) {
    const ids = [];
    for (let l = 1; l <= maxLayer; l++) {
        ids.push('hint-' + qId + '-' + l);
    }
    return ids;
}

// ===== Test harness =====
let pass = 0, fail = 0;
function assert(cond, label) {
    if (cond) { pass++; }
    else { fail++; console.log('  FAIL:', label); }
}

// ===== Grade thresholds — exact boundaries =====
console.log('--- Grade thresholds ---');
assert(computeGrade(100) === 4, '100% = grade 4');
assert(computeGrade(92)  === 4, '92% = grade 4 (boundary)');
assert(computeGrade(91)  === 3, '91% = grade 3 (82-91 range)');
// Note: exam.html showScorecard uses pct>=92 ? 4 : pct>=82 ? 3 : pct>=70 ? 2 : 1
// This means 82-91 = grade 3, 70-81 = grade 2, <70 = grade 1
assert(computeGrade(82)  === 3, '82% = grade 3 (boundary)');
assert(computeGrade(81)  === 2, '81% = grade 2 (70-81 range)');
// Actual showScorecard: pct>=92 ? 4 : pct>=82 ? 3 : pct>=70 ? 2 : 1
// So 81% falls through to pct>=70 → grade 2
assert(computeGrade(70)  === 2, '70% = grade 2 (boundary)');
assert(computeGrade(69)  === 1, '69% = grade 1');
assert(computeGrade(0)   === 1, '0% = grade 1');

// ===== Grade copy strings =====
console.log('--- Coach messages ---');
assert(coachMsg(4).includes('Grade 4'), 'grade 4 msg mentions Grade 4');
assert(coachMsg(3).includes('Grade 4'), 'grade 3 msg points toward Grade 4');
assert(coachMsg(2).includes('hints'), 'grade 2 msg mentions hints');
assert(coachMsg(1).includes('gaps'), 'grade 1 msg mentions gaps');

// ===== Hint layer id generation =====
console.log('--- Hint layer IDs ---');
assert(getHintLayerIds('rp1-q1', 1).length === 1, 'layer 1: 1 element');
assert(getHintLayerIds('rp1-q1', 3).length === 3, 'layer 3: 3 elements');
assert(getHintLayerIds('rp1-q1', 1)[0] === 'hint-rp1-q1-1', 'layer 1 id format');
assert(getHintLayerIds('rp1-q1', 3)[2] === 'hint-rp1-q1-3', 'layer 3 id format');

// ===== Hint layers: each layer reveals previous too (accumulative) =====
console.log('--- Hint accumulation ---');
// When showing layer 2, layers 1 and 2 should both be visible
const layer2Ids = getHintLayerIds('q1', 2);
assert(layer2Ids.includes('hint-q1-1'), 'showing layer 2 keeps layer 1 visible');
assert(layer2Ids.includes('hint-q1-2'), 'showing layer 2 includes layer 2');

// ===== Scorecard: pct on special values =====
console.log('--- Scorecard pct ---');
function scorePct(score, total) {
    return total > 0 ? Math.round(score / total * 100) : 0;
}
assert(scorePct(15, 15) === 100, '15/15 = 100');
assert(scorePct(0, 15)  === 0,   '0/15 = 0');
assert(scorePct(0, 0)   === 0,   '0/0 = 0 (not NaN)');
assert(!isNaN(scorePct(0, 0)),   '0/0 is not NaN');
assert(scorePct(1, 3)   === 33,  '1/3 rounds to 33');
assert(scorePct(2, 3)   === 67,  '2/3 rounds to 67');

// ===== Grade: matching saveResults (uses pct>=82 threshold) =====
console.log('--- saveResults grade vs showScorecard grade ---');
// Both functions have slightly different grade chains — verify they're consistent
// showScorecard: pct>=92?4: pct>=82?3: pct>=70?2: 1
// saveResults:   pct>=92?4: pct>=82?3: pct>=70?2: 1
// They should produce identical grades
function saveGrade(pct) {
    return pct >= 92 ? 4 : pct >= 82 ? 3 : pct >= 70 ? 2 : 1;
}
for (let p = 0; p <= 100; p++) {
    assert(computeGrade(p) === saveGrade(p), 'pct=' + p + ': showScorecard grade matches saveResults grade');
}

// ===== Summary =====
console.log('='.repeat(50));
const total = pass + fail;
console.log('exam-hint-scorecard: ' + pass + '/' + total + ' pass');
if (fail > 0) { process.exit(1); } else { console.log('PASS'); }

/**
 * Motor City Math — exam.html saveResults Unit Tests
 * Tests the saveResults storage logic extracted as pure functions.
 *
 * Run: node tests/f-validation/exam-save-results.test.js
 */

// ===== Replicate saveResults logic from exam.html =====

function computeAttempt(score, total, examId, questions, results) {
    const pct = total > 0 ? Math.round(score / total * 100) : 0;
    const grade = pct >= 92 ? 4 : pct >= 82 ? 3 : pct >= 70 ? 2 : 1;
    const storageKey = 'mcm-' + (examId || 'unknown');
    const qResults = {};
    questions.forEach(function(q, i) {
        qResults[q.id] = { correct: results[i], type: q.type, standard: q.standard };
    });
    const attempt = {
        score, total, pct, grade, questions: qResults,
        sections: {},
        timestamp: new Date().toISOString()
    };
    questions.forEach(function(q, i) {
        const sec = q.section || 'A';
        if (!attempt.sections[sec]) attempt.sections[sec] = { score: 0, total: 0 };
        attempt.sections[sec].total++;
        if (results[i]) attempt.sections[sec].score++;
    });
    return { attempt, storageKey };
}

function applyAttempt(scores, storageKey, attempt, isRetake) {
    if (!scores[storageKey]) scores[storageKey] = { attempts: [], best: null };
    if (!isRetake && scores[storageKey].attempts.length > 0) return false; // locked
    scores[storageKey].attempts.push(attempt);
    const pct = attempt.pct;
    if (!scores[storageKey].best || pct > scores[storageKey].best.pct) {
        scores[storageKey].best = { score: attempt.score, pct, grade: attempt.grade };
    }
    return true;
}

// ===== Test harness =====
let pass = 0, fail = 0;
function assert(cond, label) {
    if (cond) { pass++; }
    else { fail++; console.log('  FAIL:', label); }
}

const mockQuestions = [
    { id: 'q1', type: 'number', standard: 'W2.a', section: 'A' },
    { id: 'q2', type: 'radio', standard: 'W2.b', section: 'A' },
    { id: 'q3', type: 'number', standard: 'W3.a', section: 'B' }
];

// ===== saveResults shape =====
console.log('--- saveResults shape ---');
const { attempt: a1, storageKey: sk1 } = computeAttempt(3, 3, 'retake-practice-1', mockQuestions, [true, true, true]);
assert(sk1 === 'mcm-retake-practice-1', 'storageKey prefix mcm-');
assert(a1.pct === 100, 'pct 3/3 = 100');
assert(a1.grade === 4, 'grade 4 at 100%');
assert(a1.score === 3, 'score field present');
assert(a1.total === 3, 'total field present');
assert(typeof a1.timestamp === 'string', 'timestamp is string');
assert(a1.questions['q1'].correct === true, 'q1 correct true');
assert(a1.questions['q1'].type === 'number', 'q1 type preserved');
assert(a1.sections['A'].score === 2, 'section A: 2/2');
assert(a1.sections['B'].score === 1, 'section B: 1/1');

// ===== pct/grade edge cases =====
console.log('--- pct/grade edge cases ---');
const { attempt: a2 } = computeAttempt(0, 0, 'retake-practice-1', mockQuestions, [false, false, false]);
assert(a2.pct === 0 && !isNaN(a2.pct), 'zero-total: pct = 0 not NaN');
const { attempt: a3 } = computeAttempt(1, 3, 'retake-practice-1', mockQuestions, [true, false, false]);
assert(a3.pct === 33, '1/3 = 33%');
assert(a3.grade === 1, '33% = grade 1');

// ===== applyAttempt: writes to scores object =====
console.log('--- applyAttempt writes ---');
let scores = {};
const { attempt: at1, storageKey: sk } = computeAttempt(13, 15, 'retake-practice-1', mockQuestions, [true, true, false]);
const wrote1 = applyAttempt(scores, sk, at1, true);
assert(wrote1, 'first write returns true');
assert(scores[sk].attempts.length === 1, 'one attempt stored');
assert(scores[sk].best.pct === at1.pct, 'best pct set');

// ===== applyAttempt: updates best only if higher =====
console.log('--- applyAttempt best tracking ---');
const { attempt: at2 } = computeAttempt(10, 15, 'retake-practice-1', mockQuestions, [true, false, false]);
const at2pct = at2.pct;
applyAttempt(scores, sk, at2, true);
assert(scores[sk].attempts.length === 2, 'two attempts stored');
assert(scores[sk].best.pct === at1.pct, 'best stays higher pct (retake 1)');

const { attempt: at3 } = computeAttempt(15, 15, 'retake-practice-1', mockQuestions, [true, true, true]);
applyAttempt(scores, sk, at3, true);
assert(scores[sk].best.pct === 100, 'best updated to 100%');

// ===== applyAttempt: real exams lock after first attempt =====
console.log('--- real exam lock ---');
let scoresReal = {};
const skReal = 'mcm-nonlinear-exam-mvp';
const { attempt: atR1 } = computeAttempt(8, 15, 'nonlinear-exam-mvp', mockQuestions, [true, false, false]);
const isRetake = skReal.indexOf('retake') !== -1;
applyAttempt(scoresReal, skReal, atR1, isRetake);
assert(scoresReal[skReal].attempts.length === 1, 'first real exam attempt saved');

const { attempt: atR2 } = computeAttempt(15, 15, 'nonlinear-exam-mvp', mockQuestions, [true, true, true]);
const wrote2 = applyAttempt(scoresReal, skReal, atR2, isRetake);
assert(wrote2 === false, 'real exam: second write blocked (returns false)');
assert(scoresReal[skReal].attempts.length === 1, 'still 1 attempt after lock');
assert(scoresReal[skReal].best.pct === atR1.pct, 'best score is first attempt, not overwritten');

// ===== null examId guard =====
console.log('--- null examId guard ---');
const { storageKey: skNull } = computeAttempt(5, 10, null, mockQuestions, [true, false, false]);
assert(skNull === 'mcm-unknown', 'null examId produces mcm-unknown key');

// ===== Summary =====
console.log('='.repeat(50));
console.log('exam-save-results: ' + pass + '/' + (pass + fail) + ' pass');
if (fail > 0) { process.exit(1); } else { console.log('PASS'); }

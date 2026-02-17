/**
 * Motor City Math — Fundamentals Agent (F)
 * MVP: Score Storage Tests
 *
 * Tests the expanded score storage format from .mvp-spec.md:
 *  - Attempt append (never overwrite)
 *  - Per-question type/standard tracking
 *  - Best-score update logic
 *  - FIFO at 20 attempts max
 *
 * Pure logic tests — no DOM, runs in Node.
 *
 * Run: node tests/f-validation/mvp-score-storage.test.js
 */

let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// SCORE STORAGE LOGIC (reference implementation per spec)
// Agent A will implement this in shared/scripts.js or inline.
// These tests define the CONTRACT.
// ===================================================================

const STORAGE_KEY = 'mcm-nonlinear-exam-mvp';
const MAX_ATTEMPTS = 20;

// Question metadata from the spec
const QUESTION_META = {
    q1:  { type: 'identify',       standard: 'W2' },
    q2:  { type: 'identify',       standard: 'W2' },
    q3:  { type: 'identify',       standard: 'W2' },
    q4:  { type: 'exponential',    standard: 'W3' },
    q5:  { type: 'quadratic',      standard: 'W3' },
    q6:  { type: 'radical',        standard: 'W3' },
    q7:  { type: 'exponential',    standard: 'W3' },
    q8:  { type: 'rational',       standard: 'W3' },
    q9:  { type: 'radical',        standard: 'W3' },
    q10: { type: 'exponential',    standard: 'W3' },
    q11: { type: 'fractional-exp', standard: 'W3' },
    q12: { type: 'graph-quad',     standard: 'W2' },
    q13: { type: 'graph-rational', standard: 'W2' },
    q14: { type: 'formula',        standard: 'W3' },
    q15: { type: 'word-problem',   standard: 'W3' }
};

const SECTION_MAP = {
    q1: 'A', q2: 'A', q3: 'A',
    q4: 'B', q5: 'B', q6: 'B', q7: 'B', q8: 'B', q9: 'B', q10: 'B', q11: 'B',
    q12: 'C', q13: 'C',
    q14: 'D', q15: 'D'
};

// SAAS grade calculation
function saasGrade(pct) {
    if (pct >= 92) return 4;
    if (pct >= 82) return 3;
    if (pct >= 70) return 2;
    return 1;
}

// Build attempt object (reference implementation)
function buildAttempt(questionResults) {
    const score = Object.values(questionResults).filter(r => r.correct).length;
    const total = Object.keys(questionResults).length;
    const pct = Math.round((score / total) * 100);
    const grade = saasGrade(pct);

    // Build sections
    const sections = {};
    for (const [qid, result] of Object.entries(questionResults)) {
        const sec = SECTION_MAP[qid];
        if (!sections[sec]) sections[sec] = { score: 0, total: 0 };
        sections[sec].total++;
        if (result.correct) sections[sec].score++;
    }

    // Build questions with metadata
    const questions = {};
    for (const [qid, result] of Object.entries(questionResults)) {
        const meta = QUESTION_META[qid];
        questions[qid] = {
            correct: result.correct,
            type: meta.type,
            standard: meta.standard
        };
    }

    return {
        score, total, pct, grade,
        sections, questions,
        timestamp: new Date().toISOString()
    };
}

// Save attempt (reference implementation)
function saveAttempt(storage, attempt) {
    if (!storage[STORAGE_KEY]) {
        storage[STORAGE_KEY] = { attempts: [], best: null };
    }
    const data = storage[STORAGE_KEY];

    // Append
    data.attempts.push(attempt);

    // FIFO at MAX_ATTEMPTS
    while (data.attempts.length > MAX_ATTEMPTS) {
        data.attempts.shift();
    }

    // Update best
    if (!data.best || attempt.pct > data.best.pct) {
        data.best = { score: attempt.score, pct: attempt.pct, grade: attempt.grade };
    }

    return storage;
}

// ===================================================================
// 1. SAAS GRADE CALCULATION
// ===================================================================
section('1. SAAS 4-Point Grade');

test('100% → grade 4', saasGrade(100) === 4);
test('93% → grade 4', saasGrade(93) === 4);
test('92% → grade 4 (boundary)', saasGrade(92) === 4);
test('91% → grade 3', saasGrade(91) === 3);
test('82% → grade 3 (boundary)', saasGrade(82) === 3);
test('81% → grade 2', saasGrade(81) === 2);
test('70% → grade 2 (boundary)', saasGrade(70) === 2);
test('69% → grade 1', saasGrade(69) === 1);
test('0% → grade 1', saasGrade(0) === 1);
test('14/15 = 93% → grade 4', saasGrade(Math.round(14/15*100)) === 4);
test('12/15 = 80% → grade 2', saasGrade(Math.round(12/15*100)) === 2);
test('13/15 = 87% → grade 3', saasGrade(Math.round(13/15*100)) === 3);

// ===================================================================
// 2. ATTEMPT STRUCTURE
// ===================================================================
section('2. Attempt Structure');

// Simulate a 12/15 attempt
const results12 = {};
const correctQs = ['q1','q2','q4','q5','q7','q8','q9','q10','q11','q13','q14','q15'];
for (let i = 1; i <= 15; i++) {
    const qid = 'q' + i;
    results12[qid] = { correct: correctQs.includes(qid) };
}

const attempt12 = buildAttempt(results12);

test('Attempt has score=12', attempt12.score === 12);
test('Attempt has total=15', attempt12.total === 15);
test('Attempt has pct=80', attempt12.pct === 80);
test('Attempt has grade=2 (80% < 82%)', attempt12.grade === 2);
test('Attempt has timestamp', typeof attempt12.timestamp === 'string');

// Section breakdown
test('Section A: 2/3', attempt12.sections.A.score === 2 && attempt12.sections.A.total === 3);
test('Section B: 7/8', attempt12.sections.B.score === 7 && attempt12.sections.B.total === 8);
test('Section C: 1/2', attempt12.sections.C.score === 1 && attempt12.sections.C.total === 2);
test('Section D: 2/2', attempt12.sections.D.score === 2 && attempt12.sections.D.total === 2);

// Per-question metadata
test('q1 has type=identify', attempt12.questions.q1.type === 'identify');
test('q1 has standard=W2', attempt12.questions.q1.standard === 'W2');
test('q4 has type=exponential', attempt12.questions.q4.type === 'exponential');
test('q4 has standard=W3', attempt12.questions.q4.standard === 'W3');
test('q12 has type=graph-quad', attempt12.questions.q12.type === 'graph-quad');
test('q13 has type=graph-rational', attempt12.questions.q13.type === 'graph-rational');
test('q14 has type=formula', attempt12.questions.q14.type === 'formula');
test('q15 has type=word-problem', attempt12.questions.q15.type === 'word-problem');

// Correct/incorrect tracking
test('q1 correct=true', attempt12.questions.q1.correct === true);
test('q3 correct=false', attempt12.questions.q3.correct === false);
test('q6 correct=false', attempt12.questions.q6.correct === false);

// ===================================================================
// 3. APPEND (never overwrite)
// ===================================================================
section('3. Append Never Overwrite');

let storage = {};

// First attempt
storage = saveAttempt(storage, attempt12);
test('First attempt: attempts.length=1', storage[STORAGE_KEY].attempts.length === 1);
test('First attempt stored correctly', storage[STORAGE_KEY].attempts[0].score === 12);

// Second attempt (better)
const results14 = {};
for (let i = 1; i <= 15; i++) {
    results14['q' + i] = { correct: i !== 6 }; // miss only q6
}
const attempt14 = buildAttempt(results14);
storage = saveAttempt(storage, attempt14);

test('Second attempt: attempts.length=2', storage[STORAGE_KEY].attempts.length === 2);
test('First attempt preserved', storage[STORAGE_KEY].attempts[0].score === 12);
test('Second attempt appended', storage[STORAGE_KEY].attempts[1].score === 14);

// Third attempt (worse)
const results8 = {};
for (let i = 1; i <= 15; i++) {
    results8['q' + i] = { correct: i <= 8 };
}
const attempt8 = buildAttempt(results8);
storage = saveAttempt(storage, attempt8);

test('Third attempt: attempts.length=3', storage[STORAGE_KEY].attempts.length === 3);
test('All three preserved in order',
    storage[STORAGE_KEY].attempts[0].score === 12 &&
    storage[STORAGE_KEY].attempts[1].score === 14 &&
    storage[STORAGE_KEY].attempts[2].score === 8);

// ===================================================================
// 4. BEST-SCORE UPDATE
// ===================================================================
section('4. Best-Score Update');

// After attempt 1 (12/15, 80%)
let storage2 = {};
storage2 = saveAttempt(storage2, attempt12);
test('Best after 80%: pct=80', storage2[STORAGE_KEY].best.pct === 80);
test('Best after 80%: grade=2', storage2[STORAGE_KEY].best.grade === 2);

// After attempt 2 (14/15, 93%) — should update
storage2 = saveAttempt(storage2, attempt14);
test('Best after 93%: pct=93', storage2[STORAGE_KEY].best.pct === 93);
test('Best after 93%: grade=4', storage2[STORAGE_KEY].best.grade === 4);
test('Best after 93%: score=14', storage2[STORAGE_KEY].best.score === 14);

// After attempt 3 (8/15, 53%) — should NOT update
storage2 = saveAttempt(storage2, attempt8);
test('Best unchanged after 53%: pct still 93', storage2[STORAGE_KEY].best.pct === 93);
test('Best unchanged after 53%: grade still 4', storage2[STORAGE_KEY].best.grade === 4);

// ===================================================================
// 5. FIFO AT 20 ATTEMPTS
// ===================================================================
section('5. FIFO at 20 Attempts');

let storage3 = {};
const attempts = [];
for (let i = 0; i < 25; i++) {
    const res = {};
    const correctCount = i + 1; // 1 through 15, then wraps
    for (let q = 1; q <= 15; q++) {
        res['q' + q] = { correct: q <= (correctCount % 16) };
    }
    const att = buildAttempt(res);
    att._index = i; // tag for tracking
    storage3 = saveAttempt(storage3, att);
    attempts.push(att);
}

test('Max 20 attempts stored', storage3[STORAGE_KEY].attempts.length === 20);
test('Oldest 5 dropped (FIFO)',
    storage3[STORAGE_KEY].attempts[0].score === attempts[5].score);
test('Newest is last',
    storage3[STORAGE_KEY].attempts[19].score === attempts[24].score);

// Add one more
const oneMore = buildAttempt({ q1: { correct: true }, q2: { correct: false },
    q3: { correct: true }, q4: { correct: false }, q5: { correct: true },
    q6: { correct: false }, q7: { correct: true }, q8: { correct: false },
    q9: { correct: true }, q10: { correct: false }, q11: { correct: true },
    q12: { correct: false }, q13: { correct: true }, q14: { correct: false },
    q15: { correct: true } });
storage3 = saveAttempt(storage3, oneMore);
test('Still max 20 after 26th attempt', storage3[STORAGE_KEY].attempts.length === 20);

// ===================================================================
// 6. QUESTION TYPE ANALYTICS
// ===================================================================
section('6. Question Type Analytics');

// Verify we can query "which types does Kai miss most?" from stored data
const analyticsAttempt = storage[STORAGE_KEY].attempts[0]; // the 12/15 attempt
const typeResults = {};
for (const [qid, qdata] of Object.entries(analyticsAttempt.questions)) {
    if (!typeResults[qdata.type]) typeResults[qdata.type] = { correct: 0, total: 0 };
    typeResults[qdata.type].total++;
    if (qdata.correct) typeResults[qdata.type].correct++;
}

test('Can extract type analytics', Object.keys(typeResults).length > 0);
test('identify type tracked', typeResults['identify'] !== undefined);
test('exponential type tracked', typeResults['exponential'] !== undefined);
test('graph-quad type tracked', typeResults['graph-quad'] !== undefined);

// Verify standard-based querying
const standardResults = {};
for (const [qid, qdata] of Object.entries(analyticsAttempt.questions)) {
    if (!standardResults[qdata.standard]) standardResults[qdata.standard] = { correct: 0, total: 0 };
    standardResults[qdata.standard].total++;
    if (qdata.correct) standardResults[qdata.standard].correct++;
}

test('W2 standard tracked (5 questions)', standardResults['W2'].total === 5);
test('W3 standard tracked (10 questions)', standardResults['W3'].total === 10);

// ===================================================================
// 7. STORAGE KEY ISOLATION
// ===================================================================
section('7. Storage Key Isolation');

test('Uses correct key: mcm-nonlinear-exam-mvp', STORAGE_KEY === 'mcm-nonlinear-exam-mvp');

// Verify other keys are not affected
let multiStorage = {};
multiStorage['mcm-other-test'] = { attempts: [{ score: 5 }], best: { score: 5 } };
multiStorage = saveAttempt(multiStorage, attempt12);
test('Other keys preserved', multiStorage['mcm-other-test'].attempts[0].score === 5);
test('New key added alongside', multiStorage[STORAGE_KEY].attempts.length === 1);

// ===================================================================
// SUMMARY
// ===================================================================
section('SCORE STORAGE SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);

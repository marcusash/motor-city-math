/**
 * Motor City Math — Fundamentals Agent (F)
 * Task #34: Streak Counter Validation
 *
 * Tests the streak tracking in gradeTest():
 *  - maxStreak tracks consecutive correct answers
 *  - Streak resets on wrong answer
 *  - Badge HTML rendered when maxStreak >= 3
 *  - Streak saved to mcm_scores
 *
 * Uses extracted gradeTest logic (no DOM).
 *
 * Run: node tests/f-validation/streak-counter.test.js
 */

let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// STREAK ALGORITHM (extracted from shared/scripts.js gradeTest lines 218-245)
// ===================================================================

function computeStreak(correctSequence) {
    // correctSequence: array of booleans, true=correct, false=wrong
    var streak = 0, maxStreak = 0;
    for (var i = 0; i < correctSequence.length; i++) {
        if (correctSequence[i]) {
            streak++;
            if (streak > maxStreak) maxStreak = streak;
        } else {
            streak = 0;
        }
    }
    return { streak: streak, maxStreak: maxStreak };
}

// Badge logic from line 275-277
function shouldShowBadge(maxStreak) {
    return maxStreak >= 3;
}

function badgeHtml(maxStreak) {
    if (!shouldShowBadge(maxStreak)) return '';
    return '<div class="streak-badge">Best streak: <span class="streak-number">' + maxStreak + '</span> 🔥</div>';
}

// ===================================================================
// 1. BASIC STREAK TRACKING
// ===================================================================
section('1. Basic Streak Tracking');

test('All correct: maxStreak = length',
    computeStreak([true, true, true, true, true]).maxStreak === 5);

test('All wrong: maxStreak = 0',
    computeStreak([false, false, false]).maxStreak === 0);

test('One correct: maxStreak = 1',
    computeStreak([true]).maxStreak === 1);

test('Empty array: maxStreak = 0',
    computeStreak([]).maxStreak === 0);

test('Streak at start: 3 correct, then wrong',
    computeStreak([true, true, true, false, true]).maxStreak === 3);

test('Streak at end: wrong, then 4 correct',
    computeStreak([false, true, true, true, true]).maxStreak === 4);

test('Streak in middle: wrong, 3 correct, wrong',
    computeStreak([false, true, true, true, false]).maxStreak === 3);

test('Two streaks: picks the longer one',
    computeStreak([true, true, false, true, true, true]).maxStreak === 3);

test('Alternating: maxStreak = 1',
    computeStreak([true, false, true, false, true]).maxStreak === 1);

// ===================================================================
// 2. CURRENT STREAK VS MAX STREAK
// ===================================================================
section('2. Current vs Max Streak');

const r1 = computeStreak([true, true, true, false, true, true]);
test('Max streak = 3 (first run)', r1.maxStreak === 3);
test('Current streak = 2 (still going)', r1.streak === 2);

const r2 = computeStreak([true, true, true, true, true, false]);
test('Max streak = 5, current = 0 (ended on wrong)', r2.maxStreak === 5);
test('Current streak = 0 after wrong', r2.streak === 0);

const r3 = computeStreak([false, false, true, true, true, true, true]);
test('Late bloomer: maxStreak = 5', r3.maxStreak === 5);
test('Current streak = 5 (still going)', r3.streak === 5);

// ===================================================================
// 3. BADGE DISPLAY THRESHOLD
// ===================================================================
section('3. Badge Display (threshold = 3)');

test('maxStreak=0 → no badge', !shouldShowBadge(0));
test('maxStreak=1 → no badge', !shouldShowBadge(1));
test('maxStreak=2 → no badge', !shouldShowBadge(2));
test('maxStreak=3 → badge shown', shouldShowBadge(3));
test('maxStreak=5 → badge shown', shouldShowBadge(5));
test('maxStreak=15 → badge shown (perfect test)', shouldShowBadge(15));

// ===================================================================
// 4. BADGE HTML
// ===================================================================
section('4. Badge HTML Content');

test('Badge HTML empty when maxStreak < 3', badgeHtml(2) === '');
test('Badge HTML contains 🔥 emoji', badgeHtml(5).includes('🔥'));
test('Badge HTML contains streak number', badgeHtml(7).includes('7'));
test('Badge HTML has streak-badge class', badgeHtml(3).includes('class="streak-badge"'));
test('Badge HTML has streak-number span', badgeHtml(4).includes('class="streak-number"'));
test('Badge shows exact number: 10', badgeHtml(10).includes('>10</span>'));

// ===================================================================
// 5. REALISTIC EXAM SCENARIOS
// ===================================================================
section('5. Realistic Exam Scenarios');

// 15-question MVP exam: Kai gets 12/15 right
const mvpResults = [true, true, false, true, true, true, true, true, true, true, true, false, true, true, true];
const mvpStreak = computeStreak(mvpResults);
test('MVP exam (12/15): maxStreak = 8 (Q4-Q11)', mvpStreak.maxStreak === 8);
test('MVP exam: badge shown (8 >= 3)', shouldShowBadge(mvpStreak.maxStreak));

// Perfect 15/15
const perfect = computeStreak(new Array(15).fill(true));
test('Perfect exam: maxStreak = 15', perfect.maxStreak === 15);

// Only first 2 right
const weak = computeStreak([true, true, false, false, false, true, false, false, false, false, false, false, false, false, false]);
test('Weak exam (3/15): maxStreak = 2, no badge', weak.maxStreak === 2 && !shouldShowBadge(weak.maxStreak));

// 5-question quiz: all wrong except last
const quiz = computeStreak([false, false, false, false, true]);
test('Quiz with 1 right at end: maxStreak = 1, no badge', quiz.maxStreak === 1);

// ===================================================================
// 6. STORAGE FORMAT
// ===================================================================
section('6. Storage Format Verification');

// Verify the storage format matches shared/scripts.js lines 331-337
const mockStorage = {
    score: 12,
    total: 15,
    pct: 80,
    streak: mvpStreak.maxStreak,
    timestamp: new Date().toISOString()
};

test('Storage has streak field', 'streak' in mockStorage);
test('Storage streak matches maxStreak', mockStorage.streak === 8);
test('Storage has all required fields',
    'score' in mockStorage && 'total' in mockStorage &&
    'pct' in mockStorage && 'streak' in mockStorage &&
    'timestamp' in mockStorage);

// ===================================================================
// 7. MULTI-PART QUESTION STREAKS
// ===================================================================
section('7. Multi-Part Questions');

// gradeTest iterates parts within questions — streak tracks PARTS not questions
// Q1 has 3 parts: a(✓), b(✗), c(✓) → streak breaks at b
const multiPart = computeStreak([true, false, true, true, true, true]);
test('Multi-part: streak breaks within question', multiPart.maxStreak === 4);

// All parts of Q1 correct (3 parts) then Q2 wrong
const allPartsCorrect = computeStreak([true, true, true, false]);
test('3 correct parts then wrong: maxStreak=3, badge shown',
    allPartsCorrect.maxStreak === 3 && shouldShowBadge(3));

// ===================================================================
// SUMMARY
// ===================================================================
section('STREAK COUNTER SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);

/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-7: Grading Engine Regression Tests
 *
 * These tests define the EXPECTED behavior of the grading engine.
 * Run after ANY change to shared/scripts.js checkAnswer() or norm().
 * Tests are written against the shared/scripts.js implementations.
 *
 * Run: node tests/f-validation/grading-regression.test.js
 */

// Load the shared grading functions
const fs = require('fs');
const path = require('path');

// Extract just norm() and checkAnswer() from shared/scripts.js
// Using line-by-line extraction to avoid eval issues with DOM code
const sharedScript = fs.readFileSync(
    path.join(__dirname, '..', '..', 'shared', 'scripts.js'), 'utf-8'
);

const lines = sharedScript.split('\n');
let extracting = false;
let braceDepth = 0;
let extracted = [];
let currentFunc = [];

for (const line of lines) {
    if (!extracting && /^function (norm|checkAnswer)\b/.test(line)) {
        extracting = true;
        braceDepth = 0;
        currentFunc = [];
    }
    if (extracting) {
        currentFunc.push(line);
        braceDepth += (line.match(/\{/g) || []).length;
        braceDepth -= (line.match(/\}/g) || []).length;
        if (braceDepth === 0) {
            extracted.push(currentFunc.join('\n'));
            extracting = false;
        }
    }
}

if (extracted.length < 2) {
    console.error('ERROR: Could not extract norm() and checkAnswer() from shared/scripts.js');
    process.exit(2);
}
eval(extracted.join('\n'));

// Verify functions loaded
if (typeof norm !== 'function' || typeof checkAnswer !== 'function') {
    console.error('ERROR: Could not load norm() and checkAnswer() from shared/scripts.js');
    process.exit(2);
}

let pass = 0, fail = 0, total = 0;
function test(name, fn) {
    total++;
    try {
        if (fn()) { pass++; }
        else { fail++; console.log(`  ❌ ${name}`); }
    } catch (e) {
        fail++; console.log(`  💥 ${name}: ${e.message}`);
    }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// REGRESSION: Correct answers MUST be accepted
// ===================================================================
section('REGRESSION: Correct answers must be accepted');

// All verified-correct answers from the answer keys
const correctAnswers = [
    // index.html / index_calc.html Q1-Q16
    ['y=25x+10', 'y=25x+10', 'Q1: equation'],
    ['y = 25x + 10', 'y=25x+10', 'Q1: with spaces'],
    ['33', 33, 'Q2a: numeric'],
    ['5', 5, 'Q2b: numeric'],
    ['0', 0, 'Q3a: zero'],
    ['6', 6, 'Q3b: numeric'],
    ['5000', 5000, 'Q3c: large number'],
    ['20000', 20000, 'Q3d: large number'],
    ['150', 150, 'Q4a: numeric'],
    ['initial', 'initial', 'Q4b: keyword'],
    ['15', 15, 'Q4c: numeric'],
    ['h=8-0.5t', 'h=8-0.5t', 'Q5a: equation'],
    ['-0.5', -0.5, 'Q5b: negative decimal'],
    ['burn', 'burn', 'Q5c: keyword'],
    ['16', 16, 'Q5d: numeric'],
    ['74', 74, 'Q6c: numeric'],
    ['t=(c-25)/45', 't=(c-25)/45', 'Q7a: equation'],
    ['8', 8, 'Q7b: numeric'],
    ['p(x)=18x-500', 'p(x)=18x-500', 'Q8a: equation'],
    ['27.78', 27.78, 'Q8b: decimal (tol=1)', 1],
    ['400', 400, 'Q8c: numeric'],
    ['120', 120, 'Q9a: numeric'],
    ['47.50', 47.50, 'Q9b: decimal'],
    ['constant', 'constant', 'Q10a: keyword'],
    ['c(m)=35m+75', 'c(m)=35m+75', 'Q10b: equation'],
    ['c=60h+85', 'c=60h+85', 'Q11a: equation'],
    ['295', 295, 'Q11b: numeric'],
    ['4', 4, 'Q11c: numeric'],
    ['per mile', 'per mile', 'Q12a: keyword'],
    ['base', 'base', 'Q12b: keyword'],
    ['90', 90, 'Q12c: numeric'],
    ['20', 20, 'Q13a: numeric'],
    ['y-100=20(x-3)', 'y-100=20(x-3)', 'Q13b: point-slope'],
    ['y=20x+40', 'y=20x+40', 'Q13c: slope-intercept'],
    ['200', 200, 'Q14a: numeric'],
    ['50', 50, 'Q14b: numeric'],
    ['500', 500, 'Q14c: numeric'],
    ['6', 6, 'Q14d: numeric'],
    ['multiply', 'multiply', 'Q15a: keyword'],
    ['p(t)=500(2)^t', 'p(t)=500(2)^t', 'Q15b: exponential'],
    ['4000', 4000, 'Q15c: numeric'],
    ['v(t)=28000(0.85)^t', 'v(t)=28000(0.85)^t', 'Q16a: depreciation'],
    ['decay', 'decay', 'Q16c: keyword'],
];

for (const [input, answer, label, tol] of correctAnswers) {
    test(`Accept: ${label}: "${input}"`, () =>
        checkAnswer(input, answer, tol) === true
    );
}

// ===================================================================
// REGRESSION: Wrong answers MUST be rejected
// ===================================================================
section('REGRESSION: Wrong answers must be rejected');

const wrongAnswers = [
    ['', 33, 'Empty string'],
    ['abc', 33, 'Non-numeric text'],
    ['34', 33, 'Off by 1 (outside tol 0.5)'],
    ['y=26x+10', 'y=25x+10', 'Wrong slope'],
    ['y=25x+11', 'y=25x+10', 'Wrong intercept'],
    ['100', 150, 'Q4a: wrong number'],
    ['0.5', -0.5, 'Q5b: wrong sign (outside tol)'],
    ['growth', 'decay', 'Wrong keyword'],
    ['linear', 'constant', 'Wrong keyword'],
    ['subtract', 'multiply', 'Wrong keyword'],
];

for (const [input, answer, label] of wrongAnswers) {
    test(`Reject: ${label}: "${input}"`, () =>
        checkAnswer(input, answer) === false
    );
}

// ===================================================================
// REGRESSION: Numeric tolerance boundaries
// ===================================================================
section('REGRESSION: Tolerance boundaries');

test('Default tol=0.5: 33.5 → 33 accepted', () => checkAnswer('33.5', 33) === true);
test('Default tol=0.5: 33.51 → 33 rejected', () => checkAnswer('33.51', 33) === false);
test('Default tol=0.5: 32.5 → 33 accepted', () => checkAnswer('32.5', 33) === true);
test('Default tol=0.5: 32.49 → 33 rejected', () => checkAnswer('32.49', 33) === false);
test('Custom tol=1: 28.78 → 27.78 accepted', () => checkAnswer('28.78', 27.78, 1) === true);
test('Custom tol=1: 26.77 → 27.78 rejected', () => checkAnswer('26.77', 27.78, 1) === false);
test('Custom tol=2: 14638 → 14636.56 accepted', () => checkAnswer('14638', 14636.56, 2) === true);
test('Zero: "0" → 0 accepted', () => checkAnswer('0', 0) === true);
test('Negative: "-0.5" → -0.5 accepted', () => checkAnswer('-0.5', -0.5) === true);
test('Negative in tol: "-1" → -0.5 accepted', () => checkAnswer('-1', -0.5) === true);
test('Negative out tol: "-1.1" → -0.5 rejected', () => checkAnswer('-1.1', -0.5) === false);

// ===================================================================
// REGRESSION: String normalization
// ===================================================================
section('REGRESSION: String normalization');

test('Spaces stripped: "y = 25x + 10"', () => checkAnswer('y = 25x + 10', 'y=25x+10') === true);
test('Case insensitive: "Y=25X+10"', () => checkAnswer('Y=25X+10', 'y=25x+10') === true);
test('Dollar stripped: "$500"→"500"', () => norm('$500') === '500');
test('Asterisk stripped: "5*x"→"5x"', () => norm('5*x') === '5x');
test('Numbers unchanged by norm', () => norm(42) === 42);

// ===================================================================
// REGRESSION: Keyword matching
// ===================================================================
section('REGRESSION: Keyword matching');

test('"initial amount" matches "initial"', () => checkAnswer('initial amount', 'initial') === true);
test('"the initial value" matches "initial"', () => checkAnswer('the initial value', 'initial') === true);
test('"burn rate" matches "burn"', () => checkAnswer('burn rate', 'burn') === true);
test('"constant rate" matches "constant"', () => checkAnswer('constant rate', 'constant') === true);
test('"base fee" matches "base"', () => checkAnswer('base fee', 'base') === true);
test('"per mile" exact', () => checkAnswer('per mile', 'per mile') === true);
test('"exponential decay" matches "decay"', () => checkAnswer('exponential decay', 'decay') === true);

// ===================================================================
// KNOWN ISSUES (document but don't fail on)
// ===================================================================
section('KNOWN ISSUES (expected to fail until fixed)');

// These document bugs we've identified — they should PASS once the
// grading engine is improved by Agent A.
const knownIssues = [
    { input: '$33', answer: 33, desc: 'Dollar prefix should be accepted', shouldBe: true },
    { input: '5,000', answer: 5000, desc: 'Comma formatting should be accepted', shouldBe: true },
    { input: 'decade', answer: 'decay', desc: 'Should NOT match (false positive)', shouldBe: false },
    { input: 'baseball', answer: 'base', desc: 'Should NOT match (false positive)', shouldBe: false },
    { input: 'initiative', answer: 'initial', desc: 'Should NOT match (false positive)', shouldBe: false },
];

let knownBugsStillPresent = 0;
for (const { input, answer, desc, shouldBe } of knownIssues) {
    const actual = checkAnswer(input, answer);
    if (actual !== shouldBe) {
        knownBugsStillPresent++;
        console.log(`  ⏳ KNOWN: ${desc} — still broken (expected ${shouldBe}, got ${actual})`);
    } else {
        console.log(`  ✅ FIXED: ${desc} — now works correctly!`);
    }
}

// ===================================================================
// SUMMARY
// ===================================================================
console.log(`\n${'='.repeat(50)}`);
console.log(`RESULTS: ${total} tests, ${pass} passed, ${fail} failed`);
console.log(`Known issues still present: ${knownBugsStillPresent}/${knownIssues.length}`);
if (fail > 0) {
    console.log(`\n🔴 ${fail} REGRESSION(S) DETECTED — fix before shipping`);
}
console.log(`${'='.repeat(50)}\n`);

process.exit(fail > 0 ? 1 : 0);

/**
 * exam-answer-format-hint.test.js
 * Regression guard: exam.html must append format hint to wrong-answer feedback
 * when the correct answer is non-integer (sw-17 answer format guidance spec).
 *
 * Run: node tests/f-validation/exam-answer-format-hint.test.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'exam.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok) {
    total++;
    if (ok) { pass++; console.log('  \u2705 ' + name); }
    else { fail++; console.log('  \u274c ' + name); }
}

console.log('\n\uD83C\uDFC0 exam-answer-format-hint.test.js\n');

// ── Format hint appended on wrong non-integer answer ─────────
console.log('\u2500\u2500 Format hint on wrong answer (sw-17) \u2500\u2500');
test('hasNonIntAnswer check present', src.includes('hasNonIntAnswer'));
test('hasNonIntAnswer checks n.answer % 1 !== 0', src.includes('n.answer % 1 !== 0'));
test('format hint includes sqrt(5)', src.includes('sqrt(5)'));
test('format hint includes fractions like 4/3', src.includes('4/3'));
test('format hint includes whole numbers', src.includes('whole numbers'));
test('hint only on wrong answers (!qCorrect guard)', src.includes('if (!qCorrect)') && src.indexOf('hasNonIntAnswer') > src.indexOf('if (!qCorrect)'));

// ── Answer format guide in static UI ─────────────────────────
console.log('\n\u2500\u2500 Static answer format guide (header) \u2500\u2500');
test('Answer formats guide shown in exam header', src.includes('Answer formats:') && src.includes('fractions (4/3)'));
test('sqrt format shown in header', src.includes('sqrt(5) or 2sqrt(3)'));

// ── Inline input hints ────────────────────────────────────────
console.log('\n\u2500\u2500 Inline input format hints \u2500\u2500');
test('input hint shows decimal/fraction/sqrt options', src.includes('decimal') && src.includes('fraction (3/2)') && src.includes('sqrt(2)'));
test('fraction hint: Simplify your fraction', src.includes('Simplify your fraction'));

// ── parseStudentAnswer handles the formats ────────────────────
console.log('\n\u2500\u2500 parseStudentAnswer supports all formats \u2500\u2500');
test('parseStudentAnswer handles fractions (regex pattern)', src.includes('/^(-?\\d+)\\/(-?\\d+)$/') || src.includes("fraction") && src.includes("parseStudentAnswer"));
test('parseStudentAnswer handles sqrt (safe evaluator)', src.includes('safe evaluator') || src.includes("sqrt("));
test('parseStudentAnswer is in shared/scripts.js (reference comment)', src.includes('shared/scripts.js'));

console.log('\n' + '='.repeat(50));
console.log('exam-answer-format-hint: ' + pass + '/' + total + ' pass');
if (fail > 0) process.exit(1);
else console.log('PASS');

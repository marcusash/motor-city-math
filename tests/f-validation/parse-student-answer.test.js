/**
 * parse-student-answer.test.js
 * Unit tests for parseStudentAnswer() in shared/scripts.js.
 *
 * Validates: integers, decimals, fractions, sqrt expressions, edge cases.
 * Run: node tests/f-validation/parse-student-answer.test.js
 */

const fs = require('fs');
const path = require('path');

// Extract the parseStudentAnswer function definition as a string and eval it.
// The function is pure (no DOM, no globals) so this is safe.
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'shared', 'scripts.js'), 'utf-8');
// Match from function declaration to the closing brace at column 0
const fnMatch = src.match(/(function parseStudentAnswer\(raw\)[\s\S]+?\n\})/m);
if (!fnMatch) { console.log('❌ FATAL: parseStudentAnswer not found in shared/scripts.js'); process.exit(1); }
// eslint-disable-next-line no-eval
eval(fnMatch[1]);
// Now parseStudentAnswer is in scope

let total = 0, pass = 0, fail = 0;
function test(name, actual, expected) {
    total++;
    const eps = 1e-9;
    const ok = isNaN(expected) ? isNaN(actual) : Math.abs(actual - expected) < eps;
    if (ok) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name} — got ${actual}, expected ${expected}`); }
}

console.log('\n🏀 parse-student-answer.test.js\n');

// ── Integer inputs ──────────────────────────────────────────
console.log('── Integers ──');
test('positive integer: "4"', parseStudentAnswer('4'), 4);
test('negative integer: "-3"', parseStudentAnswer('-3'), -3);
test('zero: "0"', parseStudentAnswer('0'), 0);
test('large integer: "12345"', parseStudentAnswer('12345'), 12345);

// ── Decimal inputs ──────────────────────────────────────────
console.log('\n── Decimals ──');
test('decimal: "3.14"', parseStudentAnswer('3.14'), 3.14);
test('negative decimal: "-2.5"', parseStudentAnswer('-2.5'), -2.5);
test('leading dot: ".5"', parseStudentAnswer('.5'), 0.5); // parseFloat + sqrt eval both accept it
test('trailing dot: "3."', parseStudentAnswer('3.'), 3);   // sqrt char set eval: (3.) === 3

// ── Fraction inputs ──────────────────────────────────────────
console.log('\n── Fractions ──');
test('simple fraction: "3/4"', parseStudentAnswer('3/4'), 0.75);
test('improper fraction: "7/2"', parseStudentAnswer('7/2'), 3.5);
test('negative fraction: "-5/2"', parseStudentAnswer('-5/2'), -2.5);
test('fraction with negative denominator: "5/-2"', parseStudentAnswer('5/-2'), -2.5); // fraction regex matches negative denominator
test('zero denominator: "5/0"', parseStudentAnswer('5/0'), NaN);
test('integer via fraction: "8/4"', parseStudentAnswer('8/4'), 2);

// ── sqrt() expressions ──────────────────────────────────────
console.log('\n── sqrt() expressions ──');
test('sqrt(4): "sqrt(4)"', parseStudentAnswer('sqrt(4)'), 2);
test('sqrt(9): "sqrt(9)"', parseStudentAnswer('sqrt(9)'), 3);
test('1+sqrt(3): "1+sqrt(3)"', parseStudentAnswer('1+sqrt(3)'), 1 + Math.sqrt(3));
test('2*sqrt(2): "2*sqrt(2)"', parseStudentAnswer('2*sqrt(2)'), 2 * Math.sqrt(2));
test('implicit multiply: "2sqrt(3)"', parseStudentAnswer('2sqrt(3)'), 2 * Math.sqrt(3));
test('sqrt in expression: "sqrt(2)+sqrt(3)"', parseStudentAnswer('sqrt(2)+sqrt(3)'), Math.sqrt(2) + Math.sqrt(3));

// ── Edge cases ──────────────────────────────────────────────
console.log('\n── Edge cases ──');
test('empty string: ""', parseStudentAnswer(''), NaN);
test('null: null', parseStudentAnswer(null), NaN);
test('undefined: undefined', parseStudentAnswer(undefined), NaN);
test('whitespace only: "   "', parseStudentAnswer('   '), NaN);
test('leading/trailing whitespace: " 4 "', parseStudentAnswer(' 4 '), 4);
test('tabs: "\\t3\\t"', parseStudentAnswer('\t3\t'), 3);
test('word input: "four"', parseStudentAnswer('four'), NaN);
test('mixed: "4abc"', parseStudentAnswer('4abc'), NaN);
test('injection attempt: "1+1; alert(1)"', parseStudentAnswer('1+1; alert(1)'), NaN); // semicolons blocked
test('injection attempt: "eval(1)"', parseStudentAnswer('eval(1)'), NaN);

console.log(`\n${'='.repeat(50)}`);
console.log(`parse-student-answer: ${pass}/${total} pass`);
if (fail > 0) process.exit(1);
else console.log('PASS');

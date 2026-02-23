/**
 * evaluate-number-inputs.test.js
 * Unit tests for the evaluateNumberInputs() pure helper in exam.html.
 *
 * Tests: ordered evaluation, plus-minus swapped ordering, tolerance, NaN handling.
 * Run: node tests/f-validation/evaluate-number-inputs.test.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'exam.html'), 'utf-8');
// Extract the evaluateNumberInputs function
const fnMatch = src.match(/(function evaluateNumberInputs\(numberInputs, plusMinus\)[\s\S]+?\n    \})/m);
if (!fnMatch) {
    console.log('\u274c FATAL: evaluateNumberInputs not found in exam.html');
    process.exit(1);
}
// eslint-disable-next-line no-eval
eval(fnMatch[1]);

let total = 0, pass = 0, fail = 0;
function test(name, actual, expected) {
    total++;
    if (actual === expected) { pass++; console.log('  \u2705 ' + name); }
    else { fail++; console.log('  \u274c ' + name + ' -- got ' + actual + ', expected ' + expected); }
}

console.log('\n\uD83C\uDFC0 evaluate-number-inputs.test.js\n');

// ── Ordered (plusMinus=false) ────────────────────────────────
console.log('\u2500\u2500 Ordered evaluation \u2500\u2500');
test('all correct', evaluateNumberInputs([{val:3, answer:3, tolerance:0.01}], false), true);
test('one wrong', evaluateNumberInputs([{val:4, answer:3, tolerance:0.01}], false), false);
test('within tolerance', evaluateNumberInputs([{val:3.005, answer:3, tolerance:0.01}], false), true);
test('just outside tolerance', evaluateNumberInputs([{val:3.015, answer:3, tolerance:0.01}], false), false);
test('NaN input', evaluateNumberInputs([{val:NaN, answer:3, tolerance:0.01}], false), false);
test('two correct', evaluateNumberInputs([{val:2, answer:2, tolerance:0.01},{val:5, answer:5, tolerance:0.01}], false), true);
test('first wrong, second correct', evaluateNumberInputs([{val:1, answer:2, tolerance:0.01},{val:5, answer:5, tolerance:0.01}], false), false);
test('negative answer', evaluateNumberInputs([{val:-3, answer:-3, tolerance:0.01}], false), true);
test('zero answer', evaluateNumberInputs([{val:0, answer:0, tolerance:0.01}], false), true);
test('empty array', evaluateNumberInputs([], false), true); // all() on empty = true

// ── Plus-minus (plusMinus=true) ──────────────────────────────
console.log('\n\u2500\u2500 Plus-minus (either ordering) \u2500\u2500');
var pm1 = [{val:2, answer:2, tolerance:0.01}, {val:-2, answer:-2, tolerance:0.01}];
test('plus-minus: correct order', evaluateNumberInputs(pm1, true), true);
var pm2 = [{val:-2, answer:2, tolerance:0.01}, {val:2, answer:-2, tolerance:0.01}];
test('plus-minus: swapped order (accepted)', evaluateNumberInputs(pm2, true), true);
var pm3 = [{val:3, answer:2, tolerance:0.01}, {val:-2, answer:-2, tolerance:0.01}];
test('plus-minus: both orderings wrong', evaluateNumberInputs(pm3, true), false);
var pm4 = [{val:NaN, answer:2, tolerance:0.01}, {val:-2, answer:-2, tolerance:0.01}];
test('plus-minus: NaN in first slot', evaluateNumberInputs(pm4, true), false);
var pm5 = [{val:2.005, answer:2, tolerance:0.01}, {val:-2, answer:-2, tolerance:0.01}];
test('plus-minus: within tolerance', evaluateNumberInputs(pm5, true), true);
var pm6 = [{val:5, answer:5, tolerance:0.01}, {val:-5, answer:5, tolerance:0.01}];
test('plus-minus: one correct one wrong, no valid swap', evaluateNumberInputs(pm6, true), false);

console.log('\n' + '='.repeat(50));
console.log('evaluate-number-inputs: ' + pass + '/' + total + ' pass');
if (fail > 0) process.exit(1);
else console.log('PASS');

// evaluateNumberInputs() tolerance math regression
// Pure helper extracted from gradeExam(). Tests ordered and plus_minus paths.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} evaluate-number-inputs-tolerance.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract evaluateNumberInputs pure function
var fnMatch = src.match(/function evaluateNumberInputs\(numberInputs, plusMinus\)([\s\S]+?)^    function /m);
if (!fnMatch) { console.log('FAIL: evaluateNumberInputs not found'); process.exit(1); }

var fnBody = 'function evaluateNumberInputs(numberInputs, plusMinus) ' + fnMatch[1];
// We need parseStudentAnswer too
var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var psaMatch = scriptsSrc.match(/function parseStudentAnswer\(raw\)([\s\S]+?)\n\}/);
var psaBody = psaMatch ? 'function parseStudentAnswer(raw) ' + psaMatch[1] + '\n}' : 'function parseStudentAnswer(r){return parseFloat(r);}';

var evalFn = eval('(' + psaBody + '); ' + fnBody + '; evaluateNumberInputs');

// ── Ordered mode: basic match ──────────────────────────────────
console.log('\u2500\u2500 Ordered mode \u2500\u2500');
function makeN(val, answer, tol) { return { val: val, answer: answer, tolerance: tol }; }

var r1 = evalFn([makeN(4, 4, 0.01)], false);
test('exact match (4 == 4)', r1 === true);

var r2 = evalFn([makeN(4.005, 4, 0.01)], false);
test('within tolerance (4.005, tol=0.01)', r2 === true);

var r3 = evalFn([makeN(4.02, 4, 0.01)], false);
test('outside tolerance (4.02, tol=0.01)', r3 === false);

var r4 = evalFn([makeN(0, 4, 0.01)], false);
test('wrong answer (0 != 4)', r4 === false);

// ── Multi-input ordered ────────────────────────────────────────
console.log('\n\u2500\u2500 Multi-input ordered \u2500\u2500');
var r5 = evalFn([makeN(3, 3, 0.01), makeN(-3, -3, 0.01)], false);
test('2 inputs both correct (3, -3)', r5 === true);

var r6 = evalFn([makeN(3, 3, 0.01), makeN(3, -3, 0.01)], false);
test('2 inputs 1 wrong (wrong order, no plus_minus)', r6 === false);

// ── Plus-minus mode ────────────────────────────────────────────
console.log('\n\u2500\u2500 Plus-minus mode (intercepts either order) \u2500\u2500');
var r7 = evalFn([makeN(3, 3, 0.01), makeN(-3, -3, 0.01)], true);
test('plus_minus: correct order (3, -3)', r7 === true);

var r8 = evalFn([makeN(-3, 3, 0.01), makeN(3, -3, 0.01)], true);
test('plus_minus: reversed order (-3, 3) accepted', r8 === true);

// ── NaN input (empty field) ────────────────────────────────────
console.log('\n\u2500\u2500 NaN input \u2500\u2500');
var r9 = evalFn([makeN(NaN, 4, 0.01)], false);
test('NaN input counts as wrong', r9 === false);

console.log('\n' + '='.repeat(50));
console.log('evaluate-number-inputs-tolerance: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

/**
 * find-missing-inputs.test.js
 * Unit tests for findMissingInputLabels() in exam.html.
 *
 * Uses a minimal DOM mock (document.getElementById / querySelector stub)
 * to test validation logic without a browser.
 * Run: node tests/f-validation/find-missing-inputs.test.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'exam.html'), 'utf-8');
const fnMatch = src.match(/(function findMissingInputLabels\(questions\)[\s\S]+?\n    \})/m);
if (!fnMatch) {
    console.log('\u274c FATAL: findMissingInputLabels not found in exam.html');
    process.exit(1);
}

// Minimal DOM mock: controlled by test setup
var domStore = {};
var domRadios = {};
global.document = {
    getElementById: function(id) { return domStore[id] !== undefined ? { id: id, value: domStore[id] } : null; },
    querySelector: function(sel) {
        // 'input[name="X"]:checked' -> check domRadios[X]
        var m = sel.match(/input\[name="([^"]+)"\]:checked/);
        return m && domRadios[m[1]] ? { value: domRadios[m[1]] } : null;
    }
};

// eslint-disable-next-line no-eval
eval(fnMatch[1]);

let total = 0, pass = 0, fail = 0;
function test(name, actual, expected) {
    total++;
    var ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (ok) { pass++; console.log('  \u2705 ' + name); }
    else { fail++; console.log('  \u274c ' + name + '\n      got: ' + JSON.stringify(actual) + '\n      exp: ' + JSON.stringify(expected)); }
}

console.log('\n\uD83C\uDFC0 find-missing-inputs.test.js\n');

// ── No questions ─────────────────────────────────────────────
console.log('\u2500\u2500 Edge cases \u2500\u2500');
test('null questions -> []', findMissingInputLabels(null), []);
test('empty array -> []', findMissingInputLabels([]), []);
test('question with no inputs -> []', findMissingInputLabels([{inputs:[]}]), []);

// ── Dropdown ─────────────────────────────────────────────────
console.log('\n\u2500\u2500 Dropdown validation \u2500\u2500');
domStore = {};
test('dropdown missing (no element) -> label', findMissingInputLabels([{inputs:[{type:'dropdown',id:'q1_parent',label:'Parent function'}]}]), ['Q1 \u2014 Parent function']);

domStore = { q1_parent: '' };
test('dropdown empty value -> label', findMissingInputLabels([{inputs:[{type:'dropdown',id:'q1_parent',label:'Parent function'}]}]), ['Q1 \u2014 Parent function']);

domStore = { q1_parent: 'absolute' };
test('dropdown filled -> []', findMissingInputLabels([{inputs:[{type:'dropdown',id:'q1_parent',label:'Parent function'}]}]), []);

// ── Number ───────────────────────────────────────────────────
console.log('\n\u2500\u2500 Number validation \u2500\u2500');
domStore = {};
test('number input missing (no element) -> label', findMissingInputLabels([{inputs:[{type:'number',id:'q1a',label:'x-intercept'}]}]), ['Q1 \u2014 x-intercept']);

domStore = { q1a: '' };
test('number empty string -> label', findMissingInputLabels([{inputs:[{type:'number',id:'q1a',label:'x-intercept'}]}]), ['Q1 \u2014 x-intercept']);

domStore = { q1a: '   ' };
test('number whitespace only -> label', findMissingInputLabels([{inputs:[{type:'number',id:'q1a',label:'x-intercept'}]}]), ['Q1 \u2014 x-intercept']);

domStore = { q1a: '5' };
test('number filled -> []', findMissingInputLabels([{inputs:[{type:'number',id:'q1a',label:'x-intercept'}]}]), []);

// ── Radio ─────────────────────────────────────────────────────
console.log('\n\u2500\u2500 Radio validation \u2500\u2500');
domRadios = {};
test('radio not checked -> label', findMissingInputLabels([{inputs:[{type:'radio',id:'q2_choice'}]}]), ['Q1 \u2014 answer choice']);

domRadios = { q2_choice: 'A' };
test('radio checked -> []', findMissingInputLabels([{inputs:[{type:'radio',id:'q2_choice'}]}]), []);

// ── Text (skipped) ────────────────────────────────────────────
console.log('\n\u2500\u2500 Text inputs (skipped) \u2500\u2500');
domStore = {};
test('text type not validated -> []', findMissingInputLabels([{inputs:[{type:'text',id:'q3_text'}]}]), []);

// ── Multi-question ────────────────────────────────────────────
console.log('\n\u2500\u2500 Multi-question \u2500\u2500');
domStore = { q1a: '3', q2a: '' };
domRadios = {};
var qs = [
    { inputs: [{ type: 'number', id: 'q1a', label: 'x' }] },
    { inputs: [{ type: 'number', id: 'q2a', label: 'y' }] },
    { inputs: [{ type: 'radio', id: 'q3_radio' }] }
];
test('Q2 and Q3 missing -> 2 labels', findMissingInputLabels(qs), ['Q2 \u2014 y', 'Q3 \u2014 answer choice']);

console.log('\n' + '='.repeat(50));
console.log('find-missing-inputs: ' + pass + '/' + total + ' pass');
if (fail > 0) process.exit(1);
else console.log('PASS');

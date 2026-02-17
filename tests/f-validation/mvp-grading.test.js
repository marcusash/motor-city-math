/**
 * Motor City Math — Fundamentals Agent (F)
 * MVP: Answer Grading Tests
 *
 * Validates all 15 MVP exam answers from .mvp-spec.md:
 *  - Section A: dropdown parent functions, ±intercepts
 *  - Section B: equation solving with tolerances
 *  - Section C: vertex/asymptote numeric inputs
 *  - Section D: multiple choice, word problem numeric
 *
 * Uses checkAnswer() from shared/scripts.js (extracted via
 * the same technique as grading-regression.test.js).
 *
 * Run: node tests/f-validation/mvp-grading.test.js
 */

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// Load checkAnswer from shared/scripts.js
// ===================================================================
const scriptsPath = path.join(__dirname, '..', '..', 'shared', 'scripts.js');
const lines = fs.readFileSync(scriptsPath, 'utf-8').split('\n');

let normSrc = '', checkSrc = '';
let depth = 0, collecting = null;

for (const line of lines) {
    if (line.match(/^function norm\b/)) { collecting = 'norm'; depth = 0; }
    if (line.match(/^function checkAnswer\b/)) { collecting = 'check'; depth = 0; }
    if (collecting) {
        if (collecting === 'norm') normSrc += line + '\n';
        if (collecting === 'check') checkSrc += line + '\n';
        for (const ch of line) {
            if (ch === '{') depth++;
            if (ch === '}') depth--;
        }
        if (depth === 0 && (normSrc || checkSrc)) {
            if (collecting === 'norm' && normSrc.includes('}')) collecting = null;
            if (collecting === 'check' && checkSrc.includes('}')) collecting = null;
        }
    }
}

eval(normSrc);
eval(checkSrc);

// ===================================================================
// Section A — Identify & Transform (Q1-Q3)
// ===================================================================
section('Section A — Parent Function Dropdowns');

// Q1: f(x) = 2(x-3)³+1 → cubic
test('Q1 parent: "cubic" matches "cubic"', checkAnswer('cubic', 'cubic'));
test('Q1 parent: "quadratic" rejected', !checkAnswer('quadratic', 'cubic'));
test('Q1 parent: "" (empty) rejected', !checkAnswer('', 'cubic'));

// Q2: f(x) = -|x+4|+3 → absolute
test('Q2 parent: "absolute" matches', checkAnswer('absolute', 'absolute'));
// Q2 intercepts: x = -1 and x = -7 (tolerance ±0.1)
test('Q2 x₁=-1 accepted (exact)', checkAnswer('-1', -1, 0.1));
test('Q2 x₂=-7 accepted (exact)', checkAnswer('-7', -7, 0.1));
test('Q2 x₁=-1.05 accepted (within 0.1)', checkAnswer('-1.05', -1, 0.1));
test('Q2 x₁=-1.2 rejected (outside 0.1)', !checkAnswer('-1.2', -1, 0.1));
// ± answers: either value in either box
test('Q2 box1=-7, checking against -1: rejected', !checkAnswer('-7', -1, 0.1));
test('Q2 box1=-7, checking against -7: accepted', checkAnswer('-7', -7, 0.1));

// Q3: f(x) = 3(x-1)²-12 → quadratic, intercepts x=3, x=-1
test('Q3 parent: "quadratic" matches', checkAnswer('quadratic', 'quadratic'));
test('Q3 x₁=3 accepted', checkAnswer('3', 3, 0.1));
test('Q3 x₂=-1 accepted', checkAnswer('-1', -1, 0.1));

// ===================================================================
// Section B — Solve Nonlinear Equations (Q4-Q11)
// ===================================================================
section('Section B — Equation Solving');

// Q4: 2^(3x-1)=32 → x=2 (tol ±0.01)
test('Q4 x=2 (exact)', checkAnswer('2', 2, 0.01));
test('Q4 x=2.005 (within 0.01)', checkAnswer('2.005', 2, 0.01));
test('Q4 x=2.02 (rejected)', !checkAnswer('2.02', 2, 0.01));
test('Q4 x=1 (wrong)', !checkAnswer('1', 2, 0.01));

// Q5: 3(2x+1)²-5=7 → x=0.5 and x=-1.5 (tol ±0.1)
test('Q5 x₁=0.5 accepted', checkAnswer('0.5', 0.5, 0.1));
test('Q5 x₂=-1.5 accepted', checkAnswer('-1.5', -1.5, 0.1));
test('Q5 x₁=0.55 accepted (within 0.1)', checkAnswer('0.55', 0.5, 0.1));

// Q6: √(3x²+1)-4=0 → x=±√5≈±2.236 (tol ±0.01)
test('Q6 x₁=2.236 accepted', checkAnswer('2.236', 2.236, 0.01));
test('Q6 x₂=-2.236 accepted', checkAnswer('-2.236', -2.236, 0.01));
test('Q6 x=2.24 accepted (within 0.01)', checkAnswer('2.24', 2.236, 0.01));
test('Q6 x=2.25 rejected (outside 0.01)', !checkAnswer('2.25', 2.236, 0.01));

// Verify: √(3(√5)²+1) = √(15+1) = √16 = 4 ✓
test('Q6 math verify: √(3·5+1)=4', Math.abs(Math.sqrt(3*5+1) - 4) < 0.001);

// Q7: 5^(2-x)+3=4 → x=2 (tol ±0.01)
test('Q7 x=2 accepted', checkAnswer('2', 2, 0.01));

// Verify: 5^(2-2)+3 = 1+3 = 4 ✓
test('Q7 math verify: 5^0+3=4', Math.abs(Math.pow(5, 0) + 3 - 4) < 0.001);

// Q8: (4x+3)/(x-2)=7 → x=17/3≈5.667 (tol ±0.01)
test('Q8 x=5.667 accepted', checkAnswer('5.667', 5.667, 0.01));
test('Q8 x=5.6667 accepted', checkAnswer('5.6667', 5.667, 0.01));

// Verify: (4·17/3+3)/(17/3-2) = (68/3+9/3)/(11/3) = (77/3)/(11/3) = 7 ✓
test('Q8 math verify: (4·17/3+3)/(17/3-2)=7',
    Math.abs((4*17/3+3)/(17/3-2) - 7) < 0.001);

// Q9: √(4x-3)=√(x+6) → x=3 (tol ±0.01)
test('Q9 x=3 accepted', checkAnswer('3', 3, 0.01));

// Verify: √(12-3) = √9 = 3, √(3+6) = √9 = 3 ✓
test('Q9 math verify: √(4·3-3)=√(3+6)=3',
    Math.abs(Math.sqrt(4*3-3) - Math.sqrt(3+6)) < 0.001);

// Q10: 4·3^(x²-2)=108 → x=±√5≈±2.236 (tol ±0.01)
test('Q10 x₁=2.236 accepted', checkAnswer('2.236', 2.236, 0.01));
test('Q10 x₂=-2.236 accepted', checkAnswer('-2.236', -2.236, 0.01));

// Verify: 4·3^(5-2) = 4·27 = 108 ✓
test('Q10 math verify: 4·3^3=108', Math.abs(4 * Math.pow(3, 3) - 108) < 0.001);

// Q11: 2x^(3/2)+4=58 → x=9 (tol ±0.01)
test('Q11 x=9 accepted', checkAnswer('9', 9, 0.01));

// Verify: 2·9^(3/2)+4 = 2·27+4 = 58 ✓
test('Q11 math verify: 2·9^(3/2)+4=58',
    Math.abs(2 * Math.pow(9, 1.5) + 4 - 58) < 0.001);

// ===================================================================
// Section C — Graph & Analyze (Q12-Q13)
// ===================================================================
section('Section C — Vertex & Asymptote Inputs');

// Q12: vertex (-2, 5) tol ±0.1
test('Q12 vertex x=-2 accepted', checkAnswer('-2', -2, 0.1));
test('Q12 vertex y=5 accepted', checkAnswer('5', 5, 0.1));
test('Q12 vertex x=-2.05 accepted (within 0.1)', checkAnswer('-2.05', -2, 0.1));
test('Q12 vertex x=-3 rejected', !checkAnswer('-3', -2, 0.1));

// Q13: asymptotes x=1, y=-2 tol ±0.1
test('Q13 vertical asymptote x=1', checkAnswer('1', 1, 0.1));
test('Q13 horizontal asymptote y=-2', checkAnswer('-2', -2, 0.1));
test('Q13 vertical x=1.05 accepted (within 0.1)', checkAnswer('1.05', 1, 0.1));
test('Q13 vertical x=0 rejected', !checkAnswer('0', 1, 0.1));

// ===================================================================
// Section D — Apply (Q14-Q15)
// ===================================================================
section('Section D — Multiple Choice & Word Problem');

// Q14: Multiple choice — r = √(A/π) → option B value
test('Q14 correct option "B" matches', checkAnswer('B', 'B'));
test('Q14 wrong option "A" rejected', !checkAnswer('A', 'B'));
test('Q14 wrong option "C" rejected', !checkAnswer('C', 'B'));

// Q15b: t=20 hours (tol ±0.5)
test('Q15 t=20 accepted', checkAnswer('20', 20, 0.5));
test('Q15 t=20.3 accepted (within 0.5)', checkAnswer('20.3', 20, 0.5));
test('Q15 t=19.6 accepted (within 0.5)', checkAnswer('19.6', 20, 0.5));
test('Q15 t=21 rejected (outside 0.5)', !checkAnswer('21', 20, 0.5));

// Verify: 200·3^(20/4) = 200·3^5 = 200·243 = 48600 ✓
test('Q15 math verify: 200·3^5=48600',
    Math.abs(200 * Math.pow(3, 5) - 48600) < 0.001);

// ===================================================================
// EDGE CASES
// ===================================================================
section('Edge Cases');

// Empty inputs
test('Empty string rejected for numeric', !checkAnswer('', 2, 0.01));
test('Whitespace rejected for numeric', !checkAnswer('   ', 2, 0.01));

// Negative numbers
test('Negative sign handled: -1.5', checkAnswer('-1.5', -1.5, 0.1));
test('Negative sign handled: -2.236', checkAnswer('-2.236', -2.236, 0.01));

// Decimal precision
test('Extra decimals OK: 5.66666667', checkAnswer('5.66666667', 5.667, 0.01));

// ===================================================================
// SUMMARY
// ===================================================================
section('MVP GRADING SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);

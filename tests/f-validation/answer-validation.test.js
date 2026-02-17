/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-2: Answer validation edge case tests
 *
 * Tests the check() and norm() functions against edge cases
 * that will matter when Agent A builds the shared grading engine.
 *
 * Run: node tests/f-validation/answer-validation.test.js
 */

// ===== Replicate grading functions =====
function norm(a) {
    return typeof a === 'string' ? a.toLowerCase().replace(/\s+|\*|\$/g, '') : a;
}

function check(user, correct, tol = 0.5) {
    if (typeof correct === 'number') return Math.abs(parseFloat(user) - correct) <= tol;
    const u = norm(user), c = norm(correct);
    return c.includes('initial') || c.includes('burn') || c.includes('constant') || c.includes('per') || c.includes('base') || c.includes('multiply') || c.includes('decay') ? u.includes(c.substring(0, 4)) : u === c;
}

let pass = 0, fail = 0, total = 0;
function test(description, fn) {
    total++;
    try {
        const result = fn();
        if (result === true) {
            pass++;
        } else {
            fail++;
            console.log(`  ❌ ${description}`);
        }
    } catch (e) {
        fail++;
        console.log(`  💥 ${description}: ${e.message}`);
    }
}

function section(title) {
    console.log(`\n── ${title} ──`);
}

// ===================================================================
// NUMERIC TOLERANCE
// ===================================================================
section('Numeric: exact and boundary');
test('Integer match: "33" → 33', () => check('33', 33) === true);
test('Decimal match: "33.0" → 33', () => check('33.0', 33) === true);
test('Inside tol: "33.4" → 33', () => check('33.4', 33) === true);
test('At boundary: "33.5" → 33', () => check('33.5', 33) === true);
test('Outside tol: "33.6" → 33', () => check('33.6', 33) === false);
test('Below tol: "32.4" → 33', () => check('32.4', 33) === false);
test('At lower boundary: "32.5" → 33', () => check('32.5', 33) === true);
test('Zero: "0" → 0', () => check('0', 0) === true);
test('Negative exact: "-0.5" → -0.5', () => check('-0.5', -0.5) === true);
test('Negative in tol: "-1" → -0.5', () => check('-1', -0.5) === true);
test('Negative out tol: "-1.1" → -0.5', () => check('-1.1', -0.5) === false);

section('Numeric: custom tolerance');
test('tol=1: "27" → 27.78', () => check('27', 27.78, 1) === true);
test('tol=1: "28.78" → 27.78', () => check('28.78', 27.78, 1) === true);
test('tol=1: "26.77" → 27.78', () => check('26.77', 27.78, 1) === false);
test('tol=2: "14638" → 14636.56', () => check('14638', 14636.56, 2) === true);
test('tol=0.01: "47.50" → 47.50', () => check('47.50', 47.50, 0.01) === true);

section('Numeric: user input edge cases');
test('Empty → NaN → false', () => check('', 33) === false);
test('Text → NaN → false', () => check('abc', 33) === false);
test('Whitespace only → NaN', () => check('   ', 33) === false);
test('Leading space → OK', () => check(' 33', 33) === true);
test('Trailing space → OK', () => check('33 ', 33) === true);

// ⚠️ Known issues — these document current behavior
section('Numeric: KNOWN ISSUES (correct answer marked wrong)');
test('Dollar prefix: "$33" → NaN (BUG)', () => check('$33', 33) === false);
test('Comma: "5,000" → 5 (BUG)', () => check('5,000', 5000) === false);
test('Thousands: "20,000" → 20 (BUG)', () => check('20,000', 20000) === false);

// ===================================================================
// STRING: EXACT MATCH (non-keyword answers)
// ===================================================================
section('String: exact match after normalization');
test('Exact: "y=25x+10"', () => check('y=25x+10', 'y=25x+10') === true);
test('With spaces: "y = 25x + 10"', () => check('y = 25x + 10', 'y=25x+10') === true);
test('Uppercase: "Y=25X+10"', () => check('Y=25X+10', 'y=25x+10') === true);
test('Dollar stripped: "C(m)=$35m+$75"', () => check('C(m)=$35m+$75', 'c(m)=35m+75') === true);
test('Asterisk stripped: "p(t)=500*2^t"', () => check('p(t)=500*2^t', 'p(t)=500(2)^t') === false);
// ↑ asterisk stripped but parentheses aren't, so "5002^t" ≠ "500(2)^t"

section('String: equivalent forms REJECTED (known limitation)');
test('"25x+10=y" rejected for "y=25x+10"', () => check('25x+10=y', 'y=25x+10') === false);
test('"y=10+25x" rejected for "y=25x+10"', () => check('y=10+25x', 'y=25x+10') === false);
test('"h=8-t/2" rejected for "h=8-0.5t"', () => check('h=8-t/2', 'h=8-0.5t') === false);
test('"P(x)=18x-500" rejected for "p(x)=18x-500"', () => check('P(x)=18x-500', 'p(x)=18x-500') === true);
test('"C = 60h + 85" with spaces', () => check('C = 60h + 85', 'c=60h+85') === true);

// ===================================================================
// STRING: KEYWORD MATCH (4-char prefix)
// ===================================================================
section('Keyword: correct matches');
test('"initial amount" → initial', () => check('initial amount', 'initial') === true);
test('"the initial value" → initial', () => check('the initial value', 'initial') === true);
test('"burn rate" → burn', () => check('burn rate', 'burn') === true);
test('"constant rate" → constant', () => check('constant rate', 'constant') === true);
test('"cost per mile" → per mile', () => check('cost per mile', 'per mile') === true);
test('"base fee" → base', () => check('base fee', 'base') === true);
test('"multiply" → multiply', () => check('multiply', 'multiply') === true);
test('"decay" → decay', () => check('decay', 'decay') === true);

section('Keyword: FALSE POSITIVES (wrong answers accepted)');
test('"initiative" matches "initial"', () => check('initiative', 'initial') === true);
test('"sunburn" matches "burn"', () => check('sunburn', 'burn') === true);
test('"construction" matches "constant"', () => check('construction', 'constant') === true);
test('"permanent" matches "per mile"', () => check('permanent', 'per mile') === true);
test('"baseball" matches "base"', () => check('baseball', 'base') === true);
test('"multicultural" matches "multiply"', () => check('multicultural', 'multiply') === true);
test('"decade" matches "decay"', () => check('decade', 'decay') === true);
test('"decadent" matches "decay"', () => check('decadent', 'decay') === true);
test('"basement" matches "base"', () => check('basement', 'base') === true);
test('"permission" matches "per mile"', () => check('permission', 'per mile') === true);

// ===================================================================
// norm() FUNCTION
// ===================================================================
section('norm() function');
test('Strips spaces', () => norm('a b c') === 'abc');
test('Lowercases', () => norm('ABC') === 'abc');
test('Strips $', () => norm('$500') === '500');
test('Strips *', () => norm('5*x') === '5x');
test('Numbers pass through', () => norm(42) === 42);
test('Combo: "$ 5 * x"', () => norm('$ 5 * x') === '5x');
test('Does NOT strip commas', () => norm('5,000') === '5,000');
test('Does NOT strip parens', () => norm('(2)^t') === '(2)^t');
test('Does NOT strip minus', () => norm('-0.5') === '-0.5');

// ===================================================================
// MATH ACCURACY: Verified answers from answer keys
// ===================================================================
section('Math accuracy: verified computations');
test('Q4c: 450=20t+150 → t=15', () => (450 - 150) / 20 === 15);
test('Q5d: 0=8-0.5t → t=16', () => 8 / 0.5 === 16);
test('Q7b: (385-25)/45 = 8', () => (385 - 25) / 45 === 8);
test('Q8b: 500/18 ≈ 27.78', () => Math.abs(500/18 - 27.78) < 0.01);
test('Q8c: 18(50)-500 = 400', () => 18 * 50 - 500 === 400);
test('Q9a: (52-40)/0.10 = 120', () => (52 - 40) / 0.10 === 120);
test('Q9b: 0.10(75)+40 = 47.50', () => 0.10 * 75 + 40 === 47.50);
test('Q11b: 60(3.5)+85 = 295', () => 60 * 3.5 + 85 === 295);
test('Q11c: (325-85)/60 = 4', () => (325 - 85) / 60 === 4);
test('Q12c: 0.25(200)+40 = 90', () => 0.25 * 200 + 40 === 90);
test('Q13a: (180-100)/(7-3) = 20', () => (180 - 100) / (7 - 3) === 20);
test('Q14c: 50(6)+200 = 500', () => 50 * 6 + 200 === 500);
test('Q15c: 500*2^3 = 4000', () => 500 * Math.pow(2, 3) === 4000);

section('Math accuracy: KNOWN ERRORS in answer keys');
test('Q6d: 70+(-2)(2)=66 not 62', () => 70 + (-2) * 2 === 66);
test('Q16b: 28000*0.85^4=14616.18 not 14636.56', () => Math.abs(28000 * Math.pow(0.85, 4) - 14616.175) < 0.001);
test('Final Q1: answer should be 210 not -234', () => 3*(-4)*3 - 9*(-22) + 48 === 210);
test('Final Q5: answer should be x=-9', () => { const x=-9; return 7*x-4 === 2*(3*x-5)-(x+12); });
test('Final Q16b: 12*1.5^5=91.125 (week 5)', () => Math.abs(12 * Math.pow(1.5, 5) - 91.125) < 0.001);
test('Final Q16b: 12*1.5^6≈136.69 (week 6)', () => Math.abs(12 * Math.pow(1.5, 6) - 136.6875) < 0.01);

// ===================================================================
// SUMMARY
// ===================================================================
console.log(`\n${'='.repeat(50)}`);
console.log(`RESULTS: ${total} tests, ${pass} passed, ${fail} failed`);
if (fail > 0) {
    console.log(`\n⚠️  ${fail} test(s) failed — review above.`);
}
console.log(`${'='.repeat(50)}\n`);

process.exit(fail > 0 ? 1 : 0);

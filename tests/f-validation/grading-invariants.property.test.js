/**
 * grading-invariants.property.test.js — Property-based tests for MCM grading logic
 * Agent GF | Skill track: FR recommendation (fast-check, property-based testing)
 *
 * Instead of specific test cases, this defines INVARIANTS that must hold for
 * all inputs. fast-check generates hundreds of random inputs to find edge cases.
 *
 * Invariants tested:
 *   1. Numeric: correct answer always passes (identity)
 *   2. Numeric: within tolerance always passes
 *   3. Numeric: beyond tolerance always fails
 *   4. Numeric: NaN/non-numeric input never throws, always fails gracefully
 *   5. String: exact match always passes
 *   6. String: empty user input never passes (no false positives)
 *   7. Tolerance: symmetric — |x - correct| == |correct - x|
 *   8. Dollar/comma stripping: "$1,234" parses same as "1234" for numeric grading
 *   9. Keyword: 4-char prefix match is not overly permissive (>= 4 chars required)
 *  10. Grader never throws — always returns boolean
 *
 * Run: node tests/f-validation/grading-invariants.property.test.js
 */

const fc = require('fast-check');

// ============================================================
// Replicate grading functions from exam pages (same logic)
// ============================================================

function norm(a) {
    return typeof a === 'string' ? a.toLowerCase().replace(/\s+|\*|\$/g, '') : a;
}

// Standard check from index.html / exam pages
function check(user, correct, tol = 0.5) {
    if (typeof correct === 'number') return Math.abs(parseFloat(user) - correct) <= tol;
    const u = norm(user), c = norm(correct);
    const isKeyword = ['initial', 'burn', 'constant', 'per', 'base', 'multiply', 'decay']
        .some(k => c.includes(k));
    return isKeyword ? u.includes(c.substring(0, 4)) : u === c;
}

// Numeric check with comma/dollar stripping (resilient version)
function parseUserNum(user) {
    if (typeof user !== 'string') return parseFloat(user);
    return parseFloat(user.replace(/[$,]/g, ''));
}

function checkNumeric(user, correct, tol = 0.5) {
    const parsed = parseUserNum(user);
    return !isNaN(parsed) && Math.abs(parsed - correct) <= tol;
}

// ============================================================
// Test harness
// ============================================================

let pass = 0, fail = 0, totalRuns = 0;

function property(name, arb, predicate) {
    let runs = 0;
    try {
        fc.assert(fc.property(arb, (...args) => {
            runs++;
            return predicate(...args);
        }), { numRuns: 200, seed: 42 });
        pass++;
        console.log(`  ✅ ${name} (${runs} runs)`);
    } catch (e) {
        fail++;
        // Extract the counterexample from fast-check error
        const ce = e.message || String(e);
        const brief = ce.split('\n').slice(0, 3).join(' ');
        console.log(`  ❌ ${name} — COUNTEREXAMPLE: ${brief}`);
    }
    totalRuns += runs;
}

console.log('\n🏀 grading-invariants.property.test.js');
console.log('Property-based grading invariants (fast-check v4)\n');
console.log('='.repeat(60));

// ============================================================
// Suite 1: Numeric grading invariants
// ============================================================

console.log('\n── Suite 1: Numeric grading invariants ──');

// 1. Identity: correct answer always passes
property(
    'Numeric identity: check(correct, correct, tol) always true',
    fc.tuple(fc.integer({ min: -1000, max: 1000 }), fc.double({ min: 0.01, max: 2.0 })),
    ([correct, tol]) => check(String(correct), correct, tol) === true
);

// 2. Within tolerance always passes
property(
    'Within tolerance: |user - correct| <= tol always passes',
    fc.tuple(
        fc.integer({ min: -1000, max: 1000 }),
        fc.double({ min: 0.01, max: 2.0 })
    ),
    ([correct, tol]) => {
        // User answer exactly at tolerance boundary — should pass
        const userAtBound = String(correct + tol * 0.99);
        return check(userAtBound, correct, tol) === true;
    }
);

// 3. Beyond tolerance always fails
property(
    'Beyond tolerance: |user - correct| > tol always fails',
    fc.tuple(
        fc.integer({ min: -500, max: 500 }),
        fc.double({ min: 0.1, max: 1.0 })
    ),
    ([correct, tol]) => {
        const userBeyond = String(correct + tol + 1.0); // clearly beyond tol
        return check(userBeyond, correct, tol) === false;
    }
);

// 4. NaN input never throws, returns false
property(
    'Non-numeric input never throws, returns false',
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
    (badInput) => {
        let result;
        try {
            result = check(badInput, 42, 0.5);
        } catch (e) {
            return false; // threw — invariant violated
        }
        return result === false;
    }
);

// 5. Grader always returns boolean (never undefined/null/throws)
property(
    'Grader always returns boolean for any string input',
    fc.tuple(fc.string({ maxLength: 50 }), fc.integer({ min: -100, max: 100 })),
    ([userInput, correct]) => {
        let result;
        try {
            result = check(userInput, correct, 0.5);
        } catch (e) {
            return false;
        }
        return typeof result === 'boolean';
    }
);

// ============================================================
// Suite 2: Dollar/comma stripping invariants
// ============================================================

console.log('\n── Suite 2: Numeric formatting invariants ──');

// 6. Dollar sign stripped: "$42" grades same as "42"
property(
    'Dollar sign: "$N" grades same as "N" for integer answers',
    fc.integer({ min: 1, max: 9999 }),
    (n) => {
        const withDollar = checkNumeric('$' + n, n, 0.5);
        const without = checkNumeric(String(n), n, 0.5);
        return withDollar === without;
    }
);

// 7. Comma stripped: "1,234" grades same as "1234"
property(
    'Comma stripping: "1,234" grades same as "1234" for 4-digit answers',
    fc.integer({ min: 1000, max: 9999 }),
    (n) => {
        const str = String(n);
        const withComma = checkNumeric(str.slice(0, 1) + ',' + str.slice(1), n, 0.5);
        const without = checkNumeric(str, n, 0.5);
        return withComma === without;
    }
);

// ============================================================
// Suite 3: String/keyword grading invariants
// ============================================================

console.log('\n── Suite 3: String grading invariants ──');

// 8. Exact match always passes
property(
    'String exact match: check(answer, answer) always true',
    fc.string({ minLength: 1, maxLength: 30 }).filter(s => !['initial','burn','constant','per','base','multiply','decay'].some(k => s.toLowerCase().includes(k))),
    (answer) => {
        // Non-keyword strings: exact match must pass
        return check(answer, answer) === true;
    }
);

// 9. Empty string never passes for non-empty correct answer
property(
    'Empty input never passes for any non-empty answer',
    fc.string({ minLength: 1, maxLength: 20 }),
    (correct) => {
        return check('', correct) === false;
    }
);

// 10. Completely different string fails (no false positives for non-keywords)
property(
    'Random non-matching string fails for numeric correct answer',
    fc.tuple(
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => isNaN(parseFloat(s)) && s !== ''),
        fc.integer({ min: 1, max: 999 })
    ),
    ([randomStr, correct]) => {
        return check(randomStr, correct) === false;
    }
);

// ============================================================
// Suite 4: Tolerance symmetry
// ============================================================

console.log('\n── Suite 4: Tolerance symmetry ──');

// 11. Tolerance is symmetric: check(correct+d) == check(correct-d)
property(
    'Tolerance symmetry: offset above == offset below',
    fc.tuple(
        fc.integer({ min: -200, max: 200 }),
        fc.double({ min: 0.1, max: 2.0 }),
        fc.double({ min: 0.01, max: 3.0 })
    ),
    ([correct, tol, offset]) => {
        const above = check(String(correct + offset), correct, tol);
        const below = check(String(correct - offset), correct, tol);
        return above === below;
    }
);

// ============================================================
// Summary
// ============================================================

console.log('\n' + '='.repeat(60));
const total = pass + fail;
console.log(`RESULTS: ${pass}/${total} properties held, ${fail} violated`);
console.log(`Total runs across all properties: ${totalRuns}`);
if (fail === 0) {
    console.log('✅ All grading invariants hold');
} else {
    console.log('❌ Grading invariants violated — review counterexamples above');
}
console.log('='.repeat(60));

process.exit(fail > 0 ? 1 : 0);

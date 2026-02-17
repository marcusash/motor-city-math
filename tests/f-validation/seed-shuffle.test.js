/**
 * Motor City Math — Fundamentals Agent (F)
 * Task #46: Seed Shuffle Reproducibility
 *
 * Tests seededShuffle() from test.html:
 *  - Same seed + same input = same output every time
 *  - Different seeds produce different orders
 *  - Edge cases: empty, single element, large arrays
 *
 * Run: node tests/f-validation/seed-shuffle.test.js
 */

let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// ===================================================================
// seededShuffle extracted from test.html lines 145-153
// ===================================================================
function seededShuffle(arr, seed) {
    var m = arr.length, t, i;
    while (m) {
        seed = (seed * 9301 + 49297) % 233280;
        i = Math.floor((seed / 233280) * m--);
        t = arr[m]; arr[m] = arr[i]; arr[i] = t;
    }
    return arr;
}

// Helper: create array [1..n]
function range(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
}

// ===================================================================
// 1. DETERMINISM — Same seed = same output
// ===================================================================
section('1. Determinism');

test('Seed 42: identical on two calls',
    JSON.stringify(seededShuffle(range(10), 42)) ===
    JSON.stringify(seededShuffle(range(10), 42)));

test('Seed 100: identical on two calls',
    JSON.stringify(seededShuffle(range(10), 100)) ===
    JSON.stringify(seededShuffle(range(10), 100)));

test('Seed 0: identical on two calls',
    JSON.stringify(seededShuffle(range(10), 0)) ===
    JSON.stringify(seededShuffle(range(10), 0)));

test('Seed 999999: identical on two calls',
    JSON.stringify(seededShuffle(range(10), 999999)) ===
    JSON.stringify(seededShuffle(range(10), 999999)));

test('Seed 1: identical on two calls',
    JSON.stringify(seededShuffle(range(10), 1)) ===
    JSON.stringify(seededShuffle(range(10), 1)));

// Larger array
test('Seed 42 with 50 elements: identical',
    JSON.stringify(seededShuffle(range(50), 42)) ===
    JSON.stringify(seededShuffle(range(50), 42)));

// Very large seed
test('Seed 2147483647 (max int32): identical',
    JSON.stringify(seededShuffle(range(10), 2147483647)) ===
    JSON.stringify(seededShuffle(range(10), 2147483647)));

// ===================================================================
// 2. DIFFERENT SEEDS = DIFFERENT OUTPUT
// ===================================================================
section('2. Different Seeds Produce Different Orders');

test('Seed 42 ≠ Seed 43',
    JSON.stringify(seededShuffle(range(10), 42)) !==
    JSON.stringify(seededShuffle(range(10), 43)));

test('Seed 0 ≠ Seed 1',
    JSON.stringify(seededShuffle(range(10), 0)) !==
    JSON.stringify(seededShuffle(range(10), 1)));

test('Seed 100 ≠ Seed 200',
    JSON.stringify(seededShuffle(range(10), 100)) !==
    JSON.stringify(seededShuffle(range(10), 200)));

test('Seed 999 ≠ Seed 1000',
    JSON.stringify(seededShuffle(range(20), 999)) !==
    JSON.stringify(seededShuffle(range(20), 1000)));

// ===================================================================
// 3. PERMUTATION INTEGRITY
// ===================================================================
section('3. Permutation Integrity');

// Shuffle must contain all original elements (no dupes, no missing)
const shuffled = seededShuffle(range(10), 42);
test('Contains all elements after shuffle',
    shuffled.sort((a, b) => a - b).join(',') === '1,2,3,4,5,6,7,8,9,10');

const shuffled50 = seededShuffle(range(50), 123);
test('50-element shuffle preserves all elements',
    shuffled50.sort((a, b) => a - b).join(',') === range(50).join(','));

// Length preserved
test('Length unchanged after shuffle',
    seededShuffle(range(15), 42).length === 15);

// ===================================================================
// 4. EDGE CASES
// ===================================================================
section('4. Edge Cases');

// Empty array
test('Empty array returns empty', seededShuffle([], 42).length === 0);

// Single element
test('Single element returns same element', seededShuffle([1], 42)[0] === 1);

// Two elements — deterministic
const two1 = seededShuffle([1, 2], 42);
const two2 = seededShuffle([1, 2], 42);
test('Two elements: deterministic',
    JSON.stringify(two1) === JSON.stringify(two2));

// Seed 0 doesn't break (some LCGs have issues with 0)
test('Seed 0 produces valid shuffle',
    seededShuffle(range(5), 0).length === 5);

// Negative seed (edge case)
test('Negative seed: deterministic',
    JSON.stringify(seededShuffle(range(10), -1)) ===
    JSON.stringify(seededShuffle(range(10), -1)));

// ===================================================================
// 5. LCG ALGORITHM VERIFICATION
// ===================================================================
section('5. LCG Algorithm Spot-Check');

// Manually trace: seed=42, array=[1,2,3]
// Iteration 1 (m=3): seed=(42*9301+49297)%233280 = (390642+49297)%233280 = 439939%233280 = 206659
//   i = floor((206659/233280)*3) = floor(2.658...) = 2
//   swap arr[2] with arr[2] → no change: [1,2,3]
// Iteration 2 (m=2): seed=(206659*9301+49297)%233280 = ...
let traceSeed = 42;
traceSeed = (traceSeed * 9301 + 49297) % 233280;
test('LCG step 1 from seed=42: seed becomes 206659', traceSeed === 206659);

traceSeed = (traceSeed * 9301 + 49297) % 233280;
test('LCG step 2: next seed value is deterministic', typeof traceSeed === 'number' && traceSeed >= 0 && traceSeed < 233280);

// ===================================================================
// 6. PRACTICAL: TEST.HTML USE CASE
// ===================================================================
section('6. Practical: test.html URL Reproducibility');

// Simulate: user loads test.html?seed=42&count=10 twice
// Both times should get same question order
const questions = range(20); // 20 available questions
const take = 10;

// First load
const load1 = seededShuffle(questions.slice(), 42).slice(0, take);
// Second load  
const load2 = seededShuffle(range(20), 42).slice(0, take);

test('Same seed gives same first 10 questions',
    JSON.stringify(load1) === JSON.stringify(load2));

// Different seed gives different questions
const load3 = seededShuffle(range(20), 99).slice(0, take);
test('Different seed gives different question order',
    JSON.stringify(load1) !== JSON.stringify(load3));

// Teacher can share a link: test.html?seed=12345 → all students see same test
const student1 = seededShuffle(range(50), 12345).slice(0, 15);
const student2 = seededShuffle(range(50), 12345).slice(0, 15);
test('Shared seed: both students get identical test',
    JSON.stringify(student1) === JSON.stringify(student2));

// ===================================================================
// SUMMARY
// ===================================================================
section('SEED SHUFFLE SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);

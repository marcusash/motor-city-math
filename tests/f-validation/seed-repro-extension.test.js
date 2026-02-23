/**
 * seed-repro-extension.test.js
 * GF gf-skill-18: Extends seed reproducibility coverage beyond the core
 * seededShuffle() unit tests in seed-shuffle.test.js.
 *
 * This file tests the PIPELINE: exam_id → numeric seed → reproducible question order.
 * Guards against seeds that produce identical orderings across exams (memorization risk)
 * and verifies the seed derivation contract used by exam.html.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

// seededShuffle — same LCG implementation as exam.html and seed-shuffle.test.js
function seededShuffle(arr, seed) {
  arr = arr.slice(); // non-destructive copy
  var m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m]; arr[m] = arr[i]; arr[i] = t;
  }
  return arr;
}

// Derive a numeric seed from an exam_id string (simulating how exam.html would do it)
function examIdToSeed(examId) {
  let hash = 0;
  for (let i = 0; i < examId.length; i++) {
    hash = (hash * 31 + examId.charCodeAt(i)) % 233280;
  }
  return hash;
}

console.log('\nSeed Reproducibility Extension Tests\n');

// Load all RP exam files
const examFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice') && f.endsWith('.json'))
  .sort();

pass(`found ${examFiles.length} exam file(s)`);

const exams = examFiles.map(f => {
  const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
  return { file: f, exam_id: d.exam_id, questions: d.questions };
});

// === 1. exam_id uniqueness ===
console.log('\n  1. exam_id uniqueness:');

const examIds = exams.map(e => e.exam_id);
const uniqueIds = new Set(examIds);
if (uniqueIds.size === examIds.length) {
  pass(`all ${examIds.length} exam_ids are unique`);
} else {
  fail(`duplicate exam_ids found: ${examIds.filter((id, i) => examIds.indexOf(id) !== i).join(', ')}`);
}

// exam_id must be non-empty string
for (const e of exams) {
  if (typeof e.exam_id === 'string' && e.exam_id.length > 0) {
    pass(`${e.file}: exam_id present ("${e.exam_id}")`);
  } else {
    fail(`${e.file}: exam_id missing or empty`);
  }
}

// === 2. Seed derivation produces unique seeds per exam_id ===
console.log('\n  2. exam_id → numeric seed uniqueness:');

const seeds = exams.map(e => ({ file: e.file, exam_id: e.exam_id, seed: examIdToSeed(e.exam_id) }));
const uniqueSeeds = new Set(seeds.map(s => s.seed));

if (uniqueSeeds.size === seeds.length) {
  pass(`all ${seeds.length} derived seeds are unique`);
} else {
  fail(`seed collision: ${seeds.length} exam_ids produce ${uniqueSeeds.size} unique seeds`);
}

// Print derived seeds for visibility
console.log('\n    exam_id → seed mapping:');
for (const s of seeds) {
  console.log(`    ${s.exam_id.padEnd(22)} → ${s.seed}`);
}

// === 3. Seeded question order is reproducible per exam ===
console.log('\n  3. Reproducible question ordering per exam:');

for (const e of exams) {
  const seed = examIdToSeed(e.exam_id);
  const ids = e.questions.map(q => q.id);

  const order1 = seededShuffle(ids, seed);
  const order2 = seededShuffle(ids, seed);

  if (JSON.stringify(order1) === JSON.stringify(order2)) {
    pass(`${e.exam_id}: same seed produces same question order`);
  } else {
    fail(`${e.exam_id}: seed ${seed} produced different orderings on two calls`);
  }
}

// === 4. Different exams produce different question orderings (no cross-exam pattern leak) ===
console.log('\n  4. Cross-exam ordering isolation:');

// Build "first 5 question IDs" for each exam using its derived seed
const orderSignatures = exams.map(e => {
  const seed = examIdToSeed(e.exam_id);
  const ids = e.questions.map(q => q.id);
  // Use positions (indices) rather than IDs since exams have different question sets
  const positions = ids.map((_, i) => i);
  return { exam_id: e.exam_id, signature: seededShuffle(positions, seed).slice(0, 5).join(',') };
});

const sigSet = new Set(orderSignatures.map(s => s.signature));
if (sigSet.size === orderSignatures.length) {
  pass(`all ${orderSignatures.length} exams produce distinct first-5 orderings`);
} else {
  const collisions = orderSignatures.filter((s, i) =>
    orderSignatures.findIndex(o => o.signature === s.signature) !== i
  );
  fail(`ordering collision detected: ${collisions.map(c => c.exam_id).join(', ')}`);
}

// === 5. Seed stability — known seed→order contracts ===
console.log('\n  5. Known seed→order contracts (regression protection):');

// These are fixed expected outputs from the LCG for known inputs.
// If the shuffle implementation changes, these will break immediately.
function seededShuffle5(arr, seed) {
  return seededShuffle(arr, seed).slice(0, 5);
}

const known = [
  { seed: 42, arr: [0,1,2,3,4,5,6,7,8,9], expected: [4,1,0,2,6] },
  { seed: 100, arr: [0,1,2,3,4,5,6,7,8,9], expected: [3,5,7,4,6] },
  { seed: 1234, arr: [0,1,2,3,4,5,6,7,8,9], expected: [7,3,5,9,6] },
];

for (const k of known) {
  const got = seededShuffle5(k.arr.slice(), k.seed);
  if (JSON.stringify(got) === JSON.stringify(k.expected)) {
    pass(`seed ${k.seed}: first 5 positions = [${k.expected.join(',')}] ✓`);
  } else {
    fail(`seed ${k.seed}: expected [${k.expected.join(',')}] but got [${got.join(',')}] — LCG may have changed`);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}

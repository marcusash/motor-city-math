// gp-study-progression-plan.js
// Generates a recommended exam order for Kai based on readiness and standards coverage

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Known metadata per exam (based on GP analysis)
const EXAM_META = {
  'retake-practice-1.json': { readiness: 100, standards: ['W2.b', 'W2.c', 'W3.a', 'W3.b'], difficulty: 'BASELINE' },
  'retake-practice-2.json': { readiness: 100, standards: ['W2.b', 'W2.c', 'W3.a', 'W3.b'], difficulty: 'BASELINE' },
  'retake-practice-3.json': { readiness: 83, standards: ['W2.b', 'W2.c', 'W3.b', 'W3.c'], difficulty: 'BUILDING' },
  'retake-practice-4.json': { readiness: 83, standards: ['W2.b', 'W2.c', 'W3.a', 'W3.b'], difficulty: 'BUILDING' },
  'retake-practice-5.json': { readiness: 83, standards: ['W2.b', 'W2.d', 'W3.b', 'W3.c'], difficulty: 'BUILDING' },
  'retake-practice-6.json': { readiness: 83, standards: ['W2.b', 'W2.c', 'W3.b', 'W3.d'], difficulty: 'BUILDING' },
  'retake-practice-7.json': { readiness: 78, standards: ['W2.b', 'W2.e', 'W3.b', 'W3.e'], difficulty: 'CHALLENGING' },
  'retake-practice-8.json': { readiness: 78, standards: ['W2.a', 'W2.b', 'W3.a', 'W3.b'], difficulty: 'CHALLENGING' },
  'retake-practice-9.json': { readiness: 78, standards: ['W2.a', 'W2.b', 'W3.a', 'W3.b'], difficulty: 'CHALLENGING' },
  'retake-practice-10.json': { readiness: 78, standards: ['W2.a', 'W2.b', 'W3.a', 'W3.c'], difficulty: 'ADVANCED' },
  'retake-practice-11.json': { readiness: 78, standards: ['W2.a', 'W2.b', 'W3.a', 'W3.c'], difficulty: 'ADVANCED' },
};

console.log('=== KAI STUDY PROGRESSION PLAN ===\n');
console.log('Recommended exam order (hardness-progressive, standards-diverse):\n');

const phases = [
  { label: 'Phase 1: Warm-Up (BASELINE)', filter: m => m.difficulty === 'BASELINE' },
  { label: 'Phase 2: Build Momentum (BUILDING)', filter: m => m.difficulty === 'BUILDING' },
  { label: 'Phase 3: Push (CHALLENGING)', filter: m => m.difficulty === 'CHALLENGING' },
  { label: 'Phase 4: Peak (ADVANCED)', filter: m => m.difficulty === 'ADVANCED' },
];

for (const phase of phases) {
  console.log(`  ${phase.label}`);
  for (const [file, meta] of Object.entries(EXAM_META)) {
    if (phase.filter(meta)) {
      const num = file.match(/\d+/)[0];
      console.log(`    RP${num} — Readiness: ${meta.readiness}% | Standards: ${meta.standards.join(', ')}`);
    }
  }
  console.log('');
}

console.log('Notes:');
console.log('  - Start RP1 or RP2 to establish baseline');
console.log('  - RP5 for W2.d practice (only 5 questions total — Kais weak spot)');
console.log('  - RP7 is the toughest non-advanced (W2.e coverage)');
console.log('  - RP10/11 are final exam simulators');
console.log('  - Allow 50-60 min per exam');
console.log('');
console.log('ADHD tip: Study session = 1 exam max. Short breaks between sections.');

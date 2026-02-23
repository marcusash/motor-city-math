#!/usr/bin/env node
// scripts/concept-coverage.cjs
// Computes concept-coverage density: per W2/W3 standard, how many total
// question-slots cover it across all 9 practice exams.
// Flags standards below the threshold (default 5 appearances).
// Run: node scripts/concept-coverage.cjs

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const THRESHOLD = parseInt(process.env.MCM_COVERAGE_THRESHOLD || '5', 10);

const examFiles = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

if (examFiles.length === 0) {
  console.log('No retake-practice-*.json files found.');
  process.exit(0);
}

// --- Count slots per standard ---
const standardSlots = {};   // standard -> total slots
const examCoverage = {};    // standard -> set of exam IDs that cover it

for (const filename of examFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
  const examId = data.exam_id || filename.replace('.json', '');

  for (const q of (data.questions || [])) {
    const std = q.standard;
    if (!std) continue;
    if (!standardSlots[std]) { standardSlots[std] = 0; examCoverage[std] = new Set(); }
    standardSlots[std]++;
    examCoverage[std].add(examId);
  }
}

// --- Report ---
console.log(`\n=== MCM Concept Coverage Density ===`);
console.log(`Exams analyzed: ${examFiles.length}  |  Threshold: ${THRESHOLD} appearances\n`);

const allStandards = Object.keys(standardSlots).sort();
let flagged = 0;

for (const std of allStandards) {
  const count = standardSlots[std];
  const examCount = examCoverage[std].size;
  const bar = '█'.repeat(Math.min(count, 20)).padEnd(20, '░');
  const flag = count < THRESHOLD ? ' <<< BELOW THRESHOLD' : '';
  console.log(`${std.padEnd(8)} ${String(count).padStart(3)} slots across ${examCount} exams  [${bar}]${flag}`);
  if (count < THRESHOLD) flagged++;
}

console.log('');

if (flagged > 0) {
  console.log(`${flagged} standard(s) below threshold (${THRESHOLD} appearances):`);
  for (const std of allStandards) {
    if (standardSlots[std] < THRESHOLD) {
      const examsWithIt = Array.from(examCoverage[std]).join(', ');
      console.log(`  ${std}: ${standardSlots[std]} slots in [${examsWithIt}]`);
    }
  }
  console.log('\nACTION: Prioritize these standards in RP10 design.');
} else {
  console.log('All standards meet coverage threshold.');
}
console.log('');

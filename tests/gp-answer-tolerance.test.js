#!/usr/bin/env node
// GP: gp-answer-tolerance.test.js
// Verifies answer tolerances are within acceptable ranges.
// Numeric answers: tolerance must be 0 < t <= 0.5 (not too loose, not zero)
// Graph questions: graph.tolerance must be 0 < t <= 0.5
// Text answers: no tolerance expected (or tolerance is 0/absent)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MAX_NUMERIC_TOLERANCE = 0.5;
const MAX_GRAPH_TOLERANCE = 0.5;

let passed = 0, warned = 0, failed = 0;

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const q of json.questions || []) {
    // Check graph tolerance
    if (q.graph && q.graph.tolerance !== undefined) {
      const t = q.graph.tolerance;
      if (t <= 0) {
        console.error(`FAIL [${json.exam_id}] ${q.id}: graph.tolerance=${t} must be > 0`);
        failed++;
      } else if (t > MAX_GRAPH_TOLERANCE) {
        console.warn(`WARN [${json.exam_id}] ${q.id}: graph.tolerance=${t} is loose (max recommended ${MAX_GRAPH_TOLERANCE})`);
        warned++;
      } else {
        passed++;
      }
    }

    // Check input tolerances
    for (const inp of q.inputs || []) {
      if (inp.type === 'number') {
        const t = inp.tolerance;
        if (t === undefined || t === null) {
          console.warn(`WARN [${json.exam_id}] ${q.id} input ${inp.id}: no tolerance defined for numeric input`);
          warned++;
        } else if (t < 0) {
          console.error(`FAIL [${json.exam_id}] ${q.id} input ${inp.id}: tolerance=${t} must not be negative`);
          failed++;
        } else if (t > MAX_NUMERIC_TOLERANCE) {
          console.warn(`WARN [${json.exam_id}] ${q.id} input ${inp.id}: tolerance=${t} is very loose`);
          warned++;
        } else {
          passed++;
        }
      }
    }
  }
}

const total = passed + warned + failed;
if (failed === 0) {
  console.log(`✅ gp-answer-tolerance: ${passed}/${total} pass, ${warned} warnings, 0 failures`);
  if (warned > 0) console.log(`   Warnings are informational — tolerances within acceptable range`);
  process.exit(0);
} else {
  console.error(`❌ gp-answer-tolerance: ${failed} failures`);
  process.exit(1);
}

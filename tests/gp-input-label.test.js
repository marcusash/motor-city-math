#!/usr/bin/env node
// GP: gp-input-label.test.js
// Verifies all inputs have a label field (required for exam.html to render correctly).
// Also verifies label is not empty string.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let passed = 0, failed = 0;

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) continue;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const q of json.questions || []) {
    for (const inp of q.inputs || []) {
      // Radio inputs use options for display; empty label is acceptable
      if (inp.type === 'radio') { passed++; continue; }
      if (inp.label && inp.label.trim().length > 0) {
        passed++;
      } else {
        console.error(`FAIL [${json.exam_id}] ${q.id} input ${inp.id}: missing or empty label`);
        failed++;
      }
    }
  }
}

const total = passed + failed;
if (failed === 0) {
  console.log(`✅ gp-input-label: ${passed}/${total} inputs have labels`);
  process.exit(0);
} else {
  console.error(`❌ gp-input-label: ${failed} inputs missing labels`);
  process.exit(1);
}

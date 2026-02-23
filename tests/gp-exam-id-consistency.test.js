#!/usr/bin/env node
// GP: gp-exam-id-consistency.test.js
// Verifies exam_id in JSON matches the filename (prevents copy-paste drift).
// Also verifies question IDs follow rpN-qM convention.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
let passed = 0, failed = 0;

for (let n = 1; n <= 10; n++) {
  const filename = `retake-practice-${n}`;
  const file = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(file)) { continue; }
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  // Check exam_id matches filename
  if (json.exam_id === filename) {
    passed++;
  } else {
    console.error(`FAIL: ${filename}.json has exam_id='${json.exam_id}', expected '${filename}'`);
    failed++;
  }

  // Check title exists
  if (json.title && json.title.length > 0) {
    passed++;
  } else {
    console.error(`FAIL: ${filename}.json missing or empty title`);
    failed++;
  }

  // Check question IDs follow convention rpN-qM
  const prefix = `rp${n}-`;
  for (const q of (json.questions || [])) {
    if (q.id && q.id.startsWith(prefix)) {
      passed++;
    } else {
      console.error(`FAIL: ${filename}.json question id='${q.id}' should start with '${prefix}'`);
      failed++;
    }
  }
}

const total = passed + failed;
if (failed === 0) {
  console.log(`✅ gp-exam-id-consistency: ${passed}/${total} checks pass (exam_ids, titles, question ID prefixes)`);
  process.exit(0);
} else {
  console.error(`❌ gp-exam-id-consistency: ${failed}/${total} failures`);
  process.exit(1);
}

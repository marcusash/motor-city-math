#!/usr/bin/env node
// GP: gp-version-check.test.js
// Verifies all RP exams have version field set to "2.0" (current standard).
// Catches stale version tags or exams that were never migrated.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CURRENT_VERSION = '2.0';

let passed = 0, failed = 0;

for (let n = 1; n <= 10; n++) {
  const file = path.join(DATA_DIR, `retake-practice-${n}.json`);
  if (!fs.existsSync(file)) { 
    console.error(`FAIL: retake-practice-${n}.json not found`);
    failed++;
    continue;
  }
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (json.version === CURRENT_VERSION) {
    passed++;
  } else {
    console.error(`FAIL: ${json.exam_id} has version='${json.version}', expected '${CURRENT_VERSION}'`);
    failed++;
  }
}

const total = passed + failed;
if (failed === 0) {
  console.log(`✅ gp-version-check: ${passed}/${total} exams at version ${CURRENT_VERSION}`);
  process.exit(0);
} else {
  console.error(`❌ gp-version-check: ${failed}/${total} exams have wrong version`);
  process.exit(1);
}

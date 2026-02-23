// gp-exam-file-count-is-stable.test.js — number of RP exam files should be 11 — regression guard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f));

const EXPECTED = 11;

console.log(`gp-exam-file-count-is-stable: ${RP_FILES.length} RP exam files (expected ${EXPECTED})`);
if (RP_FILES.length < EXPECTED) {
  console.log(`  FAIL: only ${RP_FILES.length} exams — ${EXPECTED - RP_FILES.length} missing!`);
  process.exit(1);
}
if (RP_FILES.length > EXPECTED) {
  console.log(`  INFO: ${RP_FILES.length} exams — ${RP_FILES.length - EXPECTED} extra (new exams added)`);
}
console.log(`OK — ${RP_FILES.length} RP exam files present`);

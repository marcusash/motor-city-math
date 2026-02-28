// gp-tests-dir-has-verify.test.js — tests/ directory must have verify-practice-exams.js

const fs = require('fs');
const path = require('path');

const TESTS_DIR = path.join(__dirname);
const REQUIRED = ['verify-practice-exams.js', 'cross-exam-verify.js'];

let pass = 0, fail = 0;
const failures = [];
const files = fs.readdirSync(TESTS_DIR);

for (const req of REQUIRED) {
  if (!files.includes(req)) {
    fail++;
    failures.push(`tests/${req} missing`);
  } else { pass++; }
}

console.log(`gp-tests-dir-has-verify: ${pass} required test files present, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — tests/ has all required verification scripts`);

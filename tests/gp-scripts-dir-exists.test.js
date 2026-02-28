// gp-scripts-dir-exists.test.js — scripts/ directory must exist with key scripts

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
const REQUIRED_SCRIPTS = ['gp-exam-health.js', 'gp-ci-gate.js'];

console.log(`gp-scripts-dir-exists: checking scripts/ directory`);
if (!fs.existsSync(SCRIPTS_DIR)) {
  console.log(`  FAIL: scripts/ directory does not exist`);
  process.exit(1);
}

const files = fs.readdirSync(SCRIPTS_DIR);
let pass = 0, fail = 0;
const failures = [];

for (const req of REQUIRED_SCRIPTS) {
  if (!files.includes(req)) {
    fail++;
    failures.push(`scripts/${req} missing`);
  } else { pass++; }
}

console.log(`gp-scripts-dir-exists: ${pass} required scripts present, ${fail} missing`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — scripts/ directory exists with ${files.length} files, all required scripts present`);

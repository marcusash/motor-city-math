// gp-scripts-dir-key-files-exist.test.js — scripts/ directory must contain key GP scripts

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');

const REQUIRED_SCRIPTS = [
  'gp-exam-health.js',
  'gp-ci-gate.js',
  'gp-standards-gap-report.js',
  'gp-exam-compare-consecutive.js',
  'gp-exam-coverage-matrix.js'
];

let pass = 0;
let fail = 0;
const failures = [];

for (const script of REQUIRED_SCRIPTS) {
  const scriptPath = path.join(SCRIPTS_DIR, script);
  if (fs.existsSync(scriptPath)) {
    pass++;
    console.log(`  FOUND: scripts/${script}`);
  } else {
    fail++;
    failures.push(`scripts/${script} is missing`);
  }
}

console.log(`gp-scripts-dir-key-files-exist: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} required scripts present`);

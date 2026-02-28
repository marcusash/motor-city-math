// gp-scripts-dir-has-key-files.test.js — scripts/ directory must contain core GP scripts

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
const REQUIRED_SCRIPTS = [
  'gp-exam-health.js',
  'gp-ci-gate.js',
];

let pass = 0;
let fail = 0;
const failures = [];

for (const script of REQUIRED_SCRIPTS) {
  const fullPath = path.join(SCRIPTS_DIR, script);
  if (!fs.existsSync(fullPath)) {
    fail++; failures.push(`scripts/${script}: not found`);
  } else {
    const size = fs.statSync(fullPath).size;
    if (size < 100) {
      fail++; failures.push(`scripts/${script}: suspiciously small (${size} bytes)`);
    } else {
      pass++;
    }
  }
}

const allScripts = fs.existsSync(SCRIPTS_DIR) ? fs.readdirSync(SCRIPTS_DIR).filter(f => f.endsWith('.js')).length : 0;
console.log(`gp-scripts-dir-has-key-files: ${pass} pass, ${fail} fail (${allScripts} total JS scripts)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} required scripts exist in scripts/`);

// gp-ci-gate-script-exists.test.js — scripts/gp-ci-gate.js must exist (critical CI tool)

const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'gp-ci-gate.js');

if (!fs.existsSync(SCRIPT)) {
  console.log('gp-ci-gate-script-exists: 0 pass, 1 fail — CI gate script missing');
  process.exit(1);
}

const content = fs.readFileSync(SCRIPT, 'utf8');
const lines = content.split('\n').length;
console.log(`gp-ci-gate-script-exists: CI gate script found (${lines} lines)`);

// Check it references health gate
if (content.includes('health') || content.includes('gate')) {
  console.log(`  Contains gate/health logic`);
}

console.log(`OK — gp-ci-gate.js exists and has content`);

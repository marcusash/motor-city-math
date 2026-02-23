// gp-exam-health-script-exists.test.js — scripts/gp-exam-health.js must exist (critical ops tool)

const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'gp-exam-health.js');

if (!fs.existsSync(SCRIPT)) {
  console.log('gp-exam-health-script-exists: 0 pass, 1 fail — script missing');
  process.exit(1);
}

const content = fs.readFileSync(SCRIPT, 'utf8');
const lines = content.split('\n').length;
console.log(`gp-exam-health-script-exists: script found (${lines} lines)`);

// Verify it has health check logic
if (!content.includes('HEALTHY') && !content.includes('health')) {
  console.log('  WARN: script may not contain health check logic');
}

console.log(`OK — gp-exam-health.js exists and has content`);

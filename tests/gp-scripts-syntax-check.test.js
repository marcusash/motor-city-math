// gp-no-console-errors-in-scripts.test.js — verify key scripts exist and are syntactically valid (Node.js parse check)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
const REQUIRED_SCRIPTS = [
  'gp-exam-health.js',
  'gp-morning-check.js',
  'gp-standards-coverage.js',
  'gp-stale-inbox-check.js',
  'gp-backup-audit.js',
  'gp-exam-manifest-check.js',
  'gp-data-quality-summary.js',
];

let pass = 0;
let fail = 0;
const issues = [];

for (const script of REQUIRED_SCRIPTS) {
  const scriptPath = path.join(SCRIPTS_DIR, script);
  if (!fs.existsSync(scriptPath)) {
    fail++;
    issues.push(`MISSING: ${script}`);
    continue;
  }
  
  try {
    execSync(`node --check "${scriptPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    pass++;
  } catch (e) {
    fail++;
    issues.push(`SYNTAX ERROR: ${script} — ${e.stderr || e.message}`);
  }
}

console.log(`gp-no-console-errors-in-scripts: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} GP scripts are present and syntactically valid`);

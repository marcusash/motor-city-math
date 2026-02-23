// gp-scripts-all-runnable.test.js — all gp-*.js scripts in scripts/ must exist and pass node --check

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
const gpScripts = fs.readdirSync(SCRIPTS_DIR)
  .filter(f => f.startsWith('gp-') && f.endsWith('.js'))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const script of gpScripts) {
  const scriptPath = path.join(SCRIPTS_DIR, script);
  try {
    execSync(`node --check "${scriptPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    pass++;
  } catch (e) {
    fail++;
    issues.push(`SYNTAX ERROR: ${script} — ${(e.stderr || e.message).split('\n')[0]}`);
  }
}

console.log(`gp-scripts-all-runnable: ${pass}/${pass + fail} scripts have valid syntax`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} GP scripts pass syntax check`);

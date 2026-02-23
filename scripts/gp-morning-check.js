// gp-morning-check.js — single morning ritual command for GP
// Run this at the start of every session. All 4 checks must pass before starting work.

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const checks = [
  { name: 'Health Gate (11/11)', cmd: 'node scripts/gp-exam-health.js' },
  { name: 'Verify Baseline (3337/3337)', cmd: 'node tests/verify-practice-exams.js' },
  { name: 'Cross-Exam Dedup (0 hard failures)', cmd: 'node tests/cross-exam-verify.js' },
  { name: 'JSON Lint (all data/ files valid)', cmd: 'node -e "const fs=require(\'fs\');const d=\'data\';fs.readdirSync(d).filter(f=>f.endsWith(\'.json\')).forEach(f=>{try{JSON.parse(fs.readFileSync(d+\'/\'+f,\'utf8\'))}catch(e){console.error(f,e.message);process.exit(1)}});console.log(\'JSON OK\')"' },
];

let allPass = true;
const results = [];

console.log('\nGP Morning Check — ' + new Date().toLocaleString());
console.log('='.repeat(50));

for (const check of checks) {
  process.stdout.write(`  ${check.name}... `);
  try {
    const out = execSync(check.cmd, { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
    const lastLine = out.trim().split('\n').pop();
    console.log(`PASS (${lastLine})`);
    results.push({ name: check.name, status: 'PASS' });
  } catch (err) {
    console.log('FAIL');
    console.log('    ' + (err.stdout || err.message || '').split('\n').slice(0, 3).join('\n    '));
    results.push({ name: check.name, status: 'FAIL' });
    allPass = false;
  }
}

console.log('='.repeat(50));
if (allPass) {
  console.log('ALL CHECKS PASS — system healthy, ready to work');
} else {
  const failed = results.filter(r => r.status === 'FAIL').map(r => r.name).join(', ');
  console.log(`BLOCKED — fix before starting work: ${failed}`);
  console.log('See docs/agents/gp-emergency-playbook.md for remediation steps.');
  process.exit(1);
}

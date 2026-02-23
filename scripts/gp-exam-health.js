#!/usr/bin/env node
// gp-exam-health.js — Single command: run all quality checks and report
const { execSync } = require('child_process');
const checks = [
  ['verify-practice-exams', 'node tests/verify-practice-exams.js'],
  ['cross-exam-verify', 'node tests/cross-exam-verify.js'],
  ['field-completeness', 'node tests/gp-field-completeness.test.js'],
  ['answer-uniqueness', 'node tests/gp-answer-uniqueness.test.js'],
  ['solution-steps', 'node tests/gp-solution-steps.test.js'],
  ['feedback-length', 'node tests/gp-feedback-length.test.js'],
  ['manifest-integrity', 'node tests/gp-manifest-integrity.test.js'],
  ['field-audit', 'node scripts/gp-rp-field-audit.js'],
];
let pass = 0, fail = 0;
console.log('\n=== GP EXAM HEALTH CHECK ===\n');
for (const [name, cmd] of checks) {
  try {
    execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${name}`); pass++;
  } catch(e) {
    console.log(`❌ ${name}`);
    console.log(e.stdout.split('\n').filter(l=>l.includes('FAIL')).join('\n'));
    fail++;
  }
}
console.log(`\n${pass + fail} checks: ${pass} pass, ${fail} fail`);
console.log(fail === 0 ? '✅ SYSTEM HEALTHY — ready for Kai' : `❌ ${fail} check(s) failing — fix before publish`);
process.exit(fail > 0 ? 1 : 0);
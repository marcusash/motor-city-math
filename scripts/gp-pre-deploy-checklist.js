#!/usr/bin/env node
// gp-pre-deploy-checklist.js — interactive pre-deploy checklist runner
// Run before any session with Kai to verify system health

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function run(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe', cwd: ROOT });
    return { ok: true, output: out.trim() };
  } catch (e) {
    return { ok: false, output: ((e.stdout || '') + (e.stderr || '')).trim() };
  }
}

const checks = [
  {
    label: '1. Exam baseline (3337/3337)',
    cmd: 'node tests/verify-practice-exams.js',
    critical: true,
    successKeyword: 'ALL VERIFIED',
  },
  {
    label: '2. Health gate (11/11)',
    cmd: 'node scripts/gp-exam-health.js',
    critical: true,
    successKeyword: 'SYSTEM HEALTHY',
  },
  {
    label: '3. CI gate (22/22)',
    cmd: 'node scripts/gp-ci-gate.js',
    critical: true,
    successKeyword: 'ALL GATES PASS',
  },
  {
    label: '4. All JSON valid',
    cmd: 'node tests/gp-all-json-valid.test.js',
    critical: true,
    successKeyword: 'valid',
  },
  {
    label: '5. No em dashes (all fields)',
    cmd: 'node tests/gp-no-emdash-all-fields.test.js',
    critical: true,
    successKeyword: 'em-dash free',
  },
  {
    label: '6. Backup audit',
    cmd: 'node scripts/gp-backup-audit.js',
    critical: false,
    successKeyword: 'HEALTHY',
  },
];

console.log('\n🏀 Motor City Math — Pre-Deploy Checklist\n');
console.log(`Time: ${new Date().toLocaleString()}\n`);

let allGood = true;

for (const check of checks) {
  const { ok, output } = run(check.cmd);
  const lastLine = output.split('\n').pop() || '';
  const passed = ok && lastLine.includes(check.successKeyword);
  
  if (passed) {
    console.log(`  ✅ ${check.label}`);
  } else {
    const marker = check.critical ? '  ❌' : '  ⚠️';
    console.log(`${marker} ${check.label}`);
    if (!ok) console.log(`     ${lastLine.substring(0, 100)}`);
    if (check.critical) allGood = false;
  }
}

console.log('');
if (allGood) {
  console.log('🟢 SYSTEM READY — safe to study with Kai\n');
} else {
  console.log('🔴 SYSTEM NOT READY — fix critical failures before study session\n');
  process.exit(1);
}

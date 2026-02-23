#!/usr/bin/env node
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');

// --exam retake-practice-N: run single-exam validators only (skips cross-exam checks)
const examFlag = process.argv.indexOf('--exam');
const singleExam = examFlag !== -1 ? process.argv[examFlag + 1] : null;
if (singleExam) {
  console.log(`Single-exam mode: ${singleExam}`);
}

const allTasks = [
  {
    name: 'verify-practice-exams',
    args: [path.join(root, 'tests', 'verify-practice-exams.js')],
    singleExamEnv: { MCM_EXAM_FILTER: singleExam }
  },
  {
    name: 'cross-exam-verify',
    args: [path.join(root, 'tests', 'cross-exam-verify.js')],
    skipOnSingleExam: true
  },
  {
    name: 'validate-standards-map',
    args: [path.join(root, 'scripts', 'validate-standards-map.cjs')],
    skipOnSingleExam: true
  },
  {
    name: 'validate-exam-contract',
    args: [path.join(root, 'scripts', 'validate-exam-contract.cjs')],
    singleExamEnv: { MCM_EXAM_FILTER: singleExam }
  },
  {
    name: 'validate-exam-schema',
    args: [path.join(root, 'scripts', 'validate-exam-schema.cjs')],
    singleExamEnv: { MCM_EXAM_FILTER: singleExam }
  }
];

const tasks = singleExam
  ? allTasks.filter((t) => !t.skipOnSingleExam)
  : allTasks;

let failed = false;

for (const task of tasks) {
  console.log(`\n=== ${task.name} ===`);
  const env = singleExam && task.singleExamEnv
    ? Object.assign({}, process.env, task.singleExamEnv)
    : process.env;
  const result = spawnSync(process.execPath, task.args, { stdio: 'inherit', env });
  if (result.error) {
    console.error(`Failed to run ${task.name}: ${result.error.message}`);
    failed = true;
    continue;
  }
  if (result.status !== 0) {
    failed = true;
  }
}

// Pre-exit: warn on exams missing schema_version (advisory, not blocking)
(function checkSchemaVersionPresence() {
  const fs = require('fs');
  const dataDir = path.join(root, 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'));
  const missing = [];
  for (const f of files) {
    try {
      const exam = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
      if (!exam.schema_version) missing.push(f);
    } catch (_) { /* json errors caught by validator above */ }
  }
  if (missing.length > 0) {
    console.warn(`\n[WARN] schema_version missing from: ${missing.join(', ')}`);
    console.warn('       Run: node scripts/add-schema-version.cjs to fix\n');
  }
})();

if (failed) {
  console.error('\nCI data gate failed.');
  process.exit(1);
}

console.log('\nCI data gate passed.');

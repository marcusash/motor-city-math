#!/usr/bin/env node
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');

const tasks = [
  {
    name: 'verify-practice-exams',
    args: [path.join(root, 'tests', 'verify-practice-exams.js')]
  },
  {
    name: 'cross-exam-verify',
    args: [path.join(root, 'tests', 'cross-exam-verify.js')]
  },
  {
    name: 'validate-standards-map',
    args: [path.join(root, 'scripts', 'validate-standards-map.cjs')]
  },
  {
    name: 'validate-exam-contract',
    args: [path.join(root, 'scripts', 'validate-exam-contract.cjs')]
  }
];

let failed = false;

for (const task of tasks) {
  console.log(`\n=== ${task.name} ===`);
  const result = spawnSync(process.execPath, task.args, { stdio: 'inherit' });
  if (result.error) {
    console.error(`Failed to run ${task.name}: ${result.error.message}`);
    failed = true;
    continue;
  }
  if (result.status !== 0) {
    failed = true;
  }
}

if (failed) {
  console.error('\nCI data gate failed.');
  process.exit(1);
}

console.log('\nCI data gate passed.');

#!/usr/bin/env node
/**
 * gi-healthcheck.cjs
 * GI single-command health check: runs all GI analytics + CI gate.
 * Prints pass/fail per tool with timing. Exit 0 = all green.
 *
 * Usage: node scripts/gi-healthcheck.cjs
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NODE = process.execPath;

const TOOLS = [
  {
    name: 'Schema Validation (CI Gate)',
    cmd: [path.join(ROOT, 'scripts', 'ci-data-gate.cjs')],
  },
  {
    name: 'Cross-Exam Uniqueness',
    cmd: [path.join(ROOT, 'tests', 'cross-exam-verify.js')],
  },
  {
    name: 'Practice Exam Verification',
    cmd: [path.join(ROOT, 'tests', 'verify-practice-exams.js')],
  },
  {
    name: 'Concept Coverage',
    cmd: [path.join(ROOT, 'scripts', 'concept-coverage.cjs')],
    warn_only: true, // W2.d below threshold is expected until RP11 ships
  },
  {
    name: 'Score Velocity',
    cmd: [path.join(ROOT, 'scripts', 'score-velocity.cjs')],
    warn_only: true, // no score data yet
  },
  {
    name: 'QA Summary',
    cmd: [path.join(ROOT, 'scripts', 'build-qa-summary.cjs')],
  },
  {
    name: 'Answer Space Density',
    cmd: [path.join(ROOT, 'scripts', 'gi-answer-space-density.cjs')],
  },
  {
    name: 'Question Type Distribution',
    cmd: [path.join(ROOT, 'scripts', 'gi-question-type-distribution.cjs')],
  },
  {
    name: 'OCR Confidence Tests',
    cmd: [path.join(ROOT, 'tests', 'property', 'ocr-confidence.test.mjs')],
  },
];

function run(tool) {
  const start = Date.now();
  const result = spawnSync(NODE, tool.cmd, { encoding: 'utf8', cwd: ROOT, timeout: 60000 });
  const elapsed = Date.now() - start;
  return {
    name: tool.name,
    warn_only: !!tool.warn_only,
    exit_code: result.status,
    elapsed_ms: elapsed,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error ? result.error.message : null,
  };
}

function main() {
  console.log('\n==============================');
  console.log('  GI Healthcheck');
  console.log('==============================\n');

  const results = [];
  let failures = 0;
  let warnings = 0;

  for (const tool of TOOLS) {
    process.stdout.write(`Running: ${tool.name}... `);
    const r = run(tool);
    results.push(r);

    const ok = r.exit_code === 0 && !r.error;
    const tag = ok ? 'PASS' : (r.warn_only ? 'WARN' : 'FAIL');
    const timeStr = `${r.elapsed_ms}ms`;

    if (!ok) {
      if (r.warn_only) warnings++;
      else failures++;
    }

    console.log(`${tag} (${timeStr})`);
    if (!ok && r.stderr) {
      console.log('  stderr:', r.stderr.split('\n').slice(0, 3).join(' | '));
    }
  }

  const totalMs = results.reduce((s, r) => s + r.elapsed_ms, 0);
  console.log('\n------------------------------');
  console.log(`Total time: ${totalMs}ms`);
  console.log(`Pass: ${results.filter(r => r.exit_code === 0).length} / ${results.length}`);
  if (warnings > 0) console.log(`Warnings (expected): ${warnings}`);
  if (failures > 0) {
    console.log(`Hard failures: ${failures}`);
    console.log('\nStatus: FAIL');
    process.exit(1);
  } else {
    console.log('\nStatus: HEALTHY');
    process.exit(0);
  }
}

main();

#!/usr/bin/env node
/**
 * gi-daily-report.cjs
 * One-shot script: runs all GI analytics tools, prints a readable summary.
 * Exit 0 if all healthy, exit 1 if any hard failure.
 *
 * Usage: node scripts/gi-daily-report.cjs
 */

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const NODE = process.execPath;

function run(scriptPath, args = []) {
  const start = Date.now();
  const result = spawnSync(NODE, [scriptPath, ...args], {
    encoding: 'utf8',
    cwd: ROOT,
    timeout: 60000,
  });
  return {
    ok: result.status === 0 && !result.error,
    elapsed: Date.now() - start,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
    error: result.error ? result.error.message : null,
  };
}

function section(title) {
  const line = '='.repeat(50);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(line);
}

function main() {
  const date = new Date().toISOString().split('T')[0];
  console.log(`\n${'#'.repeat(60)}`);
  console.log(`  GI Daily Report — ${date}`);
  console.log(`${'#'.repeat(60)}`);

  let failures = 0;

  // 1. CI Gate
  section('1. CI Data Gate');
  const gate = run(path.join(ROOT, 'scripts', 'ci-data-gate.cjs'));
  if (gate.ok) {
    const summary = gate.stdout.split('\n').filter(l => l.includes('Schema') || l.includes('PASS') || l.includes('CI data')).join('\n');
    console.log(summary || 'PASS');
  } else {
    console.error('FAIL — CI gate has errors:');
    console.error(gate.stdout.split('\n').slice(-10).join('\n'));
    failures++;
  }

  // 2. Cross-exam uniqueness
  section('2. Cross-Exam Uniqueness');
  const cross = run(path.join(ROOT, 'tests', 'cross-exam-verify.js'));
  if (cross.ok) {
    const hardLine = cross.stdout.split('\n').find(l => l.includes('hard fail') || l.includes('PASS') || l.includes('Hard'));
    console.log(hardLine || 'PASS — 0 hard failures');
  } else {
    console.error('FAIL — cross-exam collisions detected');
    console.error(cross.stdout.split('\n').filter(l => l.includes('HARD')).join('\n'));
    failures++;
  }

  // 3. Concept coverage
  section('3. Concept Coverage');
  const cov = run(path.join(ROOT, 'scripts', 'concept-coverage.cjs'));
  const covLines = cov.stdout.split('\n').filter(l => l.match(/W[23]\./));
  const belowThreshold = covLines.filter(l => l.includes('BELOW'));
  if (belowThreshold.length === 0) {
    console.log('All standards at or above threshold.');
  } else {
    console.log('Standards below threshold:');
    belowThreshold.forEach(l => console.log(' ', l.trim()));
  }

  // 4. QA Summary
  section('4. QA Summary');
  const qa = run(path.join(ROOT, 'scripts', 'build-qa-summary.cjs'));
  const qaLine = qa.stdout.split('\n').find(l => l.includes('exams') || l.includes('PASS') || l.includes('missing'));
  console.log(qaLine || (qa.ok ? 'PASS' : 'FAIL'));
  if (!qa.ok) failures++;

  // 5. Answer space density
  section('5. Answer Space Density (Top 3 Crowded Standards)');
  const density = run(path.join(ROOT, 'scripts', 'gi-answer-space-density.cjs'));
  if (density.ok) {
    const rows = density.stdout.split('\n').filter(l => l.match(/^W[23]\./));
    const sorted = rows
      .map(l => {
        const m = l.match(/(\d+\.?\d*)%/);
        return { line: l, pct: m ? parseFloat(m[1]) : 0 };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
    sorted.forEach(r => console.log(' ', r.line.trim()));
  }

  // 6. Score velocity (summary line)
  section('6. Score Velocity');
  const vel = run(path.join(ROOT, 'scripts', 'score-velocity.cjs'));
  if (vel.ok) {
    const summaryLines = vel.stdout.split('\n').filter(l => l.includes('IMPROVING') || l.includes('PLATEAU') || l.includes('DECLINING'));
    if (summaryLines.length === 0) {
      console.log('No score data available yet.');
    } else {
      summaryLines.forEach(l => console.log(' ', l.trim()));
    }
  } else {
    console.log('No score data (expected).');
  }

  // Final status
  const divider = '='.repeat(60);
  console.log(`\n${divider}`);
  console.log(`  Status: ${failures === 0 ? 'HEALTHY' : `${failures} FAILURE(S) — action required`}`);
  console.log(`  Generated: ${new Date().toISOString()}`);
  console.log(divider + '\n');

  if (failures > 0) process.exit(1);
}

main();

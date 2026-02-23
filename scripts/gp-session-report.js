#!/usr/bin/env node
// gp-session-report.js — generate a sprint summary report for Marcus review
// Shows: commit count, test count, scripts count, fixes made, issues filed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TESTS_DIR = path.join(ROOT, 'tests');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', cwd: ROOT, stdio: 'pipe' }).trim();
  } catch (e) {
    return '';
  }
}

// Count assets
const gpTests = fs.readdirSync(TESTS_DIR).filter(f => /^gp-.*\.test\.js$/.test(f)).length;
const gpScripts = fs.readdirSync(SCRIPTS_DIR).filter(f => /^gp-.*\.js$/.test(f)).length;

// Recent GP commits
const recentCommits = run('git --no-pager log --oneline -20 --author="Copilot"');
const commitLines = recentCommits ? recentCommits.split('\n').filter(l => l.includes('GP:')) : [];

// Inbox messages sent
const grindInboxGR = path.join(ROOT, '.agent-comms', 'grind', 'inbox-GR');
const grMessages = fs.existsSync(grindInboxGR)
  ? fs.readdirSync(grindInboxGR).filter(f => f.includes('from-GP')).length
  : 0;

console.log('=== GP Sprint Report ===');
console.log(`Generated: ${new Date().toISOString()}`);
console.log('');
console.log('ASSETS');
console.log(`  GP tests:   ${gpTests}`);
console.log(`  GP scripts: ${gpScripts}`);
console.log(`  GR messages sent (inbox): ${grMessages}`);
console.log('');
console.log('RECENT GP COMMITS (last 20):');
commitLines.slice(0, 10).forEach(l => console.log(' ', l));
if (commitLines.length > 10) console.log(`  ... and ${commitLines.length - 10} more`);
console.log('');
console.log('BASELINES');
console.log('  Run: node tests/verify-practice-exams.js (expect 3337/3337)');
console.log('  Run: node scripts/gp-ci-gate.js (expect 22/22 pass)');
console.log('  Run: node scripts/gp-exam-health.js (expect 11/11 pass)');

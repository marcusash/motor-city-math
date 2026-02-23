// gp-sprint-metrics.js — quick metrics snapshot for sprint reporting

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function countFiles(dir, pattern) {
  try {
    return fs.readdirSync(dir).filter(f => pattern.test(f)).length;
  } catch { return 0; }
}

function runCommand(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return e.stdout ? e.stdout.trim() : 'ERROR';
  }
}

const timestamp = new Date().toISOString().split('T')[0];
const gpTests = countFiles(path.join(ROOT, 'tests'), /^gp-.*\.test\.js$/);
const gpScripts = countFiles(path.join(ROOT, 'scripts'), /^gp-.*\.js$/);
const totalTests = countFiles(path.join(ROOT, 'tests'), /\.test\.js$/);
const dataFiles = countFiles(path.join(ROOT, 'data'), /^retake-practice-\d+\.json$/);
const backupFiles = countFiles(path.join(ROOT, 'data', '_backups'), /\.json$/);
const docFiles = countFiles(path.join(ROOT, 'docs', 'agents'), /\.md$/);

// Recent commit count
const recentCommits = runCommand('git log --oneline --since="7 days ago" -- . | wc -l').replace(/\s/g, '');
const gpCommits = runCommand('git log --oneline --since="7 days ago" --grep="^GP:" | wc -l').replace(/\s/g, '');

console.log(`\n=== GP SPRINT METRICS (${timestamp}) ===\n`);
console.log(`Tests`);
console.log(`  GP tests:         ${gpTests}`);
console.log(`  Total tests:      ${totalTests}`);
console.log(`  GP share:         ${Math.round(gpTests/totalTests*100)}%`);
console.log(``);
console.log(`Scripts & Docs`);
console.log(`  GP scripts:       ${gpScripts}`);
console.log(`  Agent docs:       ${docFiles}`);
console.log(``);
console.log(`Data`);
console.log(`  Exam files:       ${dataFiles}`);
console.log(`  Backup files:     ${backupFiles}`);
console.log(``);
console.log(`Git`);
console.log(`  Commits (7d):     ${recentCommits}`);
console.log(`  GP commits (7d):  ${gpCommits}`);
console.log(``);

// Run baselines
console.log(`Baselines`);
const healthOut = runCommand('node scripts/gp-exam-health.js');
const healthLine = healthOut.split('\n').find(l => l.includes('pass')) || 'unknown';
console.log(`  Health gate:      ${healthLine.trim()}`);

const verifyOut = runCommand('node tests/verify-practice-exams.js');
const verifyLine = verifyOut.split('\n').find(l => l.includes('passed')) || 'unknown';
console.log(`  Exam verify:      ${verifyLine.trim()}`);
console.log(``);
console.log(`=== END METRICS ===\n`);

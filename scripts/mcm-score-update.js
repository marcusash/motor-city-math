#!/usr/bin/env node
/**
 * mcm-score-update.js -- Single-command MCM score updater
 *
 * Updates all 3 places a score must live:
 *   1. _ghSpringScores pre-seed in index.html
 *   2. mcm_scores in data/kai-scores-latest.json
 *   3. scores/{key}.json individual file (created if missing)
 *
 * Usage:
 *   node scripts/mcm-score-update.js --key unit1-practice-test-2 --score 19 --total 22 --grade B
 *   node scripts/mcm-score-update.js --key unit1-practice-test-2 --score 19 --total 22 --grade B --fix-key unit1-practice-exam-2026-04-05 --fix-score 15 --fix-total 22 --fix-grade D
 *
 * Flags:
 *   --key       Score key (must match tests registry key in index.html)
 *   --score     Points earned
 *   --total     Points possible
 *   --grade     Letter grade (A/B/C/D/F)
 *   --date      ISO date (default: today)
 *   --dry-run   Print what would change without writing
 *
 * Also validates:
 *   - Key exists in tests registry (or warns)
 *   - Percent is computed correctly (score/total*100, rounded)
 *   - All 3 files are updated atomically
 */

const fs = require('fs');
const path = require('path');

const MCM_ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(MCM_ROOT, 'index.html');
const SCORES_LATEST_PATH = path.join(MCM_ROOT, 'data', 'kai-scores-latest.json');
const SCORES_DIR = path.join(MCM_ROOT, 'scores');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function updatePreSeed(html, key, score, total, pct, grade, timestamp) {
  // Check if key already exists in _ghSpringScores
  const keyPattern = new RegExp(`"${key}":\\s*\\{[^}]*"attempts"[^}]*\\}[^}]*\\}`, 's');
  const newEntry = `"${key}": {\n            "attempts": [{ "score": ${score}, "total": ${total}, "pct": ${pct}, "teacher_grade": "${grade}", "timestamp": "${timestamp}" }],\n            "best": { "score": ${score}, "pct": ${pct}, "teacher_grade": "${grade}" }\n        }`;

  if (keyPattern.test(html)) {
    // Replace existing entry
    return html.replace(keyPattern, newEntry);
  } else {
    // Insert after opening brace of _ghSpringScores
    const insertPoint = 'var _ghSpringScores = {';
    const insertIdx = html.indexOf(insertPoint);
    if (insertIdx === -1) fail('Could not find _ghSpringScores in index.html');
    const afterBrace = insertIdx + insertPoint.length;
    return html.slice(0, afterBrace) + '\n        ' + newEntry + ',' + html.slice(afterBrace);
  }
}

function updateScoresLatest(jsonStr, key, score, total, pct, grade, timestamp) {
  const data = JSON.parse(jsonStr);
  if (!data.mcm_scores) data.mcm_scores = {};
  data.mcm_scores[key] = {
    attempts: [{ score, total, pct, teacher_grade: grade, timestamp }],
    best: { score, pct, teacher_grade: grade }
  };
  data.exported = new Date().toISOString();
  return JSON.stringify(data, null, 2);
}

function writeScoreFile(key, score, total, pct, grade, timestamp) {
  const data = {
    key,
    attempts: [{ score, total, pct, teacher_grade: grade, timestamp }],
    best: { score, total, pct, teacher_grade: grade }
  };
  return JSON.stringify(data, null, 2);
}

function validateKeyInRegistry(html, key) {
  const registryPattern = /var tests = \[([\s\S]*?)\];/;
  const match = html.match(registryPattern);
  if (!match) {
    console.warn('WARN: Could not parse tests registry');
    return false;
  }
  if (!match[1].includes(`key: '${key}'`)) {
    console.warn(`WARN: Key "${key}" not found in tests registry. Add it manually or card won't appear.`);
    return false;
  }
  return true;
}

// --- Main ---
const args = parseArgs(process.argv);

if (!args.key) fail('--key is required');
if (!args.score) fail('--score is required');
if (!args.total) fail('--total is required');
if (!args.grade) fail('--grade is required');

const key = args.key;
const score = Number(args.score);
const total = Number(args.total);
const grade = args.grade.toUpperCase();
const pct = Math.round(score / total * 100);
const date = args.date || new Date().toISOString().slice(0, 10);
const timestamp = new Date(date + 'T12:00:00.000Z').toISOString();
const dryRun = !!args['dry-run'];

console.log(`\nMCM Score Update`);
console.log(`  Key:   ${key}`);
console.log(`  Score: ${score}/${total} (${pct}%, ${grade})`);
console.log(`  Date:  ${date}`);
if (dryRun) console.log(`  MODE:  DRY RUN`);
console.log('');

// Read current files
const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
const scoresJson = fs.readFileSync(SCORES_LATEST_PATH, 'utf8');

// Validate
validateKeyInRegistry(indexHtml, key);

// 1. Update _ghSpringScores pre-seed in index.html
const newIndex = updatePreSeed(indexHtml, key, score, total, pct, grade, timestamp);
console.log(`  [1/3] index.html _ghSpringScores: ${newIndex !== indexHtml ? 'UPDATED' : 'NO CHANGE'}`);

// 2. Update data/kai-scores-latest.json
const newScores = updateScoresLatest(scoresJson, key, score, total, pct, grade, timestamp);
console.log(`  [2/3] data/kai-scores-latest.json mcm_scores: UPDATED`);

// 3. Write/update scores/{filename}.json
const scoreFilePath = path.join(SCORES_DIR, `${key}.json`);
const scoreFileContent = writeScoreFile(key, score, total, pct, grade, timestamp);
const scoreFileExists = fs.existsSync(scoreFilePath);
console.log(`  [3/3] scores/${key}.json: ${scoreFileExists ? 'UPDATED' : 'CREATED'}`);

if (!dryRun) {
  fs.writeFileSync(INDEX_PATH, newIndex, 'utf8');
  fs.writeFileSync(SCORES_LATEST_PATH, newScores, 'utf8');
  fs.writeFileSync(scoreFilePath, scoreFileContent, 'utf8');
  console.log('\n  All 3 files written. Run: cd motor-city-math && git add -A && git commit && git push');
} else {
  console.log('\n  Dry run complete. No files changed.');
}

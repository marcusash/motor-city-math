#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const examPattern = /^retake-practice-\d+\.json$/;
const scorePattern = /^kai-scores-(\d{4}-\d{2}-\d{2})\.json$/;

function loadAttemptedExams() {
  const attempted = new Set();
  const scoreFiles = fs.readdirSync(dataDir).filter((f) => scorePattern.test(f));
  for (const sf of scoreFiles) {
    const scores = JSON.parse(fs.readFileSync(path.join(dataDir, sf), 'utf8'));
    // Score files use mcm_scores dict: keys are like 'mcm-retake-practice-1'
    if (scores.mcm_scores && typeof scores.mcm_scores === 'object') {
      for (const key of Object.keys(scores.mcm_scores)) {
        // Strip 'mcm-' prefix to get exam_id
        attempted.add(key.replace(/^mcm-/, ''));
      }
    }
    // Fallback: flat exam_id field or array
    const examId = scores.exam_id || scores.examId;
    if (examId) attempted.add(examId);
    if (Array.isArray(scores)) {
      scores.forEach((s) => { if (s.exam_id) attempted.add(s.exam_id); });
    }
  }
  return attempted;
}
const staleDaysArg = process.argv.find(a => a.startsWith('--stale-days='));
const thresholdDays = staleDaysArg
  ? Number.parseInt(staleDaysArg.split('=')[1], 10)
  : Number.parseInt(process.env.MCM_FRESHNESS_DAYS || '14', 10);
const strictMode = process.env.MCM_FRESHNESS_STRICT === '1';

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getLatestScoreDate() {
  const files = fs.readdirSync(dataDir);
  const dates = files
    .map((file) => {
      const match = file.match(scorePattern);
      return match ? parseDate(match[1]) : null;
    })
    .filter(Boolean)
    .sort((a, b) => b - a);
  return dates[0] || null;
}

const referenceDate = getLatestScoreDate() || new Date();
const attemptedExams = loadAttemptedExams();
const exams = fs.readdirSync(dataDir).filter((file) => examPattern.test(file)).sort();

let failures = 0;

console.log(`Reference date: ${referenceDate.toISOString().slice(0, 10)}`);
console.log(`Freshness threshold: ${thresholdDays} days`);

for (const file of exams) {
  const fullPath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const created = parseDate(data.created) || new Date(fs.statSync(fullPath).mtime);
  const ageDays = Math.floor((referenceDate - created) / (24 * 60 * 60 * 1000));
  const label = data.exam_id || file.replace('.json', '');
  const status = ageDays > thresholdDays ? 'STALE' : 'OK';
  const attempted = attemptedExams.has(label) ? '' : ' ⚠️  NO_ATTEMPTS';
  console.log(`${label}: ${created.toISOString().slice(0, 10)} (${ageDays} days) ${status}${attempted}`);
  if (ageDays > thresholdDays) failures++;
}

if (failures > 0) {
  console.warn(`${failures} exam set(s) exceed freshness threshold.`);
  if (strictMode) process.exit(1);
}

// Report exams with no Kai attempt data
const noAttemptExams = exams.filter((f) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  const label = data.exam_id || f.replace('.json', '');
  return !attemptedExams.has(label);
});
if (noAttemptExams.length > 0) {
  console.log(`\nExams with 0 recorded Kai attempts (${noAttemptExams.length}):`);
  noAttemptExams.forEach((f) => console.log(`  - ${f}`));
  console.log('Consider: is Kai aware of these exams? Are score files being saved correctly?');
}

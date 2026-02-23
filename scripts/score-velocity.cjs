#!/usr/bin/env node
// scripts/score-velocity.cjs
// Reads all data/kai-scores-*.json files and computes Kai's score trajectory.
// Reports: per-exam best score, date, trend (improving/plateau/regressing),
// per-section breakdown, and per-standard mastery based on latest score.
// Run: node scripts/score-velocity.cjs

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// --- Load all score files ---

const scoreFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('kai-scores-') && f.endsWith('.json') && f !== 'kai-scores-latest.json')
  .sort(); // sort by filename = sort by date ascending

const allData = scoreFiles.map(f => {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
  return { file: f, date: f.replace('kai-scores-', '').replace('.json', ''), data: raw };
});

if (allData.length === 0) {
  console.log('No kai-scores-*.json files found.');
  process.exit(0);
}

// --- Merge scores across files (latest file for each exam = source of truth) ---

// Build a map: examId -> [{date, score, total, pct, sections, questions}]
const examHistory = {};

for (const { date, data } of allData) {
  const scores = data.mcm_scores || {};
  for (const [examId, examData] of Object.entries(scores)) {
    if (!examData.attempts || examData.attempts.length === 0) continue;
    for (const attempt of examData.attempts) {
      if (attempt.score == null) continue;
      if (!examHistory[examId]) examHistory[examId] = [];
      examHistory[examId].push({
        date,
        score: attempt.score,
        total: attempt.total,
        pct: attempt.pct,
        sections: attempt.sections || {},
        questions: attempt.questions || {}
      });
    }
  }
}

// Deduplicate: keep only one entry per (examId, date) - keep highest score
for (const [examId, entries] of Object.entries(examHistory)) {
  const byDate = {};
  for (const e of entries) {
    if (!byDate[e.date] || e.score > byDate[e.date].score) {
      byDate[e.date] = e;
    }
  }
  examHistory[examId] = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
}

// --- Compute per-standard mastery from all recorded question results ---

const standardCorrect = {};
const standardTotal = {};

for (const entries of Object.values(examHistory)) {
  // Use latest attempt per exam for standard mastery
  const latest = entries[entries.length - 1];
  for (const [, qdata] of Object.entries(latest.questions)) {
    const std = qdata.standard;
    const correct = qdata.correct;
    if (!std || correct == null) continue;
    if (!standardCorrect[std]) { standardCorrect[std] = 0; standardTotal[std] = 0; }
    standardTotal[std]++;
    if (correct === true) standardCorrect[std]++;
  }
}

// --- Output ---

console.log('\n=== MCM Score Velocity Report ===\n');
console.log(`Score files analyzed: ${scoreFiles.join(', ')}`);
console.log(`Exams with recorded scores: ${Object.keys(examHistory).length}\n`);

// Sort exams: MVP first, then RP1-9
const sortedExams = Object.keys(examHistory).sort((a, b) => {
  if (a.includes('mvp')) return -1;
  if (b.includes('mvp')) return 1;
  return a.localeCompare(b);
});

let totalImproving = 0;
let totalPlateau = 0;
let totalRegressing = 0;

for (const examId of sortedExams) {
  const entries = examHistory[examId];
  const label = examId.replace('mcm-', '').replace('mcm-nonlinear-exam-', 'MVP');
  const latest = entries[entries.length - 1];
  const best = entries.reduce((b, e) => e.score > b.score ? e : b, entries[0]);

  // Trajectory
  let trajectory = 'single';
  let delta = '';
  if (entries.length >= 2) {
    const first = entries[0];
    const diff = latest.score - first.score;
    if (diff > 0) { trajectory = 'IMPROVING'; totalImproving++; }
    else if (diff < 0) { trajectory = 'REGRESSING'; totalRegressing++; }
    else { trajectory = 'PLATEAU'; totalPlateau++; }
    delta = ` (${diff >= 0 ? '+' : ''}${diff} pts vs first attempt)`;
  }

  // Score bar
  const filled = Math.round((latest.pct / 100) * 15);
  const bar = '█'.repeat(filled) + '░'.repeat(15 - filled);

  console.log(`${label.padEnd(30)} ${String(latest.score).padStart(2)}/${latest.total}  ${String(latest.pct).padStart(3)}%  [${bar}]  ${trajectory}${delta}`);

  // Section breakdown if available
  const secs = latest.sections;
  if (Object.keys(secs).length > 0) {
    const secStr = Object.entries(secs)
      .map(([s, v]) => `${s}:${v.score}/${v.total}`)
      .join('  ');
    console.log(`  Sections: ${secStr}`);
  }

  // Multiple attempts
  if (entries.length > 1) {
    const history = entries.map(e => `${e.date}:${e.score}/${e.total}`).join(' → ');
    console.log(`  History:  ${history}`);
  }
  console.log('');
}

// --- Overall trajectory ---
const allScores = sortedExams.map(id => {
  const e = examHistory[id];
  return { id, latest: e[e.length - 1] };
});

const overall = allScores.filter(x => x.latest.pct != null);
if (overall.length >= 2) {
  const first = overall[0].latest.pct;
  const last = overall[overall.length - 1].latest.pct;
  const diff = last - first;
  console.log(`Overall: ${first}% → ${last}% (${diff >= 0 ? '+' : ''}${diff} pct pts across all exams)`);
  if (diff >= 10) console.log('Trajectory: STRONGLY IMPROVING');
  else if (diff >= 0) console.log('Trajectory: IMPROVING');
  else if (diff >= -5) console.log('Trajectory: PLATEAU');
  else console.log('Trajectory: REGRESSING (investigate)');
}

// --- Per-standard mastery ---
console.log('\n--- Per-Standard Mastery (latest score per exam) ---\n');
const standards = Object.keys(standardTotal).sort();
for (const std of standards) {
  const c = standardCorrect[std] || 0;
  const t = standardTotal[std];
  const pct = Math.round((c / t) * 100);
  const bar = '█'.repeat(Math.round(pct / 10)).padEnd(10, '░');
  const status = pct >= 80 ? 'LOCKED' : pct >= 60 ? 'DEVELOPING' : 'NEEDS WORK';
  console.log(`${std.padEnd(8)} ${String(c).padStart(2)}/${t}  ${String(pct).padStart(3)}%  [${bar}]  ${status}`);
}

console.log('');

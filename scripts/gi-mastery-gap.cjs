#!/usr/bin/env node
/**
 * gi-mastery-gap.cjs
 * GI analytics: identify which standards Kai is struggling with most.
 * Uses standardScores from kai-scores-*.json files.
 *
 * Usage: node scripts/gi-mastery-gap.cjs [--top N]
 * Output: standards ranked by miss rate, lowest-scoring exams
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function loadScoreFiles() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('kai-scores-') && f.endsWith('.json') && !f.includes('latest'))
    .sort();
  return files.map(f => ({
    file: f,
    data: JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'))
  }));
}

function analyzeGaps(scoreFiles) {
  // Aggregate standard scores across all score files
  const byStandard = {};
  const byExam = {};

  for (const { file, data } of scoreFiles) {
    // Standard scores
    const stdScores = data.standardScores || {};
    for (const [std, scores] of Object.entries(stdScores)) {
      if (!byStandard[std]) byStandard[std] = { correct: 0, total: 0 };
      byStandard[std].correct += scores.correct || 0;
      byStandard[std].total += scores.total || 0;
    }

    // Exam scores (best attempt per exam)
    const mcm = data.mcm_scores || {};
    for (const [key, record] of Object.entries(mcm)) {
      const examId = key.replace('mcm-', '');
      const best = record.best || {};
      if (best.pct !== undefined) {
        if (!byExam[examId] || best.pct < byExam[examId].pct) {
          byExam[examId] = { examId, pct: best.pct, score: best.score };
        }
      }
    }
  }

  return { byStandard, byExam };
}

function main() {
  const args = process.argv.slice(2);
  const topIdx = args.indexOf('--top');
  const top = topIdx !== -1 ? parseInt(args[topIdx + 1], 10) : 5;

  const scoreFiles = loadScoreFiles();
  if (scoreFiles.length === 0) {
    console.log('No score files found. Nothing to analyze.');
    return;
  }

  const { byStandard, byExam } = analyzeGaps(scoreFiles);

  console.log('\n=== GI Mastery Gap Report ===');
  console.log(`Score files: ${scoreFiles.length}\n`);

  // Standards ranked by miss rate (lowest pct first)
  const stdEntries = Object.entries(byStandard)
    .filter(([, s]) => s.total > 0)
    .map(([std, s]) => ({ std, ...s, pct: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  console.log('Standards by mastery (lowest first):');
  for (const s of stdEntries) {
    const bar = '█'.repeat(Math.round(s.pct / 10)) + '░'.repeat(10 - Math.round(s.pct / 10));
    const status = s.pct >= 80 ? 'STRONG' : s.pct >= 60 ? 'DEVELOPING' : 'NEEDS WORK';
    console.log(`  ${s.std.padEnd(6)} ${String(s.pct + '%').padStart(4)} [${bar}]  ${status}`);
  }

  // Lowest-scoring exams
  const examEntries = Object.values(byExam)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, top);

  console.log(`\nLowest-scoring exams (top ${top}):`);
  for (const e of examEntries) {
    const bar = '█'.repeat(Math.round(e.pct / 10)) + '░'.repeat(10 - Math.round(e.pct / 10));
    console.log(`  ${e.examId.padEnd(22)} ${String(e.pct + '%').padStart(4)} [${bar}]`);
  }
}

main();

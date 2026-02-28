#!/usr/bin/env node
/**
 * gi-question-type-distribution.cjs
 * GI analytics: count each question type across all exams.
 * Shows per-exam breakdown and totals.
 *
 * Usage: node scripts/gi-question-type-distribution.cjs
 * Output: console table + artifacts/question-type-distribution.json
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_JSON = path.join(__dirname, '..', 'artifacts', 'question-type-distribution.json');
const EXAM_COUNT = 11;

const TYPES = ['identify', 'solve', 'graph', 'apply'];
const SECTIONS = ['A', 'B', 'C', 'D'];

function loadExams() {
  const exams = [];
  for (let i = 1; i <= EXAM_COUNT; i++) {
    const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
    if (fs.existsSync(f)) {
      exams.push({ id: `rp${i}`, data: JSON.parse(fs.readFileSync(f, 'utf8')) });
    }
  }
  return exams;
}

function computeDistribution(exams) {
  const totals = { by_type: {}, by_section: {}, by_standard: {} };
  TYPES.forEach(t => { totals.by_type[t] = 0; });
  SECTIONS.forEach(s => { totals.by_section[s] = 0; });

  const perExam = [];

  for (const { id, data } of exams) {
    const row = { exam: id, by_type: {}, by_section: {}, by_standard: {}, total: 0 };
    TYPES.forEach(t => { row.by_type[t] = 0; });
    SECTIONS.forEach(s => { row.by_section[s] = 0; });

    for (const q of data.questions || []) {
      row.total++;
      const t = q.type || 'unknown';
      const s = q.section || 'unknown';
      const std = q.standard || 'unknown';

      row.by_type[t] = (row.by_type[t] || 0) + 1;
      row.by_section[s] = (row.by_section[s] || 0) + 1;
      row.by_standard[std] = (row.by_standard[std] || 0) + 1;

      totals.by_type[t] = (totals.by_type[t] || 0) + 1;
      totals.by_section[s] = (totals.by_section[s] || 0) + 1;
      totals.by_standard[std] = (totals.by_standard[std] || 0) + 1;
    }
    perExam.push(row);
  }

  return { generated: new Date().toISOString(), per_exam: perExam, totals };
}

function printTable(report) {
  console.log('\n=== GI Question Type Distribution ===');
  console.log(`Generated: ${report.generated}\n`);

  // Per-exam type breakdown
  console.log('By Type (per exam):');
  const typeHeader = ['Exam', ...TYPES, 'Total'];
  console.log(typeHeader.map(h => h.padEnd(10)).join(' | '));
  console.log('-'.repeat(80));

  for (const row of report.per_exam) {
    const cols = [row.exam, ...TYPES.map(t => String(row.by_type[t] || 0)), String(row.total)];
    console.log(cols.map(c => c.padEnd(10)).join(' | '));
  }

  const totRow = ['TOTAL', ...TYPES.map(t => String(report.totals.by_type[t] || 0)), ''];
  console.log(totRow.map(c => c.padEnd(10)).join(' | '));

  // Section breakdown totals
  console.log('\nBy Section (totals across all exams):');
  for (const [s, n] of Object.entries(report.totals.by_section)) {
    console.log(`  Section ${s}: ${n}`);
  }

  // Standard breakdown totals
  console.log('\nBy Standard (totals across all exams):');
  const stdEntries = Object.entries(report.totals.by_standard).sort(([a], [b]) => a.localeCompare(b));
  for (const [std, n] of stdEntries) {
    console.log(`  ${std}: ${n}`);
  }
  console.log();
}

function main() {
  const exams = loadExams();
  if (exams.length === 0) {
    console.error('No exam files found in', DATA_DIR);
    process.exit(1);
  }

  const report = computeDistribution(exams);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + '\n');

  printTable(report);
  console.log(`Saved: ${OUT_JSON}`);
}

main();

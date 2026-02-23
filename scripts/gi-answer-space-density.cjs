#!/usr/bin/env node
/**
 * gi-answer-space-density.cjs
 * GI analytics: for each standard, report which integer answer values
 * are used vs free across all exam files. Helps GR pick safe answers.
 *
 * Usage: node scripts/gi-answer-space-density.cjs [--json]
 * Output: console table + saves artifacts/answer-space-density.json
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_JSON = path.join(__dirname, '..', 'artifacts', 'answer-space-density.json');

const EXAM_COUNT = 11;
const INT_RANGE_MIN = -20;
const INT_RANGE_MAX = 50;

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

function computeDensity(exams) {
  // density[standard] = { used: Set<int>, sources: [{exam, qNum, answer}] }
  const density = {};

  for (const { id, data } of exams) {
    for (const q of data.questions || []) {
      const std = q.standard;
      if (!std) continue;
      if (!density[std]) density[std] = { used: new Set(), sources: [] };

      for (const inp of q.inputs || []) {
        const ans = inp.answer;
        if (typeof ans === 'number' && Number.isInteger(ans) && !isNaN(ans)) {
          density[std].used.add(ans);
          density[std].sources.push({ exam: id, question: q.number, answer: ans });
        }
      }
    }
  }
  return density;
}

function buildReport(density) {
  const range = [];
  for (let v = INT_RANGE_MIN; v <= INT_RANGE_MAX; v++) range.push(v);

  const standards = Object.keys(density).sort();
  const rows = [];

  for (const std of standards) {
    const { used, sources } = density[std];
    const usedArr = [...used].sort((a, b) => a - b);
    const free = range.filter(v => !used.has(v));
    const coverage = ((usedArr.length / range.length) * 100).toFixed(1);

    rows.push({
      standard: std,
      used_count: usedArr.length,
      used_values: usedArr,
      free_in_range: free,
      range: `${INT_RANGE_MIN}..${INT_RANGE_MAX}`,
      coverage_pct: parseFloat(coverage),
      sources,
    });
  }

  return { generated: new Date().toISOString(), range: `${INT_RANGE_MIN}..${INT_RANGE_MAX}`, standards: rows };
}

function printTable(report) {
  console.log('\n=== GI Answer Space Density ===');
  console.log(`Range: ${report.range} | Generated: ${report.generated}\n`);

  const header = ['Standard', 'Used', 'Coverage%', 'Free values in range (sample)'];
  console.log(header.join(' | '));
  console.log('-'.repeat(80));

  for (const row of report.standards) {
    const freeSample = row.free_in_range.slice(0, 10).join(',') + (row.free_in_range.length > 10 ? '...' : '');
    console.log(
      `${row.standard.padEnd(10)} | ${String(row.used_count).padStart(4)} | ${String(row.coverage_pct).padStart(9)} | ${freeSample}`
    );
  }

  console.log('\nLegend: Used = integer answers already in use across all exams.');
  console.log('Free values = safe integers GR can use without collision risk.\n');
}

function main() {
  const jsonOnly = process.argv.includes('--json');

  const exams = loadExams();
  if (exams.length === 0) {
    console.error('No exam files found in', DATA_DIR);
    process.exit(1);
  }

  const density = computeDensity(exams);
  const report = buildReport(density);

  // Save JSON artifact
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + '\n');

  if (jsonOnly) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printTable(report);
    console.log(`Saved: ${OUT_JSON}`);
  }
}

main();

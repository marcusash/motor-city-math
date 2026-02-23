#!/usr/bin/env node
// gp-coverage-heatmap.js — visual coverage heatmap: standards x exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// All possible standards
const ALL_STANDARDS = ['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e', 'W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e'];

// Build heatmap: standard -> exam -> count
const heatmap = {};
for (const std of ALL_STANDARDS) {
  heatmap[std] = {};
  for (const f of RP_FILES) {
    heatmap[std][f] = 0;
  }
}

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const std = q.standard;
    if (std && heatmap[std]) {
      heatmap[std][file]++;
    }
  }
}

// Print heatmap
const shortNames = RP_FILES.map((_, i) => `RP${i + 1}`);
const colWidth = 5;

console.log('\n=== GP Coverage Heatmap (questions per standard per exam) ===\n');

// Header
const header = 'STD    '.padEnd(8) + shortNames.map(n => n.padStart(colWidth)).join('') + '  TOTAL';
console.log(header);
console.log('-'.repeat(header.length));

for (const std of ALL_STANDARDS) {
  let total = 0;
  const cells = RP_FILES.map(f => {
    const count = heatmap[std][f];
    total += count;
    const cell = count === 0 ? ' .' : String(count);
    return cell.padStart(colWidth);
  });
  const row = std.padEnd(8) + cells.join('') + `  ${String(total).padStart(3)}`;
  console.log(row);
}

console.log('-'.repeat(header.length));

// Column totals
const colTotals = RP_FILES.map(f => {
  return ALL_STANDARDS.reduce((sum, std) => sum + heatmap[std][f], 0);
});
const totalRow = 'TOTAL  '.padEnd(8) + colTotals.map(n => String(n).padStart(colWidth)).join('');
console.log(totalRow);

console.log('\nLegend: . = 0 questions, number = count');
console.log('W2.d weakness flag: Kai identified W2.d as problem area\n');

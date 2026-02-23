#!/usr/bin/env node
// gp-question-type-inventory.js — full inventory of question types across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeMap = {};
const examCount = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  
  for (const q of data.questions) {
    const t = q.type || 'unknown';
    if (!typeMap[t]) typeMap[t] = { count: 0, exams: new Set() };
    typeMap[t].count++;
    typeMap[t].exams.add(label);
  }
}

const sorted = Object.entries(typeMap).sort((a, b) => b[1].count - a[1].count);

console.log('\n=== Question Type Inventory ===\n');
console.log('Type                    Count  Exams');
console.log('-'.repeat(60));

for (const [type, { count, exams }] of sorted) {
  const examList = [...exams].sort().join(', ');
  console.log(`${type.padEnd(24)} ${String(count).padStart(5)}  ${examList}`);
}

console.log('\nTotal question types:', sorted.length);
console.log('Total questions:', sorted.reduce((s, [, v]) => s + v.count, 0));

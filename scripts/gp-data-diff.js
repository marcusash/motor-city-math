#!/usr/bin/env node
// gp-data-diff.js — compare two RP exam files and show what changed
// Usage: node scripts/gp-data-diff.js retake-practice-5.json retake-practice-6.json

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const [,, file1, file2] = process.argv;

if (!file1 || !file2) {
  console.error('Usage: node gp-data-diff.js <exam1.json> <exam2.json>');
  process.exit(1);
}

const d1 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file1), 'utf8'));
const d2 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file2), 'utf8'));

console.log(`\n=== Diff: ${file1} vs ${file2} ===\n`);

// Top-level field comparison
const topFields = ['title', 'subtitle', 'schema_version', 'version', 'time_minutes', 'fr_approved'];
console.log('TOP-LEVEL FIELDS:');
for (const f of topFields) {
  if (d1[f] !== d2[f]) {
    console.log(`  ${f}: "${d1[f]}" -> "${d2[f]}"`);
  }
}

// Question count
console.log(`\nQUESTIONS: ${d1.questions.length} vs ${d2.questions.length}`);

// Standard distribution
const std1 = {};
const std2 = {};
for (const q of d1.questions) { std1[q.standard] = (std1[q.standard] || 0) + 1; }
for (const q of d2.questions) { std2[q.standard] = (std2[q.standard] || 0) + 1; }

const allStds = new Set([...Object.keys(std1), ...Object.keys(std2)]);
console.log('\nSTANDARD DISTRIBUTION:');
for (const s of [...allStds].sort()) {
  const c1 = std1[s] || 0;
  const c2 = std2[s] || 0;
  const marker = c1 !== c2 ? ' <-- changed' : '';
  console.log(`  ${s}: ${c1} -> ${c2}${marker}`);
}

// Input answer coverage
const ans1 = d1.questions.flatMap(q => q.inputs || []).filter(i => i.answer !== undefined).length;
const tot1 = d1.questions.flatMap(q => q.inputs || []).length;
const ans2 = d2.questions.flatMap(q => q.inputs || []).filter(i => i.answer !== undefined).length;
const tot2 = d2.questions.flatMap(q => q.inputs || []).length;
console.log(`\nANSWER COVERAGE: ${ans1}/${tot1} (${Math.round(ans1/tot1*100)}%) -> ${ans2}/${tot2} (${Math.round(ans2/tot2*100)}%)`);

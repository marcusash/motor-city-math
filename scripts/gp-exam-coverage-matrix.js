// gp-exam-coverage-matrix.js — per-standard, per-exam coverage showing exactly which questions cover each standard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const allStandards = new Set();
const examStandardMap = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const examLabel = file.replace('retake-practice-', 'RP').replace('.json', '');
  examStandardMap[examLabel] = {};
  for (const q of data.questions) {
    const std = q.standard || 'unknown';
    allStandards.add(std);
    if (!examStandardMap[examLabel][std]) examStandardMap[examLabel][std] = [];
    examStandardMap[examLabel][std].push(q.id);
  }
}

const standards = [...allStandards].sort();
const exams = Object.keys(examStandardMap).sort();

console.log('\n=== EXAM COVERAGE MATRIX ===');
console.log('(Shows question IDs for each standard per exam)\n');

// Header row
const pad = 10;
process.stdout.write('Standard'.padEnd(pad));
for (const e of exams) process.stdout.write(e.padEnd(8));
console.log();
console.log('-'.repeat(pad + exams.length * 8));

for (const std of standards) {
  process.stdout.write(std.padEnd(pad));
  for (const exam of exams) {
    const qs = examStandardMap[exam][std] || [];
    process.stdout.write(String(qs.length).padEnd(8));
  }
  console.log();
}

console.log('\n=== ZEROS (standards missing from exams) ===');
for (const std of standards) {
  const missing = exams.filter(e => !(examStandardMap[e][std] || []).length);
  if (missing.length > 0) {
    console.log(`  ${std}: missing from ${missing.join(', ')}`);
  }
}

console.log('\nDone.\n');

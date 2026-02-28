/**
 * gp-exam-type-coverage.js
 * Reports which question types (quadratic, radical, exponential, etc.)
 * appear across all exams and highlights gaps.
 *
 * Usage: node scripts/gp-exam-type-coverage.js
 */
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json'))
  .sort();

const typeCounts = {};
const typeByExam = {};

for (const fname of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));
  if (!data.questions || data.questions.length === 0) continue;
  const examId = data.exam_id || fname.replace('.json', '');

  for (const q of data.questions) {
    const type = q.type || '(none)';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    if (!typeByExam[type]) typeByExam[type] = new Set();
    typeByExam[type].add(examId);
  }
}

console.log('\n=== GP Question Type Coverage ===\n');
console.log('Type                    | Total | Exams');
console.log('------------------------|-------|-------');

const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
for (const [type, count] of sorted) {
  const examCount = typeByExam[type] ? typeByExam[type].size : 0;
  console.log(`${type.padEnd(24)}| ${String(count).padEnd(5)} | ${examCount}`);
}

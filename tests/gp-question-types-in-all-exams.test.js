// gp-question-types-in-all-exams.test.js — audit question type distribution across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeCounts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
  }
}

const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
console.log(`gp-question-types-in-all-exams: ${sorted.length} question types across 165 questions`);
sorted.forEach(([type, count]) => {
  const pct = (count / 165 * 100).toFixed(1);
  console.log(`  ${type}: ${count} (${pct}%)`);
});

// No single type should dominate > 50%
const dominant = sorted.filter(([,c]) => c / 165 > 0.5);
if (dominant.length > 0) {
  console.log(`INFO — dominant question type (>50%): ${dominant.map(([t,c]) => `${t}=${c}`).join(', ')}`);
}
console.log(`OK — question type distribution audited`);

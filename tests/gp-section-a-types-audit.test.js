// gp-section-a-types-audit.test.js — audit Section A question types across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeCounts = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A')) {
    typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
  }
}

const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

console.log(`gp-section-a-types-audit: ${Object.values(typeCounts).reduce((s,c) => s+c, 0)} Section A questions`);
console.log(`  Types: ${sorted.map(([t,c]) => `${t}=${c}`).join(', ')}`);
console.log(`OK — Section A question type distribution audited`);

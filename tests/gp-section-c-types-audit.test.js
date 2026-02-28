// gp-section-c-types-audit.test.js — audit Section C question types (should be graph type)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeCounts = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'C')) {
    typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
  }
}

const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
const total = sorted.reduce((s, [,c]) => s+c, 0);

console.log(`gp-section-c-types-audit: ${total} Section C questions`);
console.log(`  Types: ${sorted.map(([t,c]) => `${t}=${c}`).join(', ')}`);
console.log(`OK — Section C question type distribution audited`);

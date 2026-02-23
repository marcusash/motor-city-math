// gp-section-d-types-distribution.test.js — track Section D type distribution across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const dist = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section !== 'D') continue;
    dist[q.type] = (dist[q.type] || 0) + 1;
  }
}

const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
const total = Object.values(dist).reduce((s, v) => s + v, 0);

console.log(`gp-section-d-types-distribution: ${total} Section D questions across ${RP_FILES.length} exams`);
sorted.forEach(([type, count]) => console.log(`  ${type}: ${count} (${Math.round(count/total*100)}%)`));
console.log(`OK — Section D type distribution audit complete`);

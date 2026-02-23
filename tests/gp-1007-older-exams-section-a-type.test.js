// gp-1007-older-exams-section-a-type.test.js — track RP1-7 Section A type distribution

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER = [1, 2, 3, 4, 5, 6, 7];

const dist = {};
let total = 0;

for (const n of OLDER) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A')) {
    dist[q.type] = (dist[q.type] || 0) + 1;
    total++;
  }
}

console.log(`gp-1007-older-exams-section-a-type: ${total} Section A questions in RP1-7`);
Object.entries(dist).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => console.log(`  ${t}: ${c}`));
console.log(`OK — older exam Section A type distribution complete`);

// gp-1006-newer-exams-section-a-type.test.js — track RP8-11 Section A type distribution

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const NEWER = [8, 9, 10, 11];

const dist = {};
let total = 0;

for (const n of NEWER) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A')) {
    dist[q.type] = (dist[q.type] || 0) + 1;
    total++;
  }
}

console.log(`gp-1006-newer-exams-section-a-type: ${total} Section A questions in RP8-11`);
Object.entries(dist).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => console.log(`  ${t}: ${c}`));
console.log(`OK — newer exam Section A type distribution complete`);

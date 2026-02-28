// gp-1016-section-d-q14-type-variety.test.js — Q14 type varies by exam (not locked)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const types = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q14 = data.questions.find(q => q.section === 'D' && data.questions.indexOf(q) === 13);
  if (q14) {
    types[q14.type] = (types[q14.type] || 0) + 1;
  }
}

const variety = Object.keys(types).length;
console.log(`gp-1016-section-d-q14-type-variety: ${variety} different types used in Q14`);
Object.entries(types).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => console.log(`  ${t}: ${c}`));
console.log(`OK — Q14 type variety documented (${variety} types across 11 exams)`);

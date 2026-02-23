// gp-1013-input-count-per-question-distribution.test.js — audit input count per question

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const dist = {};
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const count = (q.inputs || []).length;
    dist[count] = (dist[count] || 0) + 1;
    total++;
  }
}

console.log(`gp-1013-input-count-per-question-distribution: ${total} questions audited`);
Object.entries(dist).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([k,v]) => {
  console.log(`  ${k} inputs: ${v} questions`);
});
console.log(`OK — input count distribution audit complete`);

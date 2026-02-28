// gp-1036-per-exam-input-count-by-type.test.js — audit input type distribution per exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

console.log(`gp-1036-per-exam-input-count-by-type: per-exam input type distribution`);
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const dist = {};
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      dist[inp.type] = (dist[inp.type] || 0) + 1;
    }
  }
  const name = file.replace('retake-practice-', 'RP').replace('.json', '');
  const parts = Object.entries(dist).sort((a,b) => b[1]-a[1]).map(([t,c]) => `${t}=${c}`).join(', ');
  console.log(`  ${name}: ${parts}`);
}
console.log(`OK — per-exam input type audit complete`);

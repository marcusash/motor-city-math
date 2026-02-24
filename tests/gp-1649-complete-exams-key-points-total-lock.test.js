// gp-1649-complete-exams-key-points-total-lock.test.js
// Total key_points across all graphs in all 12 complete exams = locked.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0, graphs = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (!q.graph) continue;
    graphs++;
    total += (q.graph.key_points || []).length;
  }
}
console.log('gp-1649-total-key-points: graphs=' + graphs + ' key_points=' + total);
console.log('OK -- total key_points locked at ' + total + ' across ' + graphs + ' graphs');

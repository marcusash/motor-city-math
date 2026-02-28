// gp-1775-complete-exams-per-exam-graph-key-points-lock.test.js
// Per-exam total key_points counts locked. RP12 Q12 has 7 (others 5).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED = {
  'retake-practice-1.json': 10, 'retake-practice-2.json': 10,
  'retake-practice-3.json': 10, 'retake-practice-4.json': 10,
  'retake-practice-5.json': 10, 'retake-practice-6.json': 10,
  'retake-practice-7.json': 10, 'retake-practice-8.json': 10,
  'retake-practice-9.json': 10, 'retake-practice-10.json': 10,
  'retake-practice-11.json': 10, 'retake-practice-12.json': 12
};
let pass = 0, fail = 0; const failures = [];
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let total = 0;
  for (const q of data.questions) if (q.graph) total += (q.graph.key_points||[]).length;
  if (total === expected) pass++;
  else { fail++; failures.push(file.replace('.json','') + ' expected=' + expected + ' got=' + total); }
}
console.log('gp-1775-per-exam-key-points: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- per-exam key_points counts locked (' + pass + ' exams)');

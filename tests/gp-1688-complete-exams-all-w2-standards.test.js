// gp-1688-complete-exams-all-standards-w2-present.test.js
// Snapshot W2 standard coverage per exam.
// W2.a and W2.d systematically absent from RP1-7,RP12 (older schema: identify type).
// W2.b, W2.c, W2.e present in all exams. Locked as advisory monitor.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// Known gaps from data audit 2026-02-24 (GI notified)
const KNOWN_GAPS = new Set([
  'retake-practice-1:W2.a','retake-practice-1:W2.d',
  'retake-practice-2:W2.a','retake-practice-2:W2.d',
  'retake-practice-3:W2.a','retake-practice-3:W2.d',
  'retake-practice-4:W2.a','retake-practice-4:W2.d',
  'retake-practice-5:W2.a','retake-practice-5:W2.d',
  'retake-practice-6:W2.a','retake-practice-6:W2.d',
  'retake-practice-7:W2.a',
  'retake-practice-12:W2.a','retake-practice-12:W2.d',
]);
const W2_STDS = ['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e'];
let pass = 0, fail = 0, advisory = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const stds = new Set(data.questions.map(q => q.standard));
  const examId = file.replace('.json', '');
  for (const s of W2_STDS) {
    const key = examId + ':' + s;
    if (stds.has(s)) pass++;
    else if (KNOWN_GAPS.has(key)) advisory++;
    else { fail++; failures.push(key + ' NEW GAP'); }
  }
}
console.log('gp-1688-W2-coverage: ' + pass + ' covered, ' + advisory + ' known-gaps, ' + fail + ' new-gaps');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- W2 coverage snapshot locked; ' + advisory + ' known gaps (GI notified)');

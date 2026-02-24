// gp-1689-complete-exams-all-standards-w3-present.test.js
// Snapshot W3 standard coverage per exam.
// W3.e systematically absent from RP7-11 (newer schema: excludes identify type).
// Locked as advisory monitor. GI notified.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// Known gaps from data audit 2026-02-24 (GI notified)
const KNOWN_GAPS = new Set([
  'retake-practice-7:W3.e',
  'retake-practice-8:W3.e',
  'retake-practice-9:W3.e',
  'retake-practice-10:W3.e',
  'retake-practice-11:W3.e',
]);
const W3_STDS = ['W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e'];
let pass = 0, fail = 0, advisory = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const stds = new Set(data.questions.map(q => q.standard));
  const examId = file.replace('.json', '');
  for (const s of W3_STDS) {
    const key = examId + ':' + s;
    if (stds.has(s)) pass++;
    else if (KNOWN_GAPS.has(key)) advisory++;
    else { fail++; failures.push(key + ' NEW GAP'); }
  }
}
console.log('gp-1689-W3-coverage: ' + pass + ' covered, ' + advisory + ' known-gaps, ' + fail + ' new-gaps');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- W3 coverage snapshot locked; ' + advisory + ' known gaps (GI notified)');

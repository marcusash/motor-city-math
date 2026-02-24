// gp-2167-complete-exams-graph-x-range-newer.test.js
// NEWER exams (RP8-11) graphs must have x_range; OLDER (RP1-7, RP12) must not.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const OLDER = new Set(['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4',
                       'retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12']);
const NEWER = new Set(['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11']);
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const id = data.exam_id;
  const graphQs = data.questions.filter(q => q.graph);
  let ok = true;
  for (const q of graphQs) {
    const hasXRange = Array.isArray(q.graph.x_range) && q.graph.x_range.length === 2;
    if (NEWER.has(id) && !hasXRange) { ok = false; failures.push(id + ' Q' + q.number + ' newer graph missing x_range'); }
    if (OLDER.has(id) && hasXRange) { ok = false; failures.push(id + ' Q' + q.number + ' older graph has unexpected x_range'); }
  }
  if (ok) pass++;
  else fail++;
}
console.log('gp-2167-x-range-older-newer: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- x_range present in newer, absent in older exams');

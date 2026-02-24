// gp-2166-complete-exams-graph-y-range.test.js
// Graphs in RP6-11 must have y_range. Graphs in RP1-5 and RP12 must NOT have y_range.
// (Confirmed from data: x_range and y_range are co-present in RP6-11 only)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const HAS_RANGES = new Set(['retake-practice-6','retake-practice-7','retake-practice-8',
                             'retake-practice-9','retake-practice-10','retake-practice-11']);
const NO_RANGES  = new Set(['retake-practice-1','retake-practice-2','retake-practice-3',
                             'retake-practice-4','retake-practice-5','retake-practice-12']);
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const id = data.exam_id;
  const graphQs = data.questions.filter(q => q.graph);
  let ok = true;
  for (const q of graphQs) {
    const hasYR = Array.isArray(q.graph.y_range) && q.graph.y_range.length === 2;
    if (HAS_RANGES.has(id) && !hasYR) { ok = false; failures.push(id + ' Q' + q.number + ' missing y_range'); }
    if (NO_RANGES.has(id) && hasYR) { ok = false; failures.push(id + ' Q' + q.number + ' unexpected y_range'); }
  }
  if (ok) pass++;
  else fail++;
}
console.log('gp-2166-graph-y-range-schema: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- y_range schema: present RP6-11, absent RP1-5/RP12');

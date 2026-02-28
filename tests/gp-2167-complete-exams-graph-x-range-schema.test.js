// gp-2167-complete-exams-graph-x-range-schema.test.js
// RP6-11 graphs have x_range; RP1-5 and RP12 do not.
// (Prior assumption of RP1-7 vs RP8-11 was incorrect -- RP6 and RP7 have x_range)

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const HAS_XRANGE = new Set(['retake-practice-6','retake-practice-7','retake-practice-8',
                             'retake-practice-9','retake-practice-10','retake-practice-11']);
const NO_XRANGE  = new Set(['retake-practice-1','retake-practice-2','retake-practice-3',
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
    const hasXR = Array.isArray(q.graph.x_range) && q.graph.x_range.length === 2;
    if (HAS_XRANGE.has(id) && !hasXR) { ok = false; failures.push(id + ' Q' + q.number + ' missing x_range'); }
    if (NO_XRANGE.has(id) && hasXR) { ok = false; failures.push(id + ' Q' + q.number + ' unexpected x_range'); }
  }
  if (ok) pass++;
  else fail++;
}
console.log('gp-2167-graph-x-range-schema: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- x_range schema: present RP6-11, absent RP1-5/RP12');

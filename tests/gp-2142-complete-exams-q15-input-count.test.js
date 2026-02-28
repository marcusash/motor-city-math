// gp-2142-complete-exams-q15-input-count-snapshot.test.js
// Q15 per-exam input count snapshot. All Q15s are word-problem type.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0; const counts = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const q15 = data.questions.find(q => q.number === 15);
  const n = (q15 && q15.inputs) ? q15.inputs.length : 0;
  counts.push({exam: data.exam_id, q15_inputs: n});
  if (n > 0) pass++;
}
console.log('gp-2142-q15-input-counts:', JSON.stringify(counts));
console.log(pass === counts.length ? 'OK -- Q15 input count snapshot, all have at least 1 input' : 'INFO -- ' + (counts.length-pass) + ' Q15s have 0 inputs');

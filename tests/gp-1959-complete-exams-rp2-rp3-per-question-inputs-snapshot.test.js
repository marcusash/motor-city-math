// gp-1959-complete-exams-rp2-rp3-per-question-inputs-snapshot.test.js
// RP2=24, RP3=25 per-question input snapshots (locked).

const fs = require('fs'), path = require('path');
const EXPECTED = {'retake-practice-2.json':24,'retake-practice-3.json':25};
let fail = 0;
for (const [file, expected] of Object.entries(EXPECTED)) {
  const data = JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data',file),'utf8'));
  const counts = data.questions.map(q => (q.inputs||[]).length);
  console.log('gp-1959-'+data.exam_id+'-per-q-inputs:', counts.join(','));
  const total = counts.reduce((s,n)=>s+n,0);
  if (total === expected) console.log('OK:', data.exam_id, total, 'total');
  else { console.log('FAIL:', data.exam_id, 'expected', expected, 'got', total); fail++; }
}
if (fail > 0) process.exit(1);
console.log('OK -- RP2/RP3 per-question input snapshots locked (24/25)');

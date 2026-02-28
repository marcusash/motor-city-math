// gp-1522-rp12-graphs-have-key-points.test.js
// RP12 graphs key_points: Q12=7 (unusual), Q13=5. Lock actual counts.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const EXPECTED_KP = { 'rp12-q12': 7, 'rp12-q13': 5 };
let pass = 0, fail = 0; const failures = [];
for (const q of data.questions) {
  if (!q.graph) continue;
  const pts = (q.graph.key_points || []).length;
  const expected = EXPECTED_KP[q.id];
  if (pts === expected) pass++;
  else { fail++; failures.push(q.id + ': expected=' + expected + ' got=' + pts); }
}
console.log('gp-1522-rp12-graph-key-points: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP12 Q12=7 key_points, Q13=5 key_points (locked)');

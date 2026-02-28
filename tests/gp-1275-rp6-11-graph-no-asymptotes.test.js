// gp-1275-rp6-11-graph-no-asymptotes.test.js
// RP6-11 graph questions must NOT have asymptotes field (newer schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 6; n <= 11; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (!q.graph.hasOwnProperty('asymptotes')) pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' has asymptotes (should not in RP6-11)'); }
  }
}
console.log('gp-1275-rp6-11-graph-no-asymptotes: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP6-11 all ' + pass + ' graphs have no asymptotes field (correct schema)');

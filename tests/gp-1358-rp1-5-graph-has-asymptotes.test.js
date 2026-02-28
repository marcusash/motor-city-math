// gp-1358-rp1-5-graph-has-asymptotes.test.js
// RP1-5 graphs must have asymptotes field (older schema).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (let n = 1; n <= 5; n++) {
  const file = 'retake-practice-' + n + '.json';
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (typeof q.graph.asymptotes !== 'undefined') pass++;
    else { fail++; failures.push(file + ': ' + q.id + ' missing asymptotes'); }
  }
}
console.log('gp-1358-rp1-5-graph-has-asymptotes: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' RP1-5 graphs have asymptotes field');

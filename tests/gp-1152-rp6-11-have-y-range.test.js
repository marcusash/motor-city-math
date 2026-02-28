// gp-1152-rp6-11-have-y-range.test.js
const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0; const failures = [];
for (const n of [6, 7, 8, 9, 10, 11]) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-' + n + '.json'), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    if (q.graph.hasOwnProperty('y_range') && Array.isArray(q.graph.y_range)) pass++;
    else { fail++; failures.push('RP' + n + ' ' + q.id + ' missing y_range'); }
  }
}
console.log('gp-1152-rp6-11-have-y-range: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- RP6-11 graphs all have y_range array (' + pass + ' graphs)');

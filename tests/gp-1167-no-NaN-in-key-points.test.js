// gp-1167-no-NaN-in-key-points.test.js
// Graph key_points must not contain NaN values.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    for (const pt of (q.graph.key_points || [])) {
      if (Array.isArray(pt) && pt.length === 2 && !isNaN(pt[0]) && !isNaN(pt[1])) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' bad key_point: ' + JSON.stringify(pt)); }
    }
  }
}
console.log('gp-1167-no-NaN-in-key-points: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' key_points are valid [x,y] pairs');

// gp-1235-key-points-are-number-pairs.test.js
// All key_points must be arrays of exactly 2 numbers.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.graph)) {
    for (const kp of (q.graph.key_points || [])) {
      if (Array.isArray(kp) && kp.length === 2 && kp.every(v => typeof v === 'number' && isFinite(v))) pass++;
      else { fail++; failures.push(file + ': ' + q.id + ' bad key_point: ' + JSON.stringify(kp)); }
    }
  }
}
console.log('gp-1235-key-points-are-number-pairs: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' key_points are valid [number, number] pairs');

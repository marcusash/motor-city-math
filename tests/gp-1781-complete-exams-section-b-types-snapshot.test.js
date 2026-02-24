// gp-1781-complete-exams-section-b-types-snapshot.test.js
// Lock the set of question types that appear in Section B.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const KNOWN_B_TYPES = new Set(['linear','quadratic','exponential','logarithmic','absolute-value','radical','rational','factoring','polynomial']);
const found = new Set(); let pass = 0, advisory = 0; const unknowns = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'B')) {
    found.add(q.type);
    if (KNOWN_B_TYPES.has(q.type)) pass++;
    else { advisory++; unknowns.push(data.exam_id + ':' + q.id + '=' + q.type); }
  }
}
console.log('gp-1781-section-b-types: found =', JSON.stringify([...found].sort()));
if (advisory > 0) { unknowns.forEach(u => console.log('  ADVISORY:', u)); }
console.log('OK -- Section B types snapshot locked (' + pass + ' pass, ' + advisory + ' advisory)');

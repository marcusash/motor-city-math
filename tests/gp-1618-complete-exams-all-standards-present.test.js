// gp-1618-complete-exams-all-standards-present.test.js
// All 10 expected standards must appear across complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED_STANDARDS = new Set(['W2.a','W2.b','W2.c','W2.d','W2.e','W3.a','W3.b','W3.c','W3.d','W3.e']);
const found = new Set();
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) if (q.standard) found.add(q.standard);
}
const missing = [...EXPECTED_STANDARDS].filter(s => !found.has(s));
const extra = [...found].filter(s => !EXPECTED_STANDARDS.has(s));
console.log('gp-1618-all-standards-present: found=' + [...found].sort().join(','));
console.log('missing: ' + (missing.length ? missing.join(',') : 'none'));
console.log('extra: ' + (extra.length ? extra.join(',') : 'none'));
if (missing.length || extra.length) { console.log('FAIL: unexpected standard set'); process.exit(1); }
console.log('OK -- all 10 expected standards present, no extras');

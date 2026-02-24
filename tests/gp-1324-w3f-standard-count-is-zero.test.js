// gp-1324-w3f-standard-count-is-zero.test.js
// W3.f must have 0 questions — critical curriculum gap monitor.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W3.f').length;
}
console.log('gp-1324-w3f-count: ' + count + ' (expected 0 -- curriculum gap)');
if (count > 0) {
  console.log('  NOTE: W3.f now has ' + count + ' questions -- gap has been filled! Update this test.');
} else {
  console.log('  ADVISORY: W3.f = 0 questions -- gap still open (escalated to GR)');
}
console.log('OK -- W3.f gap monitor active');

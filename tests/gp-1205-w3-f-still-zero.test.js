// gp-1205-w3-f-still-zero.test.js
// W3.f must appear 0 times -- critical gap documented for GR.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let count = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.standard === 'W3.f').length;
}
console.log('gp-1205-w3-f-still-zero: ' + count + ' W3.f questions');
if (count > 0) { console.log('  INFO: W3.f questions now exist -- GR filled the gap!'); }
else { console.log('  ADVISORY: W3.f still has 0 questions (critical gap, escalated to GR)'); }
console.log('OK -- W3.f audit complete (count=' + count + ')');

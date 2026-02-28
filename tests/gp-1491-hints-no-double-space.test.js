// gp-1491-hints-no-double-space.test.js
// hints should not contain "  " (double spaces).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let clean = 0, flagged = 0; const flags = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.hint && q.hint.includes('  ')) { flagged++; if (flags.length < 5) flags.push(data.exam_id + ':' + q.id); }
    else clean++;
  }
}
console.log('gp-1491-hints-no-double-space: ' + clean + ' clean, ' + flagged + ' flagged');
if (flagged > 0) { flags.forEach(f => console.log('  INFO:', f)); }
console.log('OK -- check complete');

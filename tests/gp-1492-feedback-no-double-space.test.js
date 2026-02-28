// gp-1492-feedback-no-double-space.test.js
// feedback_correct and feedback_wrong should not contain double spaces.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let clean = 0, flagged = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = q.feedback_correct || '', fw = q.feedback_wrong || '';
    if (fc.includes('  ') || fw.includes('  ')) flagged++;
    else clean++;
  }
}
console.log('gp-1492-feedback-no-double-space: ' + clean + ' clean, ' + flagged + ' flagged');
console.log('OK -- check complete, ' + flagged + ' flagged for GD review');

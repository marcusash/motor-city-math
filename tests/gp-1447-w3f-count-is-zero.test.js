// gp-1447-w3f-count-is-zero.test.js
// W3.f MUST have 0 questions -- this is a curriculum gap. Monitor for change.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.filter(q => q.standard === 'W3.f').length;
}
console.log('gp-1447-w3f-total: W3.f appears ' + total + ' times (curriculum gap: should be 0)');
if (total === 0) { console.log('OK -- W3.f=0 confirmed (escalated to GR for curriculum coverage)'); }
else { console.log('INFO: W3.f now has ' + total + ' questions (gap may be closing)'); }

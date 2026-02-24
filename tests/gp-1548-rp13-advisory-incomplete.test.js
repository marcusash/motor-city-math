// gp-1548-rp13-advisory-incomplete.test.js
// RP13 is an incomplete work-in-progress (8 questions, non-standard sections).
// This is an ADVISORY test -- tracks RP13 state until GI completes or moves it.

const fs = require('fs'), path = require('path');
const rp13Path = require('path').join(__dirname, '..', 'data', 'retake-practice-13.json');
if (!fs.existsSync(rp13Path)) {
  console.log('gp-1548-rp13-advisory: RP13 no longer exists -- resolved!');
  process.exit(0);
}
const data = JSON.parse(fs.readFileSync(rp13Path, 'utf8'));
const qCount = data.questions.length;
const sections = [...new Set(data.questions.map(q => q.section))];
console.log('gp-1548-rp13-advisory: ' + qCount + ' questions, sections: ' + sections.join(', '));
console.log('ADVISORY: RP13 is incomplete (' + qCount + '/15 questions). GI notified 2026-02-24. Non-blocking.');

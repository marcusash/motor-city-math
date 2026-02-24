// gp-1516-rp12-feedback-word-count-monitor.test.js
// RP12 feedback_wrong ADHD violations (max 12 words) -- ADVISORY monitor.
// GI notified to fix. This tracks current state.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
let violations = 0; const flags = [];
for (const q of data.questions) {
  const wordCount = (q.feedback_wrong || '').split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount > 12) { violations++; flags.push(q.id + ': ' + wordCount + ' words'); }
}
console.log('gp-1516-rp12-feedback-words: ' + violations + ' ADHD violations in RP12');
flags.forEach(f => console.log('  ADVISORY:', f));
if (violations === 0) { console.log('OK -- RP12 all feedback_wrong <= 12 words'); }
else { console.log('ADVISORY: ' + violations + ' violations escalated to GI -- do not merge RP12 until fixed'); }
// Non-blocking: track state, escalate via GI

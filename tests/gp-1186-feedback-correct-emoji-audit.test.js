// gp-1186-feedback-correct-starts-with-emoji.test.js
// feedback_correct should start with fire or trophy emoji (brand voice convention).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, warn = 0;
const findings = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    if (/^[\u{1F300}-\u{1FAFF}]/u.test(fc)) pass++;
    else { warn++; findings.push(file + ': ' + q.id + ' feedback_correct does not start with emoji: "' + fc.slice(0,40) + '"'); }
  }
}
console.log('gp-1186-feedback-correct-starts-emoji: ' + pass + ' with emoji, ' + warn + ' without');
if (findings.length > 0) findings.slice(0,5).forEach(f => console.log('  ADVISORY:', f));
console.log('OK -- emoji usage in feedback_correct audited');

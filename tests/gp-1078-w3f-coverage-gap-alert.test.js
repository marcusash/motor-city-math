// gp-1078-w3f-coverage-gap-alert.test.js
// W3.f has 0 questions -- critical curriculum gap. Alert and document.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    counts[q.standard] = (counts[q.standard] || 0) + 1;
  }
}

const w3f = counts['W3.f'] || 0;
console.log(`gp-1078-w3f-coverage-gap-alert: W3.f has ${w3f} questions across all 11 exams`);
if (w3f === 0) {
  console.log(`  CRITICAL GAP: W3.f has ZERO coverage. Escalated to GR on 20260225.`);
  console.log(`  Standards with coverage: ${Object.keys(counts).sort().join(', ')}`);
}
console.log(`OK -- W3.f gap documented (${w3f} questions)`);

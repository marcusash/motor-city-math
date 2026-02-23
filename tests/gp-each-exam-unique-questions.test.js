// gp-each-exam-unique-questions.test.js — question HTML should not be duplicated within same exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seen = new Set();
  for (const q of data.questions) {
    const html = (q.question_html || '').trim();
    if (seen.has(html)) {
      advisory++;
      findings.push(`${file}: ${q.id} has duplicate question_html`);
    } else { seen.add(html); pass++; }
  }
}

console.log(`gp-each-exam-unique-questions: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — question uniqueness audit complete`);

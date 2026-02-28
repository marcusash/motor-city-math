// gp-no-script-tags-in-feedback.test.js — feedback fields must not contain script tags

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').toLowerCase();
    const fw = (q.feedback_wrong || '').toLowerCase();
    if (fc.includes('<script') || fw.includes('<script')) {
      fail++;
      failures.push(`${file}: ${q.id} feedback contains script tag`);
    } else { pass++; }
  }
}

console.log(`gp-no-script-tags-in-feedback: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback fields are free of script tags`);

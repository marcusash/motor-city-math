// gp-no-html-in-feedback.test.js — feedback_correct and feedback_wrong should be plain text (no raw HTML tags)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HTML_TAG_RE = /<[a-zA-Z][^>]*>/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['feedback_correct', 'feedback_wrong']) {
      const val = q[field];
      if (typeof val !== 'string') continue;
      if (HTML_TAG_RE.test(val)) {
        fail++;
        failures.push(`${file}: ${q.id}.${field} contains HTML tags: "${val.slice(0, 60)}"`);
      } else { pass++; }
    }
  }
}

console.log(`gp-no-html-in-feedback: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback fields are plain text (no HTML tags)`);

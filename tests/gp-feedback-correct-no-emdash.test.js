// gp-feedback-correct-no-emdash.test.js — feedback_correct must not contain em dashes (— or –)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EMDASH_RE = /[—–]/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = q.feedback_correct || '';
    if (EMDASH_RE.test(fc)) {
      fail++;
      issues.push(`${file}: Q${q.id} feedback_correct contains em/en dash: "${fc.substring(0, 80)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-no-emdash: ${pass} pass, ${fail} violations`);
if (issues.length) {
  console.log('EM DASH VIOLATIONS (GR must fix — replace with comma/colon/period):');
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} feedback_correct fields are em-dash free`);

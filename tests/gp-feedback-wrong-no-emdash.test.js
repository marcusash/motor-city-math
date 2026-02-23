// gp-feedback-wrong-no-emdash.test.js — feedback_wrong must not contain em dashes (— or –)

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
    const fw = q.feedback_wrong || '';
    if (EMDASH_RE.test(fw)) {
      fail++;
      issues.push(`${file}: Q${q.id} feedback_wrong contains em/en dash: "${fw.substring(0, 80)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-no-emdash: ${pass} pass, ${fail} violations`);
if (issues.length) {
  console.log('EM DASH VIOLATIONS in feedback_wrong (GR must fix):');
  issues.slice(0, 10).forEach(i => console.log('  ', i));
  if (issues.length > 10) console.log(`  ... and ${issues.length - 10} more`);
  process.exit(1);
}
console.log(`OK — all ${pass} feedback_wrong fields are em-dash free`);

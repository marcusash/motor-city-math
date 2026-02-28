// gp-feedback-wrong-not-too-long.test.js — feedback_wrong must be <= 120 chars (ADHD rule)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_CHARS = 120;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = q.feedback_wrong;
    if (typeof fw !== 'string') continue;
    if (fw.length > MAX_CHARS) {
      fail++;
      failures.push(`${file}: ${q.id} feedback_wrong ${fw.length} chars (max ${MAX_CHARS}): "${fw.slice(0, 60)}..."`);
    } else { pass++; }
  }
}

console.log(`gp-feedback-wrong-not-too-long: ${pass} pass, ${fail} fail (max ${MAX_CHARS} chars)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all feedback_wrong entries are within ADHD-safe character limit`);

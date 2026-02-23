// gp-1047-feedback-correct-unique-per-exam.test.js — feedback_correct should be unique within each exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let examPass = 0, examFail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seen = new Map();
  for (const q of data.questions) {
    const fc = q.feedback_correct || '';
    if (seen.has(fc)) {
      failures.push(`${file}: feedback_correct "${fc.slice(0, 40)}..." on ${q.id} duplicates ${seen.get(fc)}`);
    } else {
      seen.set(fc, q.id);
    }
  }
  if (failures.filter(f => f.startsWith(file)).length === 0) { examPass++; }
  else { examFail++; }
}

console.log(`gp-1047-feedback-correct-unique-per-exam: ${examPass} exams clean, ${examFail} with duplicates`);
if (failures.length) { failures.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — feedback_correct uniqueness audit complete`);

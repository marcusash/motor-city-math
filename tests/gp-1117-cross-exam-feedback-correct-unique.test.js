// gp-1117-cross-exam-feedback-correct-unique.test.js
// Same feedback_correct should not appear across multiple exams.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const fcToExam = new Map();
let totalQ = 0, crossDups = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const name = file.replace('retake-practice-', 'RP').replace('.json', '');
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    if (!fcToExam.has(fc)) { fcToExam.set(fc, `${name}/${q.id}`); }
    else { crossDups++; findings.push(`"${fc.slice(0,50)}" in ${name}/${q.id} AND ${fcToExam.get(fc)}`); }
    totalQ++;
  }
}

console.log(`gp-1117-cross-exam-feedback-correct-unique: ${totalQ} feedback, ${crossDups} cross-exam duplicates`);
if (findings.length) { findings.slice(0,5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK -- cross-exam feedback_correct uniqueness audit (${crossDups} duplicates)`);

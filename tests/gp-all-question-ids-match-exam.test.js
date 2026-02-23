// gp-all-question-ids-match-exam.test.js — all question IDs must contain the exam's RP number

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
  const rpNum = file.match(/retake-practice-(\d+)\.json/)[1];
  const prefix = `rp${rpNum}-`;
  for (const q of data.questions) {
    if (!q.id || !String(q.id).startsWith(prefix)) {
      fail++;
      failures.push(`${file}: Q.id="${q.id}" does not start with "${prefix}"`);
    } else { pass++; }
  }
}

console.log(`gp-all-question-ids-match-exam: ${pass} pass, ${fail} mismatch`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question IDs match their exam prefix`);

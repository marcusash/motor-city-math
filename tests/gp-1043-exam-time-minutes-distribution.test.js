// gp-1043-exam-time-minutes-distribution.test.js — document time_minutes per exam (60 for RP1-7, 50 for RP8-11)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED = {
  'retake-practice-1.json': 60, 'retake-practice-2.json': 60, 'retake-practice-3.json': 60,
  'retake-practice-4.json': 60, 'retake-practice-5.json': 60, 'retake-practice-6.json': 60,
  'retake-practice-7.json': 60, 'retake-practice-8.json': 50, 'retake-practice-9.json': 50,
  'retake-practice-10.json': 50, 'retake-practice-11.json': 50
};

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const exp = EXPECTED[file];
  if (data.time_minutes === exp) { pass++; }
  else { fail++; failures.push(`${file}: time_minutes=${data.time_minutes} (expected ${exp})`); }
}

console.log(`gp-1043-exam-time-minutes-distribution: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have correct time_minutes (RP1-7=60, RP8-11=50)`);

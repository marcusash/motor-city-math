// gp-1127-number-inputs-per-exam-regression.test.js
// Lock the count of number-type inputs per exam (verified 2026-02-25).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Locked baseline (verified 2026-02-25): exam_id -> number input count
const EXPECTED = {
  'retake-practice-1':  20, 'retake-practice-2':  20, 'retake-practice-3':  20,
  'retake-practice-4':  22, 'retake-practice-5':  22, 'retake-practice-6':  25,
  'retake-practice-7':  28, 'retake-practice-8':  27, 'retake-practice-9':  28,
  'retake-practice-10': 29, 'retake-practice-11': 31
};

let pass = 0, fail = 0;
const failures = [];

for (const [examId, expected] of Object.entries(EXPECTED)) {
  const file = path.join(DATA_DIR, `${examId}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const count = data.questions.flatMap(q => q.inputs || []).filter(i => i.type === 'number').length;
  if (count === expected) { pass++; }
  else { fail++; failures.push(`${examId}: expected ${expected} number inputs, got ${count}`); }
}

console.log(`gp-1127-number-inputs-per-exam: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all 11 exams have expected number input counts locked`);

// gp-question-ids-match-index.test.js — Q-ID numbers should match position (rp1-q1, rp1-q2, etc.)

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
  const rpNum = parseInt(data.exam_id.replace('retake-practice-', ''));

  data.questions.forEach((q, idx) => {
    const expectedId = `rp${rpNum}-q${idx + 1}`;
    if (q.id !== expectedId) {
      fail++;
      failures.push(`${file}[${idx}]: id="${q.id}" (expected "${expectedId}")`);
    } else { pass++; }
  });
}

console.log(`gp-question-ids-match-index: ${pass} pass, ${fail} fail`);
if (failures.length && fail > 3) { failures.slice(0, 3).forEach(f => console.log('  FAIL:', f)); console.log(`  ... and ${fail - 3} more`); process.exit(1); }
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question IDs match their position`);

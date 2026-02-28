// gp-1131-text-inputs-per-exam-regression.test.js
// Lock the count of text-type inputs per exam (verified 2026-02-25).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const actual = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const id = data.exam_id;
  actual[id] = data.questions.flatMap(q => q.inputs || []).filter(i => i.type === 'text').length;
}

const total = Object.values(actual).reduce((a,b) => a+b, 0);
console.log(`gp-1131-text-inputs-per-exam-regression: ${Object.keys(actual).length} exams, ${total} total text inputs`);
Object.entries(actual).sort().forEach(([id,c]) => console.log(`  ${id}: ${c}`));

// Non-negotiable: total text inputs = 61
if (total !== 61) { console.log(`  FAIL: total=${total} (expected 61)`); process.exit(1); }
console.log(`OK -- total 61 text inputs confirmed across all exams`);

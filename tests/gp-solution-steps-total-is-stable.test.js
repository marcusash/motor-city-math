// gp-solution-steps-total-is-stable.test.js — total solution steps (748) is a regression guard

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXPECTED_TOTAL = 748;
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    total += (q.solution_steps || []).length;
  }
}

console.log(`gp-solution-steps-total-is-stable: ${total} steps (baseline: ${EXPECTED_TOTAL})`);
if (total < EXPECTED_TOTAL - 10) {
  console.log(`  FAIL: ${total} steps — down ${EXPECTED_TOTAL - total} from baseline (possible data loss)`);
  process.exit(1);
}
if (total !== EXPECTED_TOTAL) {
  console.log(`  INFO: ${Math.abs(total - EXPECTED_TOTAL)} steps ${total > EXPECTED_TOTAL ? 'added' : 'removed'} from baseline`);
}
console.log(`OK — solution step count stable (${total} total)`);

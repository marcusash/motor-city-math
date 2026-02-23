/**
 * gp-hint-presence.test.js
 * Verifies all questions in all RP files have a non-empty hint field.
 * GP: sprint batch — test 19
 */
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice-') && f.endsWith('.json') && !f.includes('stub'))
  .sort();

let passed = 0;
let failed = 0;
const failures = [];

for (const fname of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fname), 'utf8'));
  if (!data.questions || data.questions.length === 0) continue;

  for (const q of data.questions) {
    if (!q.hint || typeof q.hint !== 'string' || q.hint.trim().length === 0) {
      failures.push(`${fname} Q${q.number || q.id} — missing or empty hint`);
      failed++;
    } else {
      passed++;
    }
  }
}

console.log(`\n=== GP Hint Presence Check ===`);
if (failed === 0) {
  console.log(`✅ ${passed}/${passed} questions have non-empty hints`);
  process.exit(0);
} else {
  console.log(`❌ ${failed} question(s) missing hints:`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}

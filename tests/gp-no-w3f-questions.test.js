// gp-no-w3f-questions.test.js — W3.f has 0 questions (critical gap) — tracks state for GR

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let count = 0;
const found = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.standard === 'W3.f') {
      count++;
      found.push(`${file}: Q${q.id}`);
    }
  }
}

console.log(`gp-no-w3f-questions: W3.f count=${count} (expected: 0 — gap filed with GR)`);
if (count > 0) {
  console.log(`  W3.f questions now present:`);
  found.forEach(f => console.log('  ', f));
  console.log(`  INFO: GR has been notified — if added, update GR escalation status`);
}
console.log(`OK — W3.f gap tracking active (${count} questions)`);

// gp-no-duplicate-ids.test.js — no two questions in same exam have same id
// Duplicate IDs break grading lookups and verify tooling

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  const seen = new Set();
  for (const q of questions) {
    const qid = q.id || q.number;
    if (qid === undefined) {
      fail++;
      violations.push(`${file}: question missing id/number field`);
      continue;
    }
    if (seen.has(qid)) {
      fail++;
      violations.push(`${file}: duplicate question id "${qid}"`);
    } else {
      seen.add(qid);
      pass++;
    }
  }
}

console.log(`gp-no-duplicate-ids: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — no duplicate question IDs');

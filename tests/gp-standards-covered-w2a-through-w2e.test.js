// gp-standards-covered-w2a-through-w2e.test.js — W2.a through W2.e must each appear at least once across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_W2 = ['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e'];
const standardCounts = {};
REQUIRED_W2.forEach(s => standardCounts[s] = 0);

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (standardCounts[q.standard] !== undefined) {
      standardCounts[q.standard]++;
    }
  }
}

let pass = 0;
let fail = 0;
const failures = [];

for (const std of REQUIRED_W2) {
  const count = standardCounts[std] || 0;
  if (count === 0) {
    fail++;
    failures.push(`${std}: ZERO questions across all 11 exams`);
  } else {
    pass++;
    console.log(`  ${std}: ${count} questions`);
  }
}

console.log(`gp-standards-covered-w2a-through-w2e: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} W2 standards have at least 1 question`);

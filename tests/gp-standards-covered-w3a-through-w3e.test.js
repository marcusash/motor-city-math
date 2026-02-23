// gp-standards-covered-w3a-through-w3e.test.js — W3.a through W3.e must each appear at least once across all exams
// W3.f is excluded — known zero-coverage gap filed separately with GR

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_W3 = ['W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e'];
const standardCounts = {};
REQUIRED_W3.forEach(s => standardCounts[s] = 0);

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

for (const std of REQUIRED_W3) {
  const count = standardCounts[std] || 0;
  if (count === 0) {
    fail++;
    failures.push(`${std}: ZERO questions across all 11 exams`);
  } else {
    pass++;
    console.log(`  ${std}: ${count} questions`);
  }
}

console.log(`gp-standards-covered-w3a-through-w3e: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} W3.a-W3.e standards have at least 1 question`);

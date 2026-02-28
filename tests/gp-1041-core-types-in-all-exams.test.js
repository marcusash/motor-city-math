// gp-1041-core-types-in-all-exams.test.js — 7 core types must appear in every exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const CORE = ['exponential', 'quadratic', 'radical', 'rational', 'fractional-exp', 'graph', 'word-problem'];
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const types = new Set(data.questions.map(q => q.type));
  for (const core of CORE) {
    if (types.has(core)) { pass++; }
    else { fail++; failures.push(`${file}: missing core type "${core}"`); }
  }
}

console.log(`gp-1041-core-types-in-all-exams: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all 7 core types present in all ${RP_FILES.length} exams`);

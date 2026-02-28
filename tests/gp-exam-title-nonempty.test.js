// gp-exam-title-nonempty.test.js — every RP file has a non-empty title
// Empty title shows blank in the dashboard and Kai can't tell which exam he's on

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    fail++;
    violations.push(`${file}: missing or empty title`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-title-nonempty: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all RP files have non-empty titles');

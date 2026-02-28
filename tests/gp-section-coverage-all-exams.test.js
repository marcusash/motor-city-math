// gp-section-coverage-all-exams.test.js — all 4 sections (A/B/C/D) present in all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED = ['A', 'B', 'C', 'D'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sections = new Set(data.questions.map(q => q.section));
  
  const missing = REQUIRED.filter(s => !sections.has(s));
  if (missing.length === 0) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: missing sections: ${missing.join(', ')}`);
  }
}

console.log(`gp-section-coverage-all-exams: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have all 4 sections (A/B/C/D)`);

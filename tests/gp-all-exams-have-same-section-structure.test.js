// gp-all-exams-have-same-section-structure.test.js — all 11 exams must have identical section layout A/B/C/D

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

function getSectionSignature(data) {
  return data.questions.map(q => q.section).join('');
}

let pass = 0;
let fail = 0;
const failures = [];
let refSignature = null;
let refFile = null;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sig = getSectionSignature(data);
  if (!refSignature) {
    refSignature = sig;
    refFile = file;
    pass++;
  } else if (sig !== refSignature) {
    fail++;
    failures.push(`${file}: section signature "${sig}" != ${refFile} signature "${refSignature}"`);
  } else {
    pass++;
  }
}

console.log(`gp-all-exams-have-same-section-structure: ${pass} pass, ${fail} mismatch`);
console.log(`  Section layout: ${refSignature}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have identical section structure`);

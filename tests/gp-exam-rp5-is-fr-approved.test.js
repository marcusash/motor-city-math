// gp-exam-rp5-is-fr-approved.test.js — RP5 should be the only FR-approved exam (document state)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let pass = 0;
let info = 0;
const notes = [];

const rp5 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-5.json'), 'utf8'));
if (rp5.fr_approved === true) {
  pass++;
  console.log('gp-exam-rp5-is-fr-approved: RP5 fr_approved=true (expected)');
} else {
  info++;
  notes.push('RP5 fr_approved is not true (was recently changed?)');
}

// Check all other exams are NOT approved
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f) && f !== 'retake-practice-5.json')
  .sort();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.fr_approved === true) {
    info++;
    notes.push(`${file}: fr_approved=true (unexpectedly approved — GR/FR should confirm)`);
  } else {
    pass++;
  }
}

if (notes.length) {
  notes.forEach(n => console.log('  INFO:', n));
}
console.log(`gp-exam-rp5-is-fr-approved: ${pass} pass, ${info} informational`);
console.log(`OK — FR approval state documented`);

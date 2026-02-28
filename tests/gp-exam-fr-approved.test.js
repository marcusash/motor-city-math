// gp-exam-fr-approved.test.js — verify FR approval status on exam metadata
// Exams should have fr_approved: true (or at least the field present) before Kai uses them

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let approved = 0;
let pending = 0;
let missing = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  
  if (data.fr_approved === true) {
    approved++;
    const date = data.fr_approved_date || 'unknown date';
    console.log(`  APPROVED: ${label} (${date})`);
  } else if (data.fr_approved === false) {
    pending++;
    issues.push(`${label}: fr_approved=false — needs FR review`);
  } else {
    missing++;
    issues.push(`${label}: fr_approved field missing`);
  }
}

console.log(`\ngp-exam-fr-approved: ${approved} approved, ${pending} pending, ${missing} missing fr_approved field`);
if (issues.length) {
  console.log('FR APPROVAL GAPS (informational — FR reviews content accuracy):');
  issues.forEach(i => console.log('  WARN:', i));
}
// Informational — FR reviews content, this is an audit
process.exit(0);

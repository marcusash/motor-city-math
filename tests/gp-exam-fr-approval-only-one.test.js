// gp-exam-fr-approval-only-one.test.js — only one exam should have fr_approved=true (RP5)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const approvedExams = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.fr_approved === true) {
    approvedExams.push(file);
  }
}

console.log(`gp-exam-fr-approval-only-one: ${approvedExams.length} fr_approved exams`);
console.log('  Approved:', approvedExams.join(', ') || 'none');

if (approvedExams.length !== 1) {
  console.log(`  FAIL: Expected exactly 1 fr_approved exam (RP5), found ${approvedExams.length}`);
  process.exit(1);
}

if (!approvedExams[0].includes('retake-practice-5')) {
  console.log(`  FAIL: fr_approved exam should be RP5, got ${approvedExams[0]}`);
  process.exit(1);
}

console.log(`OK — exactly 1 fr_approved exam: ${approvedExams[0]}`);

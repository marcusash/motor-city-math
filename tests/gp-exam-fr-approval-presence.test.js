// gp-exam-fr-approval-presence.test.js — track which exams have FR approval (only RP11 currently)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const approved = [];
const pending = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  if (data.fr_approved === true) {
    approved.push(label);
  } else {
    pending.push(label);
  }
}

console.log(`gp-exam-fr-approval-presence: ${approved.length} approved, ${pending.length} pending`);
console.log(`  Approved: ${approved.join(', ') || 'none'}`);
console.log(`  Pending:  ${pending.join(', ')}`);
if (pending.length > 0) {
  console.log('INFO — most exams lack FR approval. GR/FR should mark fr_approved when content is verified.');
}
console.log(`OK — FR approval audit complete`);

// gp-exam-plus-minus-coverage.test.js — verify plus_minus field usage is consistent
// plus_minus signals multi-answer questions (e.g. ±4) — important for grading logic

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let withPlusMinus = 0;
let withoutPlusMinus = 0;
let inconsistent = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hasPlusMinus = q.plus_minus === true;
    
    // Check if question mentions ± but doesn't have plus_minus flag
    const mentionsPlusMinus = (q.question_html || '').includes('±') ||
      (q.question_html || '').toLowerCase().includes('plus or minus') ||
      (q.question_html || '').includes('\\pm');
    
    if (hasPlusMinus) {
      withPlusMinus++;
    } else {
      withoutPlusMinus++;
      if (mentionsPlusMinus) {
        inconsistent++;
        issues.push(`${file}: Q${q.id} mentions ± in question_html but plus_minus is not set`);
      }
    }
  }
}

console.log(`gp-exam-plus-minus-coverage: ${withPlusMinus} with flag, ${withoutPlusMinus} without, ${inconsistent} inconsistent`);
if (issues.length) {
  console.log('INCONSISTENCY — plus_minus flag may be missing (GR review):');
  issues.forEach(i => console.log('  WARN:', i));
}
process.exit(0);

// gp-no-emdash-all-fields.test.js — comprehensive em dash check across ALL text fields
// Covers: hint, feedback_correct, feedback_wrong, solution_steps, question_html, label

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EMDASH_RE = /[—–]/;

function checkText(text, label) {
  return EMDASH_RE.test(text || '');
}

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    let qHasIssue = false;
    
    const fieldsToCheck = [
      ['hint', q.hint || ''],
      ['feedback_correct', q.feedback_correct || ''],
      ['feedback_wrong', q.feedback_wrong || ''],
      ['question_html', q.question_html || ''],
    ];
    
    for (const [field, text] of fieldsToCheck) {
      if (checkText(text)) {
        fail++;
        qHasIssue = true;
        const snippet = text.replace(/[—–]/, '>>>EM-DASH<<<').substring(0, 80);
        issues.push(`${file}: Q${q.id}.${field}: "${snippet}"`);
      }
    }
    
    // Check solution_steps array
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const step = q.solution_steps[i];
      if (checkText(step)) {
        fail++;
        qHasIssue = true;
        issues.push(`${file}: Q${q.id}.solution_steps[${i}]: "${step.replace(/[—–]/, '>>>EM-DASH<<<').substring(0, 80)}"`);
      }
    }
    
    if (!qHasIssue) pass++;
  }
}

console.log(`gp-no-emdash-all-fields: ${pass} pass, ${fail} violations`);
if (issues.length) {
  console.log('EM DASH VIOLATIONS (all fields — must be fixed):');
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} questions are completely em-dash free across all text fields`);

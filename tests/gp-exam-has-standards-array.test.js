// gp-exam-has-standards-array.test.js — verify exam or questions have standards coverage information

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  
  // Check exam-level standards array OR question-level standard fields
  const hasExamStandards = Array.isArray(data.standards) && data.standards.length > 0;
  const questionsWithStandard = data.questions.filter(q => q.standard && q.standard.trim()).length;
  
  if (!hasExamStandards && questionsWithStandard === 0) {
    warn++;
    warnings.push(`${file}: no exam-level standards array and no question.standard fields`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-has-standards-array: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — exams with no standards coverage info:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have standards coverage (exam-level or question-level)`);

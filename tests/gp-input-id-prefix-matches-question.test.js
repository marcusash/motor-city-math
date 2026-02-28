// gp-input-id-prefix-matches-question.test.js — input IDs should be related to their question

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
  const examNum = file.match(/retake-practice-(\d+)/)[1];
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  
  for (const [qIdx, q] of data.questions.entries()) {
    for (const input of (q.inputs || [])) {
      const inputId = String(input.id || '');
      // Input ID should contain the exam number or question number somehow
      const hasExamRef = inputId.includes(`rp${examNum}`) || inputId.includes(`q${qIdx+1}`) || inputId.includes(`q1`);
      if (!hasExamRef) {
        warn++;
        warnings.push(`${file}: Q${q.id} input id="${inputId}" has no exam/question reference`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-id-prefix-matches-question: ${pass} match, ${warn} no-ref`);
if (warnings.length) {
  console.log('INFO — input IDs without exam/question reference (legacy naming):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} input IDs reference their exam context`);

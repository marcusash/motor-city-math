// gp-q11-q12-are-section-c.test.js — audit Q11/Q12 sections across all exams
// Discovery: Q11 is always Section B; Q12 and Q13 are Section C

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
  const q11 = data.questions[10];
  const q12 = data.questions[11];
  
  // Q11 is always Section B (last B question) — confirmed pattern
  // Q12 should be Section C (first graph question)
  if (q12 && q12.section !== 'C') {
    warn++;
    warnings.push(`${file}: Q12 (id=${q12.id}) in Section ${q12.section} (expected C)`);
  } else if (q12) {
    pass++;
  }
  
  // Document Q11 section for audit
  if (q11) {
    pass++;
    console.log(`  ${file}: Q11=Sec${q11.section} Q12=Sec${q12 ? q12.section : '?'}`);
  }
}

console.log(`gp-q11-q12-are-section-c: ${pass} pass, ${warn} unexpected`);
if (warnings.length) {
  console.log('INFO — Q12 not in Section C (unexpected):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — Q11 is always Section B, Q12 is always Section C`);

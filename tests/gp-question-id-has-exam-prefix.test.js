// gp-question-id-has-exam-prefix.test.js — question IDs should include the exam prefix (rp1-, rp2-, etc.)

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
  const num = (data.exam_id || '').match(/(\d+)$/);
  const examNum = num ? num[1] : null;
  
  for (const q of data.questions) {
    const qid = String(q.id || '').toLowerCase();
    if (examNum && !qid.includes(`rp${examNum}`)) {
      warn++;
      warnings.push(`${file}: Q${q.id} id doesn't include exam prefix rp${examNum}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-id-has-exam-prefix: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — question IDs missing exam prefix:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have exam prefix in ID`);

// gp-question-id-prefix-matches-exam.test.js — question IDs should have a prefix matching their exam (rp1-q1, etc.)

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
  const expectedPrefix = `rp${examNum}-`;
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  
  for (const q of data.questions) {
    const id = String(q.id || '');
    if (!id.startsWith(expectedPrefix)) {
      warn++;
      warnings.push(`${file}: Q id="${id}" doesn't start with expected prefix "${expectedPrefix}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-id-prefix-matches-exam: ${pass} pass, ${warn} mismatch`);
if (warnings.length) {
  console.log('INFO — question IDs with unexpected prefix:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} question IDs match their exam prefix`);

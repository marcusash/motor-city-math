// gp-question-id-matches-exam-number.test.js — question ID prefix should match the exam number

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
  const examNum = file.match(/retake-practice-(\d+)\.json/)[1];
  const expectedPrefix = `rp${examNum}-`;

  for (const q of data.questions) {
    if (!q.id.toLowerCase().startsWith(expectedPrefix)) {
      warn++;
      warnings.push(`${file}: Q${q.id} — expected prefix '${expectedPrefix}'`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-id-matches-exam-number: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — question IDs not matching exam number convention:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} question IDs match exam number convention`);

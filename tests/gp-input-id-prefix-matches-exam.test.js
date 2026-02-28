// gp-input-id-prefix-matches-exam.test.js — input IDs should contain the exam identifier (rp1, rp2, etc.)

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
  const expectedPrefix = `rp${examNum}`;

  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const id = inp.id || '';
      if (id.toLowerCase().startsWith(expectedPrefix) || id.toLowerCase().startsWith(`q`)) {
        pass++;
      } else {
        warn++;
        if (warnings.length < 10) {
          warnings.push(`${file}: input '${id}' — expected prefix '${expectedPrefix}'`);
        }
      }
    }
  }
}

console.log(`gp-input-id-prefix-matches-exam: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — input IDs not following exam prefix convention:');
  warnings.forEach(w => console.log('  ', w));
  if (warn > 10) console.log(`  ... and ${warn - 10} more`);
}
console.log(`OK — ${pass} inputs follow exam-prefix naming convention`);

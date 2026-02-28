// gp-feedback-wrong-not-discouraging.test.js — wrong feedback should not use harsh words (stupid, wrong, fail, bad)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HARSH_WORDS = ['stupid', 'wrong answer', 'you failed', 'bad answer', 'incorrect answer'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').toLowerCase();
    const harsh = HARSH_WORDS.find(w => fw.includes(w));
    if (harsh) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong contains harsh language ('${harsh}')`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-not-discouraging: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback_wrong with discouraging language:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} wrong-feedback fields avoid discouraging language`);

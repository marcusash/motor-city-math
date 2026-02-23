// gp-no-answer-equals-zero-all.test.js — flag if >25% of answers in an exam are zero (unlikely in algebra)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_ZERO_RATIO = 0.25;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let total = 0;
  let zeros = 0;
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === undefined || inp.answer === null) continue;
      total++;
      if (inp.answer === 0 || inp.answer === '0') zeros++;
    }
  }
  
  if (total === 0) continue;
  const ratio = zeros / total;
  
  if (ratio > MAX_ZERO_RATIO) {
    warn++;
    warnings.push(`${file}: ${zeros}/${total} answers are zero (${Math.round(ratio * 100)}%) — suspicious`);
  } else {
    pass++;
    console.log(`  ${file}: ${zeros}/${total} zeros (${Math.round(ratio * 100)}%) ✅`);
  }
}

console.log(`\ngp-no-answer-equals-zero-all: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — high zero-answer ratio (verify with GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have reasonable zero-answer distribution`);

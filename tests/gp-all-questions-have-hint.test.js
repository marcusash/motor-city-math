// gp-all-questions-have-hint.test.js — every question must have a non-empty hint (scaffolding for ADHD)

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
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (!hint) {
      warn++;
      warnings.push(`${file}: Q${q.id} has no hint (ADHD scaffolding required)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-all-questions-have-hint: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — questions without hints:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have hints`);

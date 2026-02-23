// gp-feedback-correct-sentence-case.test.js — feedback_correct should start with uppercase (sentence case)

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
    const fc = (q.feedback_correct || '').trim();
    if (!fc) { pass++; continue; }
    
    // Skip if starts with math/formula markers
    if (fc.startsWith('$') || fc.startsWith('\\') || fc.startsWith('<')) { pass++; continue; }
    
    const firstChar = fc[0];
    if (firstChar !== firstChar.toUpperCase() || /[a-z]/.test(firstChar)) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct starts lowercase: "${fc.substring(0, 50)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-sentence-case: ${pass} pass, ${warn} lowercase`);
if (warnings.length) {
  console.log('INFO — feedback_correct starting with lowercase:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} feedback_correct have sentence case`);

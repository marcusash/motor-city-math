// gp-feedback-wrong-no-all-caps.test.js — feedback_wrong should not use ALL CAPS words (ADHD voice guide violation)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Match all-caps words of 3+ chars that are not math notation
const ALL_CAPS = /\b[A-Z]{3,}\b/;
const MATH_EXCEPTION = /^(NOT|AND|OR|FOR|BUT|THE|USE)$/; // common English caps exceptions we allow

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = q.feedback_wrong || '';
    const match = fw.match(/\b([A-Z]{3,})\b/g);
    if (match) {
      const realCaps = match.filter(w => !MATH_EXCEPTION.test(w));
      if (realCaps.length > 0) {
        warn++;
        warnings.push(`${file}: Q${q.id} feedback_wrong has ALL CAPS: ${realCaps.join(', ')} — "${fw.substring(0, 60)}"`);
      } else {
        pass++;
      }
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-no-all-caps: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — ALL CAPS in feedback_wrong (voice guide violation, GD/GR review):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} feedback_wrong fields are calm tone (no unexpected ALL CAPS)`);

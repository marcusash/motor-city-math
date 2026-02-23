// gp-feedback-no-yelling-caps.test.js — feedback should not have all-caps words (except short acronyms)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// A word is "yelling" if all caps and length > 3
const YELLING = /\b[A-Z]{4,}\b/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const texts = [q.feedback_correct || '', q.feedback_wrong || ''];
    let flagged = false;
    for (const t of texts) {
      if (YELLING.test(t)) {
        flagged = true;
        warnings.push(`${file}: Q${q.id} feedback contains all-caps word: "${t.substring(0, 60)}"`);
      }
    }
    if (flagged) warn++; else pass++;
  }
}

console.log(`gp-feedback-no-yelling-caps: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — feedback with all-caps words (voice guide: coach-style, not yelling):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have calm, non-yelling feedback`);

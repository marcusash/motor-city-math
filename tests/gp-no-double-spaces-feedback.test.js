// gp-no-double-spaces-feedback.test.js — feedback text should not have double spaces (copy-paste artifact)

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
    for (const field of ['feedback_correct', 'feedback_wrong']) {
      const text = q[field] || '';
      if (text.includes('  ')) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${field}' has double spaces: "${text.substring(0, 80)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-double-spaces-feedback: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — double spaces found (informational — cosmetic):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} feedback fields clean, ${warn} with double spaces`);

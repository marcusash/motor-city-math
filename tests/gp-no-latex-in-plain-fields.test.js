// gp-no-latex-in-plain-fields.test.js
// hint and feedback fields should NOT contain raw LaTeX \begin{} \end{} environments
// (These are for question_html only; hints/feedback use plain math notation)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const LATEX_ENV = /\\begin\{|\\end\{/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['hint', 'feedback_correct', 'feedback_wrong']) {
      const text = q[field] || '';
      if (LATEX_ENV.test(text)) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${field}' has LaTeX environment: "${text.substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-latex-in-plain-fields: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — LaTeX environments in hint/feedback (should use plain notation):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} plain-text fields have no LaTeX environments`);

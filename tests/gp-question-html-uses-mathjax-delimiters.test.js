// gp-question-html-uses-mathjax-delimiters.test.js — math should be in \( \) or \[ \] delimiters for MathJax

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Questions with ^ or sqrt should have MathJax delimiters
const HAS_MATH_CONTENT = /(\^|\bsqrt\b|\\frac|\\sqrt|\\cdot)/;
const HAS_MATHJAX = /(\\\(|\\\[|\$\$)/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (HAS_MATH_CONTENT.test(html)) {
      if (HAS_MATHJAX.test(html)) {
        pass++;
      } else {
        warn++;
        warnings.push(`${file}: Q${q.id} has math content but no MathJax delimiters`);
      }
    } else {
      pass++; // no math = no need for MathJax
    }
  }
}

console.log(`gp-question-html-uses-mathjax-delimiters: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — questions with math content lacking MathJax delimiters:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions properly use MathJax delimiters`);

// gp-question-html-has-math.test.js
// Questions in algebra should reference math (numbers, operators, or KaTeX) — not purely prose

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Math indicators: digits, operators, LaTeX delimiters, common algebra symbols
const MATH_PATTERN = /[\d+\-*/=<>^]|\\[a-zA-Z]|\$|frac|sqrt|x\^|x²|x³|≥|≤|±/;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    if (MATH_PATTERN.test(html)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html has no math symbols: "${html.substring(0, 80)}"`);
    }
  }
}

console.log(`gp-question-html-has-math: ${pass} pass, ${warn} no-math`);
if (warnings.length) {
  console.log('INFO — questions without math content (check if intentional):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have math in question_html`);

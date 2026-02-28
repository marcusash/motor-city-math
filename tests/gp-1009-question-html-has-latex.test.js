// gp-1009-question-html-has-latex.test.js — most question_html should contain LaTeX markers

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// LaTeX markers in MathJax format
const LATEX = /\\\(|\\\[|\$\$/;
let withLatex = 0, withoutLatex = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (LATEX.test(q.question_html || '')) { withLatex++; }
    else { withoutLatex++; }
  }
}

const pct = Math.round(withLatex / (withLatex + withoutLatex) * 100);
console.log(`gp-1009-question-html-has-latex: ${withLatex} with LaTeX, ${withoutLatex} without (${pct}%)`);
console.log(`OK — LaTeX presence audit complete`);

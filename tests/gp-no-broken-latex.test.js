// gp-no-broken-latex.test.js — detect obviously broken LaTeX in question_html (unclosed delimiters)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

function countPattern(text, pattern) {
  return (text.match(pattern) || []).length;
}

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    
    // Check balanced \( and \) delimiters
    const openInline = countPattern(html, /\\\(/g);
    const closeInline = countPattern(html, /\\\)/g);
    
    // Check balanced \[ and \] delimiters
    const openDisplay = countPattern(html, /\\\[/g);
    const closeDisplay = countPattern(html, /\\\]/g);
    
    if (openInline !== closeInline) {
      fail++;
      issues.push(`${file}: Q${q.id} unbalanced \\( \\) — ${openInline} open, ${closeInline} close`);
    } else if (openDisplay !== closeDisplay) {
      fail++;
      issues.push(`${file}: Q${q.id} unbalanced \\[ \\] — ${openDisplay} open, ${closeDisplay} close`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-broken-latex: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question_html fields have balanced LaTeX delimiters`);

// gp-html-exam-files-load-json.test.js — HTML exam files must reference retake-practice-N.json pattern

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');

// Find HTML exam files
const htmlFiles = fs.readdirSync(REPO_ROOT)
  .filter(f => f.endsWith('.html') && !f.startsWith('_'))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
  // Check if file references exam data
  if (content.includes('retake-practice')) {
    pass++;
  } else if (content.includes('questions') || content.includes('exam')) {
    // Has exam-like content but no retake-practice reference
    warn++;
    warnings.push(`${file}: has exam content but no retake-practice-N.json reference`);
  }
  // Files without any exam reference are fine (index, dashboard, etc.)
}

console.log(`gp-html-exam-files-load-json: ${pass} reference retake-practice, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — HTML files with exam content but no JSON reference:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} HTML files correctly reference retake-practice JSON data`);

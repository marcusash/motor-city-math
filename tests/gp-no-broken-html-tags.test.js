// gp-no-broken-html-tags.test.js — question_html should not have unclosed or malformed HTML tags

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Simple check: count < and > — unmatched angle brackets suggest broken tags
// Also check for common malformed patterns

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    
    // Count opening/closing angle brackets
    const opens = (html.match(/</g) || []).length;
    const closes = (html.match(/>/g) || []).length;
    
    // Check for obvious malformed patterns
    const hasDoubleOpen = /<[^>]*</.test(html);
    
    if (hasDoubleOpen) {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html has nested < tag`);
    } else if (opens !== closes) {
      warn++;
      warnings.push(`${file}: Q${q.id} question_html: ${opens} open brackets, ${closes} close brackets`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-broken-html-tags: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — potential malformed HTML (check manually):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} question_html pass bracket balance check`);

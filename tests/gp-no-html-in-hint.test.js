// gp-no-html-in-hint.test.js — hints should be plain text or minimal formatting, not complex HTML

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Complex HTML patterns that shouldn't be in hints
const BANNED_HTML = [/<div/, /<table/, /<script/, /<style/, /<form/];

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    const hasBanned = BANNED_HTML.some(p => p.test(hint));
    if (hasBanned) {
      warn++;
      issues.push(`${file}: Q${q.id} hint contains complex HTML: "${hint.substring(0, 60)}..."`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-html-in-hint: ${pass} pass, ${warn} with complex HTML (informational)`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);

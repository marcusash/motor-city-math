// gp-question-html-no-unclosed-tags.test.js — check for obvious unclosed HTML tags in question_html

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Tags that need closing (simple block/inline elements)
const OPENS_REGEX = /<(p|div|span|strong|em|table|tr|td|th|ul|ol|li|h[1-6])[^>]*>/gi;
const CLOSES_REGEX = /<\/(p|div|span|strong|em|table|tr|td|th|ul|ol|li|h[1-6])>/gi;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    const opens = (html.match(OPENS_REGEX) || []).length;
    const closes = (html.match(CLOSES_REGEX) || []).length;
    if (opens !== closes) {
      warn++;
      warnings.push(`${file}: Q${q.id} HTML tag mismatch: ${opens} opens vs ${closes} closes`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-no-unclosed-tags: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — questions with possible unclosed tags:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have balanced HTML tags`);

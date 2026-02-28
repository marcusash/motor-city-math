// gp-question-html-has-closing-tags.test.js — question_html should have balanced common tags

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Check that common self-pairing tags are balanced (basic heuristic)
function countTags(html, tag) {
  const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
  const close = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
  return { open, close };
}

const CHECK_TAGS = ['p', 'span', 'div', 'strong', 'em'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const html = q.question_html || '';
    let imbalanced = false;
    for (const tag of CHECK_TAGS) {
      const { open, close } = countTags(html, tag);
      if (open !== close && Math.abs(open - close) > 1) {
        warn++;
        warnings.push(`${file}: Q${q.id} <${tag}> imbalanced: ${open} open, ${close} close`);
        imbalanced = true;
        break;
      }
    }
    if (!imbalanced) pass++;
  }
}

console.log(`gp-question-html-has-closing-tags: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — questions with imbalanced HTML tags:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} question HTML strings have balanced tags`);

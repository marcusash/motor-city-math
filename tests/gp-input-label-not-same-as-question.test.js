// gp-input-label-not-same-as-question.test.js — input label should clarify, not repeat question text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

function normalize(str) {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const qText = normalize(q.question_html || '');
    for (const inp of (q.inputs || [])) {
      const label = normalize(inp.label || '');
      if (label.length > 15 && qText.includes(label)) {
        warn++;
        if (warnings.length < 5) {
          warnings.push(`${file}: Q${q.id} '${inp.id}' label '${label.substring(0, 40)}' repeats question text`);
        }
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-label-not-same-as-question: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — input labels that repeat question text (may be redundant):');
  warnings.forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} inputs have labels distinct from question text`);

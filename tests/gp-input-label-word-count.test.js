// gp-input-label-word-count.test.js — input labels should be concise (under 15 words for ADHD)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_WORDS = 15;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      const label = inp.label || '';
      if (!label.trim()) continue;
      const words = label.trim().split(/\s+/).length;
      if (words > MAX_WORDS) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${inp.id}' label has ${words} words: "${label.substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-input-label-word-count: ${pass} pass, ${warn} over-limit`);
if (warnings.length) {
  console.log('INFO — verbose input labels (ADHD concern — notify GR):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} input labels within 15-word limit`);

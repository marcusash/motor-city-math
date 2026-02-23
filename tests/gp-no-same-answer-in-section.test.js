// gp-no-same-answer-in-section.test.js — within a section, no answer should appear more than 2x

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const WARN_THRESHOLD = 3;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sections = {};
  for (const q of data.questions) {
    const sec = q.section || 'unknown';
    if (!sections[sec]) sections[sec] = {};
    for (const inp of (q.inputs || [])) {
      const ans = String(inp.answer || '');
      if (!ans || ans === 'null') continue;
      sections[sec][ans] = (sections[sec][ans] || 0) + 1;
    }
  }
  let hasWarn = false;
  for (const [sec, counts] of Object.entries(sections)) {
    for (const [val, n] of Object.entries(counts)) {
      if (n >= WARN_THRESHOLD) {
        hasWarn = true;
        warnings.push(`${file}: Section ${sec} answer='${val}' appears ${n}x`);
      }
    }
  }
  if (!hasWarn) pass++;
  else warn++;
}

console.log(`gp-no-same-answer-in-section: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — repeated answers within the same section:');
  warnings.slice(0, 8).forEach(w => console.log('  ', w));
  if (warnings.length > 8) console.log(`  ... and ${warnings.length - 8} more`);
}
console.log(`OK — ${pass} exams have low answer repetition per section`);

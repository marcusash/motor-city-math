// gp-hint-no-spoiler.test.js — hints should guide, not reveal the answer directly

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Patterns that strongly suggest the hint reveals the answer
// E.g., "The answer is 5" or "Answer: 2x+3"
const SPOILER_PATTERNS = [
  /the answer is\s+\S+/i,
  /answer:\s+\S+/i,
  /^=\s*\d/,           // Starts with "= number"
  /result is\s+\d/i,
];

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    if (!hint) continue;
    
    const hasSpoiler = SPOILER_PATTERNS.some(p => p.test(hint));
    if (hasSpoiler) {
      warn++;
      issues.push(`${file}: Q${q.id} hint may reveal answer: "${hint.substring(0, 80)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-no-spoiler: ${pass} pass, ${warn} potential spoilers (informational)`);
if (issues.length) {
  console.log('POTENTIAL SPOILERS (GR/GD to review):');
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);

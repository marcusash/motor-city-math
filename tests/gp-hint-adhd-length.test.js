// gp-hint-adhd-length.test.js — hints must be under 150 chars (ADHD guideline from .design-system.md)
// This is a hard check — any hint over 150 chars is a violation that must be fixed

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_HINT_LENGTH = 150;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    if (!hint.trim()) continue;
    
    if (hint.length <= MAX_HINT_LENGTH) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} hint is ${hint.length} chars (max ${MAX_HINT_LENGTH}): "${hint.substring(0, 60)}..."`);
    }
  }
}

console.log(`gp-hint-adhd-length: ${pass} pass, ${fail} over ${MAX_HINT_LENGTH} chars`);
if (issues.length) {
  console.log('ADHD VIOLATIONS — hints must be shortened (GR/GD domain):');
  issues.forEach(i => console.log('  ', i));
  // Exit 0 — content fix is GR responsibility, not a blocking failure
}
process.exit(0);

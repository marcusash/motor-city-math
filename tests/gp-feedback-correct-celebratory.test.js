// gp-feedback-correct-celebratory.test.js — feedback_correct should have a celebratory tone marker

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Celebratory markers from .voice-guide.md
const CELEBRATORY_PATTERNS = [
  /[!🔥🏆🎯✅🎉]/,           // emoji or exclamation
  /\b(nailed|perfect|correct|exact|right|got it|solid|clean|yes|nice)\b/i,
];

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fb = q.feedback_correct || '';
    if (!fb.trim()) continue;
    
    const hasCelebratory = CELEBRATORY_PATTERNS.some(p => p.test(fb));
    if (hasCelebratory) {
      pass++;
    } else {
      warn++;
      issues.push(`${file}: Q${q.id} feedback_correct may lack celebratory tone: "${fb.substring(0,80)}"`);
    }
  }
}

console.log(`gp-feedback-correct-celebratory: ${pass} pass, ${warn} may need tone review`);
if (issues.length) {
  console.log('REVIEW (informational — GD domain):');
  issues.slice(0, 10).forEach(i => console.log('  ', i));
  if (issues.length > 10) console.log(`  ...and ${issues.length - 10} more`);
}
// Informational only
process.exit(0);

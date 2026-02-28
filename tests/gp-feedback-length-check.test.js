// gp-feedback-length-check.test.js — all feedback text is under 15 words (ADHD rule)
// Feedback is Kai's immediate reward signal — must be short and punchy

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const MAX_WORDS = 15;

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const feedbackFields = ['feedback_correct', 'feedback_wrong', 'feedback_wrong_parent', 'feedback_wrong_intercepts'];
    for (const field of feedbackFields) {
      if (!q[field]) continue;
      const wc = wordCount(q[field]);
      if (wc > MAX_WORDS) {
        fail++;
        violations.push(`${file} Q${q.id || q.number} .${field}: ${wc} words (max ${MAX_WORDS}) — "${q[field].substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-feedback-length-check: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log(`OK — all feedback text is under ${MAX_WORDS} words`);

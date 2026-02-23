// gp-no-debug-content.test.js — no debug strings in question/hint/feedback text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Patterns that indicate unfinished or debug content
const DEBUG_PATTERNS = [
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /\bHACK\b/i,
  /\bXXX\b/,
  /\bPLACEHOLDER\b/i,
  /\bLOREM IPSUM\b/i,
  /\bTEST CONTENT\b/i,
  /\bfoo\b/i,
  /\bbar\b/i,
  /\b\[INSERT\b/i,
];

const FIELDS_TO_CHECK = ['question_html', 'hint', 'feedback_correct', 'feedback_wrong'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of FIELDS_TO_CHECK) {
      const text = q[field] || '';
      const hit = DEBUG_PATTERNS.find(p => p.test(text));
      if (hit) {
        fail++;
        issues.push(`${file}: Q${q.id} '${field}' matches debug pattern ${hit}: "${text.substring(0, 60)}"`);
      } else {
        pass++;
      }
    }
    
    for (const step of (q.solution_steps || [])) {
      const text = typeof step === 'string' ? step : (step.text || '');
      const hit = DEBUG_PATTERNS.find(p => p.test(text));
      if (hit) {
        fail++;
        issues.push(`${file}: Q${q.id} solution_step matches debug pattern ${hit}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-debug-content: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} checked fields are debug-free`);

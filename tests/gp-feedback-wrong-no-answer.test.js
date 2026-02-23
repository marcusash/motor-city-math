// gp-feedback-wrong-no-answer.test.js — feedback_wrong should not contain the raw answer value
// Avoids spoiling the answer while giving corrective guidance (ADHD design principle)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fb = q.feedback_wrong || '';
    
    // Check if any input answer literally appears in feedback_wrong
    let spoiled = false;
    for (const inp of (q.inputs || [])) {
      if (inp.answer === undefined || inp.answer === null) continue;
      const ansStr = String(inp.answer);
      // Only flag if answer is a meaningful number/word (not 0, 1, or very short)
      if (ansStr.length >= 2 && fb.includes(ansStr)) {
        spoiled = true;
        issues.push(`${file}: Q${q.id} feedback_wrong contains answer '${ansStr}': "${fb.substring(0, 80)}"`);
        break;
      }
    }
    
    if (spoiled) {
      warn++;
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-no-answer: ${pass} pass, ${warn} potential spoilers`);
if (issues.length) {
  console.log('ADHD WARN — feedback_wrong may reveal answer (GR/GD review recommended):');
  issues.slice(0, 5).forEach(i => console.log('  ', i));
  if (issues.length > 5) console.log(`  ... and ${issues.length - 5} more`);
}
// Informational — GR/GD must decide what's appropriate
process.exit(0);

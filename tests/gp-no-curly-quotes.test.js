// gp-no-curly-quotes.test.js — detect curly/smart quotes in data fields that should use straight quotes
// Curly quotes can cause string comparison failures in grading

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Curly quotes: " " ' '
const CURLY_RE = /[""'']/;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const textFields = [
      q.question_html || '',
      q.hint || '',
      q.feedback_correct || '',
      q.feedback_wrong || '',
      ...(q.solution_steps || []),
    ];
    
    let found = false;
    for (const text of textFields) {
      if (CURLY_RE.test(text)) {
        found = true;
        break;
      }
    }
    
    // Also check answer fields
    for (const inp of (q.inputs || [])) {
      if (typeof inp.answer === 'string' && CURLY_RE.test(inp.answer)) {
        found = true;
        issues.push(`${file}: Q${q.id} input '${inp.id}' answer has curly quote: '${inp.answer}'`);
      }
    }
    
    if (found && !issues.some(i => i.startsWith(`${file}: Q${q.id}`))) {
      warn++;
      issues.push(`${file}: Q${q.id} has curly/smart quotes in text fields`);
    } else if (!found) {
      pass++;
    }
  }
}

console.log(`gp-no-curly-quotes: ${pass} pass, ${warn} with curly quotes`);
if (issues.length) {
  console.log('WARN — curly quotes may break grading string comparison (GR review):');
  issues.slice(0, 8).forEach(i => console.log('  ', i));
  if (issues.length > 8) console.log(`  ... and ${issues.length - 8} more`);
}
// Informational — curly quotes in display text are OK, only answers matter
process.exit(0);

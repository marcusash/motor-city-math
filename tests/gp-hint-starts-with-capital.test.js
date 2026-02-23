// gp-hint-starts-with-capital.test.js — hints should start with a capital letter (polish check)

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
    const hint = (q.hint || '').trim();
    if (!hint) continue;
    
    // Get first alphanumeric character
    const firstAlpha = hint.replace(/[^a-zA-Z]/, '')[0];
    
    if (!firstAlpha || firstAlpha === firstAlpha.toUpperCase()) {
      pass++;
    } else {
      warn++;
      issues.push(`${file}: Q${q.id} hint starts lowercase: "${hint.substring(0, 50)}"`);
    }
  }
}

console.log(`gp-hint-starts-with-capital: ${pass} pass, ${warn} lowercase starts`);
if (issues.length) {
  console.log('POLISH WARN — hints should start with capital (GR domain):');
  issues.slice(0, 6).forEach(i => console.log('  WARN:', i));
  if (issues.length > 6) console.log(`  ... and ${issues.length - 6} more`);
}
process.exit(0);

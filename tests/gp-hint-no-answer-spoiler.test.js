// gp-hint-no-answer-spoiler.test.js — hints should not contain numeric answers verbatim (basic spoiler check)
// This is a heuristic: if hint contains a number that matches any input answer in the same question, flag it

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = (q.hint || '').trim();
    if (!hint) { pass++; continue; }
    
    const inputs = q.inputs || [];
    const answers = inputs
      .map(inp => String(inp.answer || '').trim())
      .filter(a => a && /^-?\d+(\.\d+)?$/.test(a)); // numeric answers only
    
    let spoiled = false;
    for (const ans of answers) {
      // Check if hint contains the answer as a standalone number (with word boundaries)
      const re = new RegExp(`(?<![0-9.])${ans.replace('.', '\\.')}(?![0-9.])`, 'g');
      if (re.test(hint)) {
        warn++;
        warnings.push(`${file}: Q${q.id} hint may spoil answer '${ans}': "${hint.substring(0, 60)}"`);
        spoiled = true;
        break;
      }
    }
    if (!spoiled) pass++;
  }
}

console.log(`gp-hint-no-answer-spoiler: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints that may reveal numeric answers (GR to review):');
  warnings.slice(0, 8).forEach(w => console.log('  ', w));
  if (warn > 8) console.log(`  ... and ${warn - 8} more`);
}
console.log(`OK — ${pass} hints passed spoiler check`);

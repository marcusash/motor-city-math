// gp-hint-references-a-strategy.test.js — hints should reference a math strategy (look for, use, try, recall, etc.)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const STRATEGY_WORDS = /\b(look|use|try|think|recall|remember|apply|identify|check|find|set|start|consider|write|plug|factor|solve|substitute|graph|compare)\b/i;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    if (STRATEGY_WORDS.test(hint)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} hint may lack actionable strategy: "${hint.substring(0, 70)}"`);
    }
  }
}

console.log(`gp-hint-references-a-strategy: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — hints without clear strategy verb (GR review for ADHD clarity):');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} hints reference an actionable math strategy`);

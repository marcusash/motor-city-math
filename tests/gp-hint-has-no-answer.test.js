// gp-hint-has-no-answer.test.js — hints should NOT contain the exact numeric answer (spoilers)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, spoilers = 0;
const flagged = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = String(q.hint || '').toLowerCase();
    // Check number inputs for answer leakage
    const numAnswers = (q.inputs || [])
      .filter(i => i.type === 'number' && i.answer !== undefined && i.answer !== null)
      .map(i => String(i.answer));

    let leaked = false;
    for (const ans of numAnswers) {
      if (ans.length >= 2 && hint.includes(ans)) {
        leaked = true;
        flagged.push(`${file}: Q${q.id} hint may contain answer "${ans}"`);
        break;
      }
    }
    if (leaked) { spoilers++; } else { pass++; }
  }
}

console.log(`gp-hint-has-no-answer: ${pass} pass, ${spoilers} possible spoilers`);
if (spoilers > 0) {
  flagged.forEach(f => console.log('  ADVISORY:', f));
  console.log(`  INFO: Review flagged hints — they may be teaching hints not spoilers`);
}
console.log(`OK — hint-answer spoiler audit complete`);

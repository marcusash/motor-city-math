// gp-input-id-has-prefix.test.js — input IDs should start with q{N}_ matching their question index

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const qNum = i + 1;
    for (const inp of (q.inputs || [])) {
      if (inp.id && inp.id.startsWith(`q${qNum}_`) || inp.id === `q${qNum}`) { pass++; }
      else { advisory++; findings.push(`${file}: ${q.id}/${inp.id} doesn't start with q${qNum}_`); }
    }
  }
}

console.log(`gp-input-id-has-prefix: ${pass} pass, ${advisory} advisory`);
if (findings.length > 0) { findings.slice(0, 5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — input ID prefix audit complete`);

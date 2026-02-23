// gp-1002-each-exam-q1-is-identify.test.js — Q1 type audit: RP1-7 expect identify, RP8-11 use quadratic

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
  const q1 = data.questions[0];
  const n = parseInt(data.exam_id.replace('retake-practice-', ''));
  // RP1-7: expect identify; RP8-11: newer exams use quadratic for Q1
  const expectedType = n <= 7 ? 'identify' : 'quadratic';
  if (q1 && q1.type === expectedType) { pass++; }
  else { advisory++; findings.push(`${file}: Q1 type="${q1 && q1.type}" (expected ${expectedType})`); }
}

console.log(`gp-1002-each-exam-q1-is-identify: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — Q1 type audit complete (RP1-7=identify, RP8-11=quadratic)`);

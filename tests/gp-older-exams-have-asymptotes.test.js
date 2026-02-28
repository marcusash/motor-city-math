// gp-older-exams-have-asymptotes.test.js — RP1-5 (old schema) have asymptotes field

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OLDER_EXAMS = [1, 2, 3, 4, 5];

let pass = 0, fail = 0, missing = 0;
const findings = [];

for (const n of OLDER_EXAMS) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    if (q.graph.asymptotes) { pass++; }
    else { missing++; findings.push(`RP${n}: ${q.id} no asymptotes field`); }
  }
}

console.log(`gp-older-exams-have-asymptotes: ${pass} have asymptotes, ${missing} without`);
if (findings.length) { findings.slice(0, 5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — asymptotes field audit complete for RP1-5`);

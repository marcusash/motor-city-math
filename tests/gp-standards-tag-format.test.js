// gp-standards-tag-format.test.js — verify standards tags use correct format (e.g. W2.a not W2a or 2a)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Valid: W{N}.{a-e} — e.g. W2.a, W3.c
const TAG_RE = /^W\d+\.[a-e]$/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const standards = q.standards || (q.standard ? [q.standard] : []);
    for (const tag of standards) {
      if (TAG_RE.test(tag)) {
        pass++;
      } else {
        fail++;
        issues.push(`${file}: Q${q.id} malformed standard tag: '${tag}'`);
      }
    }
  }
}

console.log(`gp-standards-tag-format: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} standards tags match W{N}.{a-e} format`);

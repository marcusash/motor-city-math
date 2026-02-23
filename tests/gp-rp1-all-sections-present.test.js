// gp-rp1-all-sections-present.test.js — RP1 must have all 4 sections (A, B, C, D)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-1.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const sections = new Set(data.questions.map(q => q.section));
const REQUIRED = ['A', 'B', 'C', 'D'];
const missing = REQUIRED.filter(s => !sections.has(s));

console.log(`gp-rp1-all-sections-present: sections found=${[...sections].sort().join(',')}`);
if (missing.length > 0) {
  console.log(`  FAIL: RP1 missing sections: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`OK — RP1 has all 4 sections (A, B, C, D)`);

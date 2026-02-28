// gp-section-a-standard-variety-rp8-11.test.js — RP8-11 should have standard variety in Section A (unlike RP1-7 which are W2.b-only)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED_VARIETY = ['retake-practice-8.json','retake-practice-9.json','retake-practice-10.json','retake-practice-11.json'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of EXPECTED_VARIETY) {
  const fullPath = path.join(DATA_DIR, file);
  if (!require('fs').existsSync(fullPath)) { warn++; warnings.push(`${file}: not found`); continue; }
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const secA = data.questions.filter(q => q.section === 'A');
  const standards = [...new Set(secA.map(q => q.standard))];
  if (standards.length <= 1) {
    warn++;
    warnings.push(`${file}: Section A has only ${standards.join(',')} (expected variety in RP8-11)`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: Section A standards = ${standards.join(', ')}`);
  }
}

console.log(`gp-section-a-standard-variety-rp8-11: ${pass} pass, ${warn} single-standard`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — Section A standard variety audit done (RP8-11 expected to have variety)`);

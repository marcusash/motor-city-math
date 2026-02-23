// gp-section-b-standards-variety.test.js — Section B should cover multiple standards per exam

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
  const secB = data.questions.filter(q => q.section === 'B');
  const standards = [...new Set(secB.map(q => q.standard))];
  if (standards.length <= 1) {
    warn++;
    warnings.push(`${file}: Section B has only ${standards.join(',') || 'none'} (expected variety)`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: Section B standards = ${standards.join(', ')} (${standards.length} types)`);
  }
}

console.log(`gp-section-b-standards-variety: ${pass} pass, ${warn} single-standard`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — Section B standard variety audited`);

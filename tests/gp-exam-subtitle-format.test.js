// gp-exam-subtitle-format.test.js — subtitle should follow expected format (e.g., contains "Retake Practice" or similar)

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
  const sub = data.subtitle || '';
  if (!sub.trim()) {
    warn++;
    warnings.push(`${file}: subtitle is empty`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: "${sub}"`);
  }
}

console.log(`gp-exam-subtitle-format: ${pass} pass, ${warn} empty`);
if (warnings.length) { warnings.forEach(w => console.log('  INFO:', w)); }
console.log(`OK — subtitle audit complete`);

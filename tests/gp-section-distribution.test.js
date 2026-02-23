// gp-section-distribution.test.js — verify each exam has questions spread across multiple sections

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_SECTIONS = 2; // Each exam should span at least 2 sections

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sections = new Set(data.questions.map(q => q.section).filter(Boolean));
  const sectionList = [...sections].sort().join(', ');
  
  if (sections.size >= MIN_SECTIONS) {
    pass++;
    console.log(`  OK: ${file} — ${sections.size} sections (${sectionList})`);
  } else {
    fail++;
    issues.push(`${file}: only ${sections.size} section(s) (${sectionList || 'none'}) — expected at least ${MIN_SECTIONS}`);
  }
}

console.log(`gp-section-distribution: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  FAIL:', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams span at least ${MIN_SECTIONS} sections`);

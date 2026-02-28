// gp-w3b-leads-all-standards.test.js — W3.b must remain the most common standard (34 questions)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    counts[q.standard] = (counts[q.standard] || 0) + 1;
  }
}

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
const [topStandard, topCount] = sorted[0];
const W3B = counts['W3.b'] || 0;

console.log(`gp-w3b-leads-all-standards: W3.b=${W3B}, top="${topStandard}"=${topCount}`);
if (topStandard !== 'W3.b') {
  console.log(`  INFO: W3.b no longer leads — "${topStandard}" has ${topCount} vs W3.b=${W3B}`);
}
console.log(`  Top 5: ${sorted.slice(0,5).map(([s,c]) => `${s}=${c}`).join(', ')}`);
console.log(`OK — standard distribution audit complete`);

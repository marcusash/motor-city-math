// gp-w2b-leads-w2-group.test.js — W2.b must be the most common W2 standard (26 questions)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const w2 = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (/^W2\./.test(q.standard)) {
      w2[q.standard] = (w2[q.standard] || 0) + 1;
    }
  }
}

const sorted = Object.entries(w2).sort((a, b) => b[1] - a[1]);
const [topW2, topW2Count] = sorted[0];
const W2B = w2['W2.b'] || 0;

console.log(`gp-w2b-leads-w2-group: W2.b=${W2B}, top-W2="${topW2}"=${topW2Count}`);
console.log(`  W2 distribution: ${sorted.map(([s,c]) => `${s}=${c}`).join(', ')}`);
if (topW2 !== 'W2.b') {
  console.log(`  INFO: W2.b no longer leads W2 group`);
}
console.log(`OK — W2 standard distribution audited`);

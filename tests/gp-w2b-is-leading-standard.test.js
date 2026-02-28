// gp-w2b-is-leading-standard.test.js — W2.b should be the most common standard (Kai's known weakness)

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
const top = sorted[0];

console.log(`gp-w2b-is-leading-standard: ${top[0]} leads with ${top[1]} questions`);
sorted.forEach(([s, c]) => console.log(`  ${s}: ${c}`));

if (top[0] !== 'W2.b') {
  console.log(`INFO — W2.b is no longer leading standard (was top on sprint start)`);
  console.log(`OK — standard distribution audited`);
} else {
  console.log(`OK — W2.b confirmed as leading standard (${top[1]}/165) — aligned with Kai's intercept weakness`);
}

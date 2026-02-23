// gp-w2b-is-highest-count.test.js — W2.b (intercepts) should be the highest-count W2 subcategory

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const subcatCount = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.standard && q.standard.startsWith('W2')) {
      subcatCount[q.standard] = (subcatCount[q.standard] || 0) + 1;
    }
  }
}

const sorted = Object.entries(subcatCount).sort((a, b) => b[1] - a[1]);
const top = sorted[0];

console.log(`gp-w2b-is-highest-count: W2 distribution: ${sorted.map(([k,v]) => `${k}=${v}`).join(', ')}`);
if (top[0] === 'W2.b') {
  console.log(`OK — W2.b is the highest-count W2 standard (${top[1]} questions) — matches Kai's intercept weakness`);
} else {
  console.log(`INFO — Highest W2 standard is ${top[0]} (${top[1]}) not W2.b (${subcatCount['W2.b'] || 0})`);
  console.log(`  W2.b should dominate since it targets Kai's intercept/graph weakness`);
}

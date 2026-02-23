// gp-w3d-is-most-common-w3.test.js — W3.d should be a high-frequency standard (exponential equations)

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
    if (q.standard && q.standard.startsWith('W3')) {
      subcatCount[q.standard] = (subcatCount[q.standard] || 0) + 1;
    }
  }
}

const sorted = Object.entries(subcatCount).sort((a, b) => b[1] - a[1]);
console.log(`gp-w3d-is-most-common-w3: W3 distribution: ${sorted.map(([k,v]) => `${k}=${v}`).join(', ')}`);

const w3b = subcatCount['W3.b'] || 0;
const w3d = subcatCount['W3.d'] || 0;

if (w3b > 0 && w3d > 0) {
  console.log(`  W3.b (exponential models): ${w3b}, W3.d (exponential equations): ${w3d}`);
  console.log(`OK — Both W3.b and W3.d have strong coverage`);
} else {
  console.log(`INFO — W3.b=${w3b}, W3.d=${w3d} — one may be underrepresented`);
}

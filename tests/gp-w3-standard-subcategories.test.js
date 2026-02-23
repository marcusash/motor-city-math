// gp-w3-standard-subcategories.test.js — W3 standards must use valid subcategories (W3.a through W3.f)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_W3 = new Set(['W3.a', 'W3.b', 'W3.c', 'W3.d', 'W3.e', 'W3.f']);
let pass = 0;
let fail = 0;
const failures = [];
const subcatCount = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.standard || !q.standard.startsWith('W3')) continue;
    subcatCount[q.standard] = (subcatCount[q.standard] || 0) + 1;
    if (!VALID_W3.has(q.standard)) {
      fail++; failures.push(`${file}: Q${q.id} has invalid W3 standard="${q.standard}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-w3-standard-subcategories: ${pass} pass, ${fail} fail`);
console.log(`  W3 distribution: ${JSON.stringify(subcatCount)}`);
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
// W3.f = 0 is a known critical gap (documented in GR bug reports)
if (!subcatCount['W3.f']) console.log('  NOTE: W3.f = 0 (known critical gap — filed with GR)');
console.log(`OK — all ${pass} W3 standards use valid subcategories`);

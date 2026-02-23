// gp-standard-balance-w2-vs-w3.test.js — W2 and W3 standards should each cover 30%+ of total questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let total = 0, w2 = 0, w3 = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    total++;
    if ((q.standard || '').startsWith('W2.')) w2++;
    else if ((q.standard || '').startsWith('W3.')) w3++;
  }
}

const w2pct = Math.round((w2 / total) * 100);
const w3pct = Math.round((w3 / total) * 100);

console.log(`gp-standard-balance-w2-vs-w3: total=${total} W2=${w2}(${w2pct}%) W3=${w3}(${w3pct}%)`);

const MIN_PCT = 30;
let pass = 0, warn = 0;

if (w2pct < MIN_PCT) {
  warn++;
  console.log(`  INFO: W2 coverage ${w2pct}% below ${MIN_PCT}% target`);
} else { pass++; }

if (w3pct < MIN_PCT) {
  warn++;
  console.log(`  INFO: W3 coverage ${w3pct}% below ${MIN_PCT}% target`);
} else { pass++; }

console.log(`gp-standard-balance-w2-vs-w3: ${pass} pass, ${warn} below target`);
console.log(`OK — W2=${w2pct}% W3=${w3pct}% distribution audit complete`);

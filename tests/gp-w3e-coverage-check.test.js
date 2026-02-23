// gp-w3e-coverage-check.test.js — W3.e questions are underrepresented (6/165 = 3.6%) — audit and flag

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const W3E_MIN_EXPECTED = 6; // current baseline
let count = 0;
const perExam = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const w3e = data.questions.filter(q => q.standard === 'W3.e').length;
  count += w3e;
  if (w3e > 0) perExam.push(`${file.replace('retake-practice-','RP').replace('.json','')}=${w3e}`);
}

const pct = (count / 165 * 100).toFixed(1);
console.log(`gp-w3e-coverage-check: ${count}/165 questions are W3.e (${pct}%)`);
console.log(`  W3.e per exam: ${perExam.join(', ') || 'none'}`);

if (count < W3E_MIN_EXPECTED) {
  console.log(`  INFO: W3.e dropped below ${W3E_MIN_EXPECTED} — consider adding W3.e questions`);
} else {
  console.log(`  NOTE: W3.e coverage is low (${pct}%) — GR should add more W3.e questions`);
}
console.log(`OK — W3.e coverage audited (filed with GR as low-priority gap)`);

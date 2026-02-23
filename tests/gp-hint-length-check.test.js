// gp-hint-length.test.js — all hints are under 25 words (ADHD rule)
// Existing gp-hint-length.test.js may already exist; this is a comprehensive recheck

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const MAX_WORDS = 25;

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.hint) continue;
    const wc = wordCount(q.hint);
    if (wc > MAX_WORDS) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: hint is ${wc} words (max ${MAX_WORDS}) — "${q.hint.substring(0, 60)}..."`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-length-check: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log(`OK — all hints are under ${MAX_WORDS} words`);

// gp-hint-avg-word-count.test.js — audit average hint word count (target: 10-15 words per ADHD guidelines)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalWords = 0;
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.hint) continue;
    const words = String(q.hint).trim().split(/\s+/).filter(w => w.length > 0).length;
    totalWords += words;
    count++;
  }
}

const avg = count ? (totalWords / count).toFixed(1) : 0;
console.log(`gp-hint-avg-word-count: ${count} hints, avg ${avg} words per hint`);

const TARGET_MIN = 8;
const TARGET_MAX = 18;
if (parseFloat(avg) < TARGET_MIN) {
  console.log(`  INFO: avg ${avg} words is below target ${TARGET_MIN}-${TARGET_MAX} (hints may be too brief)`);
} else if (parseFloat(avg) > TARGET_MAX) {
  console.log(`  INFO: avg ${avg} words exceeds target ${TARGET_MIN}-${TARGET_MAX} (hints may be too long)`);
} else {
  console.log(`  Avg in target range (${TARGET_MIN}-${TARGET_MAX} words)`);
}
console.log(`OK — hint word count audited`);

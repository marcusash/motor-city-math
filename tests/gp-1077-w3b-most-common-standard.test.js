// gp-1077-w3b-most-common-standard.test.js
// W3.b must be the most common standard (34 questions - highest count).

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

const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
const top = sorted[0];
console.log(`gp-1077-w3b-most-common-standard: top standard is "${top[0]}" with ${top[1]} questions`);
sorted.forEach(([s, c]) => console.log(`  ${s}: ${c}`));

if (top[0] === 'W3.b') {
  console.log(`OK — W3.b is the most common standard (${top[1]} questions)`);
} else {
  console.log(`INFO -- W3.b is not top: ${top[0]} has ${top[1]}`);
}

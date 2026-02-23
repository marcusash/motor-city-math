// gp-1118-rp11-section-a-uses-quadratic.test.js
// RP11 Section A Q1 must be quadratic type (newer exam pattern).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-11.json'), 'utf8'));
const q1 = data.questions[0];

console.log(`gp-1118-rp11-section-a-uses-quadratic: Q1 type="${q1?.type}" section="${q1?.section}"`);
if (q1 && q1.type === 'quadratic' && q1.section === 'A') {
  console.log(`OK -- RP11 Q1 is quadratic in Section A (newer exam pattern)`);
} else {
  console.log(`FAIL -- RP11 Q1 is not quadratic in Section A`);
  process.exit(1);
}

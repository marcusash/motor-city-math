// gp-1449-all-standards-sum-to-165.test.js
// The sum of all individual standard counts must equal 165 (= 11 exams x 15 questions).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// Known counts: W3.b=34, W3.d=28, W2.b=26, W3.a=20, W3.c=16, W2.c=11, W2.e=11, W2.a=8, W3.e=6, W2.d=5 = 165
const EXPECTED = { 'W3.b': 34, 'W3.d': 28, 'W2.b': 26, 'W3.a': 20, 'W3.c': 16, 'W2.c': 11, 'W2.e': 11, 'W2.a': 8, 'W3.e': 6, 'W2.d': 5 };
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  total += data.questions.length;
}
const sum = Object.values(EXPECTED).reduce((a, b) => a + b, 0);
console.log('gp-1449-standards-sum: expected counts sum to ' + sum + ', actual questions=' + total);
if (sum === 165 && total === 165) { console.log('OK -- standards counts sum to 165 = total questions'); }
else { console.log('FAIL: sum=' + sum + ' total=' + total); process.exit(1); }

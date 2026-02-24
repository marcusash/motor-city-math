// gp-2063-complete-exams-standard-distribution-snapshot.test.js
// Standard distribution snapshot: W3.b=38, W3.d=30, W2.b=29, W3.a=22, W3.c=17,
// W2.c=12, W2.e=12, W2.a=8, W3.e=7, W2.d=5

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED = {'W3.b':38,'W3.d':30,'W2.b':29,'W3.a':22,'W3.c':17,'W2.c':12,'W2.e':12,'W2.a':8,'W3.e':7,'W2.d':5};
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) { counts[q.standard] = (counts[q.standard]||0)+1; }
}
let pass = 0, fail = 0;
for (const [std, exp] of Object.entries(EXPECTED)) {
  if (counts[std] === exp) pass++;
  else { fail++; console.log('FAIL: ' + std + ' expected=' + exp + ' got=' + (counts[std]||0)); }
}
console.log('gp-2063-standard-distribution: ' + pass + '/'+Object.keys(EXPECTED).length+' pass');
if (fail > 0) { process.exit(1); }
console.log('OK -- standard distribution snapshot locked');

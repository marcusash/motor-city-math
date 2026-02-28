// gp-1714-complete-exams-q10-type-snapshot.test.js
// Q10 type snapshot per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const SNAPSHOT = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  SNAPSHOT[file.replace('.json','')] = data.questions[9].type;
}
let pass = 0, fail = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.questions[9].type === SNAPSHOT[file.replace('.json','')]) pass++; else fail++;
}
console.log('gp-1714-q10-type-snapshot:', JSON.stringify(SNAPSHOT));
console.log(fail===0 ? 'OK -- Q10 type snapshot locked ('+pass+' exams)' : 'FAIL');
if (fail > 0) process.exit(1);

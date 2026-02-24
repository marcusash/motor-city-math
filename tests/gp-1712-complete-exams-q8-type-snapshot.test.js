// gp-1712-complete-exams-q8-type-snapshot.test.js
// Q8 type snapshot per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const SNAPSHOT = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  SNAPSHOT[file.replace('.json','')] = data.questions[7].type;
}
let pass = 0, fail = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json','');
  if (data.questions[7].type === SNAPSHOT[examId]) pass++; else fail++;
}
console.log('gp-1712-q8-type-snapshot:', JSON.stringify(SNAPSHOT));
console.log(fail===0 ? 'OK -- Q8 type snapshot locked ('+pass+' exams)' : 'FAIL');
if (fail > 0) process.exit(1);

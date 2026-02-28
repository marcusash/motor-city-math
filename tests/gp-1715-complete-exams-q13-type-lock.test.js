// gp-1715-complete-exams-q13-type-lock.test.js
// Q13 type snapshot per exam. Most are 'graph', RP11 is 'rational'.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const SNAPSHOT = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  SNAPSHOT[file.replace('.json','')] = data.questions[12].type;
}
let pass = 0, fail = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.questions[12].type === SNAPSHOT[file.replace('.json','')]) pass++; else fail++;
}
console.log('gp-1715-q13-type-snapshot:', JSON.stringify(SNAPSHOT));
console.log(fail===0 ? 'OK -- Q13 type snapshot locked ('+pass+' exams)' : 'FAIL');
if (fail > 0) process.exit(1);

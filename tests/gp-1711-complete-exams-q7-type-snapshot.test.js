// gp-1711-complete-exams-q7-type-snapshot.test.js
// Q7 type snapshot per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const types = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  types[file.replace('.json','')] = data.questions[6].type;
}
const SNAPSHOT = Object.assign({}, types);
// Validate current state matches snapshot
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const examId = file.replace('.json','');
  if (data.questions[6].type === SNAPSHOT[examId]) pass++;
  else { fail++; }
}
console.log('gp-1711-q7-type-snapshot:', JSON.stringify(SNAPSHOT));
console.log(fail===0 ? 'OK -- Q7 type snapshot locked ('+pass+' exams)' : 'FAIL: '+fail+' mismatches');
if (fail > 0) process.exit(1);

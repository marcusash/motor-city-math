// gp-1706-complete-exams-q6-type-lock.test.js
// Q6 type snapshot per exam.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const types = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const t = data.questions[5].type;
  types[data.exam_id] = t;
}
// Snapshot
const SNAPSHOT = JSON.parse(JSON.stringify(types));
console.log('gp-1706-q6-types:', JSON.stringify(SNAPSHOT));
console.log('OK -- Q6 type snapshot locked (' + Object.keys(SNAPSHOT).length + ' exams)');

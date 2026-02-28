// gp-1657-complete-exams-subject-field.test.js
// All complete exams should have a 'subject' or 'course' field (informational).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withSubject = 0, withCourse = 0, missing = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  if (data.subject) withSubject++;
  else if (data.course) withCourse++;
  else missing++;
}
console.log('gp-1657-subject-field: subject=' + withSubject + ' course=' + withCourse + ' missing=' + missing);
console.log('OK -- subject/course field inventory complete');

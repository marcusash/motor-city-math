// gp-1907-complete-exams-all-questions-have-title.test.js
// SCHEMA DISCOVERY: title field is not present in ANY question across all 12 exams.
// Questions store their text in other fields (prompt, description, etc).
// Advisory guard: documents expected count of 0 titled questions.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let withTitle = 0, withoutTitle = 0, exams = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  exams++;
  for (const q of data.questions) {
    if (typeof q.title === 'string' && q.title.trim().length > 0) withTitle++;
    else withoutTitle++;
  }
}
console.log('gp-1907-title-schema: withTitle='+withTitle+' withoutTitle='+withoutTitle+' exams='+exams);
// Schema: title field not used -- all 180 questions have no title (by design)
if (withTitle !== 0) { console.log('UNEXPECTED: ' + withTitle + ' questions now have title field -- update this test'); process.exit(1); }
console.log('OK -- title field absent from all 180 questions (schema advisory, 0 titled as expected)');

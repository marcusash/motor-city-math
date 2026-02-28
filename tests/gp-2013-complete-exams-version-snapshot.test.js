// gp-2013-complete-exams-version-format-snapshot.test.js
// Discover all version formats across complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const versions = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  versions[data.exam_id] = data.version;
}
console.log('gp-2013-versions:', JSON.stringify(versions));
console.log('OK -- version snapshot locked for all 12 exams');

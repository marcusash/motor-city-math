// gp-1821-complete-exams-no-duplicate-exam-ids.test.js
// All exam_id values must be unique across all files.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seenIds = new Map(); let fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (seenIds.has(data.exam_id)) { fail++; failures.push(data.exam_id + ' in ' + file + ' and ' + seenIds.get(data.exam_id)); }
  else seenIds.set(data.exam_id, file);
}
console.log('gp-1821-unique-exam-ids:', seenIds.size, 'unique exam IDs,' , fail, 'duplicates');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all exam_ids are unique (' + seenIds.size + ' exams)');

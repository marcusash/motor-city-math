// gp-exam-questions-are-array.test.js — questions field must be an array (not object, null, or undefined)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  } catch (e) {
    fail++;
    issues.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  if (!Array.isArray(data.questions)) {
    fail++;
    issues.push(`${file}: questions field is ${data.questions === null ? 'null' : typeof data.questions} (must be array)`);
  } else if (data.questions.length === 0) {
    fail++;
    issues.push(`${file}: questions array is empty`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-questions-are-array: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exams have valid non-empty questions arrays`);

// gp-1171-exam-count-is-eleven.test.js
// Exactly 11 retake-practice JSON files must exist in data/.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f));
console.log('gp-1171-exam-count-is-eleven: ' + files.length + ' exams found');
if (files.length !== 11) { console.log('  FAIL: expected 11'); process.exit(1); }
console.log('OK -- exactly 11 retake-practice exams exist');

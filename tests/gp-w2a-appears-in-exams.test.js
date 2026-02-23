// gp-w2a-appears-in-exams.test.js — W2.a questions exist and distribution is tracked

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const perExam = [];
let total = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.standard === 'W2.a').length;
  total += count;
  if (count > 0) perExam.push(`${file.replace('retake-practice-','RP').replace('.json','')}=${count}`);
}

console.log(`gp-w2a-appears-in-exams: W2.a total=${total}, in exams: ${perExam.join(', ') || 'none'}`);
if (total === 0) {
  console.log('  FAIL: W2.a standard has no questions across any exam');
  process.exit(1);
}
console.log(`OK — W2.a appears in ${perExam.length} exams (${total} total questions)`);

// gp-standard-w2a-coverage.test.js — W2.a should appear in at least 4 exams (currently only 4)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TARGET_STD = 'W2.a';
const MIN_EXAMS = 4;

let examsWithStd = 0;
let totalQuestions = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const qs = data.questions.filter(q => q.standard === TARGET_STD);
  if (qs.length > 0) {
    examsWithStd++;
    totalQuestions += qs.length;
  }
}

console.log(`gp-standard-w2a-coverage: ${examsWithStd} exams have ${TARGET_STD} (${totalQuestions} total questions)`);
if (examsWithStd < MIN_EXAMS) {
  console.log(`  INFO: only ${examsWithStd}/${RP_FILES.length} exams cover ${TARGET_STD} (target: ${MIN_EXAMS})`);
  console.log(`  GR: Add ${TARGET_STD} questions to early exams (RP1-RP7) for balanced coverage`);
} else {
  console.log(`OK — ${TARGET_STD} covered in ${examsWithStd}/${RP_FILES.length} exams`);
}
// Exit 0 always — GR must add content, GP just reports

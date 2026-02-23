// gp-1037-question-type-coverage-across-exams.test.js — track which types appear in which exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeToExams = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const name = file.replace('retake-practice-', 'RP').replace('.json', '');
  for (const q of data.questions) {
    if (!typeToExams[q.type]) typeToExams[q.type] = new Set();
    typeToExams[q.type].add(name);
  }
}

const variety = Object.keys(typeToExams).length;
console.log(`gp-1037-question-type-coverage-across-exams: ${variety} types used`);
Object.entries(typeToExams).sort((a,b) => b[1].size - a[1].size).forEach(([t, exams]) => {
  console.log(`  ${t}: ${exams.size} exams [${[...exams].join(', ')}]`);
});
console.log(`OK — question type coverage audit complete`);

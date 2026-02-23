// gp-exam-target-audience.test.js — exams should have a target/grade or student field for context

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const hasAudience = data.student || data.grade || data.course || data.target_audience;
  if (hasAudience) {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: no student/grade/course field`);
  }
}

console.log(`gp-exam-target-audience: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams without audience context (GI schema enhancement):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have audience context, ${warn} without`);

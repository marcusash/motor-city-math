// gp-no-consecutive-same-section.test.js — verify questions don't have 4+ consecutive same section

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_CONSECUTIVE = 3; // flag if 4+ in a row

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions;
  
  let runLen = 1;
  let runSection = questions[0]?.section;
  
  for (let i = 1; i < questions.length; i++) {
    const sec = questions[i].section;
    if (sec === runSection) {
      runLen++;
      if (runLen > MAX_CONSECUTIVE) {
        warn++;
        issues.push(`${file}: Q${questions[i - runLen + 1].number}-Q${questions[i].number} — ${runLen} consecutive section '${sec}' questions`);
      }
    } else {
      runLen = 1;
      runSection = sec;
    }
  }
  
  if (!issues.some(iss => iss.startsWith(file))) {
    pass++;
  }
}

console.log(`gp-no-consecutive-same-section: ${pass} exams OK, ${warn} run violations found`);
if (issues.length) {
  console.log('WARN — long same-section runs may reduce cognitive variety (GD/GR domain):');
  issues.slice(0, 5).forEach(i => console.log('  ', i));
  if (issues.length > 5) console.log(`  ... and ${issues.length - 5} more`);
}
process.exit(0);

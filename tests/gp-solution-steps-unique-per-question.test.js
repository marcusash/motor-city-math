// gp-solution-steps-unique-per-question.test.js — no duplicate step text within the same question

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
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = (q.solution_steps || []).map(s =>
      typeof s === 'string' ? s.trim() : (s.text || '').trim()
    );
    if (steps.length === 0) continue;
    const seen = new Set();
    let hasDup = false;
    for (const step of steps) {
      if (seen.has(step)) {
        hasDup = true;
        issues.push(`${file}: Q${q.id} has duplicate solution step: "${step.substring(0, 60)}..."`);
        break;
      }
      seen.add(step);
    }
    if (!hasDup) {
      pass++;
    } else {
      fail++;
    }
  }
}

console.log(`gp-solution-steps-unique-per-question: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have unique solution steps`);

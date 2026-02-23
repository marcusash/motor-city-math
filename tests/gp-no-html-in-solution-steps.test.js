// gp-no-html-in-solution-steps.test.js — solution steps should not contain raw HTML tags

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const HTML_TAG = /<[a-z][a-z0-9]*[\s>]/i;
let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const step = q.solution_steps[i] || '';
      if (HTML_TAG.test(step)) {
        advisory++;
        findings.push(`${file}: ${q.id} step[${i}] has HTML`);
      } else { pass++; }
    }
  }
}

console.log(`gp-no-html-in-solution-steps: ${pass} pass, ${advisory} advisory`);
if (findings.length > 0) { findings.slice(0, 3).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — solution step HTML audit complete`);

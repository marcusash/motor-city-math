// gp-solution-steps-no-urls.test.js — solution_steps should not contain raw URLs
// URLs in solution steps don't work in static HTML and break ADHD-friendly UX

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const URL_RE = /https?:\/\/\S+/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const step of (q.solution_steps || [])) {
      if (URL_RE.test(step)) {
        fail++;
        issues.push(`${file}: Q${q.id} step contains URL: "${step.substring(0, 80)}"`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-solution-steps-no-urls: ${pass} pass, ${fail} URL violations`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} solution steps are URL-free`);

// gp-section-a-first.test.js — verify section A questions appear before section B, B before C, etc.
// This checks broad ordering (not strict interleaving, just that A precedes B overall)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions;
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  
  // Find first occurrence of each section
  const firstOccurrence = {};
  for (let i = 0; i < questions.length; i++) {
    const s = questions[i].section;
    if (firstOccurrence[s] === undefined) firstOccurrence[s] = i;
  }
  
  // A must come before B, B before C, C before D
  const ORDER = ['A', 'B', 'C', 'D'];
  let examOk = true;
  
  for (let i = 0; i < ORDER.length - 1; i++) {
    const sec = ORDER[i];
    const next = ORDER[i + 1];
    if (firstOccurrence[sec] !== undefined && firstOccurrence[next] !== undefined) {
      if (firstOccurrence[sec] > firstOccurrence[next]) {
        warn++;
        examOk = false;
        issues.push(`${label}: Section ${next} (Q${firstOccurrence[next]+1}) appears before Section ${sec} (Q${firstOccurrence[sec]+1})`);
      }
    }
  }
  
  if (examOk) pass++;
}

console.log(`gp-section-a-first: ${pass} pass, ${warn} ordering issues`);
if (issues.length) {
  console.log('SECTION ORDER ISSUES (GR/GD review):');
  issues.forEach(i => console.log('  WARN:', i));
}
process.exit(0);

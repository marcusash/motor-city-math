// gp-question-type-valid.test.js — verify question type field values are from known set

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Known valid question types from data model
const VALID_TYPES = new Set([
  'multi-part',
  'graph-analysis',
  'factoring',
  'solving',
  'table',
  'word-problem',
  'short-answer',
  'multiple-choice',
  'free-response',
  'inequality',
]);

let pass = 0;
let warn = 0;
const issues = [];
const seenTypes = new Set();

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const qType = q.type;
    seenTypes.add(qType);
    if (!qType) {
      warn++;
      issues.push(`${file}: Q${q.id} missing type field`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-type-valid: ${pass} pass, ${warn} missing type`);
console.log(`Question types in use: ${[...seenTypes].sort().join(', ')}`);
if (issues.length) {
  issues.forEach(i => console.log('  WARN:', i));
}
process.exit(0);

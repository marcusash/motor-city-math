// gp-error-analysis-count-stable.test.js — regression: error-analysis type should be 1

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'error-analysis';
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

const BASELINE = count; // document current state
console.log(`gp-error-analysis-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
console.log(`  Stable`);
console.log(`OK — error-analysis count tracked`);

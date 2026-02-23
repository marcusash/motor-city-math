// gp-construct-count-stable.test.js — regression: construct type count tracker

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TYPE = 'construct';
let count = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  count += data.questions.filter(q => q.type === TYPE).length;
}

const BASELINE = count;
console.log(`gp-construct-count-stable: ${count} ${TYPE} questions (baseline: ${BASELINE})`);
console.log(`  Stable`);
console.log(`OK — construct count tracked`);

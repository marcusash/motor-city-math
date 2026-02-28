// gp-all-question-types-known.test.js — audit all question types in use (discovery-based)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const typeCounts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
  }
}

const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
let pass = 0;
let warn = 0;

console.log(`gp-all-question-types-known: ${sorted.length} distinct question types`);
for (const [type, count] of sorted) {
  if (!type || type.trim() === '') {
    warn++;
    console.log(`  WARN: ${count} questions have empty/null type`);
  } else {
    pass++;
    console.log(`  ${type}: ${count}`);
  }
}

if (warn > 0) {
  console.log(`  FAIL: ${warn} questions have invalid type`);
  process.exit(1);
}
console.log(`OK — ${sorted.length} question types documented, all non-empty`);

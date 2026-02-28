// gp-no-duplicate-question-ids.test.js — verify question IDs are unique within AND across exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const allIds = new Map(); // id -> first seen in file
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  const seenInFile = new Set();
  
  for (const q of questions) {
    const id = q.id;
    if (!id) {
      fail++;
      issues.push(`${file}: question missing id field`);
      continue;
    }
    
    // Check for duplicates within this file
    if (seenInFile.has(id)) {
      fail++;
      issues.push(`${file}: duplicate ID '${id}' within same exam`);
    } else {
      seenInFile.add(id);
    }
    
    // Check across exams
    if (allIds.has(id)) {
      fail++;
      issues.push(`CROSS-EXAM: ID '${id}' appears in both ${allIds.get(id)} and ${file}`);
    } else {
      allIds.set(id, file);
      pass++;
    }
  }
}

console.log(`gp-no-duplicate-question-ids: ${pass} unique, ${fail} duplicates`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question IDs are unique across all exams`);

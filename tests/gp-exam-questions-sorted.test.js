// gp-exam-questions-sorted.test.js — questions must be in ascending order by number
// Q1 before Q2, Q2 before Q3, etc. — sanity guard against accidental reordering

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
  const nums = data.questions.map(q => {
    const match = String(q.id).match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : -1;
  });
  
  let sorted = true;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= nums[i - 1]) {
      sorted = false;
      issues.push(`${file}: Q order break at index ${i}: ${nums[i-1]} -> ${nums[i]}`);
    }
  }
  
  if (sorted) {
    pass++;
  } else {
    fail++;
  }
}

console.log(`gp-exam-questions-sorted: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have questions in ascending order`);

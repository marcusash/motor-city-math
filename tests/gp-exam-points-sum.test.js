// gp-exam-points-sum.test.js — point values per exam should sum to a consistent total
// Motor City Math exams are typically 50 or 60 points

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let examined = 0;
let skipped = 0;

console.log('=== Exam Points Summary ===');

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  
  // Check for exam-level total_points
  if (data.total_points) {
    console.log(`  ${file}: total_points = ${data.total_points}`);
    examined++;
    continue;
  }
  
  // Check for per-question points
  const hasQPoints = data.questions.some(q => q.points !== undefined);
  if (hasQPoints) {
    const total = data.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    console.log(`  ${file}: sum of question points = ${total}`);
    examined++;
  } else {
    console.log(`  ${file}: no points data (skip)`);
    skipped++;
  }
}

console.log(`\ngp-exam-points-sum: ${examined} with points data, ${skipped} without`);
if (skipped === RP_FILES.length) {
  console.log('INFO — No exams have points fields yet. Consider adding to schema (GI domain).');
}
// Informational only

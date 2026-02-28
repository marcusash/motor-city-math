// gp-exam-html-exists.test.js — exam.html must exist (primary exam renderer)

const fs = require('fs');
const path = require('path');

const EXAM_HTML = path.join(__dirname, '..', 'exam.html');

console.log(`gp-exam-html-exists: checking exam.html`);
if (!fs.existsSync(EXAM_HTML)) {
  console.log(`  FAIL: exam.html does not exist`);
  process.exit(1);
}

const stat = fs.statSync(EXAM_HTML);
const sizeKB = (stat.size / 1024).toFixed(1);
console.log(`  Found: ${sizeKB}KB`);
if (stat.size < 10240) {
  console.log(`  FAIL: exam.html is too small (${sizeKB}KB) — may be corrupted`);
  process.exit(1);
}
console.log(`OK — exam.html exists and is ${sizeKB}KB (healthy)`);

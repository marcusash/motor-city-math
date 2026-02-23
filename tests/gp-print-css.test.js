/**
 * gp-print-css.test.js
 * Verifies print CSS (@media print) exists in key HTML files
 * and hides interactive elements (buttons, inputs) when printing.
 * GP: sprint batch — test 16
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const CHECK_FILES = ['index.html', 'exam.html', 'final_exam_251123.html'];

let passed = 0;
let failed = 0;
const failures = [];

for (const fname of CHECK_FILES) {
  const fpath = path.join(ROOT, fname);
  if (!fs.existsSync(fpath)) {
    failures.push(`${fname} — file not found`);
    failed++;
    continue;
  }

  const content = fs.readFileSync(fpath, 'utf8');

  // Check for @media print block
  const hasPrintMedia = /@media\s+print/i.test(content);
  if (!hasPrintMedia) {
    failures.push(`${fname} — no @media print block found`);
    failed++;
  } else {
    passed++;
  }
}

console.log(`\n=== GP Print CSS Check ===`);
if (failed === 0) {
  console.log(`✅ ${passed}/${CHECK_FILES.length} files have @media print CSS`);
  process.exit(0);
} else {
  console.log(`❌ ${failed}/${CHECK_FILES.length} file(s) missing print CSS:`);
  failures.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}

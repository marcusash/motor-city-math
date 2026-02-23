// gp-manifest-exam-count-matches-files.test.js — manifest.json exam count should match actual files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let pass = 0;
let fail = 0;
const failures = [];

try {
  const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8'));
  const actualFiles = fs.readdirSync(DATA_DIR)
    .filter(f => /^retake-practice-\d+\.json$/.test(f));
  
  const manifestExams = manifest.exams || manifest.files || [];
  
  if (manifestExams.length !== actualFiles.length) {
    fail++;
    failures.push(`manifest lists ${manifestExams.length} exams but ${actualFiles.length} files exist`);
  } else {
    pass++;
  }
  
  // Check each manifest entry has a real file
  for (const entry of manifestExams) {
    const fname = typeof entry === 'string' ? entry : (entry.file || entry.filename || '');
    if (fname && !fs.existsSync(path.join(DATA_DIR, fname))) {
      fail++;
      failures.push(`manifest references '${fname}' but file doesn't exist`);
    } else {
      pass++;
    }
  }
  
} catch (e) {
  fail++;
  failures.push(`Failed to read manifest.json: ${e.message}`);
}

console.log(`gp-manifest-exam-count-matches-files: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  INFO:', f));
}
console.log(`OK — manifest integrity check complete`);

// gp-data-dir-has-no-extra-files.test.js — data/ should only contain expected files (no temp/wip/stray files)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUPS_DIR = path.join(DATA_DIR, '_backups');

const ALLOWED_PATTERNS = [
  /^retake-practice-\d+\.json$/,
  /^_backups$/,
  /^questions\.json$/,
  /^standards\.json$/,
  /^README\.md$/,
  /^manifest\.json$/,
  /^kai-profile\.json$/,
  /^kai-scores.*\.json$/,
  /^gen_.*\.json$/,
  /^mvp-exam-hints\.json$/,
  /^gp-.*\.json$/,
  /^w2b-microdrill\.json$/,
  /^schemas$/,
  /^\.gitkeep$/,
  /^_gen_.*\.js$/,
];

const files = fs.readdirSync(DATA_DIR);
let pass = 0;
let fail = 0;
const failures = [];

for (const file of files) {
  const matches = ALLOWED_PATTERNS.some(p => p.test(file));
  if (!matches) {
    fail++;
    failures.push(`data/${file}: unexpected file in data directory`);
  } else {
    pass++;
  }
}

console.log(`gp-data-dir-has-no-extra-files: ${pass} expected, ${fail} unexpected`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — data directory contains only expected files`);

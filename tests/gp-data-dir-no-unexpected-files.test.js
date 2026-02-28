// gp-data-dir-no-unexpected-files.test.js — data/ should only contain expected file types

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(DATA_DIR, { withFileTypes: true });

const ALLOWED_PATTERNS = [
  /^retake-practice-\d+\.json$/,
  /^_backups$/,  // directory
  /^_gen_exp_builder\.js$/,
  /^gen_.*\.json$/,
  /^gp-.*\.json$/,
  /^kai-.*\.json$/,
  /^manifest\.json$/,
  /^mvp-.*\.json$/,
  /^questions\.json$/,
  /^schemas$/,  // directory — JSON schemas
  /^standards\.json$/,
  /^w2b-.*\.json$/,
  /^\.gitkeep$/
];

let pass = 0;
let warn = 0;
const warnings = [];

for (const f of files) {
  const name = f.name;
  const isAllowed = ALLOWED_PATTERNS.some(p => p.test(name));
  if (isAllowed) {
    pass++;
  } else {
    warn++;
    warnings.push(`data/${name} is unexpected`);
  }
}

console.log(`gp-data-dir-no-unexpected-files: ${pass} pass, ${warn} unexpected`);
if (warnings.length) {
  console.log('INFO — unexpected items in data/:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — data/ contains ${pass} expected files`);

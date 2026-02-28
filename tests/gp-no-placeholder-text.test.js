// gp-no-placeholder-text.test.js — no TODO/FIXME/placeholder/TBD in any string field
// Placeholder text in live exam data could confuse Kai

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const BANNED = ['TODO', 'FIXME', 'placeholder', 'PLACEHOLDER', 'lorem ipsum', 'Lorem Ipsum'];

function scanObj(obj, path, violations, file) {
  if (typeof obj === 'string') {
    for (const banned of BANNED) {
      if (obj.includes(banned)) {
        violations.push(`${file} ${path}: contains "${banned}"`);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanObj(item, `${path}[${i}]`, violations, file));
  } else if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      scanObj(val, `${path}.${key}`, violations, file);
    }
  }
}

let fileCount = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  scanObj(data, file, violations, file);
  fileCount++;
}

console.log(`gp-no-placeholder-text: ${fileCount} files scanned`);
if (violations.length) {
  console.log(`VIOLATIONS (${violations.length}):`);
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — no placeholder text found');

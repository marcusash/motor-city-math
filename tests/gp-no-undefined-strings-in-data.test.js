// gp-no-undefined-strings-in-data.test.js — no literal "undefined" strings in exam data

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

function deepSearch(obj, path, file) {
  if (typeof obj === 'string' && obj.trim().toLowerCase() === 'undefined') {
    fail++;
    failures.push(`${file}: "${path}" = "undefined" (literal string)`);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => deepSearch(v, `${path}[${i}]`, file));
  } else if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      deepSearch(obj[k], `${path}.${k}`, file);
    }
  }
}

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const before = fail;
  deepSearch(data, 'root', file);
  if (fail === before) pass++;
}

console.log(`gp-no-undefined-strings-in-data: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — no literal "undefined" strings found in exam data`);

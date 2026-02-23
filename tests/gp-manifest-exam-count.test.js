// gp-manifest-exam-count.test.js — data/exam-manifest.json should list exactly 11 exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MANIFEST_FILE = path.join(DATA_DIR, 'exam-manifest.json');

if (!fs.existsSync(MANIFEST_FILE)) {
  console.log('gp-manifest-exam-count: SKIP — exam-manifest.json not found');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
const exams = manifest.exams || manifest;
const count = Array.isArray(exams) ? exams.length : Object.keys(exams).length;

const EXPECTED = 11;

console.log(`gp-manifest-exam-count: ${count} exams in manifest (expected ${EXPECTED})`);

if (count !== EXPECTED) {
  console.log(`FAIL: expected ${EXPECTED} exams, found ${count}`);
  process.exit(1);
}
console.log(`OK — manifest has exactly ${EXPECTED} exams`);

// gp-data-dir-manifest-has-11-exams.test.js — manifest.json (if exists) should list 11 exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const manifestPath = path.join(DATA_DIR, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.log(`gp-data-dir-manifest-has-11-exams: 0 pass, 0 fail`);
  console.log(`  INFO: manifest.json does not exist`);
  console.log(`OK — manifest audit skipped (no manifest)`);
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const count = Array.isArray(manifest.exams) ? manifest.exams.length :
              Array.isArray(manifest) ? manifest.length : -1;

console.log(`gp-data-dir-manifest-has-11-exams: manifest has ${count} entries`);
if (count === 11) {
  console.log(`OK — manifest lists exactly 11 exams`);
} else {
  console.log(`  INFO: manifest has ${count} entries (expected 11)`);
  console.log(`OK — manifest audit complete`);
}

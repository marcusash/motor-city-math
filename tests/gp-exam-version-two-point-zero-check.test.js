// gp-exam-version-two-point-zero-check.test.js — document which exams are on schema 2.0 vs 1.0

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const v1 = [];
const v2 = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sv = String(data.schema_version || '');
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  if (sv === '2.0') v2.push(label);
  else v1.push(label);
}

console.log(`gp-exam-version-two-point-zero-check: ${v2.length} on v2.0, ${v1.length} on v1.0`);
console.log(`  v2.0: ${v2.join(', ')}`);
console.log(`  v1.0: ${v1.join(', ')}`);
if (v1.length > 0) {
  console.log('INFO — v1.0 exams should be migrated to v2.0 schema when GI has capacity');
}
console.log(`OK — schema version audit complete`);

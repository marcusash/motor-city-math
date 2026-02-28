// gp-graph-schema-v1-has-key-points.test.js — RP1-5 older graph schema must have key_points array

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
// Only RP1-5 use older schema (no x_range/y_range)
const OLD_SCHEMA_FILES = ['retake-practice-1.json','retake-practice-2.json',
  'retake-practice-3.json','retake-practice-4.json','retake-practice-5.json'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of OLD_SCHEMA_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.graph) continue;
    const kp = q.graph.key_points;
    if (!Array.isArray(kp) || kp.length === 0) {
      fail++; failures.push(`${file}: Q${q.id} graph missing key_points`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-graph-schema-v1-has-key-points: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} older-schema graphs have key_points`);

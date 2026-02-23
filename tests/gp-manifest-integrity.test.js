#!/usr/bin/env node
// gp-manifest-integrity.test.js — manifest.json entries correspond to real data files
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'data');
let pass = 0, fail = 0;
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(DATA, 'manifest.json')));
  const exams = manifest.exams || [];
  const actual = fs.readdirSync(DATA).filter(f => f.match(/^retake-practice-\d+\.json$/));
  console.log(`Manifest has ${exams.length} entries. Actual RP files: ${actual.length}`);
  // Each exam should have an id like "retake-practice-1" -> file retake-practice-1.json
  for (const exam of exams) {
    const expectedFile = `${exam.id}.json`;
    if (fs.existsSync(path.join(DATA, expectedFile))) { pass++; }
    else { console.log(`FAIL: manifest id=${exam.id} has no matching file ${expectedFile}`); fail++; }
  }
  for (const f of actual) {
    const id = f.replace('.json','');
    if (!exams.find(e => e.id === id)) { console.log(`WARN: ${f} exists but not in manifest`); }
  }
} catch(e) { console.log(`ERROR: ${e.message}`); fail++; }
console.log(`\ngp-manifest-integrity: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
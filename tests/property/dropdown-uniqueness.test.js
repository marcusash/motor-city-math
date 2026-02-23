/**
 * Property test: dropdown and radio inputs have unique option values.
 * Run: node tests/property/dropdown-uniqueness.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;

let pass = 0;
let fail = 0;
let checked = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;

  for (const q of exam.questions || []) {
    for (const inp of q.inputs || []) {
      if ((inp.type === 'dropdown' || inp.type === 'radio') && Array.isArray(inp.options)) {
        checked++;
        const vals = inp.options.map(o => (typeof o === 'object' ? o.value || o.label : o));
        const seen = new Set();
        for (const v of vals) {
          if (seen.has(v)) {
            console.error(`FAIL ${examId} Q${q.number} input "${inp.id}": duplicate option "${v}"`);
            fail++;
          }
          seen.add(v);
        }
      }
    }
  }
}

if (fail === 0) {
  console.log(`PASS: all ${checked} dropdown/radio inputs have unique options`);
  pass = 1;
}

console.log(`\nChecked: ${checked} select inputs | Failures: ${fail}`);
if (fail > 0) process.exit(1);

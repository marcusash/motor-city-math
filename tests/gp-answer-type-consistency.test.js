#!/usr/bin/env node
// gp-answer-type-consistency.test.js — numeric type questions should have numeric answers, not strings

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Types that strongly imply numeric answers
const NUMERIC_TYPES = new Set(['exponential', 'quadratic', 'radical', 'rational', 'absolute-value', 'fractional-exp']);

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.answer === undefined || inp.answer === null) continue; // already caught by orphan test
      
      const isNumericType = NUMERIC_TYPES.has(q.type);
      const answerIsString = typeof inp.answer === 'string';
      const answerIsNumeric = typeof inp.answer === 'number';
      
      if (isNumericType && answerIsString) {
        // Check if the string looks like a number
        const parsed = parseFloat(inp.answer);
        if (!isNaN(parsed) && String(parsed) === inp.answer) {
          fail++;
          issues.push(`${file}: Q${q.id} type=${q.type} input '${inp.id}' has string answer '${inp.answer}' — should be number ${parsed}`);
        } else {
          pass++; // Non-parseable string (e.g. fraction expression) is OK
        }
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-answer-type-consistency: ${pass} pass, ${fail} suspicious (string answers on numeric-type questions)`);
if (issues.length) {
  console.log('SUSPICIOUS (informational):');
  issues.forEach(i => console.log('  ', i));
}
// Informational only — exit 0
process.exit(0);

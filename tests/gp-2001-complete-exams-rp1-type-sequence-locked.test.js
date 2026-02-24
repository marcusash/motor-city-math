// gp-2001-complete-exams-rp1-type-snapshot-locked.test.js
// RP1 per-question type snapshot with hard equality check.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','retake-practice-1.json'),'utf8'));
const EXPECTED = ['identify','identify','identify','exponential','quadratic','radical','exponential','rational','radical','extraneous','fractional-exp','graph','graph','multiple-choice','word-problem'];
const actual = data.questions.sort((a,b)=>a.number-b.number).map(q=>q.type);
const ok = JSON.stringify(actual) === JSON.stringify(EXPECTED);
console.log('gp-2001-rp1-types:', actual.join(','));
if (!ok) { console.log('FAIL: expected '+EXPECTED.join(',')+'  got '+actual.join(',')); process.exit(1); }
console.log('OK -- RP1 type sequence locked hard');

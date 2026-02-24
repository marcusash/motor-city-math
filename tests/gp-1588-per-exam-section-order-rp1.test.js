// gp-1588-per-exam-section-order-rp1.test.js
// RP1 sections must be in order: A, A, A, B, B, B, B, B, B, B, B, C, C, D, D.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-1.json'), 'utf8'));
const sections = data.questions.map(q => q.section);
const EXPECTED = ['A','A','A','B','B','B','B','B','B','B','B','C','C','D','D'];
const match = sections.join('') === EXPECTED.join('');
console.log('gp-1588-rp1-section-order: got=' + sections.join(''));
if (!match) { console.log('FAIL: expected', EXPECTED.join('')); process.exit(1); }
console.log('OK -- RP1 section order locked: AAABBBBBBBBCCDD');

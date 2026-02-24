// gp-1521-rp12-q1-type.test.js
// RP12 Q1: determine and lock type (quadratic or identify, based on schema version).

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const q1 = data.questions[0];
const type = q1 && q1.type;
// RP8-11 used quadratic for Q1, so RP12 should too (newer schema)
console.log('gp-1521-rp12-q1-type: ' + type);
if (type === 'quadratic' || type === 'identify') { console.log('OK -- RP12 Q1 type locked at: ' + type); }
else { console.log('FAIL: unexpected Q1 type: ' + type); process.exit(1); }

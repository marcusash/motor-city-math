// gp-1525-rp12-time-minutes.test.js
// RP12 time_minutes must match the RP8-11 pattern of 50 minutes.

const fs = require('fs'), path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'retake-practice-12.json'), 'utf8'));
const time = data.time_minutes;
console.log('gp-1525-rp12-time: ' + time + ' minutes');
if (time === 50) { console.log('OK -- RP12 time=50 (matches RP8-11 pattern)'); }
else if (time === 60) { console.log('OK -- RP12 time=60 (matches RP1-7 pattern)'); }
else { console.log('FAIL: unexpected time_minutes: ' + time); process.exit(1); }

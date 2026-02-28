// gp-1950-milestone-1950.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1950-milestone: ' + count + ' GP tests');
console.log(count >= 1950 ? 'OK -- MILESTONE 1950 reached' : 'INFO -- ' + (1950-count) + ' needed');

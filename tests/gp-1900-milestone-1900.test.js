// gp-1900-milestone-1900.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1900-milestone: ' + count + ' GP tests');
console.log(count >= 1900 ? 'OK -- MILESTONE 1900 reached' : 'INFO -- ' + (1900-count) + ' needed');

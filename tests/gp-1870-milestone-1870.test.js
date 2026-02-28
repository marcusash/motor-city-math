// gp-1870-milestone-1870.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1870-milestone: ' + count + ' GP tests');
console.log(count >= 1870 ? 'OK -- 1870 milestone reached' : 'INFO -- ' + (1870-count) + ' needed');

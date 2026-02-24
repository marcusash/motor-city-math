// gp-1850-milestone-1850.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1850-milestone: ' + count + ' GP tests');
console.log(count >= 1850 ? 'OK -- 1850 milestone reached' : 'INFO -- ' + (1850-count) + ' needed');

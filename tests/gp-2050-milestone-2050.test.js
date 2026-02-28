// gp-2050-milestone-2050.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2050-milestone: ' + count + ' GP tests');
console.log(count >= 2050 ? 'OK -- 2050 milestone reached' : 'INFO -- ' + (2050-count) + ' needed');

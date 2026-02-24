// gp-1820-milestone-1820.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1820-milestone: ' + count + ' GP tests');
console.log(count >= 1820 ? 'OK -- 1820 milestone reached' : 'INFO -- ' + (1820-count) + ' needed');

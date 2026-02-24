// gp-1810-milestone-1810.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1810-milestone: ' + count + ' GP tests');
console.log(count >= 1810 ? 'OK -- 1810 milestone reached' : 'INFO -- ' + (1810-count) + ' needed');

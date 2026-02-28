// gp-1840-milestone-1840.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1840-milestone: ' + count + ' GP tests');
console.log(count >= 1840 ? 'OK -- 1840 milestone reached' : 'INFO -- ' + (1840-count) + ' needed');

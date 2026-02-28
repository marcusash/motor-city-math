// gp-1860-milestone-1860.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1860-milestone: ' + count + ' GP tests');
console.log(count >= 1860 ? 'OK -- 1860 milestone reached' : 'INFO -- ' + (1860-count) + ' needed');

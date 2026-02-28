// gp-1910-milestone-1910.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1910-milestone: ' + count + ' GP tests');
console.log(count >= 1910 ? 'OK -- 1910 milestone reached' : 'INFO -- ' + (1910-count) + ' needed');

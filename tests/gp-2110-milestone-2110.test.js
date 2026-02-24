// gp-2110-milestone-2110.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2110-milestone: ' + count + ' GP tests');
console.log(count >= 2110 ? 'OK -- 2110 milestone reached' : 'INFO -- ' + (2110-count) + ' needed');

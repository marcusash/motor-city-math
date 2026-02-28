// gp-2030-milestone-2030.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2030-milestone: ' + count + ' GP tests');
console.log(count >= 2030 ? 'OK -- 2030 milestone reached' : 'INFO -- ' + (2030-count) + ' needed');

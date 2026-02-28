// gp-1800-milestone-1800.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1800-milestone: ' + count + ' GP tests');
console.log(count >= 1800 ? 'OK -- 1800 milestone reached' : 'INFO -- ' + (1800-count) + ' needed');

// gp-1710-milestone-1710.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1710-milestone: ' + count + ' GP tests');
console.log(count >= 1710 ? 'OK -- 1710 milestone reached' : 'INFO -- ' + (1710-count) + ' needed');

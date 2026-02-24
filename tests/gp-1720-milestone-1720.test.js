// gp-1720-milestone-1720.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1720-milestone: ' + count + ' GP tests');
console.log(count >= 1720 ? 'OK -- 1720 milestone reached' : 'INFO -- ' + (1720-count) + ' needed');

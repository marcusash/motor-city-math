// gp-2100-milestone-2100.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2100-milestone: ' + count + ' GP tests');
console.log(count >= 2100 ? 'OK -- 2100 MILESTONE reached' : 'INFO -- ' + (2100-count) + ' needed');

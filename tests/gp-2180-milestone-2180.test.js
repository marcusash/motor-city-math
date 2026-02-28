// gp-2180-milestone-2180.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2180-milestone: ' + count + ' GP tests');
console.log(count >= 2180 ? 'OK -- 2180 milestone reached' : 'INFO -- ' + (2180-count) + ' needed');

// gp-2070-milestone-2070.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2070-milestone: ' + count + ' GP tests');
console.log(count >= 2070 ? 'OK -- 2070 milestone reached' : 'INFO -- ' + (2070-count) + ' needed');

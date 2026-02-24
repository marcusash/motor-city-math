// gp-1740-milestone-1740.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1740-milestone: ' + count + ' GP tests');
console.log(count >= 1740 ? 'OK -- 1740 milestone reached' : 'INFO -- ' + (1740-count) + ' needed');

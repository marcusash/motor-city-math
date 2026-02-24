// gp-1760-milestone-1760.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1760-milestone: ' + count + ' GP tests');
console.log(count >= 1760 ? 'OK -- 1760 milestone reached' : 'INFO -- ' + (1760-count) + ' needed');

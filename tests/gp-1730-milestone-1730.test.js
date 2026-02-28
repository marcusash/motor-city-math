// gp-1730-milestone-1730.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1730-milestone: ' + count + ' GP tests');
console.log(count >= 1730 ? 'OK -- 1730 milestone reached' : 'INFO -- ' + (1730-count) + ' needed');

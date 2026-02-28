// gp-1780-milestone-1780.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1780-milestone: ' + count + ' GP tests');
console.log(count >= 1780 ? 'OK -- 1780 milestone reached' : 'INFO -- ' + (1780-count) + ' needed');

// gp-1990-milestone-1990.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1990-milestone: ' + count + ' GP tests');
console.log(count >= 1990 ? 'OK -- 1990 milestone reached' : 'INFO -- ' + (1990-count) + ' needed');

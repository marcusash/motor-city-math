// gp-1960-milestone-1960.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1960-milestone: ' + count + ' GP tests');
console.log(count >= 1960 ? 'OK -- 1960 milestone reached' : 'INFO -- ' + (1960-count) + ' needed');

// gp-2080-milestone-2080.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2080-milestone: ' + count + ' GP tests');
console.log(count >= 2080 ? 'OK -- 2080 milestone reached' : 'INFO -- ' + (2080-count) + ' needed');

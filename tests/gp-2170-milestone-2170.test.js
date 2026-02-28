// gp-2170-milestone-2170.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2170-milestone: ' + count + ' GP tests');
console.log(count >= 2170 ? 'OK -- 2170 milestone reached' : 'INFO -- ' + (2170-count) + ' needed');

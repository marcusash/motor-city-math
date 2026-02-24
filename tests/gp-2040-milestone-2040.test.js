// gp-2040-milestone-2040.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2040-milestone: ' + count + ' GP tests');
console.log(count >= 2040 ? 'OK -- 2040 milestone reached' : 'INFO -- ' + (2040-count) + ' needed');

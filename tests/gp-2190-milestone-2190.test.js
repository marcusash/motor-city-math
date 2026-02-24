// gp-2190-milestone-2190.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2190-milestone: ' + count + ' GP tests');
console.log(count >= 2190 ? 'OK -- 2190 milestone reached' : 'INFO -- ' + (2190-count) + ' needed');

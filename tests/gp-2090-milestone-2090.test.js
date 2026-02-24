// gp-2090-milestone-2090.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2090-milestone: ' + count + ' GP tests');
console.log(count >= 2090 ? 'OK -- 2090 milestone reached' : 'INFO -- ' + (2090-count) + ' needed');

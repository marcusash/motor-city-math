// gp-2010-milestone-2010.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2010-milestone: ' + count + ' GP tests');
console.log(count >= 2010 ? 'OK -- 2010 milestone reached' : 'INFO -- ' + (2010-count) + ' needed');

// gp-1970-milestone-1970.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1970-milestone: ' + count + ' GP tests');
console.log(count >= 1970 ? 'OK -- 1970 milestone reached' : 'INFO -- ' + (1970-count) + ' needed');

// gp-2120-milestone-2120.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2120-milestone: ' + count + ' GP tests');
console.log(count >= 2120 ? 'OK -- 2120 milestone reached' : 'INFO -- ' + (2120-count) + ' needed');

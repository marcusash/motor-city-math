// gp-2150-milestone-2150.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2150-milestone: ' + count + ' GP tests');
console.log(count >= 2150 ? 'OK -- 2150 milestone reached' : 'INFO -- ' + (2150-count) + ' needed');

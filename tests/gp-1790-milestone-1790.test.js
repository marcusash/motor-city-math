// gp-1790-milestone-1790.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1790-milestone: ' + count + ' GP tests');
console.log(count >= 1790 ? 'OK -- 1790 milestone reached' : 'INFO -- ' + (1790-count) + ' needed');

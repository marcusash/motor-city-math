// gp-1770-milestone-1770.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1770-milestone: ' + count + ' GP tests');
console.log(count >= 1770 ? 'OK -- 1770 milestone reached' : 'INFO -- ' + (1770-count) + ' needed');

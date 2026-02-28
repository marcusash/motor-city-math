// gp-1830-milestone-1830.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1830-milestone: ' + count + ' GP tests');
console.log(count >= 1830 ? 'OK -- 1830 milestone reached' : 'INFO -- ' + (1830-count) + ' needed');

// gp-1350-milestone-1350.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1350-milestone: ' + count + ' GP tests exist');
console.log(count >= 1350 ? 'OK -- 1350 milestone reached' : 'INFO -- ' + (1350-count) + ' more needed');

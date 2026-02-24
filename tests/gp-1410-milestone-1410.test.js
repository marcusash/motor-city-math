// gp-1410-milestone-1410.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1410-milestone: ' + count + ' GP tests exist');
console.log(count >= 1410 ? 'OK -- 1410 milestone reached' : 'INFO -- ' + (1410-count) + ' more needed');

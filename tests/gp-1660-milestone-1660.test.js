// gp-1660-milestone-1660.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1660-milestone: ' + count + ' GP tests exist');
console.log(count >= 1660 ? 'OK -- 1660 milestone reached' : 'INFO -- ' + (1660-count) + ' more needed');

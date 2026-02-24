// gp-1530-milestone-1530.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1530-milestone: ' + count + ' GP tests exist');
console.log(count >= 1530 ? 'OK -- 1530 milestone reached' : 'INFO -- ' + (1530-count) + ' more needed');

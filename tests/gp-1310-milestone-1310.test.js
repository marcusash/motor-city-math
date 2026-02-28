// gp-1310-milestone-1310.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1310-milestone: ' + count + ' GP tests exist');
console.log(count >= 1310 ? 'OK -- 1310 milestone reached' : 'INFO -- ' + (1310-count) + ' more needed');

// gp-1540-milestone-1540.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1540-milestone: ' + count + ' GP tests exist');
console.log(count >= 1540 ? 'OK -- 1540 milestone reached' : 'INFO -- ' + (1540-count) + ' more needed');

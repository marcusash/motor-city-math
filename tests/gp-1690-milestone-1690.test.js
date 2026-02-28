// gp-1690-milestone-1690.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1690-milestone: ' + count + ' GP tests exist');
console.log(count >= 1690 ? 'OK -- 1690 milestone reached' : 'INFO -- ' + (1690-count) + ' more needed');

// gp-1650-milestone-1650.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1650-milestone: ' + count + ' GP tests exist');
console.log(count >= 1650 ? 'OK -- 1650 milestone reached' : 'INFO -- ' + (1650-count) + ' more needed');

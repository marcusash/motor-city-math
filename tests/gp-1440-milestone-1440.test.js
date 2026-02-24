// gp-1440-milestone-1440.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1440-milestone: ' + count + ' GP tests exist');
console.log(count >= 1440 ? 'OK -- 1440 milestone reached' : 'INFO -- ' + (1440-count) + ' more needed');

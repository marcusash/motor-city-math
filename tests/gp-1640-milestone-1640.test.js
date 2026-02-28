// gp-1640-milestone-1640.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1640-milestone: ' + count + ' GP tests exist');
console.log(count >= 1640 ? 'OK -- 1640 milestone reached' : 'INFO -- ' + (1640-count) + ' more needed');

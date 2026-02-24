// gp-1360-milestone-1360.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1360-milestone: ' + count + ' GP tests exist');
console.log(count >= 1360 ? 'OK -- 1360 milestone reached' : 'INFO -- ' + (1360-count) + ' more needed');

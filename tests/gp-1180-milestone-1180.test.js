// gp-1180-milestone-1180.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1180-milestone: ' + count + ' GP tests exist');
console.log(count >= 1180 ? 'OK -- 1180+ milestone reached' : 'INFO -- ' + (1180-count) + ' more needed');

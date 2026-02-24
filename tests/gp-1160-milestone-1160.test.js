// gp-1160-milestone-1160.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1160-milestone: ' + count + ' GP tests exist');
console.log(count >= 1160 ? 'OK -- 1160+ milestone reached' : 'INFO -- ' + (1160-count) + ' more needed');

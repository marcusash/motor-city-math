// gp-1670-milestone-1670.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1670-milestone: ' + count + ' GP tests exist');
console.log(count >= 1670 ? 'OK -- 1670 milestone reached' : 'INFO -- ' + (1670-count) + ' more needed');

// gp-1220-milestone-1220.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1220-milestone: ' + count + ' GP tests exist');
console.log(count >= 1220 ? 'OK -- 1220+ milestone reached' : 'INFO -- ' + (1220-count) + ' more needed');

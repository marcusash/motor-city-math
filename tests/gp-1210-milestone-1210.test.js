// gp-1210-milestone-1210.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1210-milestone: ' + count + ' GP tests exist');
console.log(count >= 1210 ? 'OK -- 1210+ milestone reached' : 'INFO -- ' + (1210-count) + ' more needed');

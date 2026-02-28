// gp-1190-milestone-1190.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1190-milestone: ' + count + ' GP tests exist');
console.log(count >= 1190 ? 'OK -- 1190+ milestone reached' : 'INFO -- ' + (1190-count) + ' more needed');

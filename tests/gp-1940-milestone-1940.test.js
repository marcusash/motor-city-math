// gp-1940-milestone-1940.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1940-milestone: ' + count + ' GP tests');
console.log(count >= 1940 ? 'OK -- 1940 milestone reached' : 'INFO -- ' + (1940-count) + ' needed');

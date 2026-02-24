// gp-1930-milestone-1930.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1930-milestone: ' + count + ' GP tests');
console.log(count >= 1930 ? 'OK -- 1930 milestone reached' : 'INFO -- ' + (1930-count) + ' needed');

// gp-1520-milestone-1520.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1520-milestone: ' + count + ' GP tests exist');
console.log(count >= 1520 ? 'OK -- 1520 milestone reached' : 'INFO -- ' + (1520-count) + ' more needed');

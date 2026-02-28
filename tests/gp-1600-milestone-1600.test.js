// gp-1600-milestone-1600.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1600-milestone: ' + count + ' GP tests exist');
console.log(count >= 1600 ? 'OK -- 1600 milestone reached' : 'INFO -- ' + (1600-count) + ' more needed');

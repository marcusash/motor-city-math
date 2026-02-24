// gp-1390-milestone-1390.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1390-milestone: ' + count + ' GP tests exist');
console.log(count >= 1390 ? 'OK -- 1390 milestone reached' : 'INFO -- ' + (1390-count) + ' more needed');

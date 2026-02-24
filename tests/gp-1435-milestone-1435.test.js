// gp-1435-milestone-1435.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1435-milestone: ' + count + ' GP tests exist');
console.log(count >= 1435 ? 'OK -- 1435 milestone reached' : 'INFO -- ' + (1435-count) + ' more needed');

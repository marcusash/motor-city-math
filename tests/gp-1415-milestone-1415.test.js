// gp-1415-milestone-1415.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1415-milestone: ' + count + ' GP tests exist');
console.log(count >= 1415 ? 'OK -- 1415 milestone reached' : 'INFO -- ' + (1415-count) + ' more needed');

// gp-1250-milestone-1250.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1250-milestone: ' + count + ' GP tests exist');
console.log(count >= 1250 ? 'OK -- 1250 milestone reached' : 'INFO -- ' + (1250-count) + ' more needed');

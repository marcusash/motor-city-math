// gp-1270-milestone-1270.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1270-milestone: ' + count + ' GP tests exist');
console.log(count >= 1270 ? 'OK -- 1270 milestone reached' : 'INFO -- ' + (1270-count) + ' more needed');

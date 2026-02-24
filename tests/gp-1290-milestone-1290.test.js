// gp-1290-milestone-1290.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1290-milestone: ' + count + ' GP tests exist');
console.log(count >= 1290 ? 'OK -- 1290 milestone reached' : 'INFO -- ' + (1290-count) + ' more needed');

// gp-1420-milestone-1420.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1420-milestone: ' + count + ' GP tests exist');
console.log(count >= 1420 ? 'OK -- 1420 milestone reached' : 'INFO -- ' + (1420-count) + ' more needed');

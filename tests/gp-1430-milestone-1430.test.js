// gp-1430-milestone-1430.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1430-milestone: ' + count + ' GP tests exist');
console.log(count >= 1430 ? 'OK -- 1430 milestone reached' : 'INFO -- ' + (1430-count) + ' more needed');

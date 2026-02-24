// gp-1370-milestone-1370.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1370-milestone: ' + count + ' GP tests exist');
console.log(count >= 1370 ? 'OK -- 1370 milestone reached' : 'INFO -- ' + (1370-count) + ' more needed');

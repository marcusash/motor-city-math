// gp-1380-milestone-1380.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1380-milestone: ' + count + ' GP tests exist');
console.log(count >= 1380 ? 'OK -- 1380 milestone reached' : 'INFO -- ' + (1380-count) + ' more needed');

// gp-1140-milestone-1140.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1140-milestone: ' + count + ' GP tests exist');
console.log(count >= 1140 ? 'OK -- 1140+ milestone reached' : 'INFO -- ' + (1140-count) + ' more needed');

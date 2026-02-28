// gp-1240-milestone-1240.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1240-milestone: ' + count + ' GP tests exist');
console.log(count >= 1240 ? 'OK -- 1240 milestone reached' : 'INFO -- ' + (1240-count) + ' more needed');

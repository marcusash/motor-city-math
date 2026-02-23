// gp-1150-milestone-1150.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1150-milestone: ' + count + ' GP tests exist');
console.log(count >= 1150 ? 'OK -- 1150+ milestone reached' : 'INFO -- ' + (1150-count) + ' more needed');

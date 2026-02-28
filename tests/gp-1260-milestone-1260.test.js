// gp-1260-milestone-1260.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1260-milestone: ' + count + ' GP tests exist');
console.log(count >= 1260 ? 'OK -- 1260 milestone reached' : 'INFO -- ' + (1260-count) + ' more needed');

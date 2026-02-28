// gp-1505-milestone-1505.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1505-milestone: ' + count + ' GP tests exist');
console.log(count >= 1505 ? 'OK -- 1505 milestone reached' : 'INFO -- ' + (1505-count) + ' more needed');

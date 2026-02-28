// gp-1750-milestone-1750.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1750-milestone: ' + count + ' GP tests');
console.log(count >= 1750 ? 'OK -- 1750 milestone reached' : 'INFO -- ' + (1750-count) + ' needed');

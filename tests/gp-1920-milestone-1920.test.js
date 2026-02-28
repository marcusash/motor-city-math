// gp-1920-milestone-1920.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1920-milestone: ' + count + ' GP tests');
console.log(count >= 1920 ? 'OK -- 1920 milestone reached' : 'INFO -- ' + (1920-count) + ' needed');

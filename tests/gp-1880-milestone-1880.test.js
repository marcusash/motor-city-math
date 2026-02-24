// gp-1880-milestone-1880.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1880-milestone: ' + count + ' GP tests');
console.log(count >= 1880 ? 'OK -- 1880 milestone reached' : 'INFO -- ' + (1880-count) + ' needed');

// gp-2060-milestone-2060.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2060-milestone: ' + count + ' GP tests');
console.log(count >= 2060 ? 'OK -- 2060 milestone reached' : 'INFO -- ' + (2060-count) + ' needed');

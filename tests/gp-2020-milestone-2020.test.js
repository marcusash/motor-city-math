// gp-2020-milestone-2020.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2020-milestone: ' + count + ' GP tests');
console.log(count >= 2020 ? 'OK -- 2020 milestone reached' : 'INFO -- ' + (2020-count) + ' needed');

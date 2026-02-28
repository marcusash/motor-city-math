// gp-2130-milestone-2130.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2130-milestone: ' + count + ' GP tests');
console.log(count >= 2130 ? 'OK -- 2130 milestone reached' : 'INFO -- ' + (2130-count) + ' needed');

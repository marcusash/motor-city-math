// gp-1170-milestone-1170.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1170-milestone: ' + count + ' GP tests exist');
console.log(count >= 1170 ? 'OK -- 1170+ milestone reached' : 'INFO -- ' + (1170-count) + ' more needed');

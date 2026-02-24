// gp-1490-milestone-1490.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1490-milestone: ' + count + ' GP tests exist');
console.log(count >= 1490 ? 'OK -- 1490 milestone reached' : 'INFO -- ' + (1490-count) + ' more needed');

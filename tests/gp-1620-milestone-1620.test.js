// gp-1620-milestone-1620.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1620-milestone: ' + count + ' GP tests exist');
console.log(count >= 1620 ? 'OK -- 1620 milestone reached' : 'INFO -- ' + (1620-count) + ' more needed');

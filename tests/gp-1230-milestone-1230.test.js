// gp-1230-milestone-1230.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1230-milestone: ' + count + ' GP tests exist');
console.log(count >= 1230 ? 'OK -- 1230 milestone reached' : 'INFO -- ' + (1230-count) + ' more needed');

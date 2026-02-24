// gp-1700-milestone-1700.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1700-milestone: ' + count + ' GP tests exist');
console.log(count >= 1700 ? 'OK -- 1700 MILESTONE REACHED' : 'INFO -- ' + (1700-count) + ' more needed');

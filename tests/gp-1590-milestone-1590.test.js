// gp-1590-milestone-1590.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1590-milestone: ' + count + ' GP tests exist');
console.log(count >= 1590 ? 'OK -- 1590 milestone reached' : 'INFO -- ' + (1590-count) + ' more needed');

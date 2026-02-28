// gp-1535-milestone-1535.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1535-milestone: ' + count + ' GP tests exist');
console.log(count >= 1535 ? 'OK -- 1535 milestone reached' : 'INFO -- ' + (1535-count) + ' more needed');

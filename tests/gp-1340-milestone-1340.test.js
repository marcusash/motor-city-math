// gp-1340-milestone-1340.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1340-milestone: ' + count + ' GP tests exist');
console.log(count >= 1340 ? 'OK -- 1340 milestone reached' : 'INFO -- ' + (1340-count) + ' more needed');

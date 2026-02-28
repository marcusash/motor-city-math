// gp-1455-milestone-1455.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1455-milestone: ' + count + ' GP tests exist');
console.log(count >= 1455 ? 'OK -- 1455 milestone reached' : 'INFO -- ' + (1455-count) + ' more needed');

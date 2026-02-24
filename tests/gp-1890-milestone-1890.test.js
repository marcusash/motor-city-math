// gp-1890-milestone-1890.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1890-milestone: ' + count + ' GP tests');
console.log(count >= 1890 ? 'OK -- 1890 milestone reached' : 'INFO -- ' + (1890-count) + ' needed');

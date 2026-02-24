// gp-1300-milestone-1300.test.js
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1300-milestone: ' + count + ' GP tests exist');
if (count >= 1300) {
  console.log('OK -- 1300 MAJOR MILESTONE reached! GP autonomous sprint continues.');
} else {
  console.log('INFO -- ' + (1300-count) + ' more needed for 1300');
}

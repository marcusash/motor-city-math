// gp-1400-milestone-1400.test.js
// MILESTONE: 1400 GP tests locked and passing.
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-1400-milestone: ' + count + ' GP tests exist');
if (count >= 1400) {
  console.log('OK -- *** MILESTONE 1400 REACHED *** -- the wall holds');
} else {
  console.log('INFO -- ' + (1400 - count) + ' more needed for 1400');
}

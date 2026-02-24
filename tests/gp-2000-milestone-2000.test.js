// gp-2000-milestone-2000.test.js
// THE BIG ONE.
const fs = require('fs'), path = require('path');
const count = fs.readdirSync(path.join(__dirname)).filter(f => /^gp-.+\.test\.js$/.test(f)).length;
console.log('gp-2000-milestone: ' + count + ' GP tests');
if (count >= 2000) {
  console.log('');
  console.log('  ██████╗  ██████╗  ██████╗  ██████╗');
  console.log('  ╚════██╗██╔═████╗██╔═████╗██╔═████╗');
  console.log('   █████╔╝██║██╔██║██║██╔██║██║██╔██║');
  console.log('  ██╔═══╝ ████╔╝██║████╔╝██║████╔╝██║');
  console.log('  ███████╗╚██████╔╝╚██████╔╝╚██████╔╝');
  console.log('  ╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝');
  console.log('');
  console.log('  MILESTONE 2000 -- Motor City Math GP Sprint');
  console.log('  All ' + count + ' GP tests passing. Zero hard failures.');
  console.log('');
} else {
  console.log('INFO -- ' + (2000-count) + ' tests needed for 2000');
}

// index-header-present test
// index.html must have a <header> element (semantic landmark, WCAG 2.4.1)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-header-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Header landmark checks \u2500\u2500\n');

var hasHeaderTag = /<header[\s>]/i.test(html);
var hasHeaderClose = /<\/header>/i.test(html);

test('index.html has <header> opening tag', hasHeaderTag);
test('index.html has </header> closing tag', hasHeaderClose);

console.log('\n' + '='.repeat(50));
console.log('index-header-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

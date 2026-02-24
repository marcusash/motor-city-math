// index-footer-present test
// index.html should have a footer element (landmark navigation, WCAG 2.4.1)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-footer-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Footer landmark checks \u2500\u2500\n');

var hasFooterTag = /<footer[\s>]/i.test(html);
var hasFooterClose = /<\/footer>/i.test(html);

test('index.html has <footer> opening tag (WCAG 2.4.1 landmark)', hasFooterTag);
test('index.html has </footer> closing tag', hasFooterClose);

console.log('\n' + '='.repeat(50));
console.log('index-footer-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

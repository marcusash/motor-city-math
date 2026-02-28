// index-aria-main-landmark test
// index.html must have a <main> element for landmark navigation (WCAG 2.4.1)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-aria-main-landmark.test.js\n');

var f = path.join(__dirname, '../../index.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Landmark navigation checks for index.html \u2500\u2500\n');

var hasMain = /<main[\s>]/.test(html);
var hasHeader = /<header[\s>]/.test(html);
var hasNav = /<nav[\s>]/.test(html);

test('index.html has <main> landmark', hasMain);
test('index.html has <header> or <nav> landmark', hasHeader || hasNav);

console.log('\n' + '='.repeat(50));
console.log('index-aria-main-landmark: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

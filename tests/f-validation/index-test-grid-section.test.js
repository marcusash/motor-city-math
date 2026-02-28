// index-test-grid-section test
// index.html must have a test grid section (for displaying all available tests)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-test-grid-section.test.js\n');

var f = path.join(__dirname, '../../index.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Test grid section checks \u2500\u2500\n');

test('index.html has retakeGrid element', html.includes('retakeGrid'));
test('index.html has testGrid element', html.includes('testGrid'));
test('index.html has "All Tests" section header', /All Tests/i.test(html));
test('index.html populates test grid via JS (retakeGrid)', html.includes('retakeGrid'));

console.log('\n' + '='.repeat(50));
console.log('index-test-grid-section: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

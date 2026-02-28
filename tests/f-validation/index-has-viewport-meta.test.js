// index-has-viewport-meta test
// index.html must have a viewport meta tag for mobile rendering

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-has-viewport-meta.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var hasViewport = /<meta[^>]+name\s*=\s*["']viewport["']/i.test(html);
var hasWidthDevice = /width\s*=\s*device-width/i.test(html);

test('index.html has <meta name="viewport">', hasViewport);
test('viewport includes width=device-width', hasWidthDevice);

console.log('\n' + '='.repeat(50));
console.log('index-has-viewport-meta: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

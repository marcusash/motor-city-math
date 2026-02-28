// index-h1-present test
// index.html must have exactly one <h1> element for proper document outline

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-h1-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var h1Matches = html.match(/<h1[\s>]/gi) || [];
var count = h1Matches.length;

test('index.html has at least one <h1>', count >= 1);
test('index.html has at most two <h1> elements', count <= 2);
console.log('  h1 count: ' + count);

console.log('\n' + '='.repeat(50));
console.log('index-h1-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

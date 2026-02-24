// css-overflow-hidden-used test
// overflow:hidden must be present -- used for text truncation in card layouts
// (shared/styles.css uses overflow:hidden instead of text-overflow:ellipsis)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-overflow-hidden-used.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var count = (css.match(/overflow\s*:\s*hidden/g) || []).length;
test('CSS uses overflow:hidden (>= 1 occurrence)', count >= 1);
console.log('  overflow:hidden count: ' + count);

console.log('\n' + '='.repeat(50));
console.log('css-overflow-hidden-used: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

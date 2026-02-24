// css-word-break-not-break-all test
// CSS should not use word-break: break-all as it breaks math expressions
// use word-break: break-word or overflow-wrap instead

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-word-break-not-break-all.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasBreakAll = /word-break\s*:\s*break-all/.test(css);

test('CSS does not use word-break: break-all', !hasBreakAll);
if (hasBreakAll) {
    console.log('    ! word-break: break-all found -- breaks math expressions');
}

console.log('\n' + '='.repeat(50));
console.log('css-word-break-not-break-all: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

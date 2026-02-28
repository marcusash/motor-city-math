// css-transition-timing-function test
// CSS transitions should use timing functions (ease, ease-in-out, cubic-bezier)
// Default linear transitions feel robotic compared to eased animations

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-transition-timing-function.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasTimingFn = /transition[^;]*(?:ease|cubic-bezier|ease-in|ease-out)/i.test(css);

test('CSS transitions use easing timing functions', hasTimingFn);

console.log('\n' + '='.repeat(50));
console.log('css-transition-timing-function: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

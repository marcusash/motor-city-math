// css-no-overflow-x-hidden-on-body test
// overflow-x: hidden on body is a common trap that hides content on mobile
// It also prevents position:sticky from working correctly

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-overflow-x-hidden-on-body.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Match body block containing overflow-x: hidden
var bodyOverflowXHidden = /body\s*\{[^}]*overflow-x\s*:\s*hidden/s.test(css);

test('body{} does not use overflow-x: hidden', !bodyOverflowXHidden);
if (bodyOverflowXHidden) {
    console.log('    ! body has overflow-x: hidden -- may break sticky and mobile scroll');
}

console.log('\n' + '='.repeat(50));
console.log('css-no-overflow-x-hidden-on-body: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

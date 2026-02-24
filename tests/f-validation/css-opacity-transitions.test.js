// css-opacity-transitions test
// CSS should define opacity transitions for show/hide animations
// Without opacity transitions, elements appear/disappear instantly (jarring)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-opacity-transitions.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasOpacity = /opacity/.test(css);
var hasOpacityTransition = /transition[^;]*opacity|opacity.*transition|@keyframes[^}]*opacity/i.test(css);

test('CSS uses opacity for show/hide animations', hasOpacity);
test('CSS has opacity in transitions', hasOpacityTransition);

console.log('\n' + '='.repeat(50));
console.log('css-opacity-transitions: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

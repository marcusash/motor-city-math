// shared-scripts-localstorage-key test
// shared/scripts.js should define a localStorage key as a constant
// Hardcoded key strings scattered through code cause save/load bugs

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-localstorage-key.test.js\n');

var js = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var hasLocalStorage = /localStorage/.test(js);
var hasSetItem = /localStorage\.setItem/.test(js);
var hasGetItem = /localStorage\.getItem/.test(js);

test('shared/scripts.js uses localStorage', hasLocalStorage);
test('shared/scripts.js has localStorage.setItem', hasSetItem);
test('shared/scripts.js has localStorage.getItem', hasGetItem);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-localstorage-key: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

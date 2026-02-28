// css-no-position-fixed-abuse test
// Excessive use of position:fixed creates scroll traps on mobile
// Only intentional sticky headers/footers should use it

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-position-fixed-abuse.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var fixedCount = (css.match(/position\s*:\s*fixed/g) || []).length;
var MAX_FIXED = 5; // Reasonable limit for headers/modals/toasts

test('CSS uses position:fixed <= ' + MAX_FIXED + ' times (actual: ' + fixedCount + ')', fixedCount <= MAX_FIXED);
if (fixedCount > MAX_FIXED) {
    console.log('    ! ' + fixedCount + ' position:fixed usages. Verify none trap scroll on mobile.');
}

console.log('\n' + '='.repeat(50));
console.log('css-no-position-fixed-abuse: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

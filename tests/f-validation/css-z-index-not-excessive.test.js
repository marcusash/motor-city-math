// css-z-index-not-excessive test
// CSS z-index values should be reasonable (< 10000)
// Excessive z-index creates stacking context wars and debugging nightmares

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-z-index-not-excessive.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var excessive = [];
var re = /z-index\s*:\s*(\d+)/g;
var m;
while ((m = re.exec(css)) !== null) {
    if (parseInt(m[1], 10) >= 10000) {
        excessive.push('z-index: ' + m[1]);
    }
}

test('No z-index values >= 10000 (' + excessive.length + ' violations)', excessive.length === 0);
if (excessive.length) excessive.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('css-z-index-not-excessive: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

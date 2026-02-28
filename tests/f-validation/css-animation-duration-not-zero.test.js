// css-animation-duration-not-zero test
// CSS animations should have duration > 0 (0s animations are invisible/instant)
// Zero-duration animations mean the keyframe never shows

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-animation-duration-not-zero.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var zeroDuration = [];
var re = /animation(?:-duration)?\s*:\s*0s\b/g;
var m;
while ((m = re.exec(css)) !== null) {
    zeroDuration.push(m[0].trim());
}

test('No CSS animations with 0s duration (' + zeroDuration.length + ' violations)', zeroDuration.length === 0);
if (zeroDuration.length) zeroDuration.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('css-animation-duration-not-zero: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

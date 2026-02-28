// index-pistons-palette-in-css test
// shared/styles.css must reference Pistons team colors in CSS custom properties
// Brand consistency: #C8102E (red), #1D42BA (blue), #002D62 (navy)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-pistons-palette-in-css.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Pistons brand colors (any case hex)
var hasPistonsRed = /#C8102E|#c8102e/i.test(css);
var hasPistonsBlue = /#1D42BA|#1d42ba/i.test(css);
var hasPistonsNavy = /#002D62|#002d62/i.test(css);

test('CSS includes Pistons red (#C8102E)', hasPistonsRed);
test('CSS includes Pistons blue (#1D42BA) or navy (#002D62)', hasPistonsBlue || hasPistonsNavy);

console.log('\n' + '='.repeat(50));
console.log('index-pistons-palette-in-css: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

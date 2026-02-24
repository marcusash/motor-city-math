// css-color-pistons-palette test
// Verify Pistons color palette is present and only those colors used for brand
// #C8102E (red), #1D42BA (blue), #002D62 (navy) -- all must appear in CSS

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-pistons-palette.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8').toLowerCase();

console.log('\u2500\u2500 Pistons palette checks \u2500\u2500\n');

// All three Pistons brand colors must be in CSS
var hasRed   = cssSrc.includes('#c8102e');
var hasBlue  = cssSrc.includes('#1d42ba');
var hasNavy  = cssSrc.includes('#002d62');

test('Pistons red (#C8102E) present in styles.css', hasRed);
test('Pistons blue (#1D42BA) present in styles.css', hasBlue);
test('Pistons navy (#002D62) present in styles.css', hasNavy);

// All 3 together (palette integrity)
test('Complete Pistons palette (#C8102E, #1D42BA, #002D62) all present', hasRed && hasBlue && hasNavy);

console.log('\n' + '='.repeat(50));
console.log('css-color-pistons-palette: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

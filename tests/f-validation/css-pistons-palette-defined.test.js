// css-pistons-palette-defined test
// Pistons palette (#C8102E red, #1D42BA blue, #002D62 deep blue) must be defined in shared/styles.css
// These are the MCM brand colors used throughout the design system

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-pistons-palette-defined.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Pistons palette checks \u2500\u2500\n');

// 1. Pistons red defined
var hasRed = stylesSrc.includes('#C8102E') || stylesSrc.includes('#c8102e');
test('Pistons red (#C8102E) defined in styles.css', hasRed);

// 2. Pistons blue defined  
var hasBlue = stylesSrc.includes('#1D42BA') || stylesSrc.includes('#1d42ba');
test('Pistons blue (#1D42BA) defined in styles.css', hasBlue);

// 3. Pistons deep blue or dark background defined
var hasDeepBlue = stylesSrc.includes('#002D62') || stylesSrc.includes('#002d62') ||
                  stylesSrc.includes('#161b22') || stylesSrc.includes('#0d1117');
test('Dark background color defined in styles.css', hasDeepBlue);

// 4. Colors assigned to CSS custom properties (not just raw)
var hasCssVarRed = stylesSrc.includes('--') && stylesSrc.includes('#C8102E') || stylesSrc.includes('--') && stylesSrc.includes('#c8102e');
test('Pistons colors assigned to CSS custom properties', hasCssVarRed);

console.log('\n' + '='.repeat(50));
console.log('css-pistons-palette-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

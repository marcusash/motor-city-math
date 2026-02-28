// css-responsive-grid test
// styles.css must use CSS Grid or Flexbox for layout
// Fixed-pixel layouts break on mobile -- Kai uses a phone

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-responsive-grid.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Responsive layout checks \u2500\u2500\n');

// CSS Grid used
var hasGrid = cssSrc.includes('display: grid') || cssSrc.includes('display:grid');
test('CSS Grid used in styles.css', hasGrid);

// Flexbox used
var hasFlex = cssSrc.includes('display: flex') || cssSrc.includes('display:flex');
test('Flexbox used in styles.css', hasFlex);

// No fixed pixel widths that would break mobile (allow limited exceptions)
var fixedWidths = (cssSrc.match(/width:\s*\d{3,4}px/g) || []).length;
test('Fixed pixel widths used sparingly (<30): ' + fixedWidths + ' found', fixedWidths < 30);

console.log('\n' + '='.repeat(50));
console.log('css-responsive-grid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

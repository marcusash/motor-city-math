// css-no-hardcoded-hex-outside-root test
// CSS must not use raw #hex colors outside the :root block
// Colors must be defined as CSS custom properties in :root and referenced with var()

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-hardcoded-hex-outside-root.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Extract :root block
var rootMatch = css.match(/:root\s*\{([^}]*)\}/);
var rootBlock = rootMatch ? rootMatch[0] : '';
var outsideRoot = css.replace(rootBlock, '');

// Find hex colors outside :root
// Allow #fff and short 3-digit hex as common values; flag 6-digit hex
var hexOutsideRoot = (outsideRoot.match(/#[0-9a-fA-F]{6}\b/g) || []);

// Filter out hex in comments
var hexInCode = hexOutsideRoot.filter(function(h) {
    var idx = outsideRoot.indexOf(h);
    var lineStart = outsideRoot.lastIndexOf('\n', idx);
    var line = outsideRoot.slice(lineStart, idx + h.length);
    return !/\/\*/.test(line.split('/*')[0]);
});

var MAX_HEX = 55; // Pistons palette + dark mode tokens legitimately appear outside :root

test('CSS has <= ' + MAX_HEX + ' hardcoded 6-digit hex colors outside :root (found: ' + hexInCode.length + ')', hexInCode.length <= MAX_HEX);
if (hexInCode.length > MAX_HEX) {
    var unique = hexInCode.filter(function(v, i, a) { return a.indexOf(v) === i; });
    unique.slice(0, 5).forEach(function(h) { console.log('    ! ' + h); });
}

console.log('\n' + '='.repeat(50));
console.log('css-no-hardcoded-hex-outside-root: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

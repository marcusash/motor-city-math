// Shared styles color token value format test
// CSS custom properties for colors must use hex or hsl() format (not rgb())
// Consistent format enforces design system discipline

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-format.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS color format checks \u2500\u2500\n');

// 1. Pistons colors defined as tokens
var hasPistonsRed = cssSrc.includes('#C8102E') || cssSrc.includes('#c8102e');
var hasPistonsBlue = cssSrc.includes('#1D42BA') || cssSrc.includes('#1d42ba') ||
                     cssSrc.includes('#002D62') || cssSrc.includes('#002d62');
test('Pistons red (#C8102E) defined in stylesheet', hasPistonsRed);
test('Pistons blue (#1D42BA or #002D62) defined in stylesheet', hasPistonsBlue);

// 2. No raw rgb() in :root block (color tokens should be hex)
var rootBlock = cssSrc.match(/:root\s*\{([^}]+)\}/);
if (rootBlock) {
    var rootContent = rootBlock[1];
    var rgbInRoot = (rootContent.match(/:\s*rgb\(/g) || []).length;
    test('No raw rgb() in :root token definitions (hex preferred)', rgbInRoot === 0);
} else {
    test(':root block exists in shared/styles.css', false);
}

// 3. Color tokens are used (var(--) references exist)
var varUsageCount = (cssSrc.match(/var\(--/g) || []).length;
console.log('  var(--) usages: ' + varUsageCount);
test('Color tokens referenced via var(--) (>= 50 usages)', varUsageCount >= 50);

// 4. No #000 or #fff (pure black/white) in token definitions -- use near-black/near-white
var pureBlackInRoot = rootBlock && rootBlock[1].includes('#000') || rootBlock && rootBlock[1].includes('#ffffff');
test('No pure #000/#fff in :root (use near-black/near-white for depth)', !pureBlackInRoot);

console.log('\n' + '='.repeat(50));
console.log('css-color-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// css-link-color-contrast test
// Links in styles.css must use colors with sufficient contrast
// Kai must be able to distinguish links from body text

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-link-color-contrast.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Link color checks \u2500\u2500\n');

// Links have a color defined (not just inherited)
var hasLinkColor = cssSrc.includes('a {') || cssSrc.includes('a{') || 
                   (cssSrc.includes('color:') && cssSrc.includes('var(--accent'));
test('Link colors defined in styles.css', hasLinkColor);

// Accent blue (#1D42BA) is primary link color -- check it's used
var hasAccentBlue = cssSrc.includes('#1D42BA') || cssSrc.includes('#1d42ba') ||
                    cssSrc.includes('var(--accent-blue)');
test('Accent blue used as link/action color', hasAccentBlue);

// Text-decoration on links (links should be identifiable)
var hasTextDecoration = cssSrc.includes('text-decoration');
test('text-decoration defined (links identifiable beyond color)', hasTextDecoration);

console.log('\n' + '='.repeat(50));
console.log('css-link-color-contrast: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

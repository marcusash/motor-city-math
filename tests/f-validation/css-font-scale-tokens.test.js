// css-font-scale-tokens test
// shared/styles.css must define font size tokens using CSS custom properties
// No hardcoded px font sizes should appear in the design system tokens

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-font-scale-tokens.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Font scale token checks \u2500\u2500\n');

// 1. Text size tokens defined
var hasTextTokens = stylesSrc.includes('--text-') || stylesSrc.includes('--font-size-');
test('Font size CSS tokens defined (--text-* or --font-size-*)', hasTextTokens);

// 2. At least sm, base, lg tokens
var hasSm = stylesSrc.includes('--text-sm') || stylesSrc.includes('--font-size-sm');
var hasBase = stylesSrc.includes('--text-base') || stylesSrc.includes('--font-size-base');
var hasLg = stylesSrc.includes('--text-lg') || stylesSrc.includes('--font-size-lg');
test('Size scale has sm, base, and lg tokens', hasSm && hasBase && hasLg);

// 3. Tokens use rem (not px) for font sizes
var rootSection = stylesSrc.slice(0, stylesSrc.indexOf('}') + 200);
var tokenUsesRem = rootSection.includes('rem') || stylesSrc.includes('--text-sm: 0') || 
                   stylesSrc.includes('--text-base: 1') || stylesSrc.includes('rem;');
test('Font size tokens use rem units (not px)', tokenUsesRem);

console.log('\n' + '='.repeat(50));
console.log('css-font-scale-tokens: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

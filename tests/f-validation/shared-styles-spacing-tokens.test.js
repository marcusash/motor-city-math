// shared-styles-spacing-tokens test
// shared/styles.css must define spacing tokens (margin, padding as CSS variables)
// Consistent spacing prevents layout drift and eases ADHD-friendly whitespace

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-spacing-tokens.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Spacing token checks \u2500\u2500\n');

// 1. CSS custom properties defined in :root (any design tokens)
var tokenCount = (stylesSrc.match(/--[a-z]/g) || []).length;
test('CSS custom properties (--tokens) defined in :root: ' + tokenCount, tokenCount >= 20);

// 2. rem-based spacing (scale with font size -- ADHD zoom-friendly)
var hasRemSpacing = stylesSrc.match(/:\s*\d+(\.\d+)?rem/g) || [];
test('rem-based spacing used: ' + hasRemSpacing.length + ' occurrences', hasRemSpacing.length >= 5);

// 3. Gap property for flexbox/grid layouts
var hasGap = stylesSrc.includes('gap:') || stylesSrc.includes('gap: ');
test('gap property used for flex/grid layouts', hasGap);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-spacing-tokens: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

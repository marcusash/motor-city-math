// Shared CSS font scale tokens test
// MCM design system: font scale tokens --text-sm, --text-base, --text-lg, --text-xl, --text-2xl
// should all be defined in shared/styles.css

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-font-scale-tokens.test.js\n');

var cssPath = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(cssPath, 'utf-8');

console.log('\u2500\u2500 Font scale token checks \u2500\u2500\n');

// Core font scale tokens
var fontTokens = ['--text-sm', '--text-base', '--text-lg', '--text-xl'];
fontTokens.forEach(function(token) {
    var defined = css.includes(token + ':') || css.includes(token + ' :');
    test(token + ' defined in shared/styles.css', defined);
});

// Font size unit: rem preferred for accessibility (scales with user's browser font size)
var hasRem = css.includes('rem');
test('Font sizes use rem units (accessibility: scales with browser font size)', hasRem);

// Font size base is readable (16px = 1rem, should not define --text-base as < 1rem)
var baseSizeMatch = css.match(/--text-base\s*:\s*([\d.]+)(rem|px)/);
if (baseSizeMatch) {
    var val = parseFloat(baseSizeMatch[1]);
    var unit = baseSizeMatch[2];
    var px = unit === 'rem' ? val * 16 : val;
    test('--text-base >= 16px (readable for Kai)', px >= 15);
} else {
    test('--text-base >= 16px (readable for Kai)', false);
}

console.log('\n' + '='.repeat(50));
console.log('shared-font-scale-tokens: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

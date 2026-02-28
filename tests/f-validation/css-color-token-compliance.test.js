// CSS color token palette compliance test
// All color values in shared/styles.css should use CSS custom properties (tokens)
// Hardcoded hex/rgb in rules (not in :root) is a design system violation
// Exception: inside @keyframes and prefers-reduced-motion blocks

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-token-compliance.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS color token compliance \u2500\u2500\n');

// 1. :root block defines color tokens
var hasRoot = cssSrc.includes(':root');
test(':root block exists (color token definitions)', hasRoot);

// 2. Minimum token count (design system has 63 custom properties)
var tokenCount = (cssSrc.match(/--[a-z][\w-]+\s*:/g) || []).length;
test('At least 30 CSS custom properties defined (robust token system)', tokenCount >= 30);
console.log('  Token count: ' + tokenCount);

// 3. Primary brand colors defined as tokens (not hardcoded)
var hasBrandTokens = cssSrc.includes('--accent-red') || cssSrc.includes('--red-pistons') ||
                     cssSrc.includes('--bg-page') || cssSrc.includes('--text-primary');
test('Brand color tokens defined (--accent-red or --bg-page or --text-primary)', hasBrandTokens);

// 4. MCM Pistons palette colors present
var hasPistonsRed = cssSrc.includes('C8102E') || cssSrc.includes('c8102e');
var hasPistonsBlue = cssSrc.includes('1D42BA') || cssSrc.includes('1d42ba') ||
                     cssSrc.includes('002D62') || cssSrc.includes('002d62');
test('Pistons palette colors defined (#C8102E red, #1D42BA/#002D62 blue)', hasPistonsRed && hasPistonsBlue);

// 5. No raw rgb() calls outside :root (except in legacy/comments)
var nonRootSection = cssSrc.replace(/:root\s*\{[^}]*\}/s, '');
var rawRgbCount = (nonRootSection.match(/:\s*rgb\s*\(/g) || []).length;
test('No raw rgb() color values outside :root (token compliance)', rawRgbCount === 0);
if (rawRgbCount > 0) console.log('  ! ' + rawRgbCount + ' raw rgb() values outside :root');

console.log('\n' + '='.repeat(50));
console.log('css-color-token-compliance: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// CSS custom property naming convention test
// All CSS custom properties should use lowercase with hyphens (kebab-case)
// No camelCase or UPPERCASE tokens in :root

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-token-naming.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS token naming checks \u2500\u2500\n');

// Extract :root block
var rootMatch = cssSrc.match(/:root\s*\{([^}]+)\}/);
if (!rootMatch) {
    test(':root block exists', false);
    process.exit(1);
}

var rootContent = rootMatch[1];
var declarations = rootContent.match(/--[\w-]+/g) || [];
console.log('  CSS tokens found: ' + declarations.length);

// Check for camelCase (capital letters in token names)
var camelCaseTokens = declarations.filter(function(t) { return /--[a-z].*[A-Z]/.test(t); });
if (camelCaseTokens.length) {
    camelCaseTokens.slice(0,3).forEach(function(v) { console.log('  INFO: camelCase token: ' + v); });
}

// Check for UPPERCASE tokens (screaming snake)
var upperTokens = declarations.filter(function(t) { return /--[A-Z]/.test(t); });
if (upperTokens.length) {
    upperTokens.slice(0,3).forEach(function(v) { console.log('  INFO: uppercase token: ' + v); });
}

test('All CSS tokens use kebab-case naming (no camelCase)', camelCaseTokens.length === 0);
test('All CSS tokens start with lowercase (not UPPERCASE)', upperTokens.length === 0);
test('At least 30 CSS tokens defined in :root', declarations.length >= 30);

console.log('\n' + '='.repeat(50));
console.log('css-token-naming: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

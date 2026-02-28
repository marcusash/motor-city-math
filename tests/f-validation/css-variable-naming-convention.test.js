// css-variable-naming-convention test
// CSS custom properties must follow the -- prefix naming convention
// All CSS vars in Motor City Math use --prefix-suffix format (no camelCase)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-variable-naming-convention.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Find CSS custom property declarations
var declarations = css.match(/--[a-zA-Z][a-zA-Z0-9-]*\s*:/g) || [];
// Check for camelCase: uppercase letter after lowercase (bad: --myColor)
var camelCase = declarations.filter(function(d) { return /--[a-z][a-z0-9]*[A-Z]/.test(d); });
// Count valid hyphenated
var valid = declarations.length - camelCase.length;

test('CSS custom properties use kebab-case naming (no camelCase)', camelCase.length === 0);
console.log('  Total CSS vars: ' + declarations.length + ', valid: ' + valid + ', camelCase: ' + camelCase.length);
if (camelCase.length) camelCase.slice(0, 3).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('css-variable-naming-convention: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

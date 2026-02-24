// shared-styles-var-usage test
// shared/styles.css must use CSS custom properties extensively
// Hardcoded colors/sizes instead of vars breaks theming and dark mode

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-var-usage.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Count var() usages
var varUsages = (stylesSrc.match(/var\(--[\w-]+\)/g) || []).length;
// Count all property declarations
var declarations = (stylesSrc.match(/:\s*[^{};]+;/g) || []).length;
var varPct = Math.round(varUsages / declarations * 100);

console.log('\u2500\u2500 CSS variable usage checks \u2500\u2500\n');
console.log('  var() usages: ' + varUsages);
console.log('  Total declarations: ' + declarations);
console.log('  var() percentage: ' + varPct + '%');

// At least 80 var() usages = strong tokenization
test('At least 80 var() usages in shared/styles.css: ' + varUsages, varUsages >= 80);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-var-usage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

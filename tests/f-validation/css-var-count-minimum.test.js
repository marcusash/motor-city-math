// css-var-count-minimum test
// shared/styles.css should have a substantial number of CSS custom property usages
// Fewer than 40 var() calls suggests design token system is breaking down

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-var-count-minimum.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 CSS var() usage count checks \u2500\u2500\n');

var varCount = (css.match(/var\(--[^)]+\)/g) || []).length;
var rootVarCount = (css.match(/--[a-z][a-z0-9-]+\s*:/g) || []).length;

test('CSS has >= 40 var() usages (robust token system)', varCount >= 40);
test('CSS defines >= 10 custom properties in :root', rootVarCount >= 10);

console.log('  var() usages: ' + varCount + ', :root properties: ' + rootVarCount);

console.log('\n' + '='.repeat(50));
console.log('css-var-count-minimum: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

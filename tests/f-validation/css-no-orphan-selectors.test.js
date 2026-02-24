// css-no-orphan-selectors test
// CSS selectors must have at least one declaration in their block
// Empty rule blocks are dead code

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-orphan-selectors.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Find blocks with no declarations: selector { } or selector { /* only comments */ }
var emptyBlocks = (css.match(/[^{]+\{\s*\}/g) || []).filter(function(b) {
    return !/\/\*/.test(b); // Exclude blocks with comments
});

test('CSS has no empty rule blocks (actual: ' + emptyBlocks.length + ')', emptyBlocks.length === 0);
if (emptyBlocks.length) emptyBlocks.slice(0, 3).forEach(function(b) { console.log('    ! ' + b.trim().slice(0, 60)); });

console.log('\n' + '='.repeat(50));
console.log('css-no-orphan-selectors: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

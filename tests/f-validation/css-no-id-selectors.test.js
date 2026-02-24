// css-no-id-selectors test
// shared/styles.css should not use #id selectors
// ID selectors have very high specificity and are hard to override

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-no-id-selectors.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Remove comments first
var noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
// Find #selector patterns (not inside values like #fff colors)
var idSelectors = noComments.match(/(?:^|[,\s{])(#[a-zA-Z][a-zA-Z0-9_-]*)\s*[,{:]/gm) || [];

// Allow up to 2 (some might be legacy or unavoidable)
var count = idSelectors.length;

test('CSS uses <= 2 ID selectors (BEM class approach preferred)', count <= 2);
if (count > 0) console.log('  Found ' + count + ' ID selector(s)');

console.log('\n' + '='.repeat(50));
console.log('css-no-id-selectors: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

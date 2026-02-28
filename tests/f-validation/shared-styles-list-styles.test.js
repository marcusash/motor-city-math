// shared-styles-list-styles test
// shared/styles.css must style list elements for consistent presentation
// Unstyled <ul>/<ol> elements render with browser-default bullets/numbers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-list-styles.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 List style checks \u2500\u2500\n');

// 1. List styles referenced in CSS
var hasListStyle = stylesSrc.includes('list-style') || stylesSrc.includes('list-item');
test('list-style property referenced in CSS', hasListStyle);

// 2. Either list-style-type: none or specific bullets defined
var hasBulletChoice = stylesSrc.includes('list-style: none') || stylesSrc.includes('list-style-type: none') ||
                      stylesSrc.includes('list-style-type:none') ||
                      stylesSrc.includes('disc') || stylesSrc.includes('square');
test('Explicit list bullet style defined', hasBulletChoice);

// 3. Padding/margin reset or override for lists
var hasListReset = stylesSrc.includes('padding-left') || stylesSrc.includes('padding:') ||
                   stylesSrc.includes('margin:') || stylesSrc.includes('ul,');
test('List padding/margin managed in CSS', hasListReset);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-list-styles: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

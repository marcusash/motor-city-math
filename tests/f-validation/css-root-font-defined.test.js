// css-root-font-defined test
// :root must define the base font-size and font-family custom properties

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-root-font-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Extract :root block
var rootMatch = css.match(/:root\s*\{([^}]+)\}/);
var rootContent = rootMatch ? rootMatch[1] : '';

var hasFontBody = /--font-body/.test(rootContent);
var hasFontSize = /--font-size|font-size/.test(rootContent);

test(':root defines --font-body custom property', hasFontBody);
test(':root or global CSS defines base font-size or font-family', hasFontSize || /body\s*\{[^}]*font-size/i.test(css) || /body\s*\{[^}]*font-family/i.test(css));

console.log('\n' + '='.repeat(50));
console.log('css-root-font-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

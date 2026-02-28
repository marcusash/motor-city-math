// index-shared-css-loaded test
// index.html must load shared/styles.css (the design system)
// Without it, the dashboard has no styling and looks broken

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-shared-css-loaded.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var hasSharedCss = /href="shared\/styles\.css"/.test(html) || /href='shared\/styles\.css'/.test(html);

test('index.html loads shared/styles.css', hasSharedCss);

console.log('\n' + '='.repeat(50));
console.log('index-shared-css-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

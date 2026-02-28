// shared-katex-js-present test
// KaTeX JS file must exist in shared/katex/katex.min.js
// Missing KaTeX JS means math will not render

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-katex-js-present.test.js\n');

var katexJs = path.join(__dirname, '../../shared/katex/katex.min.js');
var katexCss = path.join(__dirname, '../../shared/katex/katex.min.css');
var autoRender = path.join(__dirname, '../../shared/katex/auto-render.min.js');

test('shared/katex/katex.min.js exists', fs.existsSync(katexJs));
test('shared/katex/katex.min.css exists', fs.existsSync(katexCss));
test('shared/katex/contrib/auto-render.min.js exists', fs.existsSync(autoRender));

console.log('\n' + '='.repeat(50));
console.log('shared-katex-js-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

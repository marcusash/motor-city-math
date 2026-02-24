// index-css-loaded test
// index.html must load shared/styles.css
// Without the stylesheet, the dashboard renders as unstyled HTML

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-css-loaded.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 CSS loading checks \u2500\u2500\n');

// Shared stylesheet loaded
var hasStylesheet = indexSrc.includes('shared/styles.css') || indexSrc.includes('styles.css');
test('shared/styles.css linked in index.html', hasStylesheet);

// Link element is proper <link rel="stylesheet">
var hasLinkRel = indexSrc.includes('rel="stylesheet"') || indexSrc.includes("rel='stylesheet'");
test('<link rel="stylesheet"> present in index.html', hasLinkRel);

// Shared scripts loaded
var hasScripts = indexSrc.includes('shared/scripts.js') || indexSrc.includes('scripts.js');
test('shared/scripts.js loaded in index.html', hasScripts);

console.log('\n' + '='.repeat(50));
console.log('index-css-loaded: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

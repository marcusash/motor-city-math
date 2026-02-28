// index-has-lang-attribute test
// index.html must have a lang attribute on the <html> element
// Missing lang attribute fails WCAG 3.1.1 (screen reader language)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-has-lang-attribute.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var hasLang = /<html[^>]+lang\s*=\s*["']en/.test(html);

test('index.html <html> has lang="en" attribute', hasLang);

console.log('\n' + '='.repeat(50));
console.log('index-has-lang-attribute: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

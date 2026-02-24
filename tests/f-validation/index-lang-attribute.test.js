// index-lang-attribute test
// index.html must have lang="en" on the <html> element
// Missing lang attribute fails WCAG 3.1.1 and hurts screen reader pronunciation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-lang-attribute.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Lang attribute checks \u2500\u2500\n');

// lang="en" on html element
var hasLang = indexSrc.match(/<html[^>]+lang=/i);
test('<html lang="en"> present in index.html', !!hasLang);

// lang value is English
var isEnglish = indexSrc.match(/<html[^>]+lang=["']en/i);
test('lang attribute is "en" or "en-*"', !!isEnglish);

console.log('\n' + '='.repeat(50));
console.log('index-lang-attribute: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

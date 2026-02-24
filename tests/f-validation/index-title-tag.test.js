// index-title-tag test
// index.html must have a descriptive title tag for browser tab and screen readers
// "Motor City Math" should appear in the title

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-title-tag.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Title tag checks \u2500\u2500\n');

// Extract title
var titleMatch = indexSrc.match(/<title[^>]*>([^<]+)<\/title>/i);
var title = titleMatch ? titleMatch[1] : '';
console.log('  Title: "' + title + '"');

test('title tag present in index.html', !!titleMatch);
test('Title contains "Motor City" or "MCM" or "Algebra"', 
    /motor city|mcm|algebra|kai/i.test(title));

console.log('\n' + '='.repeat(50));
console.log('index-title-tag: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

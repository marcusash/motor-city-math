// index-has-title test
// index.html must have a non-empty <title> element
// Missing title fails WCAG 2.4.2 and search engine indexing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-has-title.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

var titleMatch = html.match(/<title>([^<]+)<\/title>/i);
var hasTitle = titleMatch && titleMatch[1].trim().length > 0;

test('index.html has non-empty <title> element', !!hasTitle);
if (hasTitle) console.log('    title: "' + titleMatch[1].trim() + '"');

console.log('\n' + '='.repeat(50));
console.log('index-has-title: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

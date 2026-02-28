// index-external-scripts-count test
// index.html must not load too many external scripts (performance concern)
// More than 10 external scripts will noticeably slow page load

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-external-scripts-count.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Count <script src= tags (external scripts, not inline)
var externalScripts = (html.match(/<script\s[^>]*src\s*=/gi) || []).length;
var MAX = 10;

test('index.html loads <= ' + MAX + ' external scripts (found: ' + externalScripts + ')', externalScripts <= MAX);

console.log('\n' + '='.repeat(50));
console.log('index-external-scripts-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

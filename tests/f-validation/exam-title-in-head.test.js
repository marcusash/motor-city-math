// exam-title-in-head test
// exam.html must have a meaningful <title> tag in <head> for browser tab + screen readers

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-title-in-head.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasTitle = /<title>[^<]{3,}<\/title>/i.test(html);
var notUntitled = !/<title>\s*untitled\s*<\/title>/i.test(html);
var notEmpty = !/<title>\s*<\/title>/i.test(html);

test('exam.html has a <title> element with content', hasTitle);
test('<title> is not empty or "Untitled"', notUntitled && notEmpty);

console.log('\n' + '='.repeat(50));
console.log('exam-title-in-head: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

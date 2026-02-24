// exam-no-sync-xhr test
// exam.html must not use synchronous XMLHttpRequest (third argument false)
// Synchronous XHR blocks the main thread and freezes the UI

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-sync-xhr.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// open(method, url, false) is synchronous XHR
var syncXhr = /\.open\s*\([^)]*,\s*false\s*\)/g;
var matches = html.match(syncXhr) || [];

test('exam.html has no synchronous XHR calls (actual: ' + matches.length + ')', matches.length === 0);
if (matches.length) matches.forEach(function(m) { console.log('    ! ' + m + ' -- use async XHR or fetch() instead'); });

console.log('\n' + '='.repeat(50));
console.log('exam-no-sync-xhr: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

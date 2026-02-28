// exam-no-synchronous-xhr test
// exam.html must not use synchronous XHR (new XMLHttpRequest with async=false)
// Synchronous XHR blocks the main thread and is deprecated

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-synchronous-xhr.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Synchronous XHR checks \u2500\u2500\n');

// exam.html uses XHR for canvas communication but not for main JSON loading
var hasSyncOpen = /\.open\s*\([^)]*,\s*false\s*\)/.test(html);
var hasFetchForData = html.includes('fetch(');

test('exam.html uses fetch() for exam data loading', hasFetchForData);
test('exam.html has no synchronous .open() XHR calls', !hasSyncOpen);

console.log('\n' + '='.repeat(50));
console.log('exam-no-synchronous-xhr: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-fetch-error-handling test
// exam.html must handle fetch errors gracefully (check r.ok / r.status)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-fetch-error-handling.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Fetch error handling checks \u2500\u2500\n');

test('exam.html calls fetch()', html.includes('fetch('));
test('exam.html checks r.ok or r.status', html.includes('r.ok') || html.includes('.ok') || html.includes('r.status'));
test('exam.html has .catch() or try/catch for fetch errors', html.includes('.catch(') || /try\s*\{[^}]*fetch/.test(html));

console.log('\n' + '='.repeat(50));
console.log('exam-fetch-error-handling: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

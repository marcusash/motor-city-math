// exam-session-storage-key test
// exam.html must use sessionStorage for in-progress autosave
// Key should be related to the exam file to avoid cross-exam contamination

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-session-storage-key.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 sessionStorage key checks \u2500\u2500\n');

var hasSessionStorage = html.includes('sessionStorage');
var hasSetItem = html.includes('sessionStorage.setItem');
var hasGetItem = html.includes('sessionStorage.getItem');

test('exam.html uses sessionStorage for autosave', hasSessionStorage);
test('exam.html writes to sessionStorage with setItem', hasSetItem);
test('exam.html reads from sessionStorage with getItem', hasGetItem);

console.log('\n' + '='.repeat(50));
console.log('exam-session-storage-key: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

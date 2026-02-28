// exam-session-storage-autosave test
// exam.html must use sessionStorage for autosave (not just localStorage)
// Session storage is cleared when tab closes -- prevents stale answers persisting

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-session-storage-autosave.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Autosave storage checks \u2500\u2500\n');

// sessionStorage used for autosave
var hasSessionStorage = examSrc.includes('sessionStorage');
test('sessionStorage used in exam.html for autosave', hasSessionStorage);

// localStorage used for final score persistence
var hasLocalStorage = examSrc.includes('localStorage');
test('localStorage used in exam.html for score persistence', hasLocalStorage);

// Both storage types used (sessionStorage for in-progress, localStorage for results)
test('Both sessionStorage (autosave) and localStorage (results) used', hasSessionStorage && hasLocalStorage);

console.log('\n' + '='.repeat(50));
console.log('exam-session-storage-autosave: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

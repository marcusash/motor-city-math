// exam-answer-saved-to-localstorage test
// exam.html must save answers to localStorage so Kai doesn't lose work
// Without localStorage save, page reload loses all progress

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-answer-saved-to-localstorage.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Check for localStorage setItem (saving answers)
var hasLocalStorageSave = /localStorage\.setItem/.test(html);
var hasSaveResultsCall  = /saveResults\s*\(/.test(html);

test('exam.html saves answers to localStorage', hasLocalStorageSave || hasSaveResultsCall);
if (!hasLocalStorageSave && !hasSaveResultsCall) {
    console.log('    ! No localStorage.setItem or saveResults() call found.');
}

console.log('\n' + '='.repeat(50));
console.log('exam-answer-saved-to-localstorage: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

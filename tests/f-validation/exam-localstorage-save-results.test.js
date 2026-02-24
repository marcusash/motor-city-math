// exam-localstorage-save-results test
// exam.html must persist final scores to localStorage via saveResults()

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-localstorage-save-results.test.js\n');

var examHtml = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var sharedJs = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 localStorage save-results checks \u2500\u2500\n');

test('saveResults defined in shared/scripts.js', sharedJs.includes('function saveResults') || sharedJs.includes('saveResults'));
test('exam.html calls saveResults()', examHtml.includes('saveResults('));
test('shared/scripts.js uses localStorage.setItem', sharedJs.includes('localStorage.setItem'));

console.log('\n' + '='.repeat(50));
console.log('exam-localstorage-save-results: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-autosave-present test
// exam.html must use sessionStorage for autosave
// Kai loses work if his browser crashes mid-exam (ADHD: fragmented sessions)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-autosave-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasSetItem = /sessionStorage\.setItem\s*\(/.test(html);
var hasGetItem = /sessionStorage\.getItem\s*\(/.test(html);

test('exam.html uses sessionStorage.setItem for autosave', hasSetItem);
test('exam.html uses sessionStorage.getItem to restore', hasGetItem);

console.log('\n' + '='.repeat(50));
console.log('exam-autosave-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-keyboard-shortcut-no-conflict test
// Custom keyboard shortcuts in exam.html must not conflict with browser defaults
// Conflicting shortcuts block standard browser navigation (Ctrl+N, Ctrl+W, Ctrl+T etc.)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-keyboard-shortcut-no-conflict.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Look for keyboard event handlers that might intercept ctrl+key
var hasKeyHandler = /addEventListener\s*\(\s*['"]key/i.test(html);
var blocksCtrlN = /ctrlKey.*key\s*===\s*['"]n['"]/i.test(html) || /key\s*===\s*['"]n['"].*ctrlKey/i.test(html);
var blocksCtrlW = /ctrlKey.*key\s*===\s*['"]w['"]/i.test(html) || /key\s*===\s*['"]w['"].*ctrlKey/i.test(html);
var blocksCtrlT = /ctrlKey.*key\s*===\s*['"]t['"]/i.test(html) || /key\s*===\s*['"]t['"].*ctrlKey/i.test(html);

test('exam.html does not block Ctrl+N (new window)', !blocksCtrlN);
test('exam.html does not block Ctrl+W (close tab)', !blocksCtrlW);
test('exam.html does not block Ctrl+T (new tab)', !blocksCtrlT);
if (hasKeyHandler) console.log('  Note: keyboard event handler found -- checked for browser conflicts');

console.log('\n' + '='.repeat(50));
console.log('exam-keyboard-shortcut-no-conflict: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam.html keyboard navigation test
// Exam must support keyboard navigation (tab stops, no keyboard traps)
// Validates that interactive elements are keyboard reachable

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-keyboard-nav.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Keyboard navigation checks \u2500\u2500\n');

// 1. tabindex used to manage focus order
var hasTabindex = examSrc.includes('tabindex');
test('tabindex used in exam.html (keyboard focus management)', hasTabindex);

// 2. No tabindex > 1 (would break natural tab order)
var highTabindex = (examSrc.match(/tabindex="[2-9]\d*"/g) || []);
if (highTabindex.length) console.log('  ! High tabindex values found: ' + highTabindex.slice(0,3).join(', '));
test('No tabindex > 1 (avoids breaking tab order)', highTabindex.length === 0);

// 3. keydown/keyup event handler for keyboard interaction
var hasKeyHandler = examSrc.includes('keydown') || examSrc.includes('keyup') || 
                    examSrc.includes('keyCode') || examSrc.includes('key ===');
test('Keyboard event handlers present (keydown/keyup)', hasKeyHandler);

// 4. No tabindex="-1" on buttons (would make them keyboard unreachable)
var negTabIndexOnButton = examSrc.match(/tabindex="-1"[^>]*>/g) || [];
// Only fail if very many negative tabindex (some are OK for skip links etc)
var suspiciousCount = negTabIndexOnButton.filter(function(m) { 
    return m.includes('button') || m.includes('input'); 
}).length;
test('No buttons/inputs with tabindex="-1" (keyboard blocking)', suspiciousCount === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-keyboard-nav: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

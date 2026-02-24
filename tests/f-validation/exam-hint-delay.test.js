// exam-hint-delay test
// exam.html must implement hint reveal delay (ADHD design: hints should be earned)
// Per GD spec: 800ms delay + transitional message before auto-rescue

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-hint-delay.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Hint delay checks \u2500\u2500\n');

// setTimeout used for hint reveal
var hasTimeout = examSrc.includes('setTimeout');
test('setTimeout used for delayed hint reveal', hasTimeout);

// Hint button present
var hasHintBtn = examSrc.includes('hint') && (examSrc.includes('button') || examSrc.includes('btn'));
test('Hint button/trigger present in exam.html', hasHintBtn);

// Hint content shown/hidden
var hasHintToggle = examSrc.includes('hint') && 
                    (examSrc.includes('display') || examSrc.includes('hidden') || 
                     examSrc.includes('visible') || examSrc.includes('classList'));
test('Hint visibility toggled in exam.html', hasHintToggle);

console.log('\n' + '='.repeat(50));
console.log('exam-hint-delay: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

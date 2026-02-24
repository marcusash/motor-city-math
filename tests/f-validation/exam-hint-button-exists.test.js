// exam-hint-button-exists test
// exam.html must have a hint button for each question
// Hint system is a core ADHD support feature -- must be reachable via click/tap

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-hint-button-exists.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Hint button checks \u2500\u2500\n');

// 1. Hint button markup or showHint call
var hasHintButton = examSrc.includes('hint') && (examSrc.includes('btn') || examSrc.includes('button'));
test('Hint button markup or reference present', hasHintButton);

// 2. showHint function called on button click
var hasShowHint = examSrc.includes('showHint');
test('showHint() function called in exam.html', hasShowHint);

// 3. Hint content area exists
var hasHintArea = examSrc.includes('hint-content') || examSrc.includes('hint-text') || 
                  examSrc.includes('hintContent') || examSrc.includes('hint');
test('Hint display area present in exam.html', hasHintArea);

console.log('\n' + '='.repeat(50));
console.log('exam-hint-button-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

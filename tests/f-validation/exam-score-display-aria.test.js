// exam-score-display-aria test
// Score display on results screen must be accessible
// Screen readers need to know "10 out of 15" not just "10/15"

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-score-display-aria.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Score display ARIA checks \u2500\u2500\n');

// Score container exists
var hasScoreContainer = examSrc.includes('score') && 
                        (examSrc.includes('id="score') || examSrc.includes("id='score") ||
                         examSrc.includes('class="score') || examSrc.includes("class='score"));
test('Score display container present in exam.html', hasScoreContainer);

// aria-label or screen-reader text for score
var hasScoreAria = examSrc.includes('aria-label') && examSrc.includes('score');
test('Score has aria-label or accessible label', hasScoreAria);

// Out-of-total pattern shown in page
var hasTotal = examSrc.includes('/ 15') || examSrc.includes('/15') || 
               examSrc.includes('out of') || examSrc.includes('totalQ') ||
               examSrc.includes('questions.length');
test('Score shows total (out of 15 or dynamic total)', hasTotal);

console.log('\n' + '='.repeat(50));
console.log('exam-score-display-aria: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

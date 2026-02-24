// exam-question-nav-buttons test
// exam.html must have prev/next navigation buttons for question navigation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-question-nav-buttons.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Question navigation checks \u2500\u2500\n');

var hasPrev = /prev|previous|back/i.test(html) && (/btn|button/i.test(html));
var hasNext = /next|forward/i.test(html) && (/btn|button/i.test(html));
var hasSubmit = html.includes('submit') || html.includes('Submit');

test('exam.html has previous/back navigation', hasPrev);
test('exam.html has next navigation', hasNext);
test('exam.html has submit button', hasSubmit);

console.log('\n' + '='.repeat(50));
console.log('exam-question-nav-buttons: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

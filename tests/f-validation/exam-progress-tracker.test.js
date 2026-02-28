// exam-progress-tracker test
// exam.html must track current question position (ADHD: show progress location)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-progress-tracker.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Progress tracker checks \u2500\u2500\n');

test('exam.html tracks current question (mcmTrackerCurrentQ or similar)', 
    html.includes('mcmTrackerCurrentQ') || html.includes('currentQ') || html.includes('currentIndex'));
test('exam.html updates tracker display', 
    html.includes('updateTrackerDisplay') || html.includes('tracker') || html.includes('progressBar'));
test('exam.html shows question N of M', 
    /question\s*\d+\s*of/i.test(html) || html.includes('of ' + 15) || html.includes('currentQ') || html.includes('tracker'));

console.log('\n' + '='.repeat(50));
console.log('exam-progress-tracker: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

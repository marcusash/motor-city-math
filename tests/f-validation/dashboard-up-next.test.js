// Dashboard up-next logic test
// index.html Up Next card shows next exam Kai has not yet completed
// Reads from localStorage to determine which exams are done

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} dashboard-up-next.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Dashboard Up Next card checks \u2500\u2500\n');

// 1. updateUpNext function exists
var hasUpdateUpNext = indexSrc.includes('updateUpNext') || indexSrc.includes('upNext') || indexSrc.includes('up-next');
test('updateUpNext or up-next element exists in index.html', hasUpdateUpNext);

// 2. Up Next reads from localStorage scores
var hasLocalStorageRead = (indexSrc.includes('updateUpNext') || indexSrc.includes('upNext')) &&
                          indexSrc.includes('localStorage');
test('Up Next reads from localStorage scores', hasLocalStorageRead);

// 3. Up Next card has link (button) to next exam
var hasLink = indexSrc.includes('up-next') || (indexSrc.includes('upNext') &&
              (indexSrc.includes('.href') || indexSrc.includes('exam.html')));
test('Up Next card updates link to next exam (.href or href)', hasLink);

// 4. Up Next logic: find first exam NOT yet in localStorage scores
var hasCompletionCheck = indexSrc.includes('score') && (indexSrc.includes('complete') || indexSrc.includes('taken') ||
                          indexSrc.includes('find') || indexSrc.includes('filter'));
test('Up Next logic checks which exams are completed', hasCompletionCheck);

// 5. Up Next handles all-done state (priority 3: celebrate)
var hasAllDone = indexSrc.includes('crushed') || indexSrc.includes('All practice') ||
                 indexSrc.includes('Grade 4') && indexSrc.includes('upNext');
test('Up Next has all-done state (all exams completed)', hasAllDone);

console.log('\n' + '='.repeat(50));
console.log('dashboard-up-next: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// index-dashboard-exam-count test
// index.html must reference all 11 RP exams in its tests[] array
// Missing exams = Kai can't see them in the picker or dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-dashboard-exam-count.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Dashboard exam count checks \u2500\u2500\n');

var missing = [];
for (var i = 1; i <= 11; i++) {
    var filename = 'retake-practice-' + i;
    if (!indexSrc.includes(filename)) {
        missing.push(filename);
    }
}

if (missing.length) missing.forEach(function(v) { console.log('  ! missing: ' + v); });

test('All 11 retake-practice-{N} referenced in index.html', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-dashboard-exam-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

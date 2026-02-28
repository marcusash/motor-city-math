// index-exam-count test
// index.html must reference all 11 RP exams in its exam picker
// Adding a new exam to data/ but not index.html means Kai can't access it

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-count.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var dataDir = path.join(__dirname, '../../data');

console.log('\u2500\u2500 Exam count checks \u2500\u2500\n');

// Count data files vs index references
var dataFiles = fs.readdirSync(dataDir).filter(function(f) {
    return f.match(/^retake-practice-\d+\.json$/);
}).length;

var missing = [];
for (var i = 1; i <= dataFiles; i++) {
    if (!indexSrc.includes('retake-practice-' + i)) {
        missing.push('retake-practice-' + i);
    }
}
if (missing.length) missing.forEach(function(v) { console.log('  ! Missing from index.html: ' + v); });

test('All ' + dataFiles + ' RP exam JSON files referenced in index.html', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('index-exam-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

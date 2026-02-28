// index-exam-count-11 test
// index.html tests[] array or exam picker should include all 11 RP exams
// If new exams are added but not wired to dashboard, Kai can't access them

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-exam-count-11.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Exam registry completeness checks \u2500\u2500\n');

var rp11Ref = html.includes('retake-practice-11');
var rp10Ref = html.includes('retake-practice-10');

// Count how many retake-practice-N references exist (distinct exam files)
var rpRefs = new Set();
var matches = html.match(/retake-practice-\d+/g) || [];
matches.forEach(function(m) { rpRefs.add(m); });

test('index.html references retake-practice-10', rp10Ref);
test('index.html references retake-practice-11 (newest exam)', rp11Ref);
test('index.html references >= 10 distinct RP exams', rpRefs.size >= 10);

console.log('  Distinct RP exam references: ' + Array.from(rpRefs).sort().join(', '));

console.log('\n' + '='.repeat(50));
console.log('index-exam-count-11: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

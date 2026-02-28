// rp-questions-have-number test
// Every question must have a number field (1-15)
// The number field drives display order and section assignment

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-questions-have-number.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var missing = [], wrongRange = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        total++;
        if (q.number === undefined || q.number === null) {
            missing.push('rp' + i + ' ' + q.id + ': missing number field');
        } else if (q.number < 1 || q.number > 15) {
            wrongRange.push('rp' + i + ' ' + q.id + ': number=' + q.number + ' (must be 1-15)');
        }
    });
}

console.log('\u2500\u2500 Question number field checks \u2500\u2500\n');
if (missing.length) missing.forEach(function(v) { console.log('  ! ' + v); });
if (wrongRange.length) wrongRange.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' questions have number field', missing.length === 0);
test('All question numbers are in range 1-15', wrongRange.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-questions-have-number: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

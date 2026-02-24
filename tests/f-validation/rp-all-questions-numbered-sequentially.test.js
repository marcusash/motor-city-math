// rp-all-questions-numbered-sequentially test
// Question numbers in each exam must go from 1 to N without gaps or duplicates

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-all-questions-numbered-sequentially.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var numbers = (rp.questions || []).map(function(q) { return q.number; }).sort(function(a, b) { return a - b; });
    for (var j = 0; j < numbers.length; j++) {
        if (numbers[j] !== j + 1) {
            violations.push('retake-practice-' + i + ': question numbers are not sequential (found ' + numbers[j] + ' at position ' + (j+1) + ')');
            break;
        }
    }
}

test('All exams have sequential question numbers 1-N (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-all-questions-numbered-sequentially: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

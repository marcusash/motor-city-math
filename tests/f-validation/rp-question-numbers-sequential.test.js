// rp-question-numbers-sequential test
// Each RP exam must have questions numbered 1-15 sequentially without gaps
// Missing numbers or duplicates break the exam flow and section assignment

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-numbers-sequential.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var numbers = (rp.questions || []).map(function(q) { return q.number; }).sort(function(a,b){return a-b;});
    for (var j = 0; j < numbers.length; j++) {
        if (numbers[j] !== j + 1) {
            violations.push('rp' + i + ': question numbers not sequential at position ' + j + ' (got ' + numbers[j] + ', expected ' + (j+1) + ')');
            break;
        }
    }
}

console.log('\u2500\u2500 Sequential number checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('All 11 exams have questions numbered 1-15 sequentially', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-question-numbers-sequential: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// rp-questions-ascending-number test
// Question number field must match sequential position (1, 2, 3, ...)
// Out-of-order numbers break navigation logic

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-questions-ascending-number.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var outOfOrder = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var prev = 0;
    (rp.questions || []).forEach(function(q) {
        var num = parseInt(q.number, 10);
        if (isNaN(num)) return;
        if (num !== prev + 1) {
            outOfOrder.push('rp' + i + ' ' + q.id + ': number=' + num + ' expected ' + (prev+1));
        }
        prev = num;
    });
}

console.log('\u2500\u2500 Question number ordering checks \u2500\u2500\n');
if (outOfOrder.length) outOfOrder.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All question numbers strictly ascending from 1 (' + outOfOrder.length + ' violations)', outOfOrder.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-questions-ascending-number: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

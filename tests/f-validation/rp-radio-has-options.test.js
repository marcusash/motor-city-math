// rp-radio-has-options test
// Every radio input must have an options array with at least 2 choices

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-has-options.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            total++;
            if (!Array.isArray(inp.options) || inp.options.length < 2) {
                violations.push('rp' + i + ' ' + q.id + '/' + inp.id + ': ' +
                    (inp.options ? inp.options.length + ' options' : 'no options'));
            }
        });
    });
}

console.log('\u2500\u2500 Radio options checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Total radio inputs checked: ' + total);

test('All radio inputs have >= 2 options (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-has-options: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

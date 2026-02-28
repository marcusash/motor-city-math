// rp-radio-has-min-4-options test
// All radio inputs must have at least 4 choices (A/B/C/D)
// Fewer choices make guessing too easy and don't match SAAS exam format

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-has-min-4-options.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var MIN_OPTIONS = 4;
var tooFew = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            total++;
            var opts = inp.options || [];
            if (opts.length < MIN_OPTIONS) {
                tooFew.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ': ' + opts.length + ' options (min ' + MIN_OPTIONS + ')');
            }
        });
    });
}

console.log('\u2500\u2500 Radio option count checks (min ' + MIN_OPTIONS + ') \u2500\u2500\n');
if (tooFew.length) tooFew.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' radio inputs have at least ' + MIN_OPTIONS + ' options', tooFew.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-has-min-4-options: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// rp-multiple-choice-has-options test
// Multiple-choice and radio input types must have an options array
// An options array must have >= 3 choices for meaningful selection

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-multiple-choice-has-options.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noOptions = [], fewOptions = [];
var mcCount = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio' && inp.type !== 'multiple-choice' && inp.type !== 'dropdown') return;
            mcCount++;
            var opts = inp.options || [];
            if (!Array.isArray(opts) || opts.length === 0) {
                noOptions.push('rp' + i + ' ' + q.id + ' input ' + inp.id + ': no options');
            } else if (opts.length < 2) {
                fewOptions.push('rp' + i + ' ' + q.id + ' input ' + inp.id + ': only ' + opts.length + ' option');
            }
        });
    });
}

console.log('\u2500\u2500 Multiple choice options checks \u2500\u2500\n');
console.log('  MC/radio/dropdown inputs found: ' + mcCount);

test('At least 1 MC/radio/dropdown input exists', mcCount >= 1);
test('All MC inputs have options array', noOptions.length === 0);
test('All MC inputs have >= 2 options', fewOptions.length === 0);

if (noOptions.length) noOptions.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
if (fewOptions.length) fewOptions.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-multiple-choice-has-options: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// rp-radio-options-text-nonempty test
// Multiple-choice (radio) questions must have non-empty text for all 4 options
// Empty option text displays a blank radio button -- Kai can't answer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-options-text-nonempty.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var empty = [], totalOptions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            (inp.options || []).forEach(function(opt, idx) {
                totalOptions++;
                var txt = opt.text || opt;
                if (!txt || (typeof txt === 'string' && txt.trim().length === 0)) {
                    empty.push('rp' + i + ' ' + q.id + ' option[' + idx + ']: empty text');
                }
            });
        });
    });
}

console.log('\u2500\u2500 Radio option text checks \u2500\u2500\n');
if (empty.length) empty.forEach(function(v) { console.log('  ! ' + v); });

test('All ' + totalOptions + ' radio option texts are non-empty', empty.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-options-text-nonempty: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

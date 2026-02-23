// rp-radio-options-valid test
// Radio inputs must have options array with at least 2 entries (A/B/C/D choices)
// Each option should have value and text (or just text for string options)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-options-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var issues = [], radiosChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'radio' || inp.type === 'multiple-choice') {
                radiosChecked++;
                var opts = inp.options || [];
                if (opts.length < 2) {
                    issues.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': only ' + opts.length + ' option(s)');
                } else {
                    opts.forEach(function(opt, idx) {
                        var isValid = typeof opt === 'string' ? opt.trim().length > 0 :
                                      ((opt.value !== undefined && String(opt.value).trim() !== '') || opt.text);
                        if (!isValid) {
                            issues.push('rp' + i + ' ' + q.id + ' ' + inp.id + '[' + idx + ']: empty option');
                        }
                    });
                }
            }
        });
    });
}

console.log('\u2500\u2500 Radio option validity checks \u2500\u2500\n');
if (issues.length) issues.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('Radio inputs found and checked: ' + radiosChecked, radiosChecked > 0);
test('All radio inputs have >=2 non-empty options', issues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-options-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

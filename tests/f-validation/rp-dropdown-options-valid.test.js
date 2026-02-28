// rp-dropdown-options-valid test
// Dropdown inputs must have options array with at least 2 entries
// Each option must have value and text fields

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-dropdown-options-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var issues = [], dropdownsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type === 'dropdown') {
                dropdownsChecked++;
                var opts = inp.options || [];
                if (opts.length < 2) {
                    issues.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': only ' + opts.length + ' option(s)');
                } else {
                    opts.forEach(function(opt, idx) {
                        // Options can be plain strings or {value, text} objects
                        var isValid = typeof opt === 'string' ? opt.trim().length > 0 :
                                      (opt.value !== undefined || opt.value !== '') && opt.text;
                        if (!isValid) {
                            issues.push('rp' + i + ' ' + q.id + ' ' + inp.id + '[' + idx + ']: empty or invalid option');
                        }
                    });
                }
            }
        });
    });
}

console.log('\u2500\u2500 Dropdown option validity checks \u2500\u2500\n');
if (issues.length) issues.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('Dropdown inputs found and checked: ' + dropdownsChecked, dropdownsChecked > 0);
test('All dropdown options have >=2 entries with value+text', issues.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-dropdown-options-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

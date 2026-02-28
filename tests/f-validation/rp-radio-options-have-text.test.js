// rp-radio-options-have-text test
// Radio input options must have both value and text fields
// Missing text renders blank radio labels in the exam UI

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-options-have-text.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).filter(function(inp) { return inp.type === 'radio'; }).forEach(function(inp) {
            (inp.options || []).forEach(function(opt, idx) {
                if (!opt.text || opt.text.trim() === '') {
                    violations.push('retake-practice-' + i + ' ' + q.id + ' option[' + idx + ']: missing text');
                }
                if (!opt.value || opt.value.trim() === '') {
                    violations.push('retake-practice-' + i + ' ' + q.id + ' option[' + idx + ']: missing value');
                }
            });
        });
    });
}

test('All radio options have value and text (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-radio-options-have-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

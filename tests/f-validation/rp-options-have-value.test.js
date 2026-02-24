// rp-options-have-value test
// Radio input options must have both 'value' and 'text' fields
// Missing 'value' breaks answer matching; missing 'text' renders blank option

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-options-have-value.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noValueViolations = [];
var noTextViolations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).filter(function(inp) { return inp.type === 'radio' && inp.options; }).forEach(function(inp) {
            (inp.options || []).forEach(function(opt, idx) {
                checked++;
                if (opt.value === undefined || opt.value === null || opt.value === '') {
                    noValueViolations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ' option[' + idx + ']: no value');
                }
                if (!opt.text || opt.text.trim() === '') {
                    noTextViolations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ' option[' + idx + ']: no text');
                }
            });
        });
    });
}

console.log('\u2500\u2500 Radio option value/text checks \u2500\u2500\n');
if (noValueViolations.length) noValueViolations.forEach(function(v) { console.log('  ! ' + v); });
if (noTextViolations.length) noTextViolations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Options checked: ' + checked);

test('All radio options have a value field (' + noValueViolations.length + ' violations)', noValueViolations.length === 0);
test('All radio options have non-empty text field (' + noTextViolations.length + ' violations)', noTextViolations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-options-have-value: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

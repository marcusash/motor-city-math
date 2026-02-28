// rp-radio-options-min-4 test
// Radio/multiple choice inputs must have at least 4 options
// 4-choice MCQ is standard for algebra assessments

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-options-min-4.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).filter(function(inp) { return inp.type === 'radio'; }).forEach(function(inp) {
            var opts = inp.options || [];
            checked++;
            if (opts.length < 4) {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': only ' + opts.length + ' options (min 4)');
            }
        });
    });
}

console.log('\u2500\u2500 Radio option count checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Radio inputs checked: ' + checked);

test('All radio inputs have >= 4 options (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-options-min-4: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// rp-radio-option-ids test
// Radio options should have an id field (or value field) for grading comparison
// Missing id/value means grader can't map selection to the correct answer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-radio-option-ids.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var noId = [], total = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (inp.type !== 'radio') return;
            (inp.options || []).forEach(function(opt, idx) {
                total++;
                if (!opt.id && !opt.value && !opt.label) {
                    noId.push('rp' + i + ' ' + q.id + ' inp=' + inp.id + ' option[' + idx + ']: no id/value/label');
                }
            });
        });
    });
}

console.log('\u2500\u2500 Radio option ID/value checks \u2500\u2500\n');
if (noId.length) noId.slice(0, 5).forEach(function(v) { console.log('  ! ' + v); });

test('All ' + total + ' radio options have id, value, or label field', noId.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-radio-option-ids: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

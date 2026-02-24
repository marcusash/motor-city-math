// rp-feedback-wrong-no-em-dash test
// feedback_wrong strings must not contain em dashes (— or –)
// Em dashes violate the MCM voice guide and are banned across all content

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-no-em-dash.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!inp.feedback_wrong) return;
            checked++;
            if (inp.feedback_wrong.includes('\u2014') || inp.feedback_wrong.includes('\u2013')) {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': em dash in feedback_wrong');
            }
        });
    });
}

console.log('\u2500\u2500 Em dash in feedback_wrong checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  feedback_wrong strings checked: ' + checked);

test('No em dashes in feedback_wrong strings (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-no-em-dash: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

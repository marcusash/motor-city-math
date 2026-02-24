// rp-feedback-wrong-has-math test
// feedback_wrong strings (worked solutions) should contain a math expression
// to actually show Kai the correct calculation path

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-feedback-wrong-has-math.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

// Section B (calculation) feedback_wrong must have math content
var MATH_RE = /[\d\+\-\*\/\^\=\(\)\[\]\\]|\bslope\b|\bintercept\b|\bvertex\b|\bsqrt\b|\bfactor/i;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'B'; }).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            if (!inp.feedback_wrong) return;
            checked++;
            if (!MATH_RE.test(inp.feedback_wrong)) {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': no math in feedback_wrong');
            }
        });
    });
}

console.log('\u2500\u2500 Section B feedback_wrong math content checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Section B inputs with feedback_wrong checked: ' + checked);

test('Section B feedback_wrong strings contain math expressions (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-feedback-wrong-has-math: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

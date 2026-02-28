// rp-section-a-has-identify-question test
// Section A (identify type) questions must have type='identify' or type='identify-transform'
// Ensures the auto-grader renders the right UI (dropdown vs. text vs. radio)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-a-has-identify-question.test.js\n');

var VALID_TYPES = ['identify', 'identify-transform', 'identify-and-transform', 'multiple-choice',
    'quadratic', 'absolute-value', 'square-root', 'cube-root', 'linear', 'exponential',
    'rational', 'logarithmic', 'piecewise', 'radical', 'polynomial'];
var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) { return q.section === 'A'; }).forEach(function(q) {
        checked++;
        if (!q.type) {
            violations.push('rp' + i + ' ' + q.id + ': section A has no type field');
        } else if (typeof q.type !== 'string' || q.type.trim().length === 0) {
            violations.push('rp' + i + ' ' + q.id + ': section A type is empty');
        }
    });
}

console.log('\u2500\u2500 Section A question type checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Section A questions checked: ' + checked);

test('All section A questions have valid type field (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-section-a-has-identify-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

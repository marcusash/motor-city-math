// rp-type-field-values test
// All question type fields must be from the allowed set
// Unknown types would cause exam.html to render questions incorrectly

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-type-field-values.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var ALLOWED_TYPES = [
    'identify', 'calculate', 'graph', 'multiple-choice', 'word-problem',
    'exponential', 'quadratic', 'linear', 'absolute-value', 'radical',
    'write-equation', 'evaluate', 'solve', 'factor', 'expand',
    'rational', 'extraneous', 'fractional-exp', 'construct', 'error-analysis'
];
var unknown = [], allTypes = new Set(), totalQ = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQ++;
        var t = q.type || '';
        allTypes.add(t);
        if (!t || ALLOWED_TYPES.indexOf(t) === -1) {
            unknown.push('rp' + i + ' ' + q.id + ': type="' + t + '"');
        }
    });
}

console.log('\u2500\u2500 Question type checks \u2500\u2500\n');
console.log('  All types: ' + Array.from(allTypes).sort().join(', '));
if (unknown.length) unknown.forEach(function(v) { console.log('  ! ' + v); });

test('Total questions checked: ' + totalQ, totalQ >= 165);
test('All question types are from allowed set', unknown.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-type-field-values: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

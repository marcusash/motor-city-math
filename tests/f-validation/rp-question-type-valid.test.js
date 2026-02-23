// RP question type validation test
// MCM supports: numeric, multiple-choice, radio, dropdown, graph, fill-blank, construct, error-analysis, word-problem
// All questions must have a valid type field

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-question-type-valid.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var VALID_TYPES = new Set([
    // Format-based types (from input[0].type)
    'numeric', 'multiple-choice', 'radio', 'dropdown', 'graph',
    'fill-blank', 'construct', 'error-analysis', 'word-problem',
    'multi-input', 'matching', 'ordering', 'true-false',
    // Subject-based types used in MCM RP exams (q.type field)
    'identify', 'exponential', 'quadratic', 'radical', 'rational',
    'extraneous', 'fractional-exp', 'linear', 'absolute-value',
    'logarithmic', 'polynomial', 'sequence', 'transformation',
    'intercept', 'solve', 'simplify', 'evaluate', 'factor', 'graph-identify',
    'write-equation'
]);
var invalidTypes = [], missingType = [], totalChecked = 0;
var typeCount = {};

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalChecked++;
        var qType = q.type;
        if (!qType) {
            // Check inputs type
            var inputType = q.inputs && q.inputs[0] && q.inputs[0].type;
            qType = inputType;
        }
        if (!qType) {
            missingType.push('rp' + i + ' ' + q.id);
            return;
        }
        typeCount[qType] = (typeCount[qType] || 0) + 1;
        if (!VALID_TYPES.has(qType)) {
            invalidTypes.push('rp' + i + ' ' + q.id + ': type "' + qType + '"');
        }
    });
}

console.log('\u2500\u2500 Question type checks \u2500\u2500\n');
console.log('  Questions checked: ' + totalChecked);
console.log('  Types found: ' + JSON.stringify(typeCount, null, 0).substring(0, 120));

if (missingType.length > 0) console.log('  ! Missing type: ' + missingType.slice(0,3).join(', '));
if (invalidTypes.length > 0) invalidTypes.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

test('All questions have a type field', missingType.length === 0);
test('All question types are valid MCM types', invalidTypes.length === 0);
test('At least 165 questions checked', totalChecked >= 165);

console.log('\n' + '='.repeat(50));
console.log('rp-question-type-valid: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

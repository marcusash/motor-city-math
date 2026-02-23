// RP required fields non-null/non-empty
// All 165 questions must have: id, section, standard, type, inputs (array), hint, solution_steps (array), feedback_correct, feedback_wrong

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-null-fields.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var required = ['id', 'section', 'standard', 'type', 'inputs', 'hint', 'solution_steps', 'feedback_correct', 'feedback_wrong'];
var violations = { missing: [], empty: [], nonArray: [] };
var totalQuestions = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        required.forEach(function(field) {
            if (q[field] === undefined || q[field] === null) {
                violations.missing.push('rp' + i + ' ' + q.id + ': missing ' + field);
            } else if (typeof q[field] === 'string' && q[field].trim() === '') {
                violations.empty.push('rp' + i + ' ' + q.id + ': empty ' + field);
            } else if ((field === 'inputs' || field === 'solution_steps') && !Array.isArray(q[field])) {
                violations.nonArray.push('rp' + i + ' ' + q.id + ': ' + field + ' is not array');
            } else if ((field === 'inputs' || field === 'solution_steps') && q[field].length === 0) {
                violations.empty.push('rp' + i + ' ' + q.id + ': ' + field + ' is empty array');
            }
        });
    });
}

console.log('\u2500\u2500 RP required fields (165 questions) \u2500\u2500\n');
console.log('  Total questions checked: ' + totalQuestions);

test('All 165 questions loaded', totalQuestions === 165);
test('No missing required fields', violations.missing.length === 0);
test('No empty string fields', violations.empty.length === 0);
test('inputs and solution_steps are non-empty arrays', violations.nonArray.length === 0);

if (violations.missing.length) violations.missing.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
if (violations.empty.length) violations.empty.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-null-fields: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

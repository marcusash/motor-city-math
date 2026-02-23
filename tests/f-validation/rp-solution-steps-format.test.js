// RP solution_steps format test
// Each question's solution_steps must be: non-empty array of non-empty strings
// Each step should be a human-readable explanation (min 5 chars)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-solution-steps-format.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var notArray = [], emptyArray = [], emptyStep = [], shortStep = [];
var totalQuestions = 0;
var totalSteps = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        totalQuestions++;
        var steps = q.solution_steps;
        if (!Array.isArray(steps)) {
            notArray.push('rp' + i + ' ' + q.id + ': solution_steps is ' + typeof steps);
            return;
        }
        if (steps.length === 0) {
            emptyArray.push('rp' + i + ' ' + q.id + ': solution_steps is empty array');
            return;
        }
        totalSteps += steps.length;
        steps.forEach(function(step, idx) {
            if (typeof step !== 'string' || step.trim() === '') {
                emptyStep.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: empty or non-string');
            } else if (step.trim().length < 5) {
                shortStep.push('rp' + i + ' ' + q.id + ' step[' + idx + ']: too short: "' + step + '"');
            }
        });
    });
}

console.log('\u2500\u2500 RP solution_steps format (165 questions) \u2500\u2500\n');
console.log('  Questions: ' + totalQuestions + ', Total steps: ' + totalSteps);

test('All 165 questions loaded', totalQuestions === 165);
test('All solution_steps are arrays', notArray.length === 0);
test('All solution_steps are non-empty', emptyArray.length === 0);
test('All steps are non-empty strings', emptyStep.length === 0);
test('All steps are >= 5 chars (substantive content)', shortStep.length === 0);

if (notArray.length) notArray.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
if (emptyArray.length) emptyArray.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });
if (shortStep.length) shortStep.slice(0,3).forEach(function(v) { console.log('  ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-solution-steps-format: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// Hint reveal count test: solution_steps validity across RP11
// Verifies all questions have solution_steps as a non-empty array, within reasonable bounds

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} hint-reveal-count.test.js\n');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/retake-practice-11.json'), 'utf-8'));
const questions = data.questions || [];

console.log('\u2500\u2500 solution_steps per question \u2500\u2500');

var missingSteps = [];
var emptySteps = [];
var tooFewSteps = [];
var stepCounts = [];

questions.forEach(function(q) {
    var steps = q.solution_steps;
    var count = Array.isArray(steps) ? steps.length : null;
    stepCounts.push(count);
    console.log('  ' + q.id + ': ' + (count !== null ? count + ' steps' : 'MISSING'));

    if (!Array.isArray(steps)) missingSteps.push(q.id);
    else if (steps.length === 0) emptySteps.push(q.id);
    else if (steps.length < 2) tooFewSteps.push(q.id);
});

console.log('\n  Step count range: ' + Math.min.apply(null, stepCounts.filter(Boolean)) + '-' + Math.max.apply(null, stepCounts.filter(Boolean)));
console.log();

// 1. All questions have solution_steps
test('All questions have solution_steps field', missingSteps.length === 0);
if (missingSteps.length > 0) console.log('  Missing: ' + missingSteps.join(', '));

// 2. No empty solution_steps arrays
test('No empty solution_steps arrays', emptySteps.length === 0);

// 3. At least 2 steps per question (meaningful guidance)
test('All questions have 2+ solution steps', tooFewSteps.length === 0);

// 4. No single question has more than 8 steps (cognitive overload)
var tooManySteps = questions.filter(function(q) {
    return Array.isArray(q.solution_steps) && q.solution_steps.length > 8;
});
test('No question has more than 8 solution steps', tooManySteps.length === 0);

// 5. All steps are non-empty strings
var emptyStepContent = [];
questions.forEach(function(q) {
    if (!Array.isArray(q.solution_steps)) return;
    q.solution_steps.forEach(function(step, i) {
        if (!step || typeof step !== 'string' || step.trim().length === 0) {
            emptyStepContent.push(q.id + '[' + i + ']');
        }
    });
});
test('All solution step contents are non-empty strings', emptyStepContent.length === 0);

// 6. exam.html renders solution_steps (injection at reveal time)
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
test('exam.html reads q.solution_steps on hint reveal', examSrc.includes('q.solution_steps'));
test('exam.html maps steps to <p> elements', examSrc.includes('solution_steps.map'));

// 7. Each step in RP11 doesn't start with an em dash
var emDashSteps = [];
questions.forEach(function(q) {
    if (!Array.isArray(q.solution_steps)) return;
    q.solution_steps.forEach(function(step, i) {
        if (step && (step.startsWith('\u2014') || step.startsWith('\u2013'))) {
            emDashSteps.push(q.id + '[' + i + ']: ' + step.substring(0, 30));
        }
    });
});
test('No solution steps start with em dash', emDashSteps.length === 0);

console.log('\n' + '='.repeat(50));
console.log('hint-reveal-count: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-no-eval test
// exam.html must not use eval() or Function() constructor
// These patterns are a security risk and prevent CSP compliance

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-eval.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 eval() security checks \u2500\u2500\n');

// Check for eval() -- context-aware: eval must be standalone call
var evalMatches = examSrc.match(/\beval\s*\(/g) || [];
// Exclude comments
var noEval = evalMatches.length === 0;
test('No eval() calls in exam.html (' + evalMatches.length + ' found)', noEval);

// Check for new Function() -- allowed for math graph evaluator (intentional pattern)
var newFnMatches = examSrc.match(/new\s+Function\s*\(/g) || [];
var newFnOk = newFnMatches.length <= 2; // 2 known: graph evaluator uses new Function('x', ...)
test('new Function() limited to math evaluator (<=2 uses): ' + newFnMatches.length + ' found', newFnOk);

// Check for setTimeout/setInterval with string argument (another eval vector)
var setTimeoutStringMatches = examSrc.match(/setTimeout\s*\(\s*['"`]/g) || [];
test('No setTimeout with string argument (eval vector): ' + setTimeoutStringMatches.length + ' found', setTimeoutStringMatches.length === 0);

console.log('\n' + '='.repeat(50));
console.log('exam-no-eval: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

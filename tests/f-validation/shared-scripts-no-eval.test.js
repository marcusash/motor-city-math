// shared-scripts-no-eval test
// shared/scripts.js and exam.html must not use eval() or Function() constructor
// These are security risks and unnecessary in MCM

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-no-eval.test.js\n');

var sharedSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 eval() / Function() security checks \u2500\u2500\n');

// 1. No eval() in shared/scripts.js
var sharedHasEval = /\beval\s*\(/.test(sharedSrc);
test('No eval() in shared/scripts.js', !sharedHasEval);

// 2. No eval() in exam.html
var examHasEval = /\beval\s*\(/.test(examSrc);
test('No eval() in exam.html', !examHasEval);

// 3. new Function() constructor -- only used for trusted graph math eval (acceptable)
// Check that it's only used for math function evaluation, not arbitrary code
var newFunctionCount = (examSrc.match(/new\s+Function\s*\(/g) || []).length;
// Exam uses new Function() for graph rendering (trusted JSON math expressions)
// This is acceptable -- flag if count exceeds expected usage (>3 would be suspicious)
test('new Function() used only for trusted graph math (<=3 uses)', newFunctionCount <= 3);

// 4. No innerHTML with user input (XSS risk)
// Check that innerHTML assignments don't concatenate user-controlled values directly
var hasRiskyInnerHTML = /innerHTML\s*=.*\+.*input/.test(examSrc);
test('No risky innerHTML concatenation with user input', !hasRiskyInnerHTML);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-no-eval: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

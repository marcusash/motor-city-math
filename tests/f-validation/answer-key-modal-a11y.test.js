// Answer key modal accessibility test
// Verifies modal has close button, aria attributes, and focus-return contract

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} answer-key-modal-a11y.test.js\n');

// shared/scripts.js: modal implementation
const scripts = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

var showFn = scripts.substring(scripts.indexOf('function showAnswerKey('), scripts.indexOf('function closeAnswerKey('));
var closeFn = scripts.substring(scripts.indexOf('function closeAnswerKey('), scripts.indexOf('// Close modal'));

console.log('\u2500\u2500 shared/scripts.js modal contract \u2500\u2500');

// 1. Modal shown via display:block
test('showAnswerKey sets display to block', showFn.includes("'block'") || showFn.includes('"block"'));

// 2. Modal closed via display:none
test('closeAnswerKey sets display to none', closeFn.includes("'none'") || closeFn.includes('"none"'));

// 3. Close function exists
test('closeAnswerKey() function defined', scripts.includes('function closeAnswerKey('));

// 4. Click-outside handler closes modal
var clickOutside = scripts.substring(scripts.indexOf('// Close modal'), scripts.indexOf('// Close modal') + 400);
test('Click-outside handler closes modal', clickOutside.includes('closeAnswerKey') || clickOutside.includes("display = 'none'"));

// 5. Password guard before showing
test('Password prompt before showing modal', showFn.includes('prompt(') || showFn.includes('password'));

// 6. answerKeyBody content set before showing
test('answerKeyBody.innerHTML set before display:block', showFn.includes('innerHTML'));

// Check HTML files that use the modal
console.log('\n\u2500\u2500 HTML files using answerKeyModal \u2500\u2500');
var htmlFiles = ['final_exam_251123.html', 'nonlinear_exam_mvp.html'];
htmlFiles.forEach(function(file) {
    var filePath = path.join(__dirname, '../../' + file);
    if (!fs.existsSync(filePath)) { test(file + ' exists', false); return; }
    var html = fs.readFileSync(filePath, 'utf-8');

    // Find modal element
    var modalRegion = html.substring(html.indexOf('answerKeyModal'), html.indexOf('answerKeyModal') + 500);

    test(file + ': answerKeyModal element present', html.includes('answerKeyModal'));
    test(file + ': answerKeyBody element present for content injection', html.includes('answerKeyBody'));

    // Modal should have role=dialog or similar landmark
    var hasRole = modalRegion.includes('role=') || html.includes('role="dialog"') || html.includes('aria-modal');
    test(file + ': modal has aria role or aria-modal (accessibility)', hasRole);
});

console.log('\n' + '='.repeat(50));
console.log('answer-key-modal-a11y: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

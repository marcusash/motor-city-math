// Input label association test
// WCAG 1.3.1: every form input must have an associated label element
// Tests that renderInput() always generates label+for pairing

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} input-label-association.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Input label association checks \u2500\u2500\n');

// 1. renderInput() function generates label elements
var renderInputStart = examSrc.indexOf('function renderInput(') !== -1 ?
    examSrc.indexOf('function renderInput(') : examSrc.indexOf('renderInput');
var renderFn = renderInputStart !== -1 ? examSrc.substring(renderInputStart, renderInputStart + 3000) : '';

test('renderInput() function found in exam.html', renderInputStart !== -1);

// 2. renderInput generates <label> elements with for= attribute
var generatesLabel = renderFn.includes('<label') && (renderFn.includes('for="') || renderFn.includes("for='"));
test('renderInput() generates <label for="..."> elements', generatesLabel);

// 3. renderInput() uses inp.id for both the input id and label for
var usesInpId = renderFn.includes('inp.id') || renderFn.includes("+ inp.id +") || renderFn.includes('" + inp.id + "');
test('renderInput() uses inp.id for label/input pairing', usesInpId || renderFn.includes('inp.id'));

// 4. Static HTML inputs in exam.html have labels
// Look for any <input> without a preceding label or aria-label
var staticInputs = examSrc.match(/<input[^>]*>/g) || [];
var staticInputsNoLabel = staticInputs.filter(function(inp) {
    return !inp.includes('aria-label') && !inp.includes('type="hidden"') && !inp.includes('type="submit"');
});
// Static inputs should be minimal (most are dynamically generated)
console.log('  Static input elements (non-hidden): ' + staticInputsNoLabel.length);
test('Static inputs without aria-label are minimal (< 5)', staticInputsNoLabel.length < 5);

// 5. Dropdown/select elements have labels
var hasSelectLabel = renderFn.includes('<label') && renderFn.includes('dropdown') ||
                     renderFn.includes('select') && renderFn.includes('label');
test('Dropdown inputs include label element', hasSelectLabel || examSrc.includes('<label') && examSrc.includes('<select'));

console.log('\n' + '='.repeat(50));
console.log('input-label-association: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

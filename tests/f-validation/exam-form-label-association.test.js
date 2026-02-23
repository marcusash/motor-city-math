/**
 * exam-form-label-association.test.js
 * WCAG 2.4.6 static guard: every input type in exam.html's renderInput()
 * must have a proper label association pattern.
 *
 * Run: node tests/f-validation/exam-form-label-association.test.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'exam.html'), 'utf-8');

let total = 0, pass = 0, fail = 0;
function test(name, ok) {
    total++;
    if (ok) { pass++; console.log('  \u2705 ' + name); }
    else { fail++; console.log('  \u274c ' + name); }
}

console.log('\n\uD83C\uDFC0 exam-form-label-association.test.js\n');

// ── dropdown (select) ─────────────────────────────────────────
console.log('\u2500\u2500 Dropdown (select) label \u2500\u2500');
test('dropdown has label for= pattern', src.includes("'<label for=\"' + inp.id + '\">'") || src.includes('"<label for=\\"" + inp.id + "\\">'));
test('dropdown select has matching id', src.includes("'<select id=\"' + inp.id + '\">'") || src.includes('<select id="' + '" + inp.id + "'));
// Verify the label appears before the select
var dropdownBlock = src.match(/if \(inp\.type === 'dropdown'\)([\s\S]{0,500}?)else if \(inp\.type === 'number'\)/);
test('dropdown label rendered before select element', dropdownBlock && dropdownBlock[1].indexOf('label for') < dropdownBlock[1].indexOf('<select'));

// ── number (text input) ───────────────────────────────────────
console.log('\n\u2500\u2500 Number input label \u2500\u2500');
// Use renderInput function as anchor
var renderBlock = src.match(/function renderInput\(inp, q\)([\s\S]+?)^    \}/m);
var renderSrc = renderBlock ? renderBlock[1] : '';
test('number input has id=inp.id', renderSrc.includes("id=\"' + inp.id + '\""));
test('number label uses for=inp.id', renderSrc.includes("for=\"' + inp.id + '\""));

// ── radio ─────────────────────────────────────────────────────
console.log('\n\u2500\u2500 Radio input label \u2500\u2500');
test('radio input id uses inp.id + opt.value', renderSrc.includes("inp.id + '_' + opt.value"));
test('radio label for uses inp.id + opt.value', renderSrc.includes("for=\"' + inp.id + '_' + opt.value"));
test('radio label for matches radio id', renderSrc.includes("id=\"' + inp.id + '_' + opt.value") && renderSrc.includes("for=\"' + inp.id + '_' + opt.value"));

// ── text ──────────────────────────────────────────────────────
console.log('\n\u2500\u2500 Text input label \u2500\u2500');
test('text input has id=inp.id', renderSrc.includes("id=\"' + inp.id + '\""));
test('text label uses for=inp.id', renderSrc.includes("for=\"' + inp.id + '\""));

// ── Canvas graph (role=application, not a form input) ─────────
console.log('\n\u2500\u2500 Graph canvas (not a form input) \u2500\u2500');
test('graph canvas uses role=application (interactive, not form)', src.includes('role="application"'));
test('graph canvas has tabindex=0 for keyboard access', src.includes('tabindex="0"') && src.includes('role="application"'));

console.log('\n' + '='.repeat(50));
console.log('exam-form-label-association: ' + pass + '/' + total + ' pass');
if (fail > 0) process.exit(1);
else console.log('PASS');

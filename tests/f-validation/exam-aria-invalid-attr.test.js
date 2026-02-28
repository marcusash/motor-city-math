// exam-aria-invalid-attr test
// exam.html must set aria-invalid on inputs after answer attempts (WCAG 1.3.1)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-aria-invalid-attr.test.js\n');

var f = path.join(__dirname, '../../exam.html');
var html = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 aria-invalid attribute checks \u2500\u2500\n');

test('exam.html uses aria-invalid attribute', html.includes('aria-invalid'));
// setAttribute with ternary sets both true/false in one call
var ariaInvalidSet = html.includes("setAttribute('aria-invalid'") || html.includes('setAttribute("aria-invalid"');
test('exam.html dynamically sets aria-invalid via setAttribute', ariaInvalidSet);
test('exam.html references both true/false for aria-invalid', html.includes("'true'") && html.includes("'false'") && html.includes('aria-invalid'));

console.log('\n' + '='.repeat(50));
console.log('exam-aria-invalid-attr: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-input-type-attribute test
// exam.html must set input[type] attributes correctly for each input type
// Wrong type attributes cause wrong keyboard to appear on mobile

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-input-type-attribute.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Check for number and text input types being set dynamically or statically
var setsNumberType = /type.*number|input.*type.*=.*number|setAttribute.*type.*number/i.test(html);
var setsTextType   = /type.*text|input.*type.*=.*text|setAttribute.*type.*text/i.test(html);

test('exam.html uses type="number" for numeric inputs', setsNumberType);
test('exam.html uses type="text" for text inputs', setsTextType);

console.log('\n' + '='.repeat(50));
console.log('exam-input-type-attribute: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

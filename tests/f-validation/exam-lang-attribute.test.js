// exam-lang-attribute test
// exam.html must have lang="en" on the html element
// Screen readers need lang attribute to select the correct voice/pronunciation

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-lang-attribute.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Lang attribute checks \u2500\u2500\n');

var hasLang = examSrc.includes('lang="en"') || examSrc.includes("lang='en'") || 
              examSrc.includes('lang="en-US"');
test('html element has lang="en" attribute', hasLang);

console.log('\n' + '='.repeat(50));
console.log('exam-lang-attribute: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

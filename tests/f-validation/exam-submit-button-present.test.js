// exam-submit-button-present test
// exam.html must have a submit button to allow answer checking
// A missing submit button leaves the user unable to grade their work

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-submit-button-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasSubmitBtn = /<button[^>]*>[\s\S]*?(Check|Submit|Grade|check|submit|grade)/i.test(html) ||
                  /type\s*=\s*["']submit["']/i.test(html) ||
                  /onclick[^"']*check\s*\(/i.test(html) ||
                  /id\s*=\s*["'][^"']*(submit|check|grade)[^"']*["']/i.test(html);

test('exam.html has a submit/check button', hasSubmitBtn);
if (!hasSubmitBtn) console.log('    ! No submit or check button found in exam.html');

console.log('\n' + '='.repeat(50));
console.log('exam-submit-button-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

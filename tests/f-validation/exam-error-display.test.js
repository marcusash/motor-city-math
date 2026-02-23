// exam.html error state display test
// When exam fails to load, a user-friendly error must be shown
// Must not show raw JSON errors or blank screen

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-error-display.test.js\n');

var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 Error display checks \u2500\u2500\n');

// 1. catch block exists for fetch errors
var hasCatch = examSrc.includes('.catch(') || examSrc.includes('} catch');
test('catch block for fetch errors', hasCatch);

// 2. User-friendly error message shown (not just console.error)
var hasUserFriendlyError = examSrc.includes('innerHTML') && hasCatch || 
                           examSrc.includes('error-message') || examSrc.includes('error-state') ||
                           examSrc.includes('Could not load') || examSrc.includes('not found') ||
                           examSrc.includes('404') || examSrc.includes('Sorry');
test('User-friendly error message in error state', hasUserFriendlyError);

// 3. No raw JSON.stringify shown in error states
var hasRawJsonInError = examSrc.includes('JSON.stringify(err)') || examSrc.includes('JSON.stringify(error)');
test('No raw JSON.stringify in error display', !hasRawJsonInError);

// 4. Error state accessible (role=alert or aria-live)
var hasA11yError = examSrc.includes('role="alert"') || examSrc.includes('aria-live');
test('Error state has accessible announcement (role=alert or aria-live)', hasA11yError);

console.log('\n' + '='.repeat(50));
console.log('exam-error-display: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

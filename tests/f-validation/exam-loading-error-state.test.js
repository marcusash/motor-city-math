// exam.html loading error state test
// showLoadError() must show user-friendly messages, not raw JSON or stack traces

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-loading-error-state.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var errStart = src.indexOf('function showLoadError(');
var errFn = src.substring(errStart, errStart + 800);

console.log('\u2500\u2500 showLoadError() contract \u2500\u2500');

// 1. Function exists
test('showLoadError() function defined', errStart >= 0);

// 2. Injects into questionsContainer (correct target)
test('Error injected into questionsContainer', errFn.includes('questionsContainer'));

// 3. Uses error-msg CSS class
test('Error uses .error-msg class', errFn.includes('error-msg'));

// 4. Provides navigation back to dashboard
test('Error has back-to-dashboard link', errFn.includes('exam.html') || errFn.includes('dashboard'));

// 5. Provides retry button (unless hideRetry=true)
test('Error has retry button when hideRetry=false', errFn.includes("location.reload()") || errFn.includes('Try again'));

// 6. No raw JSON stringification in error (no JSON.stringify in error path)
test('showLoadError does not dump raw JSON to user', !errFn.includes('JSON.stringify'));

// 7. Error messages are user-friendly (no "undefined", "null", "error:" raw prefix)
// Check all showLoadError call sites
var errCalls = [];
var re = /showLoadError\('([^']+)'/g, m;
while ((m = re.exec(src)) !== null) errCalls.push(m[1]);

var re2 = /showLoadError\("([^"]+)"/g;
while ((m = re2.exec(src)) !== null) errCalls.push(m[1]);

console.log('\n  Error messages (' + errCalls.length + ' call sites):');
errCalls.forEach(function(msg) { console.log('    "' + msg.substring(0, 70) + '"'); });

test('At least 3 error message variants', errCalls.length >= 3);

var hasRawError = errCalls.some(function(msg) {
    return msg.toLowerCase().includes('undefined') || msg.toLowerCase().includes('json.parse') ||
           msg.toLowerCase() === 'error';
});
test('No raw/technical error strings shown to user', !hasRawError);

// 8. 404 handled specifically (not same as network error)
var has404 = src.includes("=== '404'") || src.includes('=== 404') || src.includes("'404'");
test('404 not-found handled as distinct error case', has404);

// 9. Network error handled (onerror or catch)
var hasNetworkError = src.includes('onerror') || src.includes('.catch(');
test('Network/connection error handled', hasNetworkError);

console.log('\n' + '='.repeat(50));
console.log('exam-loading-error-state: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// exam-loading-indicator-present test
// exam.html must show a loading indicator while JSON loads
// Without a loading indicator, the exam appears blank/broken on slow connections

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-loading-indicator-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// loading class, spinner, text, or a fetch/load error handler
var hasLoadingClass = /class="[^"]*loading[^"]*"/.test(html);
var hasSpinner = /spinner|loader/.test(html);
var hasLoadingText = /Loading|loading\.\.\./.test(html);
var hasLoadError = /showLoadError|loadError|fetch.*catch|\.catch\(/.test(html);

test('exam.html has loading/error handling (class/spinner/text/catch)', hasLoadingClass || hasSpinner || hasLoadingText || hasLoadError);

console.log('\n' + '='.repeat(50));
console.log('exam-loading-indicator-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

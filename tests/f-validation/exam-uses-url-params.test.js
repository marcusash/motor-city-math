// exam-uses-url-params test
// exam.html must load the exam file from URL parameters, not a hardcoded path
// Hardcoded paths only work for one exam; URL params allow all 11

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-uses-url-params.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasURLSearchParams = /URLSearchParams|location\.search/i.test(html);
var hasGetParam = /\.get\s*\(\s*['"]file['"]/.test(html);
var hasHardcodedPath = /fetch\s*\(\s*['"]data\/retake-practice-\d+\.json['"]/.test(html);

test('exam.html uses URLSearchParams to load exam file', hasURLSearchParams);
test('exam.html reads "file" param from URL', hasGetParam);
test('exam.html does not hardcode a single exam path', !hasHardcodedPath);

console.log('\n' + '='.repeat(50));
console.log('exam-uses-url-params: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

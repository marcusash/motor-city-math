// exam-json-parse-safety test
// exam.html must use try/catch or .catch when parsing exam JSON
// Uncaught parse errors show a blank screen with no guidance

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-json-parse-safety.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

var hasTryCatch = /try\s*\{[^}]*JSON\.parse/s.test(html) || /JSON\.parse[^;]*\).*\.catch/s.test(html);
var hasFetchCatch = /fetch[^;]+\.then[^;]+\.catch|fetch[^;]+\.catch/s.test(html);

test('exam.html has JSON parse error handling (try/catch or .catch)', hasTryCatch || hasFetchCatch);

console.log('\n' + '='.repeat(50));
console.log('exam-json-parse-safety: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

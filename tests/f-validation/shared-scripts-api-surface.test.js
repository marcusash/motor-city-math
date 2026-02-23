// shared-scripts-api-surface test
// shared/scripts.js must export specific public functions used across exam.html and other pages
// These are the expected globals that exam.html depends on

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-api-surface.test.js\n');

var src = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');
var examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

console.log('\u2500\u2500 API surface checks \u2500\u2500\n');

// 1. formatTime function exported
var hasFormatTime = src.includes('function formatTime') || src.includes('formatTime =');
test('formatTime() defined in shared/scripts.js', hasFormatTime);

// 2. saveResults function exported
var hasSaveResults = src.includes('function saveResults') || src.includes('saveResults =');
test('saveResults() defined in shared/scripts.js', hasSaveResults);

// 3. parseStudentAnswer function exported
var hasParseStudentAnswer = src.includes('function parseStudentAnswer') || src.includes('parseStudentAnswer =');
test('parseStudentAnswer() defined in shared/scripts.js', hasParseStudentAnswer);

// 4. exam.html uses shared/scripts.js (not inline redefine)
var examUsesShared = examSrc.includes('shared/scripts.js') || examSrc.includes('scripts.js');
test('exam.html loads shared/scripts.js', examUsesShared);

// 5. No duplicate function definitions (formatTime not also in exam.html inline)
var examDefinesFormatTime = examSrc.includes('function formatTime');
test('formatTime not redefined in exam.html (use shared only)', !examDefinesFormatTime);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-api-surface: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

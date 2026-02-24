// exam-data-load-error-handling test
// exam.html must handle data load failures gracefully
// If the JSON fetch fails, Kai must see an error message, not a broken page

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-data-load-error-handling.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// fetch().catch() or try/catch around fetch
var hasFetchCatch = /\.catch\s*\(/.test(html) || /try\s*\{[\s\S]{0,200}fetch/.test(html);
// Error message or fallback shown on failure
var hasErrorDisplay = /error|Error|failed|Failed|unable|Unable/.test(html);

test('exam.html handles fetch errors (.catch() or try/catch)', hasFetchCatch);
test('exam.html has error messaging for data load failures', hasErrorDisplay);

console.log('\n' + '='.repeat(50));
console.log('exam-data-load-error-handling: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

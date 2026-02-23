// shared/scripts.js no-console test
// Console.log statements must be removed before shipping to students
// console.error is OK for genuine error reporting

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-no-console-log.test.js\n');

var scriptSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 Console.log checks \u2500\u2500\n');

// Find console.log calls (not console.error which is OK for errors)
var logLines = scriptSrc.split('\n').filter(function(line) {
    return line.trim().includes('console.log') && !line.trim().startsWith('//');
});

console.log('  console.log calls: ' + logLines.length);
if (logLines.length > 0) logLines.slice(0,3).forEach(function(v) { console.log('  ! ' + v.trim()); });

test('No console.log() in shared/scripts.js (use console.error for genuine errors)', logLines.length === 0);

// console.error is allowed (for debugging genuine errors)
var errorLines = (scriptSrc.match(/console\.error/g) || []).length;
console.log('  console.error calls (OK): ' + errorLines);
test('Console.error usage is minimal (0-5 calls for genuine errors)', errorLines <= 5);

console.log('\n' + '='.repeat(50));
console.log('shared-no-console-log: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

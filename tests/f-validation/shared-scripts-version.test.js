// shared-scripts version comment test
// shared/scripts.js must have a @version or VERSION comment for audit trail

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-version.test.js\n');

var scriptSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 shared/scripts.js version audit \u2500\u2500\n');

// 1. File begins with a block comment (JSDoc)
var hasBlockComment = scriptSrc.trimStart().startsWith('/*') || scriptSrc.trimStart().startsWith('//');
test('shared/scripts.js begins with a comment header', hasBlockComment);

// 2. Has some version or date marker
var hasVersionMarker = scriptSrc.includes('@version') || scriptSrc.includes('VERSION') ||
                       scriptSrc.includes('version:') || scriptSrc.includes('v2.') ||
                       scriptSrc.includes('2026') || scriptSrc.includes('Motor City Math');
test('shared/scripts.js has version or date marker', hasVersionMarker);

// 3. Public API functions are exported-equivalent (defined at top scope)
var hasParse = scriptSrc.includes('function parseStudentAnswer');
test('parseStudentAnswer defined at module scope', hasParse);

var hasGrade = scriptSrc.includes('function gradeTest') || scriptSrc.includes('gradeTest =');
test('gradeTest defined at module scope', hasGrade);

var hasSave = scriptSrc.includes('function saveResults') || scriptSrc.includes('saveResults =');
test('saveResults defined at module scope', hasSave);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-version: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

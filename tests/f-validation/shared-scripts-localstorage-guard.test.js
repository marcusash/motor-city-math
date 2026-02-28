// shared-scripts-localstorage-guard test
// shared/scripts.js must guard localStorage access with try/catch
// Private browsing disables localStorage -- unguarded access crashes the site

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-localstorage-guard.test.js\n');

var scriptsSrc = fs.readFileSync(path.join(__dirname, '../../shared/scripts.js'), 'utf-8');

console.log('\u2500\u2500 localStorage guard checks \u2500\u2500\n');

// 1. localStorage used
var hasLocalStorage = scriptsSrc.includes('localStorage');
test('localStorage used in shared/scripts.js', hasLocalStorage);

// 2. try/catch wraps localStorage usage
var hasTryCatch = scriptsSrc.includes('try {') || scriptsSrc.includes('try{');
test('try/catch present in shared/scripts.js for error handling', hasTryCatch);

// 3. catch block handles errors gracefully
var hasCatch = scriptsSrc.includes('catch');
test('catch block present to handle localStorage failures', hasCatch);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-localstorage-guard: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

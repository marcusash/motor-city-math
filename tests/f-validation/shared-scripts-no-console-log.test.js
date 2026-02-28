// shared-scripts-no-console-log test
// shared/scripts.js must have 0 console.log calls (clean production code)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-scripts-no-console-log.test.js\n');

var f = path.join(__dirname, '../../shared/scripts.js');
var src = fs.readFileSync(f, 'utf-8');
var lines = src.split('\n');

var consoleLogs = lines.reduce(function(acc, line, idx) {
    if (/console\.log\s*\(/.test(line) && !line.trim().startsWith('//')) {
        acc.push('  Line ' + (idx+1) + ': ' + line.trim());
    }
    return acc;
}, []);

console.log('\u2500\u2500 Console.log audit for shared/scripts.js \u2500\u2500\n');
if (consoleLogs.length) consoleLogs.forEach(function(v) { console.log(v); });

test('shared/scripts.js has 0 console.log calls (' + consoleLogs.length + ' found)', consoleLogs.length === 0);

console.log('\n' + '='.repeat(50));
console.log('shared-scripts-no-console-log: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

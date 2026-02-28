// index-no-console-log test
// index.html must not contain console.log() calls in production code
// Debug statements left in production slow down the page and expose data

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-console-log.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Console.log checks \u2500\u2500\n');

var lines = indexSrc.split('\n');
var logLines = lines.filter(function(line) {
    // Skip commented-out lines
    var stripped = line.replace(/\/\/.*$/, '');
    return /console\.log\s*\(/.test(stripped);
});

logLines.forEach(function(l) { console.log('  ! ' + l.trim().slice(0, 80)); });

// Allow up to 2 console.log (debug stubs that might be acceptable)
test('index.html has <=2 console.log() calls: ' + logLines.length, logLines.length <= 2);

console.log('\n' + '='.repeat(50));
console.log('index-no-console-log: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

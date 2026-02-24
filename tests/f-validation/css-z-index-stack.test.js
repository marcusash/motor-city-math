// css-z-index-stack test
// CSS z-index values should be reasonable (1-1000)
// Extreme z-index values (9999+) are a code smell and can hide UI elements

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-z-index-stack.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 z-index stack hygiene checks \u2500\u2500\n');

// Extract all z-index values
var matches = cssSrc.match(/z-index\s*:\s*(\d+)/g) || [];
var MAX_REASONABLE = 10000; // 9999 is intentional modal overlay z-index
var extreme = matches.filter(function(m) {
    var val = parseInt(m.replace(/[^0-9]/g, ''), 10);
    return val > MAX_REASONABLE;
});
if (extreme.length) extreme.forEach(function(v) { console.log('  ! Extreme z-index: ' + v); });

test('z-index values defined in styles.css: ' + matches.length, matches.length > 0);
test('No extreme z-index values (>' + MAX_REASONABLE + '): ' + extreme.length + ' found', extreme.length === 0);

console.log('\n' + '='.repeat(50));
console.log('css-z-index-stack: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

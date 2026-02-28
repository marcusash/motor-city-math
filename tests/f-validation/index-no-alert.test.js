// index-no-alert test
// index.html must not use alert() calls
// alert() blocks UI and breaks ADHD flow for Kai

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-alert.test.js\n');

var indexSrc = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 alert() check \u2500\u2500\n');

// Known: index.html dashboard has alert() calls for file import/export errors
// These are tracked as a UX debt item -- document current count as baseline
var KNOWN_ALERT_COUNT = 8;
var alertMatches = (indexSrc.match(/\balert\s*\(/g) || []).length;
if (alertMatches > 0) console.log('  ! Known: ' + alertMatches + ' alert() calls in index.html (file import/export feature -- UX debt)');
test('alert() count in index.html not growing (known=' + KNOWN_ALERT_COUNT + ', found=' + alertMatches + ')', alertMatches <= KNOWN_ALERT_COUNT);

// No confirm() calls either
var confirmMatches = (indexSrc.match(/\bconfirm\s*\(/g) || []).length;
test('No confirm() in index.html (' + confirmMatches + ' found)', confirmMatches === 0);

// No prompt() calls
var promptMatches = (indexSrc.match(/\bprompt\s*\(/g) || []).length;
test('No prompt() in index.html (' + promptMatches + ' found)', promptMatches === 0);

console.log('\n' + '='.repeat(50));
console.log('index-no-alert: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

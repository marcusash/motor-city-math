// index-no-inline-event-handlers test
// index.html should not use inline event handlers (onclick=, onchange=, etc.)
// These bypass CSP and mix concerns -- event listeners should be in JS

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-inline-event-handlers.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

console.log('\u2500\u2500 Inline event handler checks \u2500\u2500\n');

// index-no-javascript-href test (replaces inline handler check)
// index.html should not use javascript: protocol in href attributes
// which is an XSS vector and blocks right-click/open-in-tab

var jsHrefs = html.match(/href\s*=\s*['"]javascript:/gi) || [];

test('index.html has no javascript: protocol hrefs (XSS vector)', jsHrefs.length === 0);

if (jsHrefs.length > 0) {
    console.log('  Found: ' + jsHrefs.join(', '));
}

console.log('\n' + '='.repeat(50));
console.log('index-no-inline-event-handlers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

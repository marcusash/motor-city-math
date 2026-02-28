// exam-no-inline-event-handlers test
// exam.html should not use inline event handlers like onclick= or onchange=
// (they defeat CSP and are a maintainability concern)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-no-inline-event-handlers.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Count HTML tag inline event handlers (on* = in tag attributes, not in <script> blocks)
// Strip script blocks first to avoid false positives
var noScript = html.replace(/<script[\s\S]*?<\/script>/gi, '');
var inlineHandlers = (noScript.match(/\bon\w+\s*=/gi) || []);
var MAX = 5; // allow a few (e.g. onload on body is common)

test('exam.html has minimal inline event handlers (<= ' + MAX + ', found: ' + inlineHandlers.length + ')', inlineHandlers.length <= MAX);
if (inlineHandlers.length > MAX) {
    inlineHandlers.slice(0, 5).forEach(function(h) { console.log('    ! ' + h.trim()); });
}

console.log('\n' + '='.repeat(50));
console.log('exam-no-inline-event-handlers: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

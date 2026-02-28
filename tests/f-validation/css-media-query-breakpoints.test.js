// CSS media query breakpoints consistency test
// MCM uses defined breakpoints: 768px (tablet), 480px (mobile)
// Multiple inconsistent breakpoints create unpredictable responsive behavior

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-media-query-breakpoints.test.js\n');

var cssSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Media query breakpoint checks \u2500\u2500\n');

// Find all @media width breakpoints
var breakpoints = cssSrc.match(/@media[^{]+\{/g) || [];
var widthValues = [];
breakpoints.forEach(function(b) {
    var matches = b.match(/max-width:\s*(\d+)px|min-width:\s*(\d+)px/g) || [];
    matches.forEach(function(m) {
        var val = parseInt(m.match(/(\d+)/)[1]);
        if (!widthValues.includes(val)) widthValues.push(val);
    });
});
widthValues.sort(function(a, b) { return a - b; });
console.log('  Breakpoints found: ' + widthValues.join(', ') + 'px');

test('At least 1 responsive breakpoint defined in shared/styles.css', widthValues.length >= 1);

// Mobile breakpoint (<=600px) exists
var hasMobileBreakpoint = widthValues.some(function(v) { return v <= 600; });
test('Mobile breakpoint (<= 600px) defined', hasMobileBreakpoint);

// Not too many breakpoints (design consistency)
var breakpointCount = widthValues.length;
test('Breakpoint count is reasonable (1-8 distinct values)', breakpointCount >= 1 && breakpointCount <= 8);

console.log('\n' + '='.repeat(50));
console.log('css-media-query-breakpoints: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

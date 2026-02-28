// css-media-queries-test
// shared/styles.css must define responsive breakpoints for mobile
// Without @media breakpoints, layout breaks on small screens

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-media-queries.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Media query checks \u2500\u2500\n');

// Extract media queries
var mediaQueries = stylesSrc.match(/@media\s+[^{]+/g) || [];
var uniqueMedia = [...new Set(mediaQueries.map(function(m) { return m.trim(); }))];
console.log('  Media queries: ' + uniqueMedia.length);
uniqueMedia.forEach(function(m) { console.log('    ' + m.substring(0, 70)); });

// 1. At least 2 distinct @media queries (mobile + something else)
test('At least 2 distinct @media queries defined: ' + uniqueMedia.length, uniqueMedia.length >= 2);

// 2. 768px mobile breakpoint (per .responsive-spec.md)
var has768 = stylesSrc.includes('768px');
test('768px mobile breakpoint defined (per .responsive-spec.md)', has768);

// 3. pointer: coarse for touch devices
var hasPointerCoarse = stylesSrc.includes('pointer: coarse') || stylesSrc.includes('pointer:coarse');
test('pointer:coarse media query for touch targets', hasPointerCoarse);

console.log('\n' + '='.repeat(50));
console.log('css-media-queries: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

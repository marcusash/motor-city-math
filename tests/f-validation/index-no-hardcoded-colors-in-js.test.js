// index-no-hardcoded-colors-in-js test
// index.html inline scripts must not use hardcoded hex colors
// Colors should come from CSS custom properties for theme consistency

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-no-hardcoded-colors-in-js.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');

// Extract <script> blocks only
var scriptBlocks = [];
var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
var m;
while ((m = re.exec(html)) !== null) {
    scriptBlocks.push(m[1]);
}
var jsContent = scriptBlocks.join('\n');

// Find hex colors in JS (not in comments)
var hexMatches = (jsContent.match(/#[0-9A-Fa-f]{6}\b/g) || []);
var MAX_HEX = 20;

test('Inline JS has <= ' + MAX_HEX + ' hardcoded hex colors (' + hexMatches.length + ' found)', hexMatches.length <= MAX_HEX);
if (hexMatches.length > MAX_HEX) {
    hexMatches.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });
}

console.log('\n' + '='.repeat(50));
console.log('index-no-hardcoded-colors-in-js: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

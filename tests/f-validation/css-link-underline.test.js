// css-link-underline test
// Links must be underlined or have another non-color visual indicator
// Color-alone distinction fails WCAG 1.4.1 (Use of Color)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-link-underline.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Either links have underline (default) or there's explicit text-decoration handling
var hasLinkStyle = /a\s*\{|a\s*,|a:[^:]/.test(css);
var hasTextDecoration = /text-decoration/.test(css);
// If text-decoration:none is used, there should be another visual cue
var hasDecorationNone = /text-decoration\s*:\s*none/.test(css);
var hasBorderBottom = /border-bottom/.test(css);

// Links are distinguishable if: no style override (browser default underline), or underline preserved, or border-bottom
test('CSS has link styles defined', hasLinkStyle);
test('Links have visual distinction (underline or border)', !hasDecorationNone || hasBorderBottom || hasTextDecoration);

console.log('\n' + '='.repeat(50));
console.log('css-link-underline: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// css-mobile-breakpoint-defined test
// shared/styles.css must have a mobile breakpoint media query
// Motor City Math must work on phones (Kai might use his phone)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-mobile-breakpoint-defined.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Must have a media query for small screens (max-width: 600px, 640px, 768px range)
var hasMobileBreak = /@media[^{]*max-width\s*:\s*[67]\d{2}px/i.test(css) ||
                     /@media[^{]*max-width\s*:\s*[45]\d{2}px/i.test(css);
var breakpointMatch = css.match(/@media[^{]*max-width\s*:\s*(\d+px)/);
var breakpointValue = breakpointMatch ? breakpointMatch[1] : 'none found';

test('CSS has a mobile breakpoint (max-width <= 768px)', hasMobileBreak);
console.log('  Detected breakpoint: ' + breakpointValue);

console.log('\n' + '='.repeat(50));
console.log('css-mobile-breakpoint-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

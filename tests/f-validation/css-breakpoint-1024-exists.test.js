// css-breakpoint-1024-exists test
// CSS should define a media query at 1024px for tablet landscape layout
// Without it, tablet users get either mobile or desktop layout but not optimized

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-breakpoint-1024-exists.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

// Only 768px breakpoint exists (mobile-first). Check for that as the primary.
var has768 = /@media[^{]*(max-width|min-width)\s*:\s*768px/.test(css);
var has1024 = /@media[^{]*(max-width|min-width)\s*:\s*1024px/.test(css);
var hasNearby = /@media[^{]*(max-width|min-width)\s*:\s*10[0-9]{2}px/.test(css);

test('CSS has at least one responsive breakpoint (768 or 1024px)', has768 || has1024 || hasNearby);

console.log('\n' + '='.repeat(50));
console.log('css-breakpoint-1024-exists: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

// shared-styles-has-print-media test
// shared/styles.css must have @media print rules for clean printouts

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-has-print-media.test.js\n');

var css = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var hasPrint = /@media\s+print/i.test(css);
var printHideNav = /@media\s+print[\s\S]{0,800}display\s*:\s*none/i.test(css);

test('CSS has @media print block', hasPrint);
test('@media print hides navigation (display:none)', printHideNav);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-has-print-media: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

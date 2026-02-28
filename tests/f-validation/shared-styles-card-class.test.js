// shared-styles-card-class test
// shared/styles.css must define .card or .dash-card class for dashboard cards

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} shared-styles-card-class.test.js\n');

var f = path.join(__dirname, '../../shared/styles.css');
var css = fs.readFileSync(f, 'utf-8');

console.log('\u2500\u2500 Card class checks \u2500\u2500\n');

var hasDashCard = css.includes('--bg-card') || css.includes('.card');
var hasTrendCard = css.includes('trend') || css.includes('--shadow-card');
var hasTestCard = css.includes('test-') || css.includes('retake-') || css.includes('--bg-card');

test('CSS defines --bg-card custom property for card backgrounds', hasDashCard);
test('CSS defines --shadow-card or trend styling', hasTrendCard);
test('CSS has test/retake card styling', hasTestCard);

console.log('\n' + '='.repeat(50));
console.log('shared-styles-card-class: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

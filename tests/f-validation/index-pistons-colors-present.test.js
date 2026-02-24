// index-pistons-colors-present test
// index.html should reference Pistons palette colors (via CSS variables or style)
// Ensures the Motor City brand identity is present on the dashboard

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} index-pistons-colors-present.test.js\n');

var html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf-8');
var css  = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

console.log('\u2500\u2500 Pistons palette presence checks \u2500\u2500\n');

// CSS must have the Pistons colors as variables
var hasRedVar    = css.includes('--accent-red') && (css.includes('#C8102E') || css.includes('C8102E'));
var hasBlueVar   = css.includes('--accent-blue') && (css.includes('#1D42BA') || css.includes('1D42BA'));
var hasNavyVar   = css.includes('--accent-navy') && (css.includes('#002D62') || css.includes('002D62'));

// index.html should use those variables
var usesAccentRed  = html.includes('--accent-red') || html.includes('accent-red');
var usesAccentBlue = html.includes('--accent-blue') || html.includes('accent-blue');

test('CSS --accent-red maps to #C8102E (Pistons Red)', hasRedVar);
test('CSS --accent-blue maps to #1D42BA (Pistons Blue)', hasBlueVar);
test('CSS --accent-navy maps to #002D62 (Pistons Navy)', hasNavyVar);
test('index.html uses Pistons color variables', usesAccentRed || usesAccentBlue);

console.log('\n' + '='.repeat(50));
console.log('index-pistons-colors-present: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

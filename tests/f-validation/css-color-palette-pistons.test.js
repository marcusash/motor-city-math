// css-color-palette-pistons test
// shared/styles.css should use the Motor City Math Pistons color palette
// Colors: #C8102E (red), #1D42BA (blue), #002D62 (navy)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} css-color-palette-pistons.test.js\n');

var stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');

var pistons = [
    { name: 'Pistons Red', hex: '#c8102e', alt: '#C8102E' },
    { name: 'Pistons Blue', hex: '#1d42ba', alt: '#1D42BA' },
    { name: 'Pistons Navy', hex: '#002d62', alt: '#002D62' }
];

console.log('\u2500\u2500 Pistons palette checks \u2500\u2500\n');
var missing = [];
pistons.forEach(function(c) {
    var found = stylesSrc.toLowerCase().includes(c.hex);
    console.log('  ' + (found ? '\u2705' : '\u274c') + ' ' + c.name + ' (' + c.hex + ')');
    if (!found) missing.push(c.name);
});

test('All 3 Pistons brand colors present in shared/styles.css', missing.length === 0);

console.log('\n' + '='.repeat(50));
console.log('css-color-palette-pistons: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

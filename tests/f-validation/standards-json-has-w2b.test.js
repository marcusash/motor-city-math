// standards-json-has-w2b test
// data/standards.json must contain W2.b standard (Kai's primary weak standard)
// The curriculum definition must include the standards we're testing against

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} standards-json-has-w2b.test.js\n');

var standards = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/standards.json'), 'utf-8'));

// Search for W2.b in the standards definition
var raw = JSON.stringify(standards);
var hasW2b = raw.includes('W2.b') || raw.includes('W2b');
var hasUnits = standards.units && standards.units.length > 0;
var hasAlgebra = /algebra|Algebra|W\d/i.test(raw);

test('standards.json references W2.b standard', hasW2b);
test('standards.json has units defined', hasUnits);
test('standards.json is an Algebra curriculum', hasAlgebra);

console.log('\n' + '='.repeat(50));
console.log('standards-json-has-w2b: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

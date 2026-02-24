// rp-json-no-unicode-escapes test
// RP JSON string values must not contain raw \uXXXX unicode escape sequences
// (they should use actual Unicode characters instead, e.g. actual subscript chars)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-json-no-unicode-escapes.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var raw = fs.readFileSync(f, 'utf-8');
    // After JSON.parse serialization, literal \u escape in source means they're literal backslashes
    // Check source for literal \\u (escaped unicode escape in JSON source)
    var literalEscapes = raw.match(/\\u[0-9a-fA-F]{4}/g) || [];
    if (literalEscapes.length > 0) {
        violations.push('retake-practice-' + i + ': ' + literalEscapes.length + ' \\u escapes found: ' + literalEscapes.slice(0, 3).join(', '));
    }
}

console.log('\u2500\u2500 Unicode escape checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });

test('No literal \\uXXXX unicode escape sequences in RP JSON files (' + violations.length + ' files affected)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-json-no-unicode-escapes: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

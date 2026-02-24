// rp-no-unicode-escape-in-text test
// JSON string fields must not contain unicode escape sequences like \u2081
// Unicode escapes render as literal text in some parsers (GR bug fixed Feb 21)

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-no-unicode-escape-in-text.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    // Read raw text to find literal unicode escapes (would appear as \\u in raw file)
    var raw = fs.readFileSync(f, 'utf-8');
    var matches = raw.match(/\\u[0-9a-fA-F]{4}/g);
    if (matches && matches.length > 0) {
        violations.push('retake-practice-' + i + ': contains ' + matches.length + ' unicode escapes: ' + matches.slice(0, 3).join(', '));
    }
}

test('No unicode escape sequences in RP JSON files (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-no-unicode-escape-in-text: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }

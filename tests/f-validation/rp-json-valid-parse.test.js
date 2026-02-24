// rp-json-valid-parse test
// All 11 RP exam JSON files must parse without errors
// Corrupted JSON causes exam picker to crash silently

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-json-valid-parse.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var broken = [], found = 0;

console.log('\u2500\u2500 JSON parse validity checks \u2500\u2500\n');

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) { console.log('  ! rp' + i + ': file missing'); continue; }
    try {
        var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
        found++;
        console.log('  \u2705 rp' + i + ': valid JSON (' + (rp.questions || []).length + ' questions)');
    } catch(e) {
        broken.push('rp' + i + ': ' + e.message);
        console.log('  \u274c rp' + i + ': JSON PARSE ERROR: ' + e.message);
    }
}

test('All ' + found + ' RP exam files parse as valid JSON', broken.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-json-valid-parse: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
